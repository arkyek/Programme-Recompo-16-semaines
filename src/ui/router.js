/* Navigation par onglets. Les vues s'enregistrent depuis main.js : le routeur ne dépend d'aucune vue. */
import { $, $$ } from '../core/dom.js';
import { today } from '../core/dates.js';

const TAB_STORAGE_KEY = 'recompo.tab';
const DEFAULT_TAB = 'today';
/** Onglets qui reviennent sur la date du jour quand on les touche dans la barre. */
const TABS_RESET_TO_TODAY = ['today', 'session'];

/** État de navigation partagé : onglet actif, date affichée, exercice déplié dans Progrès. */
export const ui = { tab: DEFAULT_TAB, date: today(), openEx: null };

const views = {};

export function registerViews(map) { Object.assign(views, map); }

export function render() {
  if (!views[ui.tab]) ui.tab = DEFAULT_TAB;
  $$('#tabbar button').forEach(b => {
    if (b.dataset.tab === ui.tab) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  // Chaque vue rebranche ses propres gestionnaires : on repart d'une zone propre.
  const view = $('#view');
  view.onclick = view.onchange = view.oninput = null;
  Object.keys(view.dataset).forEach(k => delete view.dataset[k]);
  views[ui.tab]();
}

export function go(tab, opts = {}) {
  Object.assign(ui, opts);
  ui.tab = tab;
  try { sessionStorage.setItem(TAB_STORAGE_KEY, tab); } catch (e) { /* stockage indisponible */ }
  render();
  scrollTo(0, 0);
}

export function initRouter() {
  try { const saved = sessionStorage.getItem(TAB_STORAGE_KEY); if (saved) ui.tab = saved; } catch (e) { /* ignoré */ }
  $('#tabbar').addEventListener('click', e => {
    const b = e.target.closest('button[data-tab]');
    if (b) go(b.dataset.tab, TABS_RESET_TO_TODAY.includes(b.dataset.tab) ? { date: today() } : {});
  });
}
