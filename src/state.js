// Central modul för sparad speldata. Allt sparas i localStorage under STORAGE_KEY.
// Varje ändring skickar eventet STATE_CHANGED på window med state som `detail`.
const STORAGE_KEY = 'cgames-save';
export const STATE_CHANGED = 'cgames:state-changed';

function createDefaultState() {
  return {
    coins: 30,
    avatar: { hair: null, top: null, hat: null, glasses: null, accessory: null },
    inventory: [],
    highscores: { lava: 0, blockBlast: 0, perfectHit: 0, cOrd: 0 },
  };
}

let state;
loadState();

// Läser sparad data och fyller på med standardvärden för fält som saknas,
// så att gamla sparfiler fortsätter fungera när nya fält läggs till.
export function loadState() {
  const defaults = createDefaultState();
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    // Trasig eller otillgänglig data – börja om med standardvärden
  }

  state = {
    coins: Number.isFinite(saved.coins) ? saved.coins : defaults.coins,
    avatar: { ...defaults.avatar, ...saved.avatar },
    inventory: Array.isArray(saved.inventory) ? saved.inventory : defaults.inventory,
    highscores: { ...defaults.highscores, ...saved.highscores },
  };
  return state;
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignorera (t.ex. privat läge eller full lagring)
  }
  window.dispatchEvent(new CustomEvent(STATE_CHANGED, { detail: state }));
}

export function getState() {
  return state;
}

export function addCoins(amount) {
  state.coins = Math.max(0, state.coins + amount);
  saveState();
}

export function spendCoins(amount) {
  if (amount < 0 || state.coins < amount) return false;
  state.coins -= amount;
  saveState();
  return true;
}

// Sparar ett nytt rekord för ett minispel om det slår det gamla.
// Returnerar true om det blev nytt rekord.
export function setHighscore(game, score) {
  if (score <= (state.highscores[game] ?? 0)) return false;
  state.highscores[game] = score;
  saveState();
  return true;
}

export function ownsItem(itemId) {
  return state.inventory.includes(itemId);
}

// Köper en vara om den inte redan ägs och det finns tillräckligt med mynt.
export function buyItem(itemId, price) {
  if (ownsItem(itemId) || state.coins < price) return false;
  state.coins -= price;
  state.inventory.push(itemId);
  saveState();
  return true;
}

// Utrustar ett ägt item i en avatar-slot. Skicka null som itemId för att ta av.
export function equipItem(slot, itemId) {
  if (!(slot in state.avatar)) return false;
  if (itemId !== null && !ownsItem(itemId)) return false;
  state.avatar[slot] = itemId;
  saveState();
  return true;
}
