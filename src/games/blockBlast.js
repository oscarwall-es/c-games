// Spellogik för Block Blast – ingen DOM här, bara brädet och reglerna.
// Brädet är en platt lista med SIZE*SIZE rutor: null (tom) eller en färg.
// En bit är { cells: [[rad, kol], ...], color }, normaliserad så att
// bitens övre vänstra hörn (bounding box) är [0, 0].
export const SIZE = 8;
export const COLORS = ['blue', 'green', 'yellow', 'purple', 'red'];

export const POINTS_PER_CELL = 1;
export const POINTS_PER_LINE = 10;
export const COINS_PER_LINE = 2;
export const MULTI_CLEAR_BONUS = 5;

// Formgrupper – först slumpas en grupp, sedan en variant (rotation) inom den.
const SHAPE_GROUPS = [
  // Enstaka ruta
  [[[0, 0]]],
  // Raka linjer 2–4, liggande och stående
  [
    [[0, 0], [0, 1]],
    [[0, 0], [1, 0]],
  ],
  [
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0]],
  ],
  [
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
  ],
  // L-form i fyra rotationer
  [
    [[0, 0], [1, 0], [2, 0], [2, 1]],
    [[0, 0], [0, 1], [0, 2], [1, 0]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 0], [1, 1], [1, 2]],
  ],
  // Fyrkant 2×2
  [[[0, 0], [0, 1], [1, 0], [1, 1]]],
  // T-form i fyra rotationer
  [
    [[0, 0], [0, 1], [0, 2], [1, 1]],
    [[0, 1], [1, 0], [1, 1], [2, 1]],
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [1, 0], [1, 1], [2, 0]],
  ],
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const index = (row, col) => row * SIZE + col;

export function createGrid() {
  return Array(SIZE * SIZE).fill(null);
}

export function randomPiece() {
  return { cells: pick(pick(SHAPE_GROUPS)), color: pick(COLORS) };
}

export function randomPieces() {
  return [randomPiece(), randomPiece(), randomPiece()];
}

// Bitens storlek i rader/kolumner (för att rita den).
export function pieceSize(piece) {
  const rows = Math.max(...piece.cells.map(([r]) => r)) + 1;
  const cols = Math.max(...piece.cells.map(([, c]) => c)) + 1;
  return { rows, cols };
}

// Rutindex som biten skulle täcka med övre vänstra hörnet på (row, col),
// eller null om någon del hamnar utanför brädet.
export function cellsFor(piece, row, col) {
  const result = [];
  for (const [dr, dc] of piece.cells) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return null;
    result.push(index(r, c));
  }
  return result;
}

export function canPlace(grid, piece, row, col) {
  const cells = cellsFor(piece, row, col);
  return cells !== null && cells.every((i) => grid[i] === null);
}

export function fitsAnywhere(grid, piece) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (canPlace(grid, piece, r, c)) return true;
    }
  }
  return false;
}

// Placerar biten och rensar fulla rader/kolumner. Anroparen ska ha kollat canPlace.
// Returnerar nytt bräde + vad som rensades och hur många poäng/mynt det gav.
export function placePiece(grid, piece, row, col) {
  const next = [...grid];
  for (const i of cellsFor(piece, row, col)) next[i] = piece.color;

  const fullRows = [];
  const fullCols = [];
  for (let k = 0; k < SIZE; k++) {
    let rowFull = true;
    let colFull = true;
    for (let j = 0; j < SIZE; j++) {
      if (next[index(k, j)] === null) rowFull = false;
      if (next[index(j, k)] === null) colFull = false;
    }
    if (rowFull) fullRows.push(k);
    if (colFull) fullCols.push(k);
  }

  // Rensa efter att alla fulla linjer hittats, så att en ruta i både
  // en full rad och en full kolumn räknas till båda.
  const cleared = new Set();
  for (const r of fullRows) for (let c = 0; c < SIZE; c++) cleared.add(index(r, c));
  for (const c of fullCols) for (let r = 0; r < SIZE; r++) cleared.add(index(r, c));
  for (const i of cleared) next[i] = null;

  const lines = fullRows.length + fullCols.length;
  const points = piece.cells.length * POINTS_PER_CELL + lines * POINTS_PER_LINE;
  const coins = lines * COINS_PER_LINE + (lines > 1 ? MULTI_CLEAR_BONUS : 0);

  return { grid: next, rows: fullRows.length, cols: fullCols.length, cleared, points, coins };
}
