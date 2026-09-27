// Platshållarskärm för spel och shop som inte är byggda än.
export function comingSoon(title) {
  return (container) => {
    container.innerHTML = `
      <div class="coming-soon">
        <h2 class="coming-soon__title">${title}</h2>
        <p class="placeholder">Kommer snart</p>
      </div>`;
  };
}
