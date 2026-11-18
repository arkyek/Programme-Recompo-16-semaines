/* Feuille « Exercice libre » : ajoute un exercice hors programme à la séance. */
import { $, esc } from '../../core/dom.js';
import { parseNum } from '../../core/format.js';
import { EXERCISES } from '../../data/exercises.js';
import { save } from '../../state/store.js';
import { createFreeItem } from '../../domain/training-log.js';
import { openSheet, closeSheet, toast } from '../../ui/shell.js';
import { render } from '../../ui/router.js';

const MAX_SETS = 10;

export function openFreeExerciseSheet(lg, p) {
  openSheet(`<h2>Exercice libre</h2>
    <p class="muted small">L'app calcule si l'objectif est atteint et propose la charge suivante, comme pour les exercices du programme.</p>
    <div class="field"><label for="f-n">Nom de l'exercice</label><input id="f-n" placeholder="Ex. Tractions assistées" list="f-list">
      <datalist id="f-list">${Object.values(EXERCISES).map(x => `<option value="${esc(x.n)}">`).join('')}</datalist></div>
    <div class="fgrid">
      <div class="field"><label for="f-s">Séries</label><input id="f-s" type="number" inputmode="numeric" value="3"></div>
      <div class="field"><label for="f-r">Repos (s)</label><input id="f-r" type="number" inputmode="numeric" value="90"></div>
      <div class="field"><label for="f-a">Reps min</label><input id="f-a" type="number" inputmode="numeric" value="${p.phase >= 3 ? 8 : 10}"></div>
      <div class="field"><label for="f-b">Reps max</label><input id="f-b" type="number" inputmode="numeric" value="12"></div>
      <div class="field"><label for="f-i">Hausse de charge (kg)</label><input id="f-i" type="number" inputmode="decimal" step="0.5" value="2.5"></div>
      <div class="field"><label for="f-q">RIR visé</label><input id="f-q" value="${p.phase === 1 ? '3' : '1–2'}"></div>
    </div>
    <button class="btn block" data-ok>Ajouter à la séance</button><button class="btn ghost block" data-close>Annuler</button>`, s => {
    s.querySelector('[data-ok]').onclick = () => {
      const name = $('#f-n').value.trim();
      if (!name) { toast('Donne un nom à l\'exercice'); return; }
      const min = Math.max(1, +$('#f-a').value || 8);
      const max = Math.max(min, +$('#f-b').value || min);
      const item = createFreeItem({
        name,
        sets: Math.max(1, Math.min(MAX_SETS, +$('#f-s').value || 3)),
        reps: [min, max],
        rir: $('#f-q').value || '2',
        rest: +$('#f-r').value || 90,
        inc: parseNum($('#f-i').value) || 0,
      }, p);
      lg.items.push(item);
      save();
      closeSheet();
      render();
      setTimeout(() => $('#ex-' + (lg.items.length - 1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    };
  });
}
