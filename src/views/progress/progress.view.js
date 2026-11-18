/* Vue « Progrès » : régularité, poids, tour de taille, mesures et charges. */
import { $, esc, keepScroll } from '../../core/dom.js';
import { today, fmtShort } from '../../core/dates.js';
import { fmtNum } from '../../core/format.js';
import { state, save } from '../../state/store.js';
import { plan, phaseLine } from '../../domain/schedule.js';
import { weightSeries, waistSeries, weightTrend, exerciseStats, adherence } from '../../domain/progress.js';
import { ui, render } from '../../ui/router.js';
import { setHeader, confirmSheet } from '../../ui/shell.js';
import { lineChart, sparkline } from '../../ui/components/chart.js';
import { openMeasureSheet } from './measure-sheet.js';

/** Écart gauche/droite au step-up jugé significatif (genou opéré). */
const STEP_ASYMMETRY = 0.1;

function adherenceCard() {
  const { planned, done } = adherence(), p = plan(today());
  return `<div class="card"><div class="row between"><h3>Régularité</h3><span class="chip lift">${done}/${planned} séances</span></div>
    <div class="bar"><i style="width:${planned ? Math.round(done / planned * 100) : 0}%"></i></div>
    <p class="small muted">${p.phase ? phaseLine(p) : 'Le programme commence le ' + esc(fmtShort(state.settings.start))}. Muscu + cardio prévus jusqu'à aujourd'hui.</p></div>`;
}

function trendBlock() {
  const t = weightTrend();
  if (!t) return '<p class="muted small">Pèse-toi lundi, mercredi et vendredi : après 2 semaines, l\'app compare les moyennes et propose un ajustement.</p>';
  return `<div class="kv"><span>Moyenne 7 derniers jours</span><span>${fmtNum(t.current, 1)} kg</span><span>Semaine précédente</span><span>${fmtNum(t.previous, 1)} kg</span><span>Évolution</span><span>${t.delta > 0 ? '+' : ''}${fmtNum(t.delta, 2)} kg</span></div>
    <div class="${t.warn ? 'warnbox' : 'note-ok'}">${esc(t.message)}</div>`;
}

function stepCell(m) {
  const asym = m.stepL && m.stepR && Math.abs(m.stepL - m.stepR) / Math.max(m.stepL, m.stepR) > STEP_ASYMMETRY;
  return `${m.stepL || '—'}/${m.stepR || '—'}${asym ? ' ⚠' : ''}`;
}

function measuresCard() {
  const rows = [...state.measures].sort((a, b) => a.date < b.date ? 1 : -1);
  const table = rows.length
    ? `<div class="tblwrap"><table class="mini"><thead><tr><th>Date</th><th>Poids</th><th>Taille</th><th>FC</th><th>Vélo 12'</th><th>Step G/D</th><th></th></tr></thead><tbody>${rows.map(m => `<tr>
        <td>${esc(fmtShort(m.date))}</td><td>${m.weight ? fmtNum(m.weight, 1) : '—'}</td><td>${m.waist ? fmtNum(m.waist, 1) : '—'}</td><td>${m.hr || '—'}</td><td>${esc(m.bike || '—')}</td><td>${stepCell(m)}</td>
        <td><button class="btn ghost sm" data-delm="${state.measures.indexOf(m)}" aria-label="Supprimer la mesure du ${esc(fmtShort(m.date))}">✕</button></td></tr>`).join('')}</tbody></table></div>`
    : '<p class="empty">Aucune mesure. Commence par les mesures du jour 0.</p>';
  return `<div class="card"><div class="row between"><h3>Mesures</h3><button class="btn sm" data-act="measure">+ Nouvelle mesure</button></div>
    <p class="small muted">Tous les lundis : tour de taille. Toutes les 4 semaines (S0, S4, S8, S12, S16) : FC repos, test vélo 12 min, step-up gauche/droite, photos.</p>
    ${table}</div>`;
}

function strengthCard() {
  const stats = Object.entries(exerciseStats());
  const list = stats.length ? stats.map(([key, s]) => {
    const first = s.pts[0], last = s.pts[s.pts.length - 1];
    const gain = first.v > 0 ? Math.round((last.v / first.v - 1) * 100) : 0;
    const details = ui.openEx === key
      ? `<div class="stack small" style="padding:4px 0 10px">${[...s.pts].reverse().map(q => `<div class="row between"><span>${esc(fmtShort(q.date))}</span><span class="num muted">${esc(q.all)}</span></div>`).join('')}</div>`
      : '';
    return `<button class="exrow" data-ex="${esc(key)}"><span class="grow"><b>${esc(s.name)}</b><br>
      <span class="small muted num">${fmtNum(last.kg, 1)} kg × ${last.reps} · ${s.pts.length} séance(s)${s.pts.length > 1 ? ` · ${gain >= 0 ? '+' : ''}${gain} %` : ''}</span></span>${sparkline(s.pts)}</button>${details}`;
  }).join('') : '<p class="empty">Les charges apparaîtront après la première séance.</p>';
  return `<div class="card"><h3>Charges par exercice</h3><p class="small muted">Force estimée (1RM) à partir de la meilleure série de chaque séance.</p>${list}</div>`;
}

export function progressView() {
  setHeader({ eyebrow: 'Mesures, charges et régularité', title: 'Progrès' });
  const view = $('#view');
  view.innerHTML = `
    ${adherenceCard()}
    <div class="card"><h3>Poids</h3>${lineChart(weightSeries(), 'kg')}${trendBlock()}</div>
    <div class="card"><h3>Tour de taille (nombril)</h3>${lineChart(waistSeries(), 'cm')}</div>
    ${measuresCard()}
    ${strengthCard()}`;

  view.onclick = e => {
    if (e.target.closest('[data-act="measure"]')) { openMeasureSheet(); return; }
    const del = e.target.closest('[data-delm]');
    if (del) {
      confirmSheet('Supprimer cette mesure ?', () => { state.measures.splice(+del.dataset.delm, 1); save(); render(); });
      return;
    }
    const ex = e.target.closest('[data-ex]');
    if (ex) { ui.openEx = ui.openEx === ex.dataset.ex ? null : ex.dataset.ex; keepScroll(render); }
  };
}
