/* Vue « Aujourd'hui » : activité du jour, cibles, journée type et note. */
import { $, esc } from '../../core/dom.js';
import { today, addDays, fmtDate } from '../../core/dates.js';
import { fmtNum, parseNum, clampPct } from '../../core/format.js';
import { CHECK } from '../../core/icons.js';
import { SESSIONS, TARGETS } from '../../config/program.js';
import { tipOfDay } from '../../config/tips.js';
import { state, save, dayEntry } from '../../state/store.js';
import { plan, phaseLine, stepGoal, zone2Minutes, intervalsFor } from '../../domain/schedule.js';
import { timeline, mealsTotals } from '../../domain/timeline.js';
import { activityLog } from '../../domain/training-log.js';
import { ui, go, render } from '../../ui/router.js';
import { setHeader } from '../../ui/shell.js';
import { openMoveActivitySheet } from '../shared/move-activity-sheet.js';
import { openAddFoodSheet } from './add-food-sheet.js';

const WEIGH_DAYS = [0, 2, 4];

function activitySummary(p) {
  if (p.kind === 'lift') return `${SESSIONS[p.sid].items.length} exercices · ≈ ${p.phase === 1 ? 50 : 60} min · ${state.settings.slot === 'midi' ? '12 h 15' : '18 h'}`;
  if (p.kind === 'cardio') return p.cid === 'int' ? intervalsFor(p).label : `${zone2Minutes(p.w)} min en zone 2 (112–130 bpm)`;
  if (p.kind === 'free') return 'Règle la date de début dans l\'onglet Réglages.';
  return 'Récupération : marche, spa, détente.';
}

function activityCard(p, isToday) {
  const done = activityLog(p.date, p)?.done;
  const chipCls = p.kind === 'lift' ? 'lift' : p.kind === 'cardio' ? 'cardio' : '';
  return `<div class="card ${chipCls ? 'hl' : ''}">
    <div class="row between"><span class="chip ${chipCls}">${esc(isToday ? fmtDate(p.date) : 'Programme du jour')}</span>${done ? '<span class="chip ok">Fait</span>' : ''}</div>
    <h2>${esc(p.label)}${p.moved ? ' <span class="chip warn">déplacé</span>' : ''}</h2>
    <p class="muted small">${activitySummary(p)}</p>
    <div class="row">
      ${p.kind === 'lift' ? `<button class="btn grow" data-act="session">${done ? 'Revoir la séance' : 'Commencer la séance'}</button>` : ''}
      ${p.kind === 'cardio' ? `<button class="btn grow" data-act="session">${done ? 'Revoir le cardio' : 'Commencer le cardio'}</button>` : ''}
      ${p.kind === 'free' ? '<button class="btn grow" data-act="settings">Ouvrir les réglages</button>' : ''}
      ${p.phase ? '<button class="btn sec" data-act="move">Changer</button>' : ''}
    </div>
  </div>`;
}

function targetsBlock(p, d) {
  const tot = mealsTotals(p.date, p);
  const kcalT = TARGETS.kcal[p.nut], waterT = TARGETS.water[p.nut], stepsT = stepGoal(p.w || 1);
  const showWeight = WEIGH_DAYS.includes(p.wd) || d.weight;
  const bar = (v, t) => `<div class="bar"><i style="width:${clampPct(v, t)}%"></i></div>`;
  return `
  <div class="sec-title">Cibles du jour · ${p.nut === 'lift' ? 'jour d\'entraînement' : 'jour de repos'}</div>
  <div class="targets">
    <div class="tg"><span class="lb">Calories (repas cochés)</span><span class="v num">${fmtNum(tot.kcal)} <small>/ ${fmtNum(kcalT)}</small></span>${bar(tot.kcal, kcalT)}</div>
    <div class="tg"><span class="lb">Protéines</span><span class="v num">${fmtNum(tot.prot)} g <small>/ ${TARGETS.prot}</small></span>${bar(tot.prot, TARGETS.prot)}</div>
    <div class="tg"><span class="lb">Eau</span><span class="v num">${fmtNum((d.water || 0) / 1000, 2)} L <small>/ ${fmtNum(waterT / 1000, 1)}</small></span>${bar(d.water || 0, waterT)}<div class="ctl"><button data-water="-250" aria-label="Retirer 250 ml">−</button><button data-water="250">+250 ml</button></div></div>
    <div class="tg"><span class="lb">Pas</span><span class="v num">${fmtNum(d.steps || 0)} <small>/ ${fmtNum(stepsT)}</small></span>${bar(d.steps || 0, stepsT)}<input data-num="steps" type="number" inputmode="numeric" placeholder="Saisir les pas" value="${d.steps || ''}" aria-label="Pas du jour"></div>
    <div class="tg"><span class="lb">Sommeil (nuit dernière)</span><span class="v num">${d.sleep ? fmtNum(d.sleep, 1) + ' h' : '—'} <small>/ ${fmtNum(TARGETS.sleep, 1)}</small></span><input data-num="sleep" type="number" inputmode="decimal" step="0.25" placeholder="Heures" value="${d.sleep || ''}" aria-label="Heures de sommeil"></div>
    <div class="tg"><span class="lb">${showWeight ? 'Poids à jeun' : 'Poids (lun / mer / ven)'}</span><span class="v num">${d.weight ? fmtNum(d.weight, 1) + ' kg' : '—'}</span><input data-num="weight" type="number" inputmode="decimal" step="0.1" placeholder="kg" value="${d.weight || ''}" aria-label="Poids en kg"></div>
  </div>
  <div class="row"><span class="muted small grow">Lipides ≥ ${TARGETS.fat} g · glucides ≈ ${TARGETS.carbs[p.nut]} g · fibres 30–40 g</span><button class="btn sec sm" data-act="extra">+ Ajouter un aliment</button></div>
  ${(d.extra || []).length ? `<div class="chips">${d.extra.map((x, i) => `<button class="chip" data-delx="${i}" aria-label="Retirer ${esc(x.label)}">${esc(x.label)} · ${x.kcal} kcal · ${x.prot} g ✕</button>`).join('')}</div>` : ''}`;
}

function timelineBlock(p, checks) {
  return `<div class="sec-title">Du réveil au coucher</div>
  <div class="card"><div class="tl">
    ${timeline(p).map(it => `<div class="tli ${checks[it.k] ? 'done' : ''}">
      <span class="t">${it.t}</span>
      <button class="ck" data-ck="${it.k}" aria-pressed="${!!checks[it.k]}" aria-label="Fait : ${esc(it.title)}">${CHECK}</button>
      <div class="bd"><span class="tt">${esc(it.title)}</span>
        ${it.dt ? `<span class="dt">${esc(it.dt)}${it.meal ? ` · <span class="num">${it.kcal} kcal, ${it.prot} g prot.</span>` : ''}</span>` : ''}
        ${it.sup ? `<div class="sup">${it.sup.map(s => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
        ${it.action ? '<div><button class="btn sm" data-act="session">Ouvrir</button></div>' : ''}
        ${it.tip ? `<details><summary>Conseil</summary><p>${esc(it.tip)}</p></details>` : ''}
      </div></div>`).join('')}
  </div></div>`;
}

export function todayView() {
  const date = ui.date, p = plan(date), d = state.days[date] || {}, isToday = date === today();

  setHeader({
    eyebrow: phaseLine(p),
    title: isToday ? 'Aujourd\'hui' : fmtDate(date),
    actions: '<button class="iconbtn" data-nav="-1" aria-label="Jour précédent">‹</button><button class="iconbtn" data-nav="1" aria-label="Jour suivant">›</button>',
    onClick: e => { const b = e.target.closest('[data-nav]'); if (b) { ui.date = addDays(ui.date, +b.dataset.nav); render(); } },
  });

  const view = $('#view');
  view.innerHTML = `
    ${!isToday ? '<button class="btn ghost sm" data-act="gotoday">Revenir à aujourd\'hui</button>' : ''}
    ${activityCard(p, isToday)}
    ${targetsBlock(p, d)}
    ${timelineBlock(p, d.checks || {})}
    <div class="tip"><b>Conseil du jour.</b> ${esc(tipOfDay(date))}</div>
    <div class="field"><label for="in-note">Note du jour</label><textarea id="in-note" rows="2" placeholder="Fatigue, genou, faim, humeur…">${esc(d.note || '')}</textarea></div>`;

  view.onclick = e => {
    const ck = e.target.closest('[data-ck]');
    if (ck) { const dd = dayEntry(date); dd.checks ||= {}; dd.checks[ck.dataset.ck] = !dd.checks[ck.dataset.ck]; save(); render(); return; }
    const water = e.target.closest('[data-water]');
    if (water) { const dd = dayEntry(date); dd.water = Math.max(0, (dd.water || 0) + +water.dataset.water); save(); render(); return; }
    const delx = e.target.closest('[data-delx]');
    if (delx) { dayEntry(date).extra.splice(+delx.dataset.delx, 1); save(); render(); return; }

    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'gotoday') { ui.date = today(); render(); }
    else if (act === 'session') go('session', { date });
    else if (act === 'settings') go('settings');
    else if (act === 'move') openMoveActivitySheet(date);
    else if (act === 'extra') openAddFoodSheet(date);
  };

  view.onchange = e => {
    const key = e.target.dataset.num;
    if (!key) return;
    const value = parseNum(e.target.value), dd = dayEntry(date);
    if (value == null) delete dd[key]; else dd[key] = value;
    save();
    render();
  };

  $('#in-note').addEventListener('input', e => { dayEntry(date).note = e.target.value; save(); });
}
