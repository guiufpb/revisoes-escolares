'use strict';

const http = require('node:http');
const { randomUUID } = require('node:crypto');

const HOST = '127.0.0.1';
const PORT = clampInteger(process.env.PRONUNCIATION_GATEWAY_PORT, 1024, 65535, 5190);
const MAX_AUDIO_BYTES = 1024 * 1024;
const AZURE_TIMEOUT_MS = clampInteger(process.env.AZURE_SPEECH_TIMEOUT_MS, 3000, 30000, 12000);

function clampInteger(value, minimum, maximum, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(minimum, Math.min(maximum, Math.trunc(number)));
}

function allowedOrigin(origin) {
  if (!origin) return null;
  return /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(origin) ? origin : false;
}

function corsHeaders(request) {
  const origin = allowedOrigin(request.headers.origin);
  return origin
    ? {
        'Access-Control-Allow-Origin': origin,
        Vary: 'Origin',
      }
    : {};
}

function sendJson(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  response.end(JSON.stringify(body));
}

function readBody(request, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let exceeded = false;
    request.on('data', (chunk) => {
      if (exceeded) return;
      size += chunk.length;
      if (size > limit) {
        exceeded = true;
        const error = new Error('audio_too_large');
        error.code = 'audio_too_large';
        reject(error);
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (exceeded) {
        chunks.forEach((chunk) => chunk.fill(0));
        chunks.length = 0;
        return;
      }
      const body = Buffer.concat(chunks);
      chunks.forEach((chunk) => chunk.fill(0));
      chunks.length = 0;
      resolve(body);
    });
    request.on('error', reject);
  });
}

function decodeReference(header) {
  if (typeof header !== 'string' || !header || header.length > 512) return '';
  try {
    const reference = Buffer.from(header, 'base64').toString('utf8').replace(/\s+/g, ' ').trim();
    if (!reference || reference.length > 240) return '';
    if (!/^[\p{L}\p{N}\s.,!?;:'"’-]+$/u.test(reference)) return '';
    return reference;
  } catch (_error) {
    return '';
  }
}

function azureConfiguration() {
  const key = String(process.env.AZURE_SPEECH_KEY || '').trim();
  const region = String(process.env.AZURE_SPEECH_REGION || '')
    .trim()
    .toLowerCase();
  if (!key || !/^[a-z0-9-]{2,40}$/.test(region)) return null;
  return { key, region };
}

function finiteScore(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, number)) : null;
}

function sanitizedAssessment(payload) {
  const best = payload && Array.isArray(payload.NBest) ? payload.NBest[0] : null;
  // REST short audio returns scores directly in NBest; SDK-shaped fixtures may nest them.
  const assessment = best && (best.PronunciationAssessment || best);
  if (!assessment) return null;
  if (
    finiteScore(assessment.PronScore) === null &&
    finiteScore(assessment.AccuracyScore) === null
  ) {
    return null;
  }
  return {
    pronunciationScore: finiteScore(assessment.PronScore),
    accuracyScore: finiteScore(assessment.AccuracyScore),
    fluencyScore: finiteScore(assessment.FluencyScore),
    completenessScore: finiteScore(assessment.CompletenessScore),
    prosodyScore: finiteScore(assessment.ProsodyScore),
  };
}

async function requestAzure(audio, reference, configuration) {
  const assessmentHeader = Buffer.from(
    JSON.stringify({
      ReferenceText: reference,
      GradingSystem: 'HundredMark',
      Granularity: 'Word',
      Dimension: 'Comprehensive',
      EnableProsodyAssessment: 'True',
    }),
    'utf8'
  ).toString('base64');
  const endpoint = new URL(
    `https://${configuration.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
  );
  endpoint.searchParams.set('language', 'en-US');
  endpoint.searchParams.set('format', 'detailed');
  endpoint.searchParams.set('profanity', 'removed');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AZURE_TIMEOUT_MS);
  try {
    return await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Ocp-Apim-Subscription-Key': configuration.key,
        'Pronunciation-Assessment': assessmentHeader,
      },
      body: audio,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function createServer() {
  return http.createServer(async (request, response) => {
    const requestId = randomUUID();
    const startedAt = Date.now();
    const cors = corsHeaders(request);
    if (request.headers.origin && allowedOrigin(request.headers.origin) === false) {
      sendJson(response, 403, { error: 'origin_not_allowed', requestId });
      return;
    }
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        ...cors,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Reference-Text, X-Pronunciation-Locale',
        'Access-Control-Max-Age': '600',
      });
      response.end();
      return;
    }

    const url = new URL(request.url, `http://${HOST}:${PORT}`);
    if (request.method === 'GET' && url.pathname === '/health') {
      sendJson(response, 200, { ok: true, configured: Boolean(azureConfiguration()) }, cors);
      return;
    }
    if (request.method !== 'POST' || url.pathname !== '/api/pronunciation') {
      sendJson(response, 404, { error: 'not_found', requestId }, cors);
      return;
    }
    if (!/^audio\/wav(?:;|$)/i.test(String(request.headers['content-type'] || ''))) {
      sendJson(response, 415, { error: 'wav_required', requestId }, cors);
      return;
    }
    if (String(request.headers['x-pronunciation-locale'] || 'en-US') !== 'en-US') {
      sendJson(response, 400, { error: 'locale_not_allowed', requestId }, cors);
      return;
    }
    const reference = decodeReference(request.headers['x-reference-text']);
    if (!reference) {
      sendJson(response, 400, { error: 'invalid_reference', requestId }, cors);
      return;
    }
    const configuration = azureConfiguration();
    if (!configuration) {
      sendJson(response, 503, { error: 'gateway_unconfigured', requestId }, cors);
      return;
    }

    let audio = null;
    const diagnostic = { azureStatus: null, audioBytes: 0 };
    try {
      audio = await readBody(request, MAX_AUDIO_BYTES);
      diagnostic.audioBytes = audio.length;
      diagnostic.mimeType = 'audio/wav';
      if (audio.length < 48 || audio.subarray(0, 4).toString('ascii') !== 'RIFF') {
        sendJson(response, 400, { error: 'invalid_wav', requestId }, cors);
        return;
      }
      diagnostic.wav = {
        encoding: audio.readUInt16LE(20),
        channels: audio.readUInt16LE(22),
        sampleRate: audio.readUInt32LE(24),
        bitsPerSample: audio.readUInt16LE(34),
      };
      const azureResponse = await requestAzure(audio, reference, configuration);
      diagnostic.azureStatus = azureResponse.status;
      let payload = null;
      try {
        payload = await azureResponse.json();
      } catch (_error) {
        payload = null;
      }
      diagnostic.azureJsonReceived = Boolean(payload);
      const recognitionStatuses = [
        'Success',
        'NoMatch',
        'InitialSilenceTimeout',
        'BabbleTimeout',
        'Error',
      ];
      diagnostic.recognitionStatus = recognitionStatuses.includes(
        payload && payload.RecognitionStatus
      )
        ? payload.RecognitionStatus
        : null;
      // Never log the raw Azure body: it can contain recognized speech or echoed credentials.
      const errorCode = payload && ((payload.error && payload.error.code) || payload.code);
      const safeErrorCodes = [
        'BadRequest',
        'InvalidRequest',
        'InvalidArgument',
        'Unauthorized',
        'Forbidden',
        'AuthenticationFailure',
        'TooManyRequests',
        'InternalServerError',
      ];
      diagnostic.azureErrorCode = safeErrorCodes.includes(errorCode) ? errorCode : null;
      diagnostic.azureErrorPresent = Boolean(errorCode);
      const best = payload && Array.isArray(payload.NBest) ? payload.NBest[0] : null;
      const scores = best && (best.PronunciationAssessment || best);
      diagnostic.scoreFields = [
        'AccuracyScore',
        'FluencyScore',
        'CompletenessScore',
        'PronScore',
        'ProsodyScore',
      ].filter((field) => scores && finiteScore(scores[field]) !== null);
      const words = best && Array.isArray(best.Words) ? best.Words : [];
      diagnostic.wordCount = words.length;
      diagnostic.phonemeCount = words.reduce(
        (count, word) => count + (Array.isArray(word.Phonemes) ? word.Phonemes.length : 0),
        0
      );
      if (!azureResponse.ok) {
        const status = azureResponse.status === 429 ? 429 : 502;
        sendJson(response, status, { error: 'azure_unavailable', requestId }, cors);
        return;
      }
      const assessment = sanitizedAssessment(payload);
      if (!assessment) {
        sendJson(response, 422, { error: 'assessment_unavailable', requestId }, cors);
        return;
      }
      sendJson(response, 200, { ok: true, assessment, requestId }, cors);
    } catch (error) {
      diagnostic.localError =
        error && error.code === 'audio_too_large'
          ? 'audio_too_large'
          : error && error.name === 'AbortError'
            ? 'timeout'
            : 'request_failed';
      if (error && error.code === 'audio_too_large') {
        if (!response.headersSent) {
          sendJson(response, 413, { error: 'audio_too_large', requestId }, cors);
        }
        return;
      }
      const timeout = error && error.name === 'AbortError';
      if (!response.headersSent) {
        sendJson(
          response,
          timeout ? 504 : 502,
          { error: timeout ? 'azure_timeout' : 'azure_unavailable', requestId },
          cors
        );
      }
    } finally {
      if (audio) audio.fill(0);
      const durationMs = Date.now() - startedAt;
      console.log(
        JSON.stringify({
          requestId,
          path: url.pathname,
          status: response.statusCode,
          durationMs,
          ...diagnostic,
        })
      );
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log(
      `Gateway de pronúncia ativo em http://${HOST}:${PORT}. Credenciais lidas somente do ambiente.`
    );
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.close(() => process.exit(0)));
  }
}

module.exports = { createServer, decodeReference, sanitizedAssessment };
