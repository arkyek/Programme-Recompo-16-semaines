/* Accès DOM et échappement HTML. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const esc = value => String(value ?? '').replace(/[&<>"]/g, c => HTML_ESCAPES[c]);

/** Exécute `fn` (typiquement un re-rendu) sans perdre la position de défilement. */
export function keepScroll(fn) {
  const y = scrollY;
  fn();
  scrollTo(0, y);
}
