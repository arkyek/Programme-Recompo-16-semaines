/* Sauvegarde et restauration des données (fichier JSON). */
import { esc } from '../../core/dom.js';
import { today } from '../../core/dates.js';
import { persistNow, serialize, parseBackup, replaceState } from '../../state/store.js';
import { shareOrDownload } from '../../services/file-export.js';
import { openSheet, closeSheet, toast } from '../../ui/shell.js';
import { render } from '../../ui/router.js';

export async function exportBackup() {
  persistNow();
  const json = serialize();
  const result = await shareOrDownload(json, `recompo-sauvegarde-${today()}.json`, 'application/json', 'Sauvegarde Recompo 16');
  if (result === 'downloaded') toast('Sauvegarde téléchargée');
  if (result === 'failed') {
    // Dernier recours : afficher le contenu pour le copier à la main
    openSheet(`<h2>Copier la sauvegarde</h2><textarea rows="10" style="width:100%" readonly>${esc(json)}</textarea>
      <button class="btn ghost block" data-close>Fermer</button>`);
  }
}

export function openImportSheet() {
  openSheet(`<h2>Importer une sauvegarde</h2><p class="small">Remplace toutes les données actuelles par celles du fichier.</p>
    <button class="btn block" data-file>Choisir le fichier .json</button>
    <input type="file" accept="application/json,.json" hidden data-input>
    <div class="field"><label for="i-txt">Ou coller le contenu</label><textarea id="i-txt" rows="5"></textarea></div>
    <button class="btn sec block" data-paste>Importer le texte collé</button><button class="btn ghost block" data-close>Annuler</button>`, s => {
    const apply = text => {
      try {
        replaceState(parseBackup(text));
        closeSheet();
        toast('Sauvegarde importée');
        render();
      } catch (e) {
        toast('Fichier invalide : ce n\'est pas une sauvegarde Recompo');
      }
    };
    const input = s.querySelector('[data-input]');
    input.onchange = () => { const file = input.files[0]; if (file) file.text().then(apply); };
    s.querySelector('[data-file]').onclick = () => { input.value = ''; input.click(); };
    s.querySelector('[data-paste]').onclick = () => apply(s.querySelector('#i-txt').value);
  });
}
