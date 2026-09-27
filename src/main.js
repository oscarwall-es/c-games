import './style.css';
import { getState, STATE_CHANGED } from './state.js';
import { initRouter, registerRoute } from './router.js';
import { renderHome } from './screens/home.js';
import { renderShop } from './screens/shop.js';
import { comingSoon } from './screens/comingSoon.js';

const coinEl = document.querySelector('#coin-count');
const renderCoins = () => (coinEl.textContent = getState().coins);

renderCoins();
window.addEventListener(STATE_CHANGED, renderCoins);

registerRoute('hem', renderHome);
registerRoute('lava', comingSoon('🌋 Lava'));
registerRoute('blockblast', comingSoon('🧱 Block Blast'));
registerRoute('perfecthit', comingSoon('🎯 Perfect Hit'));
registerRoute('cord', comingSoon('🔤 C-Ord'));
registerRoute('shop', renderShop);

initRouter(document.querySelector('#screen'));
