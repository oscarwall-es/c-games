// Hash-router: visar skärmen som matchar window.location.hash (t.ex. #lava)
// i innehållsområdet och markerar aktiv menyknapp. Okända hashar går till DEFAULT_ROUTE.
// En skärm kan returnera en städfunktion som körs när man lämnar den
// (t.ex. för att ta bort tangentbordslyssnare och timers).
const DEFAULT_ROUTE = 'hem';
const routes = {};
let container = null;
let cleanupCurrent = null;

export function registerRoute(name, render) {
  routes[name] = render;
}

export function initRouter(screenEl) {
  container = screenEl;
  document.querySelectorAll('[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
  window.addEventListener('hashchange', renderCurrent);
  renderCurrent();
}

export function navigate(name) {
  // Sätter bara hashen – 'hashchange' sköter själva renderingen.
  window.location.hash = name;
}

function renderCurrent() {
  const name = window.location.hash.slice(1);
  if (!routes[name]) {
    // Byt ut ogiltig/tom hash utan att lägga till ett extra steg i historiken
    history.replaceState(null, '', `#${DEFAULT_ROUTE}`);
    return renderCurrent();
  }

  document.querySelectorAll('[data-route]').forEach((btn) => {
    const active = btn.dataset.route === name;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-current', active ? 'page' : 'false');
  });

  cleanupCurrent?.();
  container.innerHTML = '';
  const cleanup = routes[name](container);
  cleanupCurrent = typeof cleanup === 'function' ? cleanup : null;
  // Mjuk in-tonande övergång (se .screen-enter i style.css)
  container.firstElementChild?.classList.add('screen-enter');
}
