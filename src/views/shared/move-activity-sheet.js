/* Feuille « Changer l'activité du jour » (utilisée par Aujourd'hui et Séance). */
import { esc } from '../../core/dom.js';
import { fmtShort } from '../../core/dates.js';
import { SESSIONS } from '../../config/program.js';
import { state, save, dayEntry } from '../../state/store.js';
import { plan, basePlan, kindLabel } from '../../domain/schedule.js';
import { openSheet, closeSheet } from '../../ui/shell.js';
import { render } from '../../ui/router.js';

export function openMoveActivitySheet(date) {
  const p = plan(date), base = basePlan(date);
  const sameSplit = ([key]) => (p.phase === 1) === key.startsWith('fb');
  const options = [
    ['', `Programme prévu (${kindLabel(base)})`],
    ...Object.entries(SESSIONS).filter(sameSplit).map(([k, s]) => [k, s.t]),
    ['z2', 'Cardio zone 2'], ['int', 'Intervalles vélo'], ['active', 'Repos actif'], ['rest', 'Repos'],
  ];
  const current = state.days[date]?.override || '';

  openSheet(`<h2>Changer l'activité du ${esc(fmtShort(date))}</h2>
    <p class="muted small">Utile pour décaler une séance. Garder 48 h entre deux séances qui travaillent les mêmes muscles.</p>
    <div class="stack">${options.map(([k, l]) => `<button class="btn ${current === k ? '' : 'sec'} block" data-ov="${k}">${esc(l)}</button>`).join('')}</div>
    <button class="btn ghost block" data-close>Annuler</button>`, s => {
    s.addEventListener('click', e => {
      const b = e.target.closest('[data-ov]');
      if (!b) return;
      const d = dayEntry(date);
      if (b.dataset.ov) d.override = b.dataset.ov; else delete d.override;
      save();
      closeSheet();
      render();
    });
  });
}
