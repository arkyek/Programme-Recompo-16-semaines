/* Vue « Guide » : contenu du programme hors ligne + fiches exercices. */
import { $, $$, esc } from '../core/dom.js';
import { GUIDE_HTML } from '../content/guide.js';
import { EXERCISES } from '../data/exercises.js';
import { setHeader } from '../ui/shell.js';
import { exerciseFigure } from '../ui/components/figure.js';
import { exerciseCues } from '../ui/components/exercise-info.js';

/** Sommaire : [id de section, libellé]. */
const SECTIONS = [
  ['vue', 'Vue d\'ensemble'], ['avant', 'Avant de commencer'], ['plan', 'Plan'], ['cardio', 'Cardio'],
  ['genou', 'Genou'], ['recup', 'Spa'], ['nutrition', 'Nutrition'], ['complements', 'Compléments'],
  ['testo', 'Testo & sommeil'], ['suivi', 'Suivi'], ['exos', 'Exercices'], ['sources', 'Sources'],
];

function exercisesSection() {
  const cards = Object.entries(EXERCISES).map(([key, x]) => `<div class="ex">${exerciseFigure(key)}
    <div class="bd"><h3>${esc(x.n)}</h3><span class="small muted">${esc(x.m)}</span>${exerciseCues(x)}</div></div>`).join('');
  return `<section id="exos"><div class="sechead"><div class="eyebrow">EXERCICES</div><h2>Fiches exercices</h2></div><div class="stack">${cards}</div></section>`;
}

export function guideView() {
  setHeader({ eyebrow: 'Tout le programme, hors ligne', title: 'Guide' });
  const view = $('#view');
  // Les fiches exercices s'insèrent juste avant les sources
  const content = GUIDE_HTML.replace('<section id="sources">', exercisesSection() + '<section id="sources">');
  view.innerHTML = `
    <nav class="gnav" aria-label="Sommaire">${SECTIONS.map(([id, label]) => `<button data-g="${id}">${esc(label)}</button>`).join('')}</nav>
    <div class="guide">${content}</div>`;

  view.onclick = e => {
    const link = e.target.closest('[data-g]');
    if (link) { $('#' + link.dataset.g, view)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    // Onglets « semaine type » de la section Plan
    const tab = e.target.closest('[data-w]');
    if (tab) {
      $$('[data-w]', view).forEach(b => {
        b.setAttribute('aria-selected', b === tab);
        $('#' + b.dataset.w, view).hidden = b !== tab;
      });
    }
  };
}
