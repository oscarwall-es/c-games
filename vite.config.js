import { defineConfig } from 'vite';

export default defineConfig({
  // Relativa sökvägar i bygget, så att samma dist/ fungerar både på en
  // egen domän (Netlify) och i en undermapp (GitHub Pages: /c-games/).
  // Appen använder hash-routing (#lava osv.), så inga serverregler behövs.
  base: './',
});
