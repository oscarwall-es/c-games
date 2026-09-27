import './style.css';
import { getState, STATE_CHANGED } from './state.js';
import { initRouter, registerRoute } from './router.js';
import { renderHome } from './screens/home.js';
import { renderShop } from './screens/shop.js';
import { renderLava } from './screens/lava.js';
import { renderBlockBlast } from './screens/blockBlast.js';
import { renderPerfectHit } from './screens/perfectHit.js';
import { renderCOrd } from './screens/cOrd.js';

const coinEl = document.querySelector('#coin-count');
const coinPill = document.querySelector('.coins');
let shownCoins = getState().coins;
coinEl.textContent = shownCoins;

// Uppdatera mynträknaren och låt den "puttra till" när mynt läggs till.
window.addEventListener(STATE_CHANGED, () => {
  const { coins } = getState();
  if (coins === shownCoins) return;
  if (coins > shownCoins) {
    coinPill.classList.remove('is-bumping');
    void coinPill.offsetWidth; // Starta om animationen
    coinPill.classList.add('is-bumping');
  }
  shownCoins = coins;
  coinEl.textContent = coins;
});
coinPill.addEventListener('animationend', () => coinPill.classList.remove('is-bumping'));

registerRoute('hem', renderHome);
registerRoute('lava', renderLava);
registerRoute('blockblast', renderBlockBlast);
registerRoute('perfecthit', renderPerfectHit);
registerRoute('cord', renderCOrd);
registerRoute('shop', renderShop);

initRouter(document.querySelector('#screen'));
