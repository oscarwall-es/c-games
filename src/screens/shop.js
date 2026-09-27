import { getState, buyItem, equipItem, ownsItem, STATE_CHANGED } from '../state.js';
import { ITEMS, SLOT_NAMES } from '../items.js';
import { renderAvatar } from './avatar.js';

const MESSAGE_MS = 2500;

export function renderShop(container) {
  const shop = document.createElement('div');
  shop.className = 'shop';

  const message = document.createElement('p');
  message.className = 'shop__message';
  message.setAttribute('role', 'status');
  let messageTimer = null;

  function showMessage(text) {
    message.textContent = text;
    message.classList.add('is-visible');
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => message.classList.remove('is-visible'), MESSAGE_MS);
  }

  function onBuy(itemId, item) {
    if (!buyItem(itemId, item.price)) {
      showMessage('❌ Inte nog med C Coins');
      return;
    }
    equipItem(item.slot, itemId);
  }

  function render() {
    const { avatar } = getState();
    shop.replaceChildren(renderAvatar(avatar), message);

    for (const [slot, slotName] of Object.entries(SLOT_NAMES)) {
      const heading = document.createElement('h3');
      heading.className = 'shop__heading';
      heading.textContent = slotName;

      const grid = document.createElement('div');
      grid.className = 'shop__grid';

      for (const [itemId, item] of Object.entries(ITEMS)) {
        if (item.slot !== slot) continue;
        grid.append(renderCard(itemId, item, avatar[slot] === itemId));
      }
      shop.append(heading, grid);
    }
  }

  function renderCard(itemId, item, equipped) {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.classList.toggle('is-equipped', equipped);
    card.innerHTML = `
      <span class="shop-card__emoji">${item.emoji}</span>
      <span class="shop-card__name">${item.name}</span>
      <span class="shop-card__price">🌙 ${item.price}</span>`;

    if (equipped) {
      const status = document.createElement('span');
      status.className = 'shop-card__status';
      status.textContent = 'Utrustad ✅';
      card.append(status);
    } else {
      const owned = ownsItem(itemId);
      const btn = document.createElement('button');
      btn.className = owned ? 'shop-card__btn shop-card__btn--equip' : 'shop-card__btn';
      btn.textContent = owned ? 'Utrusta' : 'Köp';
      btn.addEventListener('click', () => (owned ? equipItem(item.slot, itemId) : onBuy(itemId, item)));
      card.append(btn);
    }
    return card;
  }

  render();
  container.append(shop);

  // Rita om när state ändras (köp/utrustning). Lyssnaren tar bort sig själv
  // när man lämnat skärmen.
  const onChange = () => {
    if (!shop.isConnected) {
      clearTimeout(messageTimer);
      return window.removeEventListener(STATE_CHANGED, onChange);
    }
    render();
  };
  window.addEventListener(STATE_CHANGED, onChange);
}
