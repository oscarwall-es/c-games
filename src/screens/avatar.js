import { getItem } from '../items.js';

// Lagerordning nerifrån och upp. Varje lager får klassen avatar__<slot>
// så att placeringen styrs helt från CSS. Hår-emojin är ett helt huvud
// och läggs därför i full storlek rakt ovanpå bas-figuren.
const LAYERS = ['hair', 'top', 'glasses', 'hat', 'accessory'];
export const BASE_EMOJI = '🧑';

// Ansiktet som används som spelpjäs i minispelen: utrustat hår, annars bas-figuren.
export function getAvatarFace(avatar) {
  return getItem(avatar.hair)?.emoji ?? BASE_EMOJI;
}

export function renderAvatar(avatar) {
  const el = document.createElement('div');
  el.className = 'avatar';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Din avatar');

  const base = document.createElement('span');
  base.className = 'avatar__layer avatar__base';
  base.textContent = BASE_EMOJI;
  el.append(base);

  for (const slot of LAYERS) {
    const item = getItem(avatar[slot]);
    if (!item) continue;
    const layer = document.createElement('span');
    layer.className = `avatar__layer avatar__${slot}`;
    layer.textContent = item.emoji;
    el.append(layer);
  }

  return el;
}
