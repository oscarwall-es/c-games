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
const renderCoins = () => (coinEl.textContent = getState().coins);

renderCoins();
window.addEventListener(STATE_CHANGED, renderCoins);

registerRoute('hem', renderHome);
registerRoute('lava', renderLava);
registerRoute('blockblast', renderBlockBlast);
registerRoute('perfecthit', renderPerfectHit);
registerRoute('cord', renderCOrd);
registerRoute('shop', renderShop);

initRouter(document.querySelector('#screen'));
