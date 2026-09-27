import './style.css';
import { getState, STATE_CHANGED } from './state.js';
import { initRouter } from './router.js';

const coinEl = document.querySelector('#coin-count');
const renderCoins = () => (coinEl.textContent = getState().coins);

renderCoins();
window.addEventListener(STATE_CHANGED, renderCoins);

initRouter(document.querySelector('#screen'));

