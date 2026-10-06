// Arte original e determinística. A/B compartilham a mesma geometria;
// somente os sete grupos declarados em comparison() variam.
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, '../assets/objetos_escolares');
const ink = '#25364b';
const colors = {
  red: '#e34e51',
  blue: '#3988db',
  yellow: '#f9cd4b',
  green: '#3aaa78',
  orange: '#ed963e',
  pink: '#ee91b5',
  purple: '#9464ce',
};
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const txt = (x, y, s, size = 18) =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${ink}" stroke="none">${esc(s)}</text>`;
const rect = (x, y, w, h, c, r = 8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const circle = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const line = (x1, y1, x2, y2, c = ink, w = 4) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
const poly = (pts, c) => `<polygon points="${pts}" fill="${c}"/>`;
const group = (body, x = 0, y = 0, s = 1, attr = '') =>
  `<g transform="translate(${x} ${y}) scale(${s})" ${attr}>${body}</g>`;
function svg(body, w = 240, h = 200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="18" fill="#f5f9ff"/><g stroke="${ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>\n`;
}
function write(name, body, w = 240, h = 200) {
  fs.writeFileSync(path.join(out, 'play-time-' + name + '.svg'), svg(body, w, h));
}
function toy(name, color = colors.blue) {
  const wheel = (x, y, r = 18) => circle(x, y, r, '#394656') + circle(x, y, r / 2, '#d6e1ec');
  switch (name) {
    case 'robot':
      return (
        line(120, 35, 120, 19) +
        circle(120, 16, 7, colors.orange) +
        rect(72, 36, 96, 58, color) +
        circle(97, 61, 9, 'white') +
        circle(143, 61, 9, 'white') +
        line(100, 80, 140, 80) +
        rect(78, 97, 84, 65, color) +
        circle(120, 123, 13, colors.yellow) +
        line(76, 108, 47, 132) +
        line(165, 108, 191, 132) +
        rect(82, 163, 26, 22, '#bac7d6') +
        rect(133, 163, 26, 22, '#bac7d6')
      );
    case 'teddy-bear':
      return (
        circle(76, 43, 22, '#bd895f') +
        circle(164, 43, 22, '#bd895f') +
        circle(120, 72, 49, '#d7a57b') +
        circle(84, 165, 27, '#bd895f') +
        circle(158, 165, 27, '#bd895f') +
        `<ellipse cx="120" cy="142" rx="43" ry="45" fill="#d7a57b"/>` +
        circle(68, 125, 22, '#d7a57b') +
        circle(171, 125, 22, '#d7a57b') +
        circle(103, 67, 5, ink) +
        circle(137, 67, 5, ink) +
        `<ellipse cx="120" cy="84" rx="22" ry="16" fill="#f2d3b5"/>` +
        poly('112,78 128,78 120,86', ink) +
        line(120, 87, 120, 96) +
        `<path d="M120 122v45 M112 130h16 M112 142h16 M112 154h16" stroke-dasharray="3 4"/>`
      );
    case 'doll':
      return (
        `<path d="M74 67Q69 16 120 22Q171 17 168 68" fill="#795446"/>` +
        circle(120, 62, 34, '#f5d4b5') +
        circle(107, 59, 4, ink) +
        circle(133, 59, 4, ink) +
        line(110, 77, 130, 77) +
        poly('100,98 140,98 165,158 75,158', colors.pink) +
        line(96, 106, 66, 135, '#b4826a', 15) +
        line(144, 106, 174, 135, '#b4826a', 15) +
        line(99, 160, 99, 185, '#b4826a', 13) +
        line(143, 160, 143, 185, '#b4826a', 13) +
        circle(94, 106, 6, '#e6bd9c') +
        circle(146, 106, 6, '#e6bd9c') +
        `<path d="M120 102v50 M88 149h65" fill="none" stroke-dasharray="3 5"/>`
      );
    case 'car':
      return (
        poly('33,132 50,94  eighty,94', color).replace(' eighty', '80') +
        `<path d="M30 132v-21h36l25-39h57l32 39h27v44H30z" fill="${color}"/>` +
        poly('95,80 116,80 116,111 78,111', '#c5e5f5') +
        poly('124,80 145,80 169,111 124,111', '#c5e5f5') +
        wheel(68, 151) +
        wheel(169, 151)
      );
    case 'lorry':
      return (
        rect(20, 60, 121, 81, color, 9) +
        rect(143, 93, 75, 49, color) +
        poly('150,66 185,66 215,99 145,99', color) +
        poly('156,74 180,74 197,92 156,92', '#d4ebf6') +
        wheel(60, 145) +
        wheel(172, 145) +
        line(30, 74, 126, 74, '#ffffff', 5)
      );
    case 'train':
      return (
        rect(22, 90, 78, 49, colors.red) +
        rect(49, 53, 45, 40, colors.red) +
        rect(19, 60, 20, 29, '#505e72') +
        rect(110, 81, 52, 58, colors.green) +
        rect(174, 81, 52, 58, colors.yellow) +
        rect(58, 61, 25, 26, '#dbf0ff') +
        line(101, 125, 111, 125) +
        line(162, 125, 175, 125) +
        [41, 81, 122, 151, 187, 216].map((x) => wheel(x, 145, 12)).join('')
      );
    case 'bike':
      return (
        wheel(51, 139, 39) +
        wheel(190, 139, 39) +
        `<path d="M51 139L92 77L130 139Z M92 77h70l-32 62 M190 139L153 57h24 M92 77l-8-16h25" fill="none" stroke="${color}" stroke-width="7"/>` +
        circle(130, 139, 7, ink) +
        line(130, 139, 148, 147) +
        line(143, 151, 156, 151)
      );
    case 'boat':
      return (
        poly('27,109 211,109 180,158 60,158', color) +
        line(120, 31, 120, 108) +
        poly('113,34  fifty,101 113,101', colors.yellow).replace(' fifty', '50') +
        poly('129,49 190,101 129,101', colors.red) +
        `<path d="M24 170q18 15 36 0t36 0t36 0t36 0t36 0" fill="none" stroke="#568fc1"/>`
      );
    case 'plane':
      return (
        `<path d="M25 103L95 92L116 31h24l-7 59 74 8q23 10 0 20l-74 2 7 57h-24l-23-56-66-5-13-25h14z" fill="${color}"/>` +
        line(155, 98, 190, 102, 'white', 6)
      );
    case 'helicopter':
      return (
        `<ellipse cx="122" cy="104" rx="68" ry="39" fill="${color}"/>` +
        poly(' sixty,94 21,80 21,122  sixty,118', color).replaceAll(' sixty', '60') +
        poly('134, seventy 181,86 181,110 134,110', '#c9e6fa').replace(' seventy', '70') +
        line(115, 60, 115, 40) +
        line(45, 40, 188, 40, ink, 7) +
        line(83, 147, 181, 147, ink, 7) +
        line(98, 133, 98, 147) +
        line(165, 132, 165, 147)
      );
    case 'rocket':
      return (
        `<path d="M91 125V65Q92 32 120 18Q147 32 149 65v60z" fill="${color}"/>` +
        poly('91,92  sixty,141 91,130', colors.red).replace(' sixty', '60') +
        poly('149,92 180,141 149,130', colors.red) +
        circle(120, 70, 19, '#c7e9fa') +
        poly('99,131 141,131 120,185', colors.orange) +
        poly('109,133 131,133 120,163', colors.yellow)
      );
    case 'kite':
      return (
        poly('120,19 184,74 120,135 56,74', color) +
        line(120, 19, 120, 135) +
        line(56, 74, 184, 74) +
        `<path d="M120 135q-35 14 0 26t0 25" fill="none"/>` +
        poly('100,153 121,160 101,169', colors.red) +
        poly('123,177 145,183 123,190', colors.yellow)
      );
    case 'ball':
      return (
        circle(120, 102, 70, color) +
        `<path d="M63 62q61 49 114 98 M58 137q63-70 119-74" fill="none" stroke="#dcecff" stroke-width="7"/>`
      );
    case 'soccer-ball':
      return (
        circle(120, 102, 70, '#ffffff') +
        poly('120,76 145,94 135,121 105,121 95,94', ink) +
        poly('70,54 85,75 65,89 54,80', ink) +
        poly('162,50 164,75 184,87 185,68', ink) +
        poly('58,138 84,130 88,159  seventy,160', ink).replace(' seventy', '70') +
        poly('152,134 177,130 181,151 159,165', ink) +
        line(120, 76, 120, 34) +
        line(95, 94, 65, 89) +
        line(145, 94, 164, 75) +
        line(105, 121, 84, 130) +
        line(135, 121, 152, 134)
      );
    case 'basketball':
      return (
        circle(120, 102, 70, colors.orange) +
        line(50, 102, 190, 102) +
        line(120, 32, 120, 172) +
        `<path d="M seventy  fifty Q150 100  seventy 154 M170  fifty Q90 100 170 154" fill="none"/>`
          .replaceAll(' seventy', '70')
          .replaceAll(' fifty', '50')
      );
    case 'tennis-ball':
      return (
        circle(120, 102, 70, '#b6d844') +
        `<path d="M64  sixty Q127 100 64 143 M174  sixty Q111 100 174 143" fill="none" stroke="white" stroke-width="8"/>`.replaceAll(
          ' sixty',
          '60'
        )
      );
    case 'beach-ball':
      return (
        circle(120, 102, 70, '#ffffff') +
        `<path d="M120 32Q60 100 120 172Q194 108 120 32" fill="${colors.red}"/>` +
        `<path d="M120 32Q158 102 120 172" fill="${colors.yellow}"/>` +
        circle(120, 36, 8, colors.blue)
      );
    case 'balloon':
      return (
        `<ellipse cx="120" cy=" seventy" rx="52" ry=" sixty" fill="${color}"/>`
          .replace(' seventy', '70')
          .replace(' sixty', '60') +
        poly('120,130 112,141 128,141', color) +
        `<path d="M120 141q-20 13 0 26t0 25" fill="none"/>`
      );
    case 'blocks':
      return (
        rect(38, 103, 50, 50, colors.red, 4) +
        rect(93, 103, 50, 50, colors.blue, 4) +
        rect(148, 103, 50, 50, colors.yellow, 4) +
        rect(93, 48, 50, 50, colors.green, 4) +
        [53, 71, 109, 127, 164, 182].map((x) => rect(x, 95, 10, 8, '#e9eef3', 2)).join('')
      );
    case 'marbles':
      return [
        [70, 77, colors.blue],
        [151, 74, colors.green],
        [110, 140, colors.purple],
      ]
        .map(
          ([x, y, c]) =>
            circle(x, y, 35, c) +
            `<path d="M${x - 15} ${y - 22}q35 24 0  forty" fill="none" stroke="white" stroke-width="8"/>`.replace(
              ' forty',
              '40'
            )
        )
        .join('');
    case 'yo-yo':
      return (
        circle(105, 116, 52, colors.orange) +
        circle(130, 116, 52, colors.red) +
        circle(130, 116, 24, colors.yellow) +
        `<path d="M117 65V32q0-18 30-18t15 29" fill="none" stroke-width="5"/>`
      );
    case 'spinning-top':
      return (
        rect(110, 27, 20, 35, colors.red, 3) +
        `<path d="M50 99Q64  fifty 120  fifty Q176  fifty 190 99L120 163z" fill="${colors.yellow}"/>`.replaceAll(
          ' fifty',
          '50'
        ) +
        `<ellipse cx="120" cy="99" rx="70" ry="20" fill="${colors.blue}"/>` +
        poly('113,162 127,162 120,183', ink)
      );
    case 'controller':
      return (
        `<path d="M74 57h92q23 0 35 42l13 45q3 33-25 28l-38-28H90l-37 28q-27 5-24-28l13-45q12-42 32-42z" fill="#626f88"/>` +
        rect(60, 89, 38, 13, '#eef5ff', 1) +
        rect(73, 76, 13, 38, '#eef5ff', 1) +
        circle(170, 88, 10, colors.red) +
        circle(188, 109, 10, colors.green) +
        circle(150, 110, 10, colors.blue) +
        circle(170, 130, 10, colors.yellow)
      );
    default:
      throw new Error(name);
  }
}
function furniture(kind = 'table') {
  return kind === 'table'
    ? rect(60, 160, 600, 26, '#d5a377', 4) +
        rect(88, 186, 26, 187, '#b68154', 3) +
        rect(606, 186, 26, 187, '#b68154', 3)
    : rect(60, 180, 600, 48, '#c7acf0', 6) +
        rect(45, 142, 27, 232, '#987aaf', 3) +
        rect(640, 205, 27, 169, '#987aaf', 3) +
        rect(77, 167, 123, 14, '#ffffff', 5);
}
const room = () =>
  rect(16, 16, 688, 389, '#fff2dc', 12) +
  rect(16, 330, 688, 75, '#e8d6c1', 0) +
  rect(520, 42, 135, 130, '#b8e5f2', 7) +
  line(586, 42, 586, 172) +
  line(520, 105, 655, 105);
const park = () =>
  rect(16, 16, 688, 389, '#d8efff', 12) +
  rect(16, 286, 688, 119, '#bbe0ae', 0) +
  circle(620, 55, 23, '#ffe6a0');
function child(x, y, s = 1, girl = false) {
  let b = girl ? `<path d="M-24 12q-15-48 24-48t24 48" fill="#654637"/>` : '';
  b +=
    circle(0, 0, 24, '#dca87b') +
    circle(-8, -3, 2, ink) +
    circle(8, -3, 2, ink) +
    `<path d="M-7 10q7 6 14 0" fill="none"/>`;
  b +=
    rect(-24, 29, 48, 65, girl ? '#a78ad2' : '#4b9b9a', 9) +
    line(-20, 43, -38, 75, '#dca87b', 11) +
    line(20, 43, 38, 75, '#dca87b', 11) +
    line(-13, 96, -16, 139, '#62738e', 14) +
    line(13, 96, 16, 139, '#62738e', 14) +
    rect(-30, 135, 25, 12, '#43566c', 4) +
    rect(5, 135, 25, 12, '#43566c', 4);
  return group(b, x, y, s);
}
function action(kind) {
  let b = kind === 'read' || kind === 'doll' || kind === 'draw' ? room() : park();
  if (kind === 'bike') {
    b += group(toy('bike', '#c4ccd8'), 240, 159, 1.35);
    b +=
      circle(390, 145, 25, '#dca87b') +
      `<path d="M365 140q5-33 43-22l8 22z" fill="#e6797c"/>` +
      line(386, 170, 363, 230, '#a78ad2', 33) +
      line(389, 180, 453, 234, '#dca87b', 11) +
      line(365, 230, 398, 267, '#63768d', 16) +
      line(398, 267, 415, 343, '#63768d', 13) +
      line(357, 235, 331, 275, '#63768d', 16) +
      line(331, 275, 398, 336, '#63768d', 13);
  } else {
    b += child(310, 177, 1.35, kind !== 'kite');
    if (kind === 'read')
      b +=
        poly('286,247 322,255 356,247 356,289 322,298 286,289', '#fffef5') +
        line(322, 255, 322, 298) +
        line(294, 262, 311, 265) +
        line(337, 265, 348, 261);
    if (kind === 'draw')
      b +=
        rect(350, 255, 190, 22, '#cfa076', 4) +
        rect(380, 277, 17, 110, '#cfa076', 2) +
        poly('382,220 497,220 487,252 375,252', 'white') +
        line(366, 245, 419, 232, colors.red, 5);
    if (kind === 'kite')
      b += group(toy('kite', colors.orange), 460, 26, 0.8) + line(361, 278, 556, 132, ink, 2);
    if (kind === 'doll')
      b += group(toy('doll'), 345, 227, 0.62) + group(furniture('bed'), 420, 100, 0.3);
    if (kind === 'play') b += group(toy('ball', colors.red), 435, 255, 0.65);
  }
  return b;
}
// Brinquedos individuais: desenhos distinguíveis sem nome escrito.
for (const name of [
  'robot',
  'teddy-bear',
  'kite',
  'doll',
  'bike',
  'car',
  'lorry',
  'train',
  'rocket',
  'helicopter',
  'boat',
  'plane',
  'controller',
  'ball',
  'balloon',
  'blocks',
  'marbles',
  'yo-yo',
  'spinning-top',
  'soccer-ball',
  'tennis-ball',
  'beach-ball',
  'basketball',
])
  write(name, toy(name));
for (const name of ['red', 'green', 'blue', 'yellow'])
  write(name + '-robot', toy('robot', colors[name]));
write('red-car', toy('car', colors.red));
write('blue-ball', toy('ball', colors.blue));
write(
  'four-balls',
  [colors.blue, colors.red, colors.blue, colors.green]
    .map((c, i) => group(toy('ball', c), 40 + i * 175, 80, 0.62, `data-ball-color="${c}"`))
    .join(''),
  800,
  310
);
for (const [file, name, position] of [
  ['doll-on-table', 'doll', 'on'],
  ['robot-under-table', 'robot', 'under'],
  ['car-under-table', 'car', 'under'],
]) {
  const yy = position === 'on' ? 54 : 239;
  const body =
    position === 'on'
      ? toy(name)
          .replace(line(99, 160, 99, 185, '#b4826a', 13), line(99, 158, 72, 158, '#b4826a', 13))
          .replace(line(143, 160, 143, 185, '#b4826a', 13), line(143, 158, 170, 158, '#b4826a', 13))
      : toy(name);
  write(file, furniture() + group(body, 276, yy, 0.67), 720, 410);
}
for (const [file, kind, n, under] of [
  ['two-bears-on-bed', 'bed', 2, false],
  ['two-bears-under-bed', 'bed', 2, true],
  ['four-bears-on-bed', 'bed', 4, false],
  ['two-bears-on-table', 'table', 2, false],
]) {
  let b = furniture(kind);
  for (let i = 0; i < n; i++)
    b += group(
      toy('teddy-bear'),
      n === 4 ? 97 + i * 125 : 205 + i * 190,
      under ? 249 : kind === 'bed' ? 64 : 43,
      0.6,
      `data-bear="${i + 1}"`
    );
  write(file, b, 720, 410);
}
let balloons = rect(15, 15, 870, 400, '#dff3ff', 15) + rect(15, 320, 870, 95, '#c6e2b9', 0);
for (let i = 0; i < 7; i++) {
  const x = 65 + i * 120,
    y = 205,
    s = 0.77,
    girl = i === 3 || i === 4;
  const n = [2, 1, 1, 2, 1, 0, 0][i];
  const handX = x + 38 * s,
    handY = y + 75 * s;
  for (let k = 0; k < n; k++) {
    const bx = x + 20 + k * 42,
      by = 75 + k * 13;
    balloons +=
      line(bx, by + 38, handX, handY, ink, 2) +
      `<ellipse cx="${bx}" cy="${by}" rx="24" ry="35" fill="${[colors.red, colors.yellow, colors.blue, colors.purple, colors.green][i % 5]}" data-balloon="${i}-${k}"/>` +
      poly(`${bx},${by + 35} ${bx - 4},${by + 42} ${bx + 4},${by + 42}`, colors.yellow);
  }
  balloons +=
    group(
      child(0, 0, 1, girl),
      x,
      y,
      s,
      `data-child="${girl ? 'girl' : 'boy'}" data-holding="${n > 0}"`
    ) + txt(x - 25, 388, girl ? 'menina' : 'menino', 15);
  if (i === 5) balloons += group(toy('plane'), x - 35, 226, 0.35);
  if (i === 6) balloons += group(toy('bike'), x - 55, 234, 0.5);
}
write('children-balloons', balloons, 900, 430);
for (const [file, kind] of [
  ['read-inside', 'read'],
  ['fly-kite-outside', 'kite'],
  ['ride-bike-outside', 'bike'],
  ['play-doll-inside', 'doll'],
  ['play-outside', 'play'],
])
  write(file, action(kind), 720, 430);
const metal =
  group(toy('bike', '#b9c4d1'), 30, 55, 2.0) +
  line(290, 80, 234, 241, '#7e8b9a', 5) +
  poly('234,241 235,222 249,230', '#7e8b9a') +
  rect(465, 70, 190, 155, '#e6edf4', 14) +
  rect(505, 114, 110, 42, '#9faab9', 5) +
  line(512, 121, 605, 121, 'white', 6) +
  line(510, 141, 605, 141, '#718096', 3);
write('metal-bike', metal, 720, 430);
let cloth =
  toy('doll').replaceAll('#f5d4b5', '#ead5bd').replaceAll('#b4826a', '#ead5bd') +
  '<circle cx="120" cy="62" r="29" fill="none" stroke-dasharray="3 5"/>';
write(
  'fabric-doll',
  group(cloth, 50, 35, 1.7) +
    rect(495, 70, 180, 180, '#f1b7cb', 5) +
    Array.from(
      { length: 7 },
      (_, i) =>
        line(500, 85 + i * 23, 668, 85 + i * 23, '#cb809e', 1) +
        line(510 + i * 23, 76, 510 + i * 23, 242, '#cb809e', 1)
    ).join('') +
    line(513, 224, 652, 224, ink, 2),
  720,
  430
);
const paper = toy('kite', '#fff0c9') + poly('150,40 150,78 184,74', '#ded3b8');
write('paper-kite', paper);
write(
  'paper-kite-plastic-lorry',
  group(paper, 36, 35, 1.3) +
    group(toy('lorry', colors.green), 373, 90, 1.25) +
    rect(85, 310, 140, 70, '#fff2ca', 3) +
    poly('185,310 185,338 225,338', '#dbd0b6') +
    rect(470, 305, 140, 70, '#76cba1', 17) +
    rect(493, 295, 40, 11, '#76cba1', 3) +
    line(481, 322, 595, 322, '#c8f5df', 5),
  720,
  430
);
// Préparation: enseignement autonome, distinct des scènes évaluatives.
write(
  'learn-toys',
  ['car', 'train', 'teddy-bear', 'spinning-top']
    .map((n, i) => group(toy(n), 35 + i * 175, 65, 0.65))
    .join(''),
  760,
  280
);
let learn = Object.entries(colors)
  .map(
    ([n, c], i) =>
      rect(25 + i * 104, 20, 80, 46, c, 6) +
      txt(26 + i * 104, 90, n, 16) +
      txt(
        26 + i * 104,
        111,
        ['vermelho', 'azul', 'amarelo', 'verde', 'laranja', 'rosa', 'roxo'][i],
        14
      )
  )
  .join('');
learn += ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
  .map((n, i) => txt(25 + i * 70, 164, String(i + 1), 23) + txt(25 + i * 70, 188, n, 17))
  .join('');
learn += Array.from({ length: 6 }, (_, i) =>
  group(toy('kite', colors.orange), 100 + i * 90, 201, 0.35, `data-kite="${i + 1}"`)
).join('');
for (const [i, n, pt] of [
  [0, 'soccer-ball', 'bola de futebol'],
  [1, 'tennis-ball', 'bola de tênis'],
  [2, 'beach-ball', 'bola de praia'],
  [3, 'basketball', 'bola de basquete'],
])
  learn +=
    group(toy(n), 40 + i * 180, 310, 0.5) +
    txt(40 + i * 180, 425, n.replaceAll('-', ' '), 17) +
    txt(40 + i * 180, 450, pt, 15);
write('learn-colors-numbers', learn, 760, 475);
write(
  'learn-positions',
  rect(80, 233, 230, 137, '#d4a270', 5) +
    group(toy('boat').replace(/<path d="M24 170[^>]+\/>/, ''), 100, 72, 1.02) +
    rect(470, 245, 145, 25, '#d4a270', 4) +
    rect(480, 170, 130, 75, '#d4a270', 4) +
    rect(481, 270, 15, 120, '#ad7a50', 2) +
    rect(590, 270, 15, 120, '#ad7a50', 2) +
    group(toy('ball'), 480, 277, 0.45),
  720,
  420
);
function miniAction(kind) {
  if (kind === 'read')
    return (
      child(115, 42, 0.65, true) +
      poly('89,82 114,89 141,82 141,113 114,120 89,113', '#fff9e6') +
      line(114, 89, 114, 120)
    );
  if (kind === 'kite')
    return child(65, 60, 0.65) + group(toy('kite'), 130, 4, 0.35) + line(90, 109, 172, 51, ink, 2);
  if (kind === 'doll') return child(75, 42, 0.65, true) + group(toy('doll'), 112, 64, 0.5);
  return (
    group(toy('bike'), 20, 67, 0.67) +
    circle(120, 40, 17, '#dca87b') +
    '<path d="M103 37q5-23 29-13l6 14z" fill="#e6797c"/>' +
    line(119, 58, 101, 106, '#a78ad2', 20) +
    line(119, 60, 139, 105, '#dca87b', 8) +
    line(100, 107, 118, 131, '#62738e', 9) +
    line(118, 131, 108, 161, '#62738e', 8)
  );
}
let places =
  group(action('draw'), 10, 50, 0.47) +
  group(action('bike'), 365, 50, 0.47) +
  txt(25, 34, 'Inside / Indoor', 23) +
  txt(380, 34, 'Outside / Outdoor', 23);
for (const [i, k, en, pt] of [
  [0, 'read', 'Read books', 'Ler livros'],
  [1, 'kite', 'Fly a kite', 'Empinar pipa'],
  [2, 'bike', 'Ride a bike', 'Pedalar'],
  [3, 'doll', 'Play with a doll', 'Brincar com boneca'],
])
  places +=
    group(miniAction(k), 20 + i * 180, 260, 0.62) +
    txt(20 + i * 180, 396, en, 17) +
    txt(20 + i * 180, 420, pt, 14);
write('learn-places', places, 760, 450);
write(
  'learn-materials',
  group(toy('car', '#aab7c9'), 20, 35, 0.65) +
    group(toy('teddy-bear'), 200, 35, 0.65) +
    group(
      poly('20,100 220,100 185,160 55,160', '#fff0c9') + poly('50,98 120,38 190,98', '#fff0c9'),
      385,
      35,
      0.65
    ) +
    group(toy('blocks'), 565, 35, 0.65) +
    ['metal / metal', 'fabric / tecido', 'paper / papel', 'plastic / plástico']
      .map(
        (n, i) =>
          rect(40 + i * 180, 190, 120, 40, ['#aab7c9', '#d3b897', '#fff0c9', '#9ed7b3'][i], 4) +
          txt(30 + i * 180, 270, n, 16)
      )
      .join('') +
    line(51, 199, 145, 199, 'white', 4) +
    line(230, 213, 330, 213, '#795e44', 2) +
    line(248, 195, 248, 226, '#795e44', 2) +
    poly('495,191 495,214 519,214', '#d8cfb6') +
    rect(614, 184, 20, 6, '#9ed7b3', 1),
  760,
  310
);
write(
  'learn-compare',
  txt(55, 40, 'A', 27) +
    txt(430, 40, 'B', 27) +
    group(toy('car', colors.green), 25, 100, 1.1) +
    group(toy('kite', colors.red), 260, 60, 0.5) +
    group(toy('car', colors.blue), 400, 100, 1.1),
  720,
  320
);
function ufo(x, y) {
  return group(
    `<ellipse cx="40" cy="25" rx="37" ry="12" fill="#adbbd7"/><path d="M20 23q20-32 40 0" fill="#c3edf5"/>`,
    x,
    y
  );
}
function comparison(b) {
  let body =
    room() +
    rect(60, 85, 305, 15, '#b78f68', 2) +
    circle(560, 123, 50, '#fff7eb') +
    circle(560, 123, 32, colors.red) +
    circle(560, 123, 13, '#fff7eb') +
    line(40, 39, 365, 39) +
    poly('117,40 150,40 133,77', colors.blue) +
    poly('176,40 209,40 192,77', colors.green);
  body +=
    child(100, 217, 0.9, true) +
    child(413, 217, 0.9, false) +
    group(toy('plane', colors.blue), 42, 338, 0.34) +
    ufo(230, 95) +
    ufo(310, 292) +
    group(toy('beach-ball'), 507, 295, 0.43);
  const changes = [
    poly('58,40 91,40 75,77', b ? colors.yellow : colors.red),
    b ? '' : group(toy('plane', colors.red), 252, 35, 0.28),
    b ? line(586, 98, 560, 123, colors.blue, 5) + poly('578,96 590,89 590,103', colors.blue) : '',
    group(toy(b ? 'doll' : 'robot'), 234, 227, 0.53),
    group(toy(b ? 'basketball' : 'soccer-ball'), 443, 230, 0.55),
    b
      ? [0, 1, 2, 3]
          .map((i) =>
            rect(
              606,
              300 - i * 30,
              29,
              29,
              [colors.red, colors.blue, colors.green, colors.yellow][i],
              2
            )
          )
          .join('')
      : [0, 1, 2, 3]
          .map((i) =>
            rect(
              558 + (i % 2) * 30,
              270 + Math.floor(i / 2) * 30,
              29,
              29,
              [colors.red, colors.blue, colors.green, colors.yellow][i],
              2
            )
          )
          .join(''),
    rect(349, 319, 50, 50, b ? colors.blue : colors.purple, 4) + txt(366, 353, '1', 27),
  ];
  return body + changes.map((s, i) => `<g data-difference="${i + 1}">${s}</g>`).join('');
}
function pair(focus = '', review = false, mobile = false) {
  const a = comparison(false),
    b = comparison(true);
  let body =
    txt(30, 28, 'A', 24) +
    txt(mobile ? 30 : 765, mobile ? 498 : 28, 'B', 24) +
    group(a, 0, 38, 1, 'data-scene="a"') +
    group(b, mobile ? 0 : 735, mobile ? 508 : 38, 1, 'data-scene="b"');
  if (focus === 'flag')
    body += group(
      line(130, 125, 81, 102, '#7e8b9a', 5) + poly('81,102 101,101 94,116', '#7e8b9a'),
      mobile ? 0 : 735,
      mobile ? 470 : 0
    );
  if (focus === 'ball')
    for (const [x, y] of [[0, 0], mobile ? [0, 470] : [735, 0]])
      body += group(
        line(452, 243, 502, 317, '#7e8b9a', 5) + poly('502,317 486,309 501,301', '#7e8b9a'),
        x,
        y
      );
  if (review) {
    const markers = [
      [75, 80],
      [294, 110],
      [585, 160],
      [350, 285],
      [505, 365],
      [652, 278],
      [410, 388],
    ];
    for (const [x, y] of [[0, 0], mobile ? [0, 470] : [735, 0]])
      markers.forEach(([mx, my], i) => {
        body +=
          circle(x + mx, y + my, 14, '#ffffff') + txt(x + mx - 5, y + my + 5, String(i + 1), 16);
      });
    const legends = [
      ['The flag is yellow.', 'A bandeirinha é amarela.'],
      ['There is no red plane in picture B.', 'Não há avião vermelho na imagem B.'],
      ['There is a dart in picture B.', 'Há um dardo na imagem B.'],
      ['There is a doll instead of the robot.', 'Há uma boneca no lugar do robô.'],
      ['There is a basketball in picture B.', 'Há uma bola de basquete na imagem B.'],
      [
        'The blocks make a tall tower in picture B.',
        'Os blocos formam uma torre alta na imagem B.',
      ],
      ['The block is blue in picture B.', 'O bloco é azul na imagem B.'],
    ];
    legends.forEach(([en, pt], i) => {
      body +=
        txt(
          35,
          (mobile ? 990 : 505) + i * (mobile ? 80 : 50),
          `${i + 1}. ${en}`,
          mobile ? 30 : 22
        ) + txt(60, (mobile ? 1027 : 528) + i * (mobile ? 80 : 50), pt, mobile ? 28 : 20);
    });
  }
  return body;
}
write('compare-a-b', pair(), 1460, 470);
write('compare-a-b-flag-focus', pair('flag'), 1460, 470);
write('compare-a-b-ball-focus', pair('ball'), 1460, 470);
write('compare-review-7', pair('', true), 1460, 860);
write('compare-a-b-mobile', pair('', false, true), 720, 940);
write('compare-a-b-flag-focus-mobile', pair('flag', false, true), 720, 940);
write('compare-a-b-ball-focus-mobile', pair('ball', false, true), 720, 940);
write('compare-review-7-mobile', pair('', true, true), 720, 1580);
console.log('Assets originais Play Time gerados.');
