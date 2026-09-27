import { getState, addCoins, setHighscore, setProgress } from '../state.js';
import {
  CENTER,
  ZONE_WIDTH,
  PERFECT_MARGIN,
  RESULTS,
  MAX_LEVEL,
  clampLevel,
  speedForLevel,
  advance,
  judge,
} from '../games/perfectHit.js';

const HINT = 'Tryck när den blå pricken är mitt i det gröna!';
const MAX_DT = 0.05; // Undvik stora hopp om fliken legat i bakgrunden

export function renderPerfectHit(container) {
  // Nivån (och därmed farten) sparas, så den finns kvar nästa gång.
  let level = clampLevel(getState().progress.perfectHitLevel);
  let position = 0;
  let direction = 1;
  let running = false;
  let frameId = null;
  let lastTime = null;

  const root = document.createElement('div');
  root.className = 'ph';
  root.innerHTML = `
    <div class="ph__info">
      <span class="ph__speed"></span>
      <span class="ph__record"></span>
    </div>
    <div class="ph__bar">
      <div class="ph__track">
        <div class="ph__zone"></div>
        <div class="ph__perfect"></div>
        <div class="ph__marker"></div>
      </div>
    </div>
    <p class="ph__result" role="status"></p>
    <button class="ph__hit">TRYCK!</button>
    <button class="ph__again">🔄 Igen</button>
    <button class="ph__reset" type="button">↩️ Börja om från nivå 1</button>`;

  const speedEl = root.querySelector('.ph__speed');
  const recordEl = root.querySelector('.ph__record');
  const markerEl = root.querySelector('.ph__marker');
  const resultEl = root.querySelector('.ph__result');
  const hitBtn = root.querySelector('.ph__hit');
  const againBtn = root.querySelector('.ph__again');
  const resetBtn = root.querySelector('.ph__reset');

  // Zonerna ritas utifrån samma konstanter som används för att bedöma träffen.
  const zone = root.querySelector('.ph__zone');
  zone.style.left = `${(CENTER - ZONE_WIDTH / 2) * 100}%`;
  zone.style.width = `${ZONE_WIDTH * 100}%`;
  const perfectEl = root.querySelector('.ph__perfect');
  perfectEl.style.left = `${(CENTER - PERFECT_MARGIN) * 100}%`;
  perfectEl.style.width = `${PERFECT_MARGIN * 2 * 100}%`;

  function drawInfo() {
    speedEl.textContent = level === MAX_LEVEL ? `⚡ Nivå ${level} (max!)` : `⚡ Nivå ${level} av ${MAX_LEVEL}`;
    recordEl.textContent = `🏆 Rekord: nivå ${Math.max(level, getState().highscores.perfectHit)}`;
    resetBtn.hidden = level === 1;
  }

  function drawMarker() {
    markerEl.style.left = `${position * 100}%`;
  }

  function setResult(text, tone = '') {
    resultEl.textContent = text;
    resultEl.className = `ph__result ${tone ? `ph__result--${tone}` : ''}`;
  }

  function tick(time) {
    if (lastTime !== null) {
      const dt = Math.min(MAX_DT, (time - lastTime) / 1000);
      ({ position, direction } = advance(position, direction, speedForLevel(level), dt));
      drawMarker();
    }
    lastTime = time;
    frameId = requestAnimationFrame(tick);
  }

  function start() {
    position = 0;
    direction = 1;
    lastTime = null;
    running = true;
    hitBtn.disabled = false;
    againBtn.disabled = true;
    setResult(HINT);
    drawMarker();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(tick);
  }

  function hit() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frameId);
    hitBtn.disabled = true;
    againBtn.disabled = false;

    const result = judge(position);
    const { coins } = RESULTS[result];
    if (coins > 0) addCoins(coins);
    let text = RESULTS[result].text;
    if (result === 'perfect' && level < MAX_LEVEL) {
      level++;
      setProgress('perfectHitLevel', level);
      text += ` · Nivå ${level}!`;
    }
    // Rekordet är den högsta nivå spelaren har nått
    setHighscore('perfectHit', level);
    setResult(text, result);
    drawInfo();
    againBtn.focus({ preventScroll: true });
  }

  // pointerdown i stället för click: reagerar direkt när fingret nuddar
  // knappen, inte först när det släpps – viktigt i ett precisionsspel.
  hitBtn.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    hit();
  });
  // Tangentbord (Enter/mellanslag på fokuserad knapp) ger ett vanligt click
  hitBtn.addEventListener('click', (event) => {
    if (event.detail === 0) hit();
  });
  againBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', () => {
    level = 1;
    setProgress('perfectHitLevel', level);
    drawInfo();
    start();
  });

  // Mellanslag trycker TRYCK! eller Igen, beroende på läge
  function onKeyDown(event) {
    if (event.code !== 'Space' || event.repeat) return;
    if (event.target.closest?.('button')) return; // Knappen sköter det själv
    event.preventDefault();
    if (running) hit();
    else start();
  }
  window.addEventListener('keydown', onKeyDown);

  container.append(root);
  drawInfo();
  start();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('keydown', onKeyDown);
  };
}
