import { addCoins } from '../state.js';
import { WORDS } from '../games/cOrdWords.js';
import { REWARD, isCorrect, normalize, randomWordIndex } from '../games/cOrd.js';

const NEXT_WORD_DELAY_MS = 1800;
const SHAKE_MS = 400;

export function renderCOrd(container) {
  let currentIndex = -1;
  let locked = false;
  let nextWordTimer = null;
  let shakeTimer = null;

  const root = document.createElement('div');
  root.className = 'cord';
  root.innerHTML = `
    <section class="cord__clues-card">
      <h3 class="cord__title">Vilket ord är det?</h3>
      <ul class="cord__clues"></ul>
      <p class="cord__length"></p>
    </section>
    <form class="cord__form" autocomplete="off">
      <label class="cord__label" for="cord-guess">Skriv ordet</label>
      <input
        id="cord-guess"
        class="cord__input"
        type="text"
        placeholder="Skriv ordet"
        autocapitalize="characters"
        autocorrect="off"
        spellcheck="false"
        enterkeyhint="done"
      />
      <button class="cord__guess" type="submit">✅ Gissa</button>
    </form>
    <p class="cord__message" role="status"></p>
    <button class="cord__new" type="button">🔄 Nytt ord</button>`;

  const cluesEl = root.querySelector('.cord__clues');
  const lengthEl = root.querySelector('.cord__length');
  const form = root.querySelector('.cord__form');
  const input = root.querySelector('.cord__input');
  const messageEl = root.querySelector('.cord__message');

  function setMessage(text, tone = '') {
    messageEl.textContent = text;
    messageEl.className = `cord__message ${tone ? `cord__message--${tone}` : ''}`;
  }

  function newWord() {
    clearTimeout(nextWordTimer);
    currentIndex = randomWordIndex(currentIndex);
    const { word, clues } = WORDS[currentIndex];
    cluesEl.replaceChildren(
      ...clues.map((clue) => {
        const li = document.createElement('li');
        li.textContent = `💡 ${clue}`;
        return li;
      }),
    );
    // Antal bokstäver som hjälp för de yngsta – avslöjar inte ordet
    lengthEl.textContent = `🔤 ${word.length} bokstäver`;
    locked = false;
    input.value = '';
    input.disabled = false;
    setMessage('');
    input.focus({ preventScroll: true });
  }

  function shakeInput() {
    input.classList.remove('is-shaking');
    void input.offsetWidth; // Starta om animationen
    input.classList.add('is-shaking');
    clearTimeout(shakeTimer);
    shakeTimer = setTimeout(() => input.classList.remove('is-shaking'), SHAKE_MS);
  }

  function guess() {
    if (locked) return;
    if (!normalize(input.value)) {
      input.focus();
      return;
    }

    if (isCorrect(input.value, WORDS[currentIndex].word)) {
      locked = true;
      input.disabled = true;
      addCoins(REWARD);
      setMessage(`🎉 Rätt! +${REWARD} C Coins`, 'good');
      nextWordTimer = setTimeout(newWord, NEXT_WORD_DELAY_MS);
    } else {
      setMessage('❌ Fel, försök igen!', 'bad');
      shakeInput();
      // Markera texten så att nästa gissning skriver över den direkt
      input.focus();
      input.select();
    }
  }

  // Ett formulär gör att både knappen och Enter-tangenten skickar gissningen
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    guess();
  });
  root.querySelector('.cord__new').addEventListener('click', newWord);

  container.append(root);
  newWord();

  return () => {
    clearTimeout(nextWordTimer);
    clearTimeout(shakeTimer);
  };
}
