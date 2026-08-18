const bootLines = document.querySelector('#bootLines');
const codeOutput = document.querySelector('#codeOutput');
const counter = document.querySelector('#counter');
const hint = document.querySelector('#hint');
const modal = document.querySelector('#accessModal');
const restartButton = document.querySelector('#restartButton');
const clock = document.querySelector('#clock');

const target = 80;
let inputCount = 0;
let lineIndex = 0;
let unlocked = false;
let isTyping = false;

const bootLog = [
  'ИНИЦИАЛИЗАЦИЯ ЗАЩИЩЁННОГО КАНАЛА...',
  'СКАНИРОВАНИЕ СИСТЕМНЫХ УЗЛОВ <span class="muted">[OK]</span>',
  'ОБХОД ПРОТОКОЛА FIREWALL <span class="muted">[BYPASSED]</span>',
  'ОПРЕДЕЛЕНИЕ ГЕОЛОКАЦИИ <span class="muted">[47.3769° N, 8.5417° E]</span>',
  'СПУТНИКОВЫЙ КАНАЛ: УСТАНОВЛЕН <span class="muted">[ENCRYPTED]</span>',
  'ОЖИДАНИЕ РУЧНОГО ВВОДА...'
];

const snippets = [
  'const tunnel = await QuantumLink.open({ mode: "silent", relay: node });',
  'function decryptPacket(buffer) { return AES.decode(buffer, sessionKey); }',
  'for (let port = 1; port < 65536; port++) { probe(port, target); }',
  'std::vector<uint8_t> payload = forge_signature(seed, entropy);',
  'if (trace.level > 0) { reroute(proxyChain.rotate()); }',
  'await vault.sync({ compression: "adaptive", priority: "critical" });',
  'kernel.inject("/dev/ghost", { privilege: "root", timeout: 0 });',
  'const checksum = packets.reduce((sum, p) => sum ^ p.hash, 0xA7);',
  'neuralMap.resolve(origin).then(access => session.authorize(access));',
  'while (uplink.signal > 0.92) { exfiltrate(fragment.next()); }'
];

function addBootLine(text, delay) {
  window.setTimeout(() => {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = text;
    bootLines.append(line);
  }, delay);
}

function startBoot() {
  bootLines.innerHTML = '';
  bootLog.forEach((line, index) => addBootLine(line, index * 330));
}

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString('ru-RU', { hour12: false });
}

function updateCounter() {
  counter.textContent = `INPUT: ${String(Math.min(inputCount, target)).padStart(3, '0')} / ${String(target).padStart(3, '0')}`;
}

function typeSnippet() {
  if (isTyping || unlocked) return;
  isTyping = true;
  hint.textContent = ' Обработка командного потока...';
  const text = snippets[lineIndex++ % snippets.length];
  const line = document.createElement('div');
  line.className = 'code-line';
  codeOutput.append(line);
  let char = 0;
  const writer = window.setInterval(() => {
    line.textContent += text[char++] || '';
    document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
    if (char >= text.length) {
      window.clearInterval(writer);
      isTyping = false;
      hint.textContent = ' Нажмите любую клавишу или коснитесь экрана';
    }
  }, 9);
}

function registerInput(forceFinish = false) {
  if (unlocked) return;
  inputCount += forceFinish ? target : 1;
  updateCounter();
  typeSnippet();
  if (inputCount >= target || forceFinish) unlock();
}

function unlock() {
  unlocked = true;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') registerInput(true);
  else registerInput();
});
document.querySelector('#terminal').addEventListener('pointerdown', () => registerInput());
restartButton.addEventListener('click', () => {
  unlocked = false; inputCount = 0; lineIndex = 0; isTyping = false;
  codeOutput.innerHTML = ''; updateCounter(); startBoot();
  modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true');
});

updateCounter(); updateClock(); startBoot(); window.setInterval(updateClock, 1000);
