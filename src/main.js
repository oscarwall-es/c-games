import './style.css';
import { getState, subscribe } from './state.js';
import { initRouter } from './router.js';

const coinEl = document.querySelector('#coin-count');
const renderCoins = (state) => (coinEl.textContent = state.coins);

renderCoins(getState());
subscribe(renderCoins);

initRouter(document.querySelector('#screen'));
