// Spellogik för Perfect Hit – ingen DOM här.
// Markörens position är ett tal 0–1 längs stapeln; mitten är 0.5.
export const CENTER = 0.5;
export const ZONE_WIDTH = 0.18; // Gröna zonen, andel av stapeln
export const PERFECT_MARGIN = 0.02; // ± kring mitten som räknas som perfekt

// Fart i stapelbredder per sekund
export const BASE_SPEED = 0.6;
export const SPEED_STEP = 0.12;
export const MAX_SPEED = 1.8;

export const RESULTS = {
  perfect: { coins: 15, text: '🎯 Perfekt! +15 C Coins' },
  good: { coins: 8, text: '👍 Bra! +8 C Coins' },
  miss: { coins: 0, text: '😬 Nästan! Inga mynt den här gången' },
};

// Farten ökar för varje perfekt träff, upp till MAX_SPEED.
export function speedFor(perfects) {
  return Math.min(MAX_SPEED, BASE_SPEED + perfects * SPEED_STEP);
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
