// Minimal router: visar en skärm i innehållsområdet och markerar aktiv menyknapp.
const routes = {};
let container = null;

export function registerRoute(name, render) {
  routes[name] = render;
}

export function initRouter(screenEl) {
  container = screenEl;
  document.querySelectorAll('[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
}

export function navigate(name) {
  document.querySelectorAll('[data-route]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.route === name);
  });

  container.innerHTML = '';
  const render = routes[name];
  if (render) {
    render(container);
  } else {
    container.innerHTML = '<p class="placeholder">Välj ett spel!</p>';
  }
}
