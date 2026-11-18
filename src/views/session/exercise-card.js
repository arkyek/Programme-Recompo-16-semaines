/* Carte d'un exercice dans la séance : schéma, prescription, objectif, saisie des séries, verdict. */
import { esc } from '../../core/dom.js';
import { pad, fmtShort } from '../../core/dates.js';
import { restTxt } from '../../core/format.js';
import { CHECK } from '../../core/icons.js';
import { EXERCISES } from '../../data/exercises.js';
import { suggest, evalItem } from '../../domain/training-log.js';
import { exerciseFigure } from '../../ui/components/figure.js';
import { exerciseCues } from '../../ui/components/exercise-info.js';

const RIR_OPTIONS = ['', '0', '1', '2', '3', '4+'];

function fixedSetRow(s, i, j, r) {
  return `<div class="set fixed ${s.done ? 'done' : ''}"><span class="sn">${j + 1}</span><span class="small">${esc(r.txt)}</span>
    <button class="ck" data-done="${i}:${j}" aria-pressed="${s.done}" aria-label="Série ${j + 1} faite">${CHECK}</button></div>`;
}

function loadSetRow(s, i, j, r) {
  return `<div class="set ${s.done ? 'done' : ''}"><span class="sn">${j + 1}</span>
    <input type="number" inputmode="decimal" step="0.5" value="${esc(s.kg)}" data-f="${i}:${j}:kg" aria-label="Charge série ${j + 1} (kg)" placeholder="kg">
    <input type="number" inputmode="numeric" value="${esc(s.reps)}" data-f="${i}:${j}:reps" aria-label="Répétitions série ${j + 1}" placeholder="${r.reps[0]}–${r.reps[1]}">
    <select data-f="${i}:${j}:rir" aria-label="RIR série ${j + 1}">${RIR_OPTIONS.map(v => `<option ${s.rir === v ? 'selected' : ''} value="${v}">${v || '–'}</option>`).join('')}</select>
    <button class="ck" data-done="${i}:${j}" aria-pressed="${s.done}" aria-label="Valider la série ${j + 1}">${CHECK}</button></div>`;
}

/**
 * @param {object} it   exercice du journal
 * @param {number} i    position dans la séance
 * @param {object} p    plan du jour
 * @param {boolean} current exercice en cours (mis en avant)
 */
export function exerciseCard(it, i, p, current) {
  const x = EXERCISES[it.ex] || { n: it.name, cues: [], m: '' };
  const r = it.rx, ev = evalItem(it), sg = suggest(it, p.date, p.deload);
  const repsTxt = r.fixed ? `${r.sets} × ${r.txt}` : `${r.sets} × ${r.reps[0]}–${r.reps[1]}`;
  const row = r.fixed ? fixedSetRow : loadSetRow;

  return `<article class="ex ${current ? 'cur' : ''}" id="ex-${i}">
    ${it.free ? '' : exerciseFigure(it.ex)}
    <div class="bd">
      <div class="hd"><span class="idx">${pad(i + 1)}</span><h3>${esc(x.n || it.name)}</h3></div>
      <div class="rx"><span>${repsTxt}</span>${r.rir ? `<span>RIR ${esc(r.rir)}</span>` : ''}<span>repos ${restTxt(r.rest)}</span>${it.free ? '<span>libre</span>' : ''}</div>
      ${it.note ? `<p class="small"><b>${esc(it.note)}</b></p>` : ''}
      ${sg ? `<div class="goal"><span><b>Objectif du jour.</b> ${esc(sg.text)}</span>${sg.prev ? `<span class="muted small">Dernière fois (${esc(fmtShort(sg.last))}) : ${esc(sg.prev)}</span>` : ''}</div>` : ''}
      <div class="sets">
        ${r.fixed ? '' : '<div class="set hdr"><span></span><span>kg</span><span>reps</span><span>RIR</span><span></span></div>'}
        ${it.sets.map((s, j) => row(s, i, j, r)).join('')}
      </div>
      <div class="row">
        <button class="btn sec sm" data-addset="${i}">+ Série</button>
        ${it.sets.length > 1 ? `<button class="btn ghost sm" data-delset="${i}">− Série</button>` : ''}
        ${it.free ? `<button class="btn ghost sm" data-delex="${i}">Retirer</button>` : ''}
      </div>
      <div class="verdict ${ev.s}">${esc(ev.t)}</div>
      ${it.free ? '' : `<details><summary class="small" style="color:var(--accent);font-weight:600">Technique et conseils</summary>
        <div class="stack small" style="margin-top:8px"><span class="muted">${esc(x.m)}</span>${exerciseCues(x)}</div></details>`}
    </div></article>`;
}
