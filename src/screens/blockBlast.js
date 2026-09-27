import { getState, addCoins, setHighscore } from '../state.js';
import {
  SIZE,
  createGrid,
  randomPieces,
  pieceSize,
  cellsFor,
  canPlace,
  fitsAnywhere,
  placePiece,
} from '../games/blockBlast.js';

const HINT = 'Välj en bit och tryck på brädet';
const MESSAGE_MS = 1800;
const SHAKE_MS = 400;

export function renderBlockBlast(container) {
  let grid;
  let pieces; // Tre platser; null = redan använd
  let selected = null; // Index i pieces
  let score;
  let gameOver;
  let messageTimer = null;
  let shakeTimer = null;

  const root = document.createElement('div');
  root.className = 'bb';
  root.innerHTML = `
    <div class="bb__info">
      <span class="bb__score"></span>
      <span class="bb__record"></span>
    </div>
    <p class="bb__message" role="status"></p>
    <div class="bb__board-wrap">
      <div class="bb__board" style="--size: ${SIZE}"></div>
      <div class="bb__over" hidden>
        <p class="bb__over-text"></p>
        <button class="bb__restart">🔄 Ny omgång</button>
      </div>
    </div>
    <div class="bb__tray"></div>`;

  const scoreEl = root.querySelector('.bb__score');
  const recordEl = root.querySelector('.bb__record');
  const messageEl = root.querySelector('.bb__message');
  const boardEl = root.querySelector('.bb__board');
  const overEl = root.querySelector('.bb__over');
  const overTextEl = root.querySelector('.bb__over-text');
  const trayEl = root.querySelector('.bb__tray');

  // Skapa rutorna en gång – sedan uppdateras bara deras klasser.
  const cellEls = [];
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'bb__cell';
    cell.dataset.index = i;
    cellEls.push(cell);
  }
  boardEl.append(...cellEls);

  function setMessage(text, tone = '', { sticky = false } = {}) {
    clearTimeout(messageTimer);
    messageEl.textContent = text;
    messageEl.className = `bb__message ${tone ? `bb__message--${tone}` : ''}`;
    if (!sticky) messageTimer = setTimeout(() => setMessage(HINT, '', { sticky: true }), MESSAGE_MS);
  }

  function drawScore() {
    scoreEl.textContent = `Poäng: ${score}`;
    recordEl.textContent = `🏆 Rekord: ${getState().highscores.blockBlast}`;
  }

  function drawBoard({ cleared = new Set() } = {}) {
    grid.forEach((color, i) => {
      const cell = cellEls[i];
      cell.className = 'bb__cell';
      if (color) cell.classList.add('bb__cell--filled', `bb--${color}`);
      if (cleared.has(i)) cell.classList.add('bb__cell--cleared');
    });
  }

  function drawTray() {
    trayEl.replaceChildren(
      ...pieces.map((piece, i) => {
        const slot = document.createElement('button');
        slot.className = 'bb__slot';
        slot.dataset.slot = i;
        if (!piece) {
          slot.disabled = true;
          slot.setAttribute('aria-label', 'Använd');
          return slot;
        }
        const fits = fitsAnywhere(grid, piece);
        slot.classList.toggle('is-selected', selected === i);
        slot.classList.toggle('is-blocked', !fits);
        slot.setAttribute('aria-pressed', selected === i);
        slot.setAttribute('aria-label', `Bit ${i + 1}${fits ? '' : ' (får inte plats)'}`);

        const { rows, cols } = pieceSize(piece);
        const mini = document.createElement('div');
        mini.className = 'bb__piece';
        mini.style.gridTemplateColumns = `repeat(${cols}, var(--mini))`;
        mini.style.gridTemplateRows = `repeat(${rows}, var(--mini))`;
        for (const [r, c] of piece.cells) {
          const block = document.createElement('span');
          block.className = `bb__block bb--${piece.color}`;
          block.style.gridRow = r + 1;
          block.style.gridColumn = c + 1;
          mini.append(block);
        }
        slot.append(mini);
        return slot;
      }),
    );
  }

  // Förhandsvisning när man håller musen över brädet (datorn).
  function showPreview(row, col) {
    clearPreview();
    if (selected === null || gameOver) return;
    const piece = pieces[selected];
    const cells = cellsFor(piece, row, col);
    const ok = canPlace(grid, piece, row, col);
    // Om biten sticker utanför: visa bara de delar som hamnar på brädet
    const shown = cells ?? piece.cells
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) => r < SIZE && c < SIZE)
      .map(([r, c]) => r * SIZE + c);
    for (const i of shown) cellEls[i].classList.add(ok ? 'bb__cell--preview' : 'bb__cell--preview-bad');
  }

  function clearPreview() {
    for (const cell of cellEls) cell.classList.remove('bb__cell--preview', 'bb__cell--preview-bad');
  }

  function rejectPlacement(row, col) {
    const piece = pieces[selected];
    for (const [dr, dc] of piece.cells) {
      const r = row + dr;
      const c = col + dc;
      if (r < SIZE && c < SIZE) cellEls[r * SIZE + c].classList.add('bb__cell--preview-bad');
    }
    boardEl.classList.remove('is-shaking');
    void boardEl.offsetWidth; // Starta om animationen
    boardEl.classList.add('is-shaking');
    clearTimeout(shakeTimer);
    shakeTimer = setTimeout(() => {
      boardEl.classList.remove('is-shaking');
      clearPreview();
    }, SHAKE_MS);
    setMessage('🚫 Får inte plats där', 'bad');
  }

  function clearMessage(result) {
    const lines = result.rows + result.cols;
    if (lines === 1) return result.rows ? '✨ Rad rensad!' : '✨ Kolumn rensad!';
    return `✨ ${lines} linjer rensade! Bonus +5`;
  }

  function onCellTap(index) {
    if (gameOver) return;
    if (selected === null) {
      setMessage('👇 Välj en bit först', 'info');
      return;
    }
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const piece = pieces[selected];
    if (!canPlace(grid, piece, row, col)) {
      rejectPlacement(row, col);
      return;
    }

    const result = placePiece(grid, piece, row, col);
    grid = result.grid;
    score += result.points;
    pieces[selected] = null;
    selected = null;

    if (result.coins > 0) {
      addCoins(result.coins);
      setMessage(`${clearMessage(result)} +${result.coins} 🌙`, 'good');
    }
    setHighscore('blockBlast', score);

    if (pieces.every((p) => p === null)) pieces = randomPieces();
    // Bara en bit kvar? Välj den direkt så slipper man ett extra tryck.
    const remaining = pieces.flatMap((p, i) => (p ? [i] : []));
    if (remaining.length === 1) selected = remaining[0];

    clearPreview();
    drawBoard({ cleared: result.cleared });
    drawScore();
    drawTray();
    checkGameOver();
  }

  function onSlotTap(i) {
    if (gameOver || !pieces[i]) return;
    selected = selected === i ? null : i;
    clearPreview();
    drawTray();
  }

  function checkGameOver() {
    if (pieces.some((p) => p && fitsAnywhere(grid, p))) return;
    gameOver = true;
    selected = null;
    clearTimeout(messageTimer);
    overTextEl.textContent = `Spelet är slut! Poäng: ${score}`;
    overEl.hidden = false;
    setMessage('Inga bitar får plats längre', 'bad', { sticky: true });
    drawTray();
  }

  function newGame() {
    grid = createGrid();
    pieces = randomPieces();
    selected = null;
    score = 0;
    gameOver = false;
    overEl.hidden = true;
    setMessage(HINT, '', { sticky: true });
    drawBoard();
    drawScore();
    drawTray();
  }

  boardEl.addEventListener('click', (event) => {
    const cell = event.target.closest('.bb__cell');
    if (cell) onCellTap(Number(cell.dataset.index));
  });
  boardEl.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const cell = event.target.closest('.bb__cell');
    if (cell) {
      const i = Number(cell.dataset.index);
      showPreview(Math.floor(i / SIZE), i % SIZE);
    }
  });
  boardEl.addEventListener('pointerleave', clearPreview);
  trayEl.addEventListener('click', (event) => {
    const slot = event.target.closest('.bb__slot');
    if (slot) onSlotTap(Number(slot.dataset.slot));
  });
  root.querySelector('.bb__restart').addEventListener('click', newGame);

  container.append(root);
  newGame();

  return () => {
    clearTimeout(messageTimer);
    clearTimeout(shakeTimer);
  };
}
