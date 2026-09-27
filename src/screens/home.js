import { getState, STATE_CHANGED } from '../state.js';
import { renderAvatar } from './avatar.js';

export const GAMES = [
  { route: 'lava', emoji: '🌋', name: 'Lava' },
  { route: 'blockblast', emoji: '🧱', name: 'Block Blast' },
  { route: 'perfecthit', emoji: '🎯', name: 'Perfect Hit' },
  { route: 'cord', emoji: '🔤', name: 'C-Ord' },
];

export function renderHome(container) {
  const home = document.createElement('div');
  home.className = 'home';

  const hero = document.createElement('section');
  hero.className = 'home__hero';
  const greeting = document.createElement('h2');
  greeting.className = 'home__greeting';
  greeting.textContent = 'Välkommen tillbaka!';
  hero.append(renderAvatar(getState().avatar), greeting);

  const grid = document.createElement('div');
  grid.className = 'game-grid';
  for (const game of GAMES) {
    const card = document.createElement('a');
    card.className = 'game-card';
    card.href = `#${game.route}`;
    card.innerHTML = `<span class="game-card__emoji">${game.emoji}</span><span class="game-card__name">${game.name}</span>`;
    grid.append(card);
  }

  home.append(hero, grid);
  container.append(home);

  // Rita om avataren om state ändras medan hemskärmen visas.
  // Lyssnaren tar bort sig själv när man lämnat skärmen.
  const onChange = () => {
    if (!home.isConnected) return window.removeEventListener(STATE_CHANGED, onChange);
    hero.querySelector('.avatar').replaceWith(renderAvatar(getState().avatar));
  };
  window.addEventListener(STATE_CHANGED, onChange);
}
