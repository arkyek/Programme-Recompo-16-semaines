/* Vue « Calendrier » : les 16 semaines, regroupées par phase. */
import { $, esc } from '../core/dom.js';
import { today, addDays, parse, fmtDate, fmtShort, JOURS_COURTS } from '../core/dates.js';
import { PHASES, PROGRAM_WEEKS, PROGRAM_DAYS, DELOAD_WEEKS } from '../config/program.js';
import { state } from '../state/store.js';
import { plan } from '../domain/schedule.js';
import { isDayDone } from '../domain/training-log.js';
import { go } from '../ui/router.js';
import { setHeader } from '../ui/shell.js';

const LEGEND = `<div class="legend">
  <span><i style="background:var(--accent-soft)"></i>Musculation</span>
  <span><i style="background:var(--cardio-soft)"></i>Cardio</span>
  <span><i style="background:var(--surface);border:1px solid var(--line)"></i>Repos</span>
  <span><i style="background:var(--ok);border-radius:50%"></i>Fait</span>
</div>`;

function weekCard(w, t) {
  const start = addDays(state.settings.start, (w - 1) * 7);
  const isCurrent = start <= t && t <= addDays(start, 6);
  let liftDone = 0, liftPlanned = 0;
  const cells = JOURS_COURTS.map((label, i) => {
    const date = addDays(start, i), p = plan(date), done = isDayDone(date, p);
    if (p.kind === 'lift') { liftPlanned++; if (done) liftDone++; }
    return `<button class="dc ${p.kind} ${date === t ? 'today' : ''} ${done ? 'done' : ''}" data-d="${date}" aria-label="${esc(fmtDate(date) + ' : ' + p.label)}"><span class="d">${label}</span><span class="n">${parse(date).getDate()}</span><span class="a">${esc(p.short)}</span></button>`;
  });
  return `<div class="wk card" ${isCurrent ? 'style="border-color:var(--fg)"' : ''}>
    <div class="wh"><b>Semaine ${w}${DELOAD_WEEKS.includes(w) ? ' · décharge' : ''}</b><span class="muted num">${fmtShort(start)} · muscu ${liftDone}/${liftPlanned}</span></div>
    <div class="days7">${cells.join('')}</div></div>`;
}

export function calendarView() {
  const start = state.settings.start;
  setHeader({ eyebrow: `${PROGRAM_WEEKS} semaines · du ${fmtShort(start)} au ${fmtShort(addDays(start, PROGRAM_DAYS - 1))}`, title: 'Calendrier' });

  const t = today();
  let html = LEGEND;
  for (let w = 1; w <= PROGRAM_WEEKS; w++) {
    if ((w - 1) % 4 === 0) {
      const ph = (w + 3) / 4;
      html += `<div class="phase-h"><b>Phase ${ph}</b><span class="muted small">${PHASES[ph]} · S${w}–S${w + 3}</span></div>`;
    }
    html += weekCard(w, t);
  }
  const view = $('#view');
  view.innerHTML = html;
  view.onclick = e => { const b = e.target.closest('[data-d]'); if (b) go('today', { date: b.dataset.d }); };
}
