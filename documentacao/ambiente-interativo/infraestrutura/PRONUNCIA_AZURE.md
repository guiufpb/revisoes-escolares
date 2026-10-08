# Protótipo de pronúncia com Azure

Esta capacidade é **opt-in**, depende de internet e não faz parte da conclusão, pontuação ou
persistência normal das revisões. A primeira unidade habilitada é
`mariana-ingles-at-school-atividade-3`, somente depois de suas 25 atividades.

## Arquitetura e privacidade

- `js/pronuncia.js` solicita consentimento, captura o microfone após clique, converte a tentativa
  para WAV PCM mono de 16 kHz e controla a interface acessível.
- `js/audio.js` continua sendo a única fonte de TTS; **Ouvir modelo** usa `AudioRevisoes.falar`.
  Na seção **CONVERSAÇÃO · ESCUTE E PRONUNCIE**, `falarAlvo()` em `js/pronuncia.js` fixa
  `velocidade: 0.5` para pergunta e resposta das cinco conversas, inclusive ao ouvir novamente.
  Essa velocidade não altera os demais áudios da Activity 3 nem a avaliação da fala gravada.
- `scripts/azure-pronunciation-gateway.js` aceita apenas páginas HTTP de loopback, limita o corpo a
  1 MiB, acrescenta a chave fora do navegador e chama o endpoint REST de áudio curto. Por segurança,
  a conversa com Azure requer `npm run interativo`; o restante do ambiente continua funcionando por
  `file://` sem essa capacidade externa.
- O navegador e o gateway mantêm o áudio somente em memória. Buffers são zerados depois da
  resposta, timeout ou erro; não existe arquivo, cache, log de fala ou campo de `localStorage`.
- O gateway devolve somente escores resumidos. A interface não mostra nota nem aprova/reprova: ela
  converte as faixas declarativas em feedback infantil e permite tentativas ilimitadas.

O Azure é opcional. Permissão negada, navegador sem microfone, gateway desligado, credencial
ausente, timeout, limite ou falha de rede mantêm a Activity 3 concluída e deixam o TTS local
disponível.

## Configuração local

O fluxo normal do responsável é dar duplo clique em `abrir_ambiente_interativo.bat` ou no launcher
Chromium. Ambos delegam a `scripts/abrir-ambiente-local.ps1`, que valida a raiz explicitamente
selecionada, as dependências e a identidade de eventual servidor em 5173 antes de preparar
pronúncia. Outra cópia ou identidade indisponível interrompem a preparação e a abertura;
nenhum processo alheio é encerrado. Consulte [Worktrees e entrega local](WORKTREES_CATALOGO_E_ENTREGA_LOCAL.md).
O auxiliar chama `scripts/preparar-pronuncia-azure.ps1` somente da raiz selecionada. Se o gateway já estiver
saudável e configurado em `127.0.0.1:5190`, o launcher o reutiliza. Caso contrário, verifica se a
Azure CLI está instalada e autenticada, recupera em memória a chave do recurso
`revisoes-escolares-speech` no grupo `revisoes-escolares-rg`, define temporariamente
`AZURE_SPEECH_KEY` e `AZURE_SPEECH_REGION=brazilsouth` e inicia `npm run pronuncia:gateway` em uma
janela separada. A chave chega ao processo filho apenas por herança de ambiente: não aparece no
comando, no navegador ou em arquivo. O launcher confirma `ok:true` e `configured:true` em
`/health` antes de anunciar que a pronúncia está pronta. O auxiliar de abertura então inicia ou
reutiliza somente o servidor confirmado da cópia escolhida, com porta habitual 5173 e strictPort,
revalidando a identidade antes do navegador. Os comandos npm diretos não preparam pronúncia.

Se a sessão da CLI expirou, o launcher oferece ao responsável a escolha de executar `az login`.
O login e qualquer consentimento são realizados pela Azure CLI, nunca dentro do script. Se a CLI
não estiver instalada, o login falhar, a chave não puder ser obtida ou a porta 5190 estiver
ocupada por serviço sem saúde, a pronúncia fica indisponível e o ambiente principal abre
normalmente. Um gateway que informe `configured:false` também não é substituído por outra
instância na mesma porta. Fechar a janela do gateway interrompe a pronúncia; enquanto ela estiver
ativa, novos cliques no launcher reutilizam o processo. Depois de reiniciar o computador, basta
abrir o mesmo `.bat` outra vez.

O gateway escuta somente em `127.0.0.1:5190`. Não grave a chave em `.js`, HTML, `.env`, arquivo
versionado ou armazenamento do navegador. O `-ExecutionPolicy Bypass` do launcher vale apenas
para a execução daquele PowerShell; não altera a política global.

Diagnóstico sem enviar áudio:

```text
http://127.0.0.1:5190/health
```

`configured: true` confirma apenas que as duas variáveis existem; a primeira tentativa real ainda
pode revelar região, cota, permissão ou disponibilidade incompatíveis. Nunca cole a chave em issue,
teste, print, conversa, commit ou relatório. O launcher não altera a assinatura nem o SKU.

## Contrato REST e diagnóstico

O gateway usa `POST` para
`https://<regiao>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`,
com `language=en-US`, `format=detailed` e `profanity=removed`. Envia
`Content-Type: audio/wav; codecs=audio/pcm; samplerate=16000`, `Accept: application/json` e
autenticação por chave exclusivamente no servidor. O header `Pronunciation-Assessment` contém
JSON UTF-8 em Base64 com `ReferenceText`, `GradingSystem: HundredMark`, `Granularity: Word`,
`Dimension: Comprehensive` e `EnableProsodyAssessment: True` (string conforme o exemplo REST).
O WAV é PCM de 16 bits, mono e 16 kHz; a captura usa Web Audio, sem MediaRecorder/WebM.
O endpoint regional é usado pelo
[exemplo REST oficial da Microsoft](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/PronunciationAssessment/Python/sample.py).

A [documentação REST oficial](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short)
descreve os escores diretamente em `NBest[0]`. O parser aceita esse formato e preserva
compatibilidade com escores aninhados em `PronunciationAssessment`. Resultado sem escores não
é convertido artificialmente em zero. `Granularity: Word` solicita avaliação por palavra, sem
solicitar fonemas. O navegador recebe somente os escores resumidos.

Os logs registram status HTTP local/Azure, tamanho, MIME, metadados numéricos WAV, estado de
reconhecimento, nomes dos campos de avaliação e contagens de palavras/fonemas. Erros locais e
códigos Azure usam uma lista fechada; códigos desconhecidos são indicados apenas pela presença de
erro. Não são registrados áudio, texto de referência, transcrição, corpo bruto Azure, headers de
autenticação ou credenciais. Assim, é possível distinguir HTTP Azure 200 sem avaliação, erro
Azure e exceção local sem expor a fala.

O idioma `en-US` tem suporte em todas as regiões de speech-to-text, incluindo `brazilsouth`,
conforme as [regiões](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions)
e os [idiomas oficiais](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=pronunciation-assessment).
O recurso local permanece F0. Testes simulados não comprovam o funcionamento com Azure real;
essa confirmação exige a tentativa manual autorizada pelo responsável.

Variáveis opcionais:

- `PRONUNCIATION_GATEWAY_PORT`: porta local, padrão `5190`. Se mudar, ajuste também `gatewayUrl`
  na configuração opt-in da revisão.
- `AZURE_SPEECH_TIMEOUT_MS`: timeout entre 3 e 30 segundos, padrão `12000`.

## Contrato declarativo

Play Time · Unit 6 habilita dez pares (20 alvos separados) após suas 25 questões. As cinco
conversas da Activity 3 continuam sem alteração. O par pode declarar `imagem` e `imagemAlt`:
somente nomes de arquivos locais em `assets/objetos_escolares/` com extensões SVG, PNG, JPG,
JPEG ou WebP são aceitos; URLs, diretórios, travessia, query e data URI são recusados. Uma imagem
sem descrição é omitida. O renderer limpa src/alt e oculta o recipiente ao trocar para um par
sem imagem, ocultar a seção ou desativar a capacidade. A imagem nunca entra no progresso.

Troca de sessão no Modo Responsável, encerramento dessa sessão e saída de Inglês desativam a
pronúncia: descartam captura, cancelam avaliação, limpam imagem e consentimento. A sessão seguinte
solicita novo consentimento, inclusive entre sessões da mesma unidade. Não são persistidos
consentimento, gravação, imagem nem avaliação. Os modelos continuam a 0,50 e usam apenas
AudioRevisoes; o gateway, launcher, Azure e credenciais não foram alterados.

Uma unidade pode declarar `pronuncia` com `habilitada`, identificador, URL local, duração,
timeout, duas faixas e pares de pergunta/resposta. O controlador valida IDs e textos, e ignora a
capacidade quando a configuração estiver ausente ou inválida. Conteúdo fica na revisão; captura,
WAV, envio, descarte, estados e feedback ficam no controlador compartilhado.

`descricao` e `mensagemIndisponibilidade` opcionais fornecem textos locais próprios da revisão,
com limites de tamanho e uso de `textContent`. Play Time identifica dez conversas opcionais e
preserva sua conclusão mesmo sem serviço; configurações sem esses campos mantêm o texto legado.

As faixas são calibração pedagógica, não nota escolar. Mudá-las não pode alterar pontos,
conclusão ou chaves. A validação com crianças deve observar falsos negativos e preferir incentivo.

## Validação

Os testes usam microfone, `AudioContext` e gateway simulados; não consomem Azure. Eles verificam
WAV, texto de referência, feedback, consentimento, permissão negada, indisponibilidade, timeout,
repetição, descarte, celular e acessibilidade. Uma validação humana posterior ainda é necessária
para calibrar as faixas com as vozes reais de Alice e Mariana.
Os modelos também são verificados no payload efetivo do sintetizador: `en-US` a `0.50` em todas
as perguntas e respostas, ao repetir e voltar, sem microfone ou chamada ao gateway.
Incluem resposta REST 200 com escores diretos, formato aninhado, resultado sem avaliação, erro
Azure 401, contrato dos headers, ausência de fala/segredo nos logs e descarte do buffer no gateway.
Com a porta 5190 livre, `node tests/launcher-pronuncia.cjs` exercita o preparador com CLI, npm e
`/health` simulados:
autenticação válida, reutilização, login recusado/feito pelo responsável, CLI ausente, falha na
recuperação da chave e gateway sem configuração. O teste usa apenas uma credencial fictícia e
confere que ela não aparece na saída nem no ambiente posterior e que o gateway inicia na raiz
escolhida. A simulação oculta sua janela e encerra apenas seus próprios processos. Os wrappers,
seleção/identidade e falha opcional são verificados separadamente por
`node tests/worktrees-abertura-local.cjs`; os dois `.bat` também foram executados contra a porta
habitual ocupada por servidor legado, sem Azure. O preparador e o gateway de produção não foram
alterados neste lote. Um `/health` real confirma a preparação local sem enviar áudio
ao Azure; a gravação de uma tentativa continua sendo uma validação humana separada.
