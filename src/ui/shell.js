/* Éléments fixes de l'interface : en-tête, notification éphémère, feuille modale. */
import { $, esc } from '../core/dom.js';

/* ---------- En-tête ---------- */

/**
 * @param {object} o
 * @param {string} o.eyebrow  surtitre
 * @param {string} o.title    titre
 * @param {string} [o.actions] HTML des boutons à droite
 * @param {Function} [o.onClick] gestionnaire de clic sur l'en-tête
 */
export function setHeader({ eyebrow, title, actions = '', onClick = null }) {
  const top = $('#top');
  top.innerHTML = `<div class="in"><div class="ttl"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></div>${actions}</div>`;
  top.onclick = onClick;
}

/* ---------- Notification ---------- */

let toastTimer;
export function toast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- Feuille modale ---------- */

/**
 * Ouvre une feuille modale. Tout élément [data-close] la ferme, ainsi qu'un clic sur le fond.
 * @param {string} html
 * @param {(root: HTMLElement) => void} [bind] branchement des gestionnaires
 */
export function openSheet(html, bind) {
  const s = $('#sheet');
  s.innerHTML = `<div class="pn" role="dialog" aria-modal="true">${html}</div>`;
  s.hidden = false;
  s.onclick = e => { if (e.target === s || e.target.closest('[data-close]')) closeSheet(); };
  bind?.(s);
}

export function closeSheet() {
  const s = $('#sheet');
  s.hidden = true;
  s.innerHTML = '';
}

export function confirmSheet(message, onConfirm, label = 'Supprimer') {
  openSheet(`<h2>${esc(message)}</h2>
    <button class="btn danger block" data-ok>${esc(label)}</button>
    <button class="btn ghost block" data-close>Annuler</button>`, s => {
    s.querySelector('[data-ok]').onclick = () => { closeSheet(); onConfirm(); };
  });
}
