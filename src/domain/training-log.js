/* Journal d'entraînement : création des séances, suggestion de charge (surcharge progressive), bilan. */
import { state } from '../state/store.js';
import { fmtNum, roundTo } from '../core/format.js';
import { SESSIONS, LOAD_INCREMENTS, DEFAULT_INCREMENT } from '../config/program.js';
import { EXERCISES } from '../data/exercises.js';
import { prescription } from './prescription.js';

export const liftKey = (date, sid) => `${date}|${sid}`;
export const cardioKey = date => `${date}|cardio`;

const emptySet = kg => ({ kg: kg ?? '', reps: '', rir: '', done: false });

/** Journal lié à l'activité prévue ce jour-là (muscu ou cardio), s'il existe. */
export function activityLog(date, p) {
  if (p.kind === 'lift') return state.logs[liftKey(date, p.sid)];
  if (p.kind === 'cardio') return state.logs[cardioKey(date)];
  return undefined;
}

/** Jour considéré comme « fait » : séance enregistrée, ou ≥ 5 étapes cochées un jour de repos. */
export function isDayDone(date, p) {
  if (p.kind === 'lift' || p.kind === 'cardio') return !!activityLog(date, p)?.done;
  const checks = state.days[date]?.checks || {};
  return Object.values(checks).filter(Boolean).length >= 5;
}

/** Dernière performance enregistrée sur un exercice, avant une date. */
function lastPerformance(exKey, before) {
  let best = null;
  for (const lg of Object.values(state.logs)) {
    if (!lg.items || lg.date >= before) continue;
    const it = lg.items.find(x => x.ex === exKey);
    if (!it) continue;
    const sets = it.sets.filter(s => s.done && +s.reps > 0);
    if (!sets.length) continue;
    if (!best || lg.date > best.date) best = { date: lg.date, sets, target: it.rx.sets };
  }
  return best;
}

/**
 * Objectif du jour pour un exercice, d'après la dernière séance.
 * @returns {null | {kg, text, prev?, last?, up?}}
 */
export function suggest(it, date, deload) {
  if (it.rx.fixed) return null;
  const last = lastPerformance(it.ex, date), [bot, top] = it.rx.reps;
  const inc = it.inc ?? LOAD_INCREMENTS[it.ex] ?? DEFAULT_INCREMENT;
  if (!last) return { kg: null, text: `Première fois : choisis une charge qui permet ${bot} reps en gardant ${it.rx.rir} rep(s) en réserve, puis note-la.` };

  const kg = Math.max(...last.sets.map(s => +s.kg || 0));
  const prev = last.sets.map(s => `${s.kg || 0}×${s.reps}`).join(' · ');
  const ctx = { prev, last: last.date };

  if (deload) {
    const light = kg ? roundTo(kg * 0.9, inc || 0.5) : null;
    return { ...ctx, kg: light, text: `Décharge : ${light ? light + ' kg' : 'même charge'}, ${bot} reps, sans forcer.` };
  }
  const allTop = last.sets.length >= last.target && last.sets.every(s => +s.reps >= top);
  if (allTop && inc) return { ...ctx, kg: kg + inc, up: true, text: `Palier atteint la dernière fois : +${fmtNum(inc, inc % 1 ? 1 : 0)} kg → ${fmtNum(kg + inc, 1)} kg, viser ${bot} reps et plus.` };
  if (allTop) return { ...ctx, kg: kg || null, up: true, text: 'Palier atteint : passe à une variante plus dure ou ajoute du lest.' };
  const target = last.sets.map(s => Math.min(top, +s.reps + 1)).join(' / ');
  return { ...ctx, kg: kg || null, text: `Même charge${kg ? ' (' + fmtNum(kg, 1) + ' kg)' : ''}, viser 1 rep de plus : ${target}.` };
}

/** État d'un exercice : todo | low (sous la fourchette) | ok | top (palier atteint). */
export function evalItem(it) {
  const done = it.sets.filter(s => s.done);
  if (it.rx.fixed) return done.length >= it.sets.length ? { s: 'ok', t: 'Fait' } : { s: 'todo', t: `${done.length}/${it.sets.length} séries` };
  if (done.length < it.sets.length) return { s: 'todo', t: `${done.length}/${it.sets.length} séries faites` };
  const [bot, top] = it.rx.reps;
  if (done.every(s => +s.reps >= top)) return { s: 'top', t: 'Palier atteint : augmente la charge la prochaine fois' };
  if (done.every(s => +s.reps >= bot)) return { s: 'ok', t: 'Objectif atteint : garde la charge et ajoute des reps' };
  return { s: 'low', t: 'Sous la fourchette : garde ou baisse un peu la charge' };
}

/** Crée les séries vides d'un exercice, pré-remplies avec la charge suggérée. */
function withSets(it, count, date, deload) {
  const sg = suggest(it, date, deload);
  it.sets = Array.from({ length: count }, () => emptySet(sg?.kg));
  return it;
}

/** Journal de la séance du jour, créé à partir du programme s'il n'existe pas encore. */
export function ensureLiftLog(p) {
  const key = liftKey(p.date, p.sid);
  if (!state.logs[key]) {
    const items = SESSIONS[p.sid].items.map(([ex, cat, opt]) => {
      const rx = prescription(cat, opt, p);
      return withSets({ ex, cat, name: EXERCISES[ex].n, note: opt?.note || '', rx }, rx.sets, p.date, p.deload);
    });
    state.logs[key] = { date: p.date, sid: p.sid, items, warm: {}, created: Date.now() };
  }
  return state.logs[key];
}

export function ensureCardioLog(p) {
  return (state.logs[cardioKey(p.date)] ||= { date: p.date, kind: p.cid, min: '', hr: '', act: p.pool ? 'Natation' : 'Vélo', done: false });
}

const slug = s => s.toLowerCase().replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ]+/g, '-');

/** Exercice ajouté librement : reconnu dans le catalogue si le nom correspond. */
export function createFreeItem({ name, sets, reps, rir, rest, inc }, p) {
  const known = Object.keys(EXERCISES).find(k => EXERCISES[k].n.toLowerCase() === name.toLowerCase());
  const it = {
    ex: known || 'free:' + slug(name), name: known ? EXERCISES[known].n : name,
    cat: 'free', free: !known, rx: { sets, reps, rir, rest }, inc,
  };
  return withSets(it, sets, p.date, p.deload);
}

export function addSet(it) {
  const last = it.sets[it.sets.length - 1];
  it.sets.push(emptySet(last?.kg));
}

/** Valide / dévalide une série. Renvoie false si les reps manquent. */
export function toggleSet(it, j) {
  const s = it.sets[j];
  if (!s.done && !it.rx.fixed && !(+s.reps > 0)) return false;
  s.done = !s.done;
  // Reporte la charge sur la série suivante si elle est vide
  const next = it.sets[j + 1];
  if (s.done && next && !next.done && next.kg === '' && s.kg !== '') next.kg = s.kg;
  return true;
}

export function sessionSummary(lg) {
  const rows = lg.items.map(it => ({ name: it.name, e: evalItem(it) }));
  const count = s => rows.filter(r => r.e.s === s).length;
  return { rows, top: count('top'), ok: count('ok'), low: count('low'), todo: count('todo') };
}

export function recentLiftLogs(limit = 6) {
  return Object.values(state.logs)
    .filter(l => l.items && l.done)
    .sort((a, b) => a.date < b.date ? 1 : -1)
    .slice(0, limit);
}
