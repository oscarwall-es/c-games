// Katalog över avatar-föremål. `slot` måste matcha en nyckel i state.avatar.
// Shoppen kommer att bygga vidare på den här listan.
export const ITEMS = {
  'hair-curly': { slot: 'hair', emoji: '🦱', name: 'Lockigt hår', price: 10 },
  'top-tshirt': { slot: 'top', emoji: '👕', name: 'T-shirt', price: 10 },
  'hat-crown': { slot: 'hat', emoji: '👑', name: 'Krona', price: 30 },
  'glasses-cool': { slot: 'glasses', emoji: '🕶️', name: 'Solglasögon', price: 15 },
  'accessory-star': { slot: 'accessory', emoji: '⭐', name: 'Stjärna', price: 20 },
};

export function getItem(itemId) {
  return ITEMS[itemId] ?? null;
}
