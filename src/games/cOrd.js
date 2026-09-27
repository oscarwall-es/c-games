// Spellogik för C-Ord – ingen DOM här.
import { WORDS } from './cOrdWords.js';

export const REWARD = 10;

// Versaler/gemener spelar ingen roll och mellanslag runt ordet ignoreras.
export function normalize(text) {
  return text.trim().toLocaleUpperCase('sv-SE');
}

export function isCorrect(guess, word) {
  return normalize(guess) === normalize(word);
}

// Slumpar ett index i ordbanken, aldrig samma som `previousIndex`.
export function randomWordIndex(previousIndex = -1, words = WORDS) {
  if (words.length < 2) return 0;
  let index;
  do {
    index = Math.floor(Math.random() * words.length);
  } while (index === previousIndex);
  return index;
}
