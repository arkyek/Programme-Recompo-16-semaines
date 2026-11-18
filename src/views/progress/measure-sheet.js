/* Feuille « Nouvelle mesure » : poids, tour de taille, tests de forme. */
import { $ } from '../../core/dom.js';
import { today } from '../../core/dates.js';
import { parseNum } from '../../core/format.js';
import { state, save } from '../../state/store.js';
import { openSheet, closeSheet, toast } from '../../ui/shell.js';
import { render } from '../../ui/router.js';

export function openMeasureSheet() {
  openSheet(`<h2>Nouvelle mesure</h2>
    <div class="field"><label for="m-d">Date</label><input id="m-d" type="date" value="${today()}"></div>
    <div class="fgrid">
      <div class="field"><label for="m-w">Poids (kg)</label><input id="m-w" type="number" inputmode="decimal" step="0.1"></div>
      <div class="field"><label for="m-t">Tour de taille (cm)</label><input id="m-t" type="number" inputmode="decimal" step="0.5"></div>
      <div class="field"><label for="m-h">FC repos (bpm)</label><input id="m-h" type="number" inputmode="numeric"></div>
      <div class="field"><label for="m-b">Test vélo 12 min</label><input id="m-b" placeholder="km ou watts"></div>
      <div class="field"><label for="m-l">Step-up gauche (reps)</label><input id="m-l" type="number" inputmode="numeric"></div>
      <div class="field"><label for="m-r">Step-up droite (reps)</label><input id="m-r" type="number" inputmode="numeric"></div>
    </div>
    <p class="small muted">Taille : debout, au nombril, après une expiration normale, ruban horizontal. Step-up : marche de 30 cm, maximum de reps propres.</p>
    <button class="btn block" data-ok>Enregistrer</button><button class="btn ghost block" data-close>Annuler</button>`, s => {
    s.querySelector('[data-ok]').onclick = () => {
      const num = id => parseNum($(id).value);
      const m = { date: $('#m-d').value || today(), weight: num('#m-w'), waist: num('#m-t'), hr: num('#m-h'), bike: $('#m-b').value.trim(), stepL: num('#m-l'), stepR: num('#m-r') };
      if (!m.weight && !m.waist && !m.hr && !m.bike && !m.stepL && !m.stepR) { toast('Saisis au moins une valeur'); return; }
      state.measures.push(m);
      save();
      closeSheet();
      render();
    };
  });
}
