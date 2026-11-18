/* Vue « Séance » : aiguille vers la séance de muscu, le cardio, ou l'écran de repos. */
import { $, $$, esc, keepScroll } from '../../core/dom.js';
import { today, addDays, fmtDate, fmtShort } from '../../core/dates.js';
import { SESSIONS } from '../../config/program.js';
import { save } from '../../state/store.js';
import { plan, phaseLine } from '../../domain/schedule.js';
import { ensureLiftLog, evalItem, addSet, toggleSet, sessionSummary, recentLiftLogs } from '../../domain/training-log.js';
import { ui, go, render } from '../../ui/router.js';
import { setHeader, toast } from '../../ui/shell.js';
import { startRest, stopRest } from '../../ui/rest-timer.js';
import { openMoveActivitySheet } from '../shared/move-activity-sheet.js';
import { exerciseCard } from './exercise-card.js';
import { openFreeExerciseSheet } from './free-exercise-sheet.js';
import { cardioView } from './cardio.view.js';

const VERDICT_SHORT = { top: 'Palier ↑', ok: 'Atteint', low: 'Sous', todo: 'À faire' };
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

function warmUp(legs) {
  return ['5 min de vélo ou d\'elliptique, facile',
    '10 squats sur box, 10 ponts fessiers, 10 rotations d\'épaules à l\'élastique',
    ...(legs ? ['2 × 45 s de chaise contre le mur'] : []),
    '2 séries d\'approche sur le 1er exercice (≈ 50 % × 10, puis 75 % × 5)'];
}

function historyList() {
  const list = recentLiftLogs();
  if (!list.length) return '';
  return `<div class="sec-title">Dernières séances</div><div class="card">${list.map(l => `
    <button class="exrow" data-hist="${l.date}"><span class="grow"><b>${esc(SESSIONS[l.sid]?.t || 'Séance')}</b><br><span class="muted small">${esc(fmtDate(l.date))}</span></span>
    <span class="chip ok">${l.items.filter(i => evalItem(i).s === 'top').length} palier(s)</span></button>`).join('')}</div>`;
}

function summaryCard(lg) {
  const sum = sessionSummary(lg);
  if (sum.todo === sum.rows.length) return '';
  return `<div class="card"><h3>Bilan de la séance</h3>
    <div class="chips"><span class="chip ok">${plural(sum.top, 'palier')}</span><span class="chip lift">${plural(sum.ok, 'objectif')} atteint${sum.ok > 1 ? 's' : ''}</span>${sum.low ? `<span class="chip warn">${sum.low} sous la fourchette</span>` : ''}${sum.todo ? `<span class="chip">${sum.todo} à faire</span>` : ''}</div>
    <div class="kv">${sum.rows.map(r => `<span>${esc(r.name)}</span><span class="verdict ${r.e.s}" style="padding:2px 8px;font-size:12px">${VERDICT_SHORT[r.e.s]}</span>`).join('')}</div>
    <p class="small muted">Après la séance : dîner protéiné dans les 2 h, sauna possible, pas de zone froide aujourd'hui.</p></div>`;
}

/* ---------- Jour sans séance ---------- */

function nextActivity(date) {
  for (let i = 1; i < 8; i++) {
    const d = addDays(date, i), q = plan(d);
    if (q.kind === 'lift' || q.kind === 'cardio') return q;
  }
  return null;
}

function restDayView(p) {
  setHeader({ eyebrow: phaseLine(p), title: 'Séance' });
  const next = nextActivity(p.date);
  const view = $('#view');
  view.innerHTML = `<div class="card"><h2>${esc(p.label)} ${p.date === today() ? 'aujourd\'hui' : 'le ' + esc(fmtShort(p.date))}</h2>
      <p class="muted">Récupération : c'est pendant le repos que le muscle se construit. Marche, spa, sommeil.</p>
      ${next ? `<p>Prochaine activité : <b>${esc(next.label)}</b>, ${esc(fmtDate(next.date).toLowerCase())}</p><button class="btn" data-go="${next.date}">Voir cette séance</button>` : ''}
      ${p.phase ? '<button class="btn sec" data-act="move">Faire une séance aujourd\'hui quand même</button>' : ''}</div>
    ${historyList()}`;
  view.onclick = e => {
    const target = e.target.closest('[data-go], [data-hist]');
    if (target) { go('session', { date: target.dataset.go || target.dataset.hist }); return; }
    if (e.target.closest('[data-act="move"]')) openMoveActivitySheet(p.date);
  };
}

/* ---------- Séance de musculation ---------- */

function liftView(p) {
  const lg = ensureLiftLog(p);
  save();
  const session = SESSIONS[p.sid];
  setHeader({ eyebrow: phaseLine(p) + ' · ' + fmtShort(p.date), title: session.t });

  const doneCount = lg.items.filter(it => evalItem(it).s !== 'todo').length;
  const currentIdx = lg.items.findIndex(it => evalItem(it).s === 'todo');
  const view = $('#view');
  view.innerHTML = `
    <div class="card">
      <div class="row between"><span class="chip lift">${doneCount}/${lg.items.length} exercices</span>${lg.done ? '<span class="chip ok">Séance terminée</span>' : ''}</div>
      ${p.deload ? '<div class="warnbox"><b>Semaine de décharge.</b> Moitié moins de séries, charges −10 %, RIR 3. On récupère pour mieux repartir.</div>' : ''}
      <p class="small muted">Effort : RIR = répétitions gardées en réserve. Repos et objectifs calculés pour la phase ${p.phase}.</p>
    </div>
    <div class="card"><h3>Échauffement · 8 min</h3><div class="checklist">${warmUp(session.legs).map((w, i) => `<label><input type="checkbox" data-warm="${i}" ${lg.warm[i] ? 'checked' : ''}><span>${esc(w)}</span></label>`).join('')}</div></div>
    ${lg.items.map((it, i) => exerciseCard(it, i, p, i === currentIdx)).join('')}
    <button class="btn sec block" data-act="free">+ Ajouter un exercice libre</button>
    ${session.after ? `<div class="tip">${esc(session.after)}</div>` : ''}
    ${summaryCard(lg)}
    <button class="btn block" data-act="finish">${lg.done ? 'Séance enregistrée ✓' : 'Terminer la séance'}</button>
    ${historyList()}`;
  bindLiftView(view, lg, p);
}

function bindLiftView(view, lg, p) {
  const rerender = () => keepScroll(render);

  view.onchange = e => {
    const field = e.target.dataset.f;
    if (field) { const [i, j, k] = field.split(':'); lg.items[i].sets[j][k] = e.target.value; save(); return; }
    const warm = e.target.dataset.warm;
    if (warm != null) { lg.warm[warm] = e.target.checked; save(); }
  };

  view.onclick = e => {
    const doneBtn = e.target.closest('[data-done]');
    if (doneBtn) {
      const [i, j] = doneBtn.dataset.done.split(':').map(Number), it = lg.items[i], s = it.sets[j];
      // Récupère les valeurs saisies même si l'événement change n'a pas encore eu lieu
      $$(`[data-f^="${i}:${j}:"]`, view).forEach(inp => { s[inp.dataset.f.split(':')[2]] = inp.value; });
      if (!toggleSet(it, j)) { toast('Indique le nombre de répétitions'); return; }
      save();
      if (s.done) startRest(it.rx.rest, `${it.name} · série ${j + 1} validée`);
      rerender();
      return;
    }
    const add = e.target.closest('[data-addset]');
    if (add) { addSet(lg.items[+add.dataset.addset]); save(); rerender(); return; }
    const del = e.target.closest('[data-delset]');
    if (del) { lg.items[+del.dataset.delset].sets.pop(); save(); rerender(); return; }
    const delEx = e.target.closest('[data-delex]');
    if (delEx) { lg.items.splice(+delEx.dataset.delex, 1); save(); rerender(); return; }
    const hist = e.target.closest('[data-hist]');
    if (hist) { go('session', { date: hist.dataset.hist }); return; }

    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'free') openFreeExerciseSheet(lg, p);
    if (act === 'finish') {
      const todo = lg.items.filter(it => evalItem(it).s === 'todo').length;
      lg.done = true;
      lg.end = Date.now();
      save();
      stopRest();
      toast(todo ? `Séance enregistrée (${todo} exercice(s) incomplet(s))` : 'Séance enregistrée. Bravo !');
      rerender();
    }
  };
}

export function sessionView() {
  const p = plan(ui.date);
  if (p.kind === 'cardio') return cardioView(p);
  if (p.kind === 'lift') return liftView(p);
  return restDayView(p);
}
