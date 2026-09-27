// Spellogik för Lava – ingen DOM här, bara brädet och reglerna.
// Positioner är index i en platt lista: index = rad * COLS + kolumn.
export const COLS = 6;
export const ROWS = 7;
export const MIN_START_GOAL_DISTANCE = 3;
export const MAX_LAVA = 16;

const DIRECTIONS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const toXY = (index) => [index % COLS, Math.floor(index / COLS)];
const toIndex = (x, y) => y * COLS + x;

// Grundantal lava-rutor, slumpas en gång per spelomgång (6–10).
export function randomBaseLava() {
  return randomInt(6, 10);
}

// Antal lava-rutor: grundantalet +1 per vinst, max MAX_LAVA.
export function lavaCountFor(baseLava, wins) {
  return Math.min(MAX_LAVA, baseLava + wins);
}

// Returnerar ny position efter ett steg, eller null om steget går utanför brädet.
export function step(position, direction) {
  const [dx, dy] = DIRECTIONS[direction];
  const [x, y] = toXY(position);
  const nx = x + dx;
  const ny = y + dy;
  if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return null;
  return toIndex(nx, ny);
}

function distance(a, b) {
  const [ax, ay] = toXY(a);
  const [bx, by] = toXY(b);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

// BFS: finns en väg från start till mål som inte går genom lava?
export function hasPath(start, goal, lava) {
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    if (current === goal) return true;
    for (const direction of Object.keys(DIRECTIONS)) {
      const next = step(current, direction);
      if (next === null || visited.has(next) || lava.has(next)) continue;
      visited.add(next);
      queue.push(next);
    }
  }
  return false;
}

function placeLava(count, start, goal) {
  const free = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    if (i !== start && i !== goal) free.push(i);
  }
  // Fisher–Yates och ta de första `count`
  for (let i = free.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [free[i], free[j]] = [free[j], free[i]];
  }
  return new Set(free.slice(0, count));
}

// Skapar ett nytt bräde med start, mål och lava där det garanterat finns en väg.
export function createBoard(lavaCount) {
  const cells = COLS * ROWS;
  const start = randomInt(0, cells - 1);

  let goal;
  do {
    goal = randomInt(0, cells - 1);
  } while (distance(start, goal) < MIN_START_GOAL_DISTANCE);

  let lava;
  do {
    lava = placeLava(lavaCount, start, goal);
  } while (!hasPath(start, goal, lava));

  return { start, goal, lava };
}
