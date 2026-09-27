// Katalog över avatar-föremål. `slot` måste matcha en nyckel i state.avatar.
// Ordningen här är ordningen de visas i shoppen.
export const ITEMS = {
  'dark-hair': { slot: 'hair', emoji: '🧑', name: 'Mörkt hår', price: 25 },
  'blonde-hair': { slot: 'hair', emoji: '👱', name: 'Blont hår', price: 35 },
  'red-hair': { slot: 'hair', emoji: '🧑‍🦰', name: 'Rött hår', price: 40 },
  'curly-hair': { slot: 'hair', emoji: '👨‍🦱', name: 'Lockigt hår', price: 45 },
  'gray-hair': { slot: 'hair', emoji: '👴', name: 'Ljust grått hår', price: 50 },

  'blue-top': { slot: 'top', emoji: '👕', name: 'Blå tröja', price: 35 },
  'pink-top': { slot: 'top', emoji: '👚', name: 'Rosa tröja', price: 40 },
  'martial-arts': { slot: 'top', emoji: '🥋', name: 'Kampsportdräkt', price: 55 },
  jacket: { slot: 'top', emoji: '🧥', name: 'Jacka', price: 60 },
  tanktop: { slot: 'top', emoji: '🎽', name: 'Sportlinne', price: 45 },

  cap: { slot: 'hat', emoji: '🧢', name: 'Keps', price: 40 },
  tophat: { slot: 'hat', emoji: '🎩', name: 'Cylinderhatt', price: 70 },
  crown: { slot: 'hat', emoji: '👑', name: 'Krona', price: 100 },
  gradcap: { slot: 'hat', emoji: '🎓', name: 'Studentmössa', price: 65 },

  glasses: { slot: 'glasses', emoji: '👓', name: 'Glasögon', price: 45 },
  sunglasses: { slot: 'glasses', emoji: '🕶️', name: 'Solglasögon', price: 55 },

  star: { slot: 'accessory', emoji: '🌟', name: 'Stjärna', price: 40 },
  diamond: { slot: 'accessory', emoji: '💎', name: 'Diamant', price: 80 },
  bow: { slot: 'accessory', emoji: '🎀', name: 'Rosett', price: 35 },
  headphones: { slot: 'accessory', emoji: '🎧', name: 'Hörlurar', price: 60 },
};

export const SLOT_NAMES = {
  hair: 'Hår',
  top: 'Tröjor',
  hat: 'Hattar',
  glasses: 'Glasögon',
  accessory: 'Accessoarer',
};

export function getItem(itemId) {
  return ITEMS[itemId] ?? null;
}
