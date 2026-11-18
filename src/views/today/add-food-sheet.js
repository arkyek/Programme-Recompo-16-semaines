/* Feuille « Ajouter un aliment » hors plan de repas. */
import { $ } from '../../core/dom.js';
import { QUICK_FOODS } from '../../config/program.js';
import { save, dayEntry } from '../../state/store.js';
import { openSheet, closeSheet, toast } from '../../ui/shell.js';
import { render } from '../../ui/router.js';

export function openAddFoodSheet(date) {
  openSheet(`<h2>Ajouter un aliment</h2>
    <div class="chips">${QUICK_FOODS.map(([label, kcal], i) => `<button class="chip" data-q="${i}">${label} · ${kcal} kcal</button>`).join('')}</div>
    <div class="field"><label for="x-l">Nom</label><input id="x-l" placeholder="Ex. sandwich poulet"></div>
    <div class="fgrid">
      <div class="field"><label for="x-k">kcal</label><input id="x-k" type="number" inputmode="numeric"></div>
      <div class="field"><label for="x-p">Protéines (g)</label><input id="x-p" type="number" inputmode="numeric"></div>
    </div>
    <button class="btn block" data-add>Ajouter</button><button class="btn ghost block" data-close>Annuler</button>`, s => {
    s.addEventListener('click', e => {
      const quick = e.target.closest('[data-q]');
      if (quick) {
        const [label, kcal, prot] = QUICK_FOODS[+quick.dataset.q];
        $('#x-l').value = label; $('#x-k').value = kcal; $('#x-p').value = prot;
        return;
      }
      if (!e.target.closest('[data-add]')) return;
      const label = $('#x-l').value.trim() || 'Aliment', kcal = +$('#x-k').value || 0, prot = +$('#x-p').value || 0;
      if (!kcal && !prot) { toast('Indique au moins les calories ou les protéines'); return; }
      (dayEntry(date).extra ||= []).push({ label, kcal, prot });
      save();
      closeSheet();
      render();
    });
  });
}
