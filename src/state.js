// Enkel global state med prenumeranter. Mynt sparas i localStorage.
const STORAGE_KEY = 'c-games-state';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

const state = { coins: 0, ...load() };
const listeners = new Set();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignorera (t.ex. privat läge)
  }
}

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch);
  save();
  listeners.forEach((fn) => fn(state));
}

export function addCoins(amount) {
  setState({ coins: Math.max(0, state.coins + amount) });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
