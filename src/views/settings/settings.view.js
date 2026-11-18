/* Vue « Réglages » : date de début, horaire des séances, sauvegarde et réinitialisation. */
import { $ } from '../../core/dom.js';
import { addDays, mondayOf, fmtDate, fmtShort } from '../../core/dates.js';
import { PROGRAM_DAYS, PROGRAM_WEEKS } from '../../config/program.js';
import { state, save, resetState } from '../../state/store.js';
import { isStoragePersisted } from '../../services/pwa.js';
import { render } from '../../ui/router.js';
import { setHeader, toast, confirmSheet } from '../../ui/shell.js';
import { exportBackup, openImportSheet } from './backup-sheets.js';

const SLOTS = [['soir', 'Le soir (18 h)'], ['midi', 'Le midi (12 h 15)']];

async function showStorageStatus() {
  const persisted = await isStoragePersisted();
  const el = $('#s-persist');
  if (!el || persisted == null) return;
  el.textContent = persisted
    ? 'Stockage protégé : iOS ne l\'effacera pas automatiquement.'
    : 'Astuce : installe l\'app sur l\'écran d\'accueil pour protéger le stockage.';
}

export function settingsView() {
  const { start, slot } = state.settings;
  setHeader({ eyebrow: 'Programme et données', title: 'Réglages' });

  const view = $('#view');
  view.innerHTML = `
    <div class="sec-title">Programme</div>
    <div class="card"><h3>Date de début</h3>
      <p class="small muted">Le programme commence un lundi. Toute date choisie est ramenée au lundi de sa semaine.</p>
      <div class="field"><label for="s-start">Lundi de la semaine 1</label><input id="s-start" type="date" value="${start}"></div>
      <p class="small muted">${PROGRAM_WEEKS} semaines : du ${fmtDate(start).toLowerCase()} au ${fmtDate(addDays(start, PROGRAM_DAYS - 1)).toLowerCase()}</p>
    </div>
    <div class="card"><h3>Horaire des séances</h3>
      <div class="field"><label for="s-slot">Séances de musculation</label>
        <select id="s-slot">${SLOTS.map(([v, l]) => `<option value="${v}" ${slot === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <p class="small muted">La journée type (repas, collagène, café) s'adapte à l'horaire choisi.</p>
    </div>

    <div class="sec-title">Données</div>
    <div class="card"><h3>Sauvegarde</h3>
      <p class="small">Les données sont enregistrées <b>uniquement sur ce téléphone</b>. Exporte une sauvegarde chaque semaine dans Fichiers ou iCloud Drive : elle permet de tout récupérer si tu changes de téléphone.</p>
      <p class="small muted" id="s-persist"></p>
      <div class="row"><button class="btn grow" data-act="export">Exporter la sauvegarde</button><button class="btn sec grow" data-act="import">Importer</button></div>
    </div>
    <div class="card"><h3>Réinitialiser</h3>
      <p class="small muted">Efface séances, mesures et réglages de ce téléphone. Action définitive : exporte une sauvegarde avant.</p>
      <button class="btn danger block" data-act="reset">Tout effacer</button>
    </div>`;

  view.onclick = e => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'export') exportBackup();
    if (act === 'import') openImportSheet();
    if (act === 'reset') {
      confirmSheet('Effacer toutes les données de l\'app ? Exporte d\'abord une sauvegarde.', () => {
        resetState();
        toast('Données effacées');
        render();
      }, 'Tout effacer');
    }
  };

  view.onchange = e => {
    if (e.target.id === 's-start' && e.target.value) {
      state.settings.start = mondayOf(e.target.value);
      save();
      toast('Début : lundi ' + fmtShort(state.settings.start));
      render();
    }
    if (e.target.id === 's-slot') {
      state.settings.slot = e.target.value;
      save();
      toast('Horaire mis à jour');
    }
  };

  showStorageStatus();
}
