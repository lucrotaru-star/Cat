const welcomeScreen = document.querySelector('#welcomeScreen');
const playButton = document.querySelector('#playButton');
const terminal = document.querySelector('#terminal');
const bootLines = document.querySelector('#bootLines');
const codeOutput = document.querySelector('#codeOutput');
const counter = document.querySelector('#counter');
const hint = document.querySelector('#hint');
const modal = document.querySelector('#accessModal');
const clock = document.querySelector('#clock');
const fakeWindows = document.querySelector('#fakeWindows');
const videoOverlay = document.querySelector('#videoOverlay');
const gotchaVideo = document.querySelector('#gotchaVideo');

const bootLog = [
  'ИНИЦИАЛИЗАЦИЯ ЗАЩИЩЁННОГО КАНАЛА...',
  'СКАНИРОВАНИЕ СИСТЕМНЫХ УЗЛОВ <span class="muted">[OK]</span>',
  'ОБХОД ПРОТОКОЛА FIREWALL <span class="muted">[BYPASSED]</span>',
  'ОПРЕДЕЛЕНИЕ ГЕОЛОКАЦИИ <span class="muted">[47.3769° N, 8.5417° E]</span>',
  'СПУТНИКОВЫЙ КАНАЛ: УСТАНОВЛЕН <span class="muted">[ENCRYPTED]</span>',
  'АВТОНОМНЫЙ ПОТОК ДАННЫХ ЗАПУЩЕН...'
];
const snippets = [
  'const tunnel = await QuantumLink.open({ mode: "silent", relay: node });',
  'function decryptPacket(buffer) { return AES.decode(buffer, sessionKey); }',
  'for (let port = 1; port < 65536; port++) { probe(port, target); }',
  'std::vector<uint8_t> payload = forge_signature(seed, entropy);',
  'if (trace.level > 0) { reroute(proxyChain.rotate()); }',
  'await vault.sync({ compression: "adaptive", priority: "critical" });',
  'kernel.inject("/dev/ghost", { privilege: "root", timeout: 0 });',
  'const checksum = packets.reduce((sum, p) => sum ^ p.hash, 0xA7);'
];

let progress = 0;
let lineIndex = 0;

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString('ru-RU', { hour12: false });
}

function updateProgress() {
  counter.textContent = `DATA: ${String(progress).padStart(3, '0')} / 100`;
}

function addBootLine(text, delay) {
  setTimeout(() => {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = text;
    bootLines.append(line);
  }, delay);
}

function writeSnippet() {
  const text = snippets[lineIndex++ % snippets.length];
  const line = document.createElement('div');
  line.className = 'code-line';
  codeOutput.append(line);
  let char = 0;
  const writer = setInterval(() => {
    line.textContent += text[char++] || '';
    if (char >= text.length) clearInterval(writer);
  }, 8);
}

function showWindows() {
  const messages = [
    'WARNING: REMOTE SESSION DETECTED',
    'SYSTEM FILES: ARCHIVE CREATED',
    'ENCRYPTION KEY: OVERRIDDEN',
    'CONNECTION STATUS: UNSTABLE'
  ];
  messages.forEach((message, index) => setTimeout(() => {
    const win = document.createElement('article');
    win.className = 'fake-window';
    win.style.left = `${8 + (index * 19) % 48}%`;
    win.style.top = `${8 + (index * 16) % 58}%`;
    win.innerHTML = `<header><span>SECURITY_ALERT.exe</span><span>×</span></header><p><span class="warning">${message}</span><br>> scanning residual processes...<br>> access level: ROOT</p>`;
    fakeWindows.append(win);
  }, index * 550));
}

function finishSequence() {
  hint.textContent = ' Данные приняты. Инициализация предупреждений...';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(showWindows, 1200);
  setTimeout(playVideo, 3000);
}

function playVideo() {
  videoOverlay.classList.add('show');
  videoOverlay.setAttribute('aria-hidden', 'false');
  gotchaVideo.play().catch(() => {
    // Some browsers only permit delayed video playback without audio.
    gotchaVideo.muted = true;
    gotchaVideo.play();
  });
}

gotchaVideo.addEventListener('ended', () => {
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  window.close();
  setTimeout(() => {
    document.body.replaceChildren();
    document.body.style.background = '#000';
  }, 250);
});

document.addEventListener('fullscreenchange', () => {
  // Leaving fullscreen also releases the cursor, rather than trapping the visitor.
  if (!document.fullscreenElement && document.pointerLockElement) {
    document.exitPointerLock();
  }
});

function startSequence() {
  bootLog.forEach((line, index) => addBootLine(line, index * 300));
  const stream = setInterval(() => {
    writeSnippet();
    progress = Math.min(100, progress + 8);
    updateProgress();
    if (progress >= 100) {
      clearInterval(stream);
      setTimeout(finishSequence, 950);
    }
  }, 600);
}

playButton.addEventListener('click', async () => {
  try {
    const requests = [
      document.documentElement.requestFullscreen?.(),
      document.documentElement.requestPointerLock?.()
    ].filter(Boolean);
    await Promise.allSettled(requests);
  } catch (_) {
    // Browsers may decline immersive-mode requests; the scene still works normally.
  }
  welcomeScreen.hidden = true;
  terminal.hidden = false;
  updateClock();
  updateProgress();
  startSequence();
});

setInterval(updateClock, 1000);
