// Spellogik för Perfect Hit – ingen DOM här.
// Markörens position är ett tal 0–1 längs stapeln; mitten är 0.5.
export const CENTER = 0.5;
export const ZONE_WIDTH = 0.18; // Gröna zonen, andel av stapeln
export const PERFECT_MARGIN = 0.02; // ± kring mitten som räknas som perfekt

// Nivåer: en perfekt träff tar spelaren upp en nivå, upp till MAX_LEVEL.
export const MAX_LEVEL = 20;

// Fart i stapelbredder per sekund. Nivå 1–11 ökar med 0.12 per nivå
// (0.6 → 1.8). Därefter ökar den långsammare, 0.05 per nivå (→ 2.25 på
// nivå 20), eftersom den perfekta randen annars passeras snabbare än en
// skärmuppdatering och blir omöjlig att träffa.
const BASE_SPEED = 0.6;
const EARLY_STEP = 0.12;
const LATE_STEP = 0.05;
const STEP_CHANGE_LEVEL = 11;

export const RESULTS = {
  perfect: { coins: 15, text: '🎯 Perfekt! +15 C Coins' },
  good: { coins: 8, text: '👍 Bra! +8 C Coins' },
  miss: { coins: 0, text: '😬 Nästan! Inga mynt den här gången' },
};

export function clampLevel(level) {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(level) || 1));
}

export function speedForLevel(level) {
  const lvl = clampLevel(level);
  const early = Math.min(lvl, STEP_CHANGE_LEVEL) - 1;
  const late = Math.max(0, lvl - STEP_CHANGE_LEVEL);
  return BASE_SPEED + early * EARLY_STEP + late * LATE_STEP;
}

// Flyttar markören `dt` sekunder framåt och studsar mot kanterna.
// direction är 1 (höger) eller -1 (vänster).
export function advance(position, direction, speed, dt) {
  let pos = position + direction * speed * dt;
  let dir = direction;
  if (pos > 1) {
    pos = 2 - pos;
    dir = -1;
  } else if (pos < 0) {
    pos = -pos;
    dir = 1;
  }
  return { position: pos, direction: dir };
}

const EPSILON = 1e-9; // Så att exakta gränsvärden inte faller bort p.g.a. flyttalsavrundning

export function judge(position) {
  const distance = Math.abs(position - CENTER) - EPSILON;
  if (distance <= PERFECT_MARGIN) return 'perfect';
  if (distance <= ZONE_WIDTH / 2) return 'good';
  return 'miss';
}
