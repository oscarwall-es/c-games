import { getState, addCoins, setHighscore } from '../state.js';
import { getAvatarFace } from './avatar.js';
import { COLS, ROWS, createBoard, lavaCountFor, randomBaseLava, step } from '../games/lava.js';

const WIN_REWARD = 8;
const NEW_BOARD_DELAY_MS = 1500;
const HINT = 'Gå till ⭐ och undvik 🔥!';

const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const ARROWS = [
  { direction: 'up', label: '⬆️', name: 'Upp' },
  { direction: 'left', label: '⬅️', name: 'Vänster' },
  { direction: 'down', label: '⬇️', name: 'Ner' },
  { direction: 'right', label: '➡️', name: 'Höger' },
];

export function renderLava(container) {
  // Svårigheten lever bara så länge skärmen visas – nollställs när man lämnar.
  const baseLava = randomBaseLava();
  let wins = 0;
  let board = null;
  let player = null;
  let locked = false;
  let newBoardTimer = null;
  const face = getAvatarFace(getState().avatar);

  const root = document.createElement('div');
  root.className = 'lava';
  root.innerHTML = `
    <div class="lava__info">
      <span class="lava__level"></span>
      <span class="lava__record"></span>
    </div>
    <p class="lava__message" role="status"></p>
    <div class="lava__board" style="--cols: ${COLS}"></div>
    <div class="lava__controls">
      ${ARROWS.map(
        (a) => `<button class="lava__arrow lava__arrow--${a.direction}" data-direction="${a.direction}" aria-label="${a.name}">${a.label}</button>`,
      ).join('')}
    </div>
    <button class="lava__restart">🔄 Börja om</button>`;

  const levelEl = root.querySelector('.lava__level');
  const recordEl = root.querySelector('.lava__record');
  const messageEl = root.querySelector('.lava__message');
  const boardEl = root.querySelector('.lava__board');

  function setMessage(text, tone = '') {
    messageEl.textContent = text;
    messageEl.className = `lava__message ${tone ? `lava__message--${tone}` : ''}`;
  }

  function drawRecord() {
    recordEl.textContent = `🏆 Rekord: nivå ${getState().highscores.lava}`;
  }

  function newBoard() {
    clearTimeout(newBoardTimer);
    board = createBoard(lavaCountFor(baseLava, wins));
    player = board.start;
    locked = false;
    levelEl.textContent = `Nivå ${wins + 1} · 🔥 ${board.lava.size}`;
    setMessage(HINT);
    drawBoard();
  }

  function drawBoard() {
    const cells = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const cell = document.createElement('div');
      cell.className = 'lava__cell';
      if (board.lava.has(i)) {
        cell.classList.add('lava__cell--lava');
        cell.textContent = '🔥';
      } else if (i === board.goal) {
        cell.classList.add('lava__cell--goal');
        cell.textContent = '⭐';
      }
      if (i === player) {
        cell.classList.add('lava__cell--player');
        cell.textContent = face;
      }
      cells.push(cell);
    }
    boardEl.replaceChildren(...cells);
  }

  function move(direction) {
    if (locked) return;
    const next = step(player, direction);
    if (next === null) return; // Kant – ignorera

    if (board.lava.has(next)) {
      player = board.start;
      setMessage('💥 Aj, du klev i lavan!', 'bad');
    } else if (next === board.goal) {
      player = next;
      locked = true;
      wins++;
      addCoins(WIN_REWARD);
      // Rekordet är den högsta nivå spelaren har klarat
      setHighscore('lava', wins);
      drawRecord();
      setMessage(`🎉 Vinst! +${WIN_REWARD} C Coins`, 'good');
      newBoardTimer = setTimeout(newBoard, NEW_BOARD_DELAY_MS);
    } else {
      player = next;
      setMessage(HINT);
    }
    drawBoard();
  }

  function onKeyDown(event) {
    const direction = KEY_TO_DIRECTION[event.key];
    if (!direction) return;
    event.preventDefault(); // Hindra att sidan scrollar
    move(direction);
  }

  root.querySelector('.lava__controls').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-direction]');
    if (btn) move(btn.dataset.direction);
  });
  root.querySelector('.lava__restart').addEventListener('click', newBoard);
  window.addEventListener('keydown', onKeyDown);

  container.append(root);
  drawRecord();
  newBoard();

  // Städas av routern när man lämnar skärmen
  return () => {
    clearTimeout(newBoardTimer);
    window.removeEventListener('keydown', onKeyDown);
  };
}
