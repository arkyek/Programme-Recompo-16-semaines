/* Statistiques de progression : poids, tour de taille, force estimée, régularité. */
import { state } from '../state/store.js';
import { today, addDays } from '../core/dates.js';
import { PROGRAM_DAYS } from '../config/program.js';
import { plan } from './schedule.js';
import { isDayDone } from './training-log.js';

const byDate = (a, b) => a[0] < b[0] ? -1 : 1;

/** Série [date, kg] : pesées du jour + mesures (la mesure l'emporte à date égale). */
export function weightSeries() {
  const pts = {};
  for (const d in state.days) if (state.days[d].weight) pts[d] = +state.days[d].weight;
  state.measures.forEach(m => { if (m.weight) pts[m.date] = +m.weight; });
  return Object.entries(pts).sort(byDate);
}

export const waistSeries = () => state.measures.filter(m => m.waist).map(m => [m.date, +m.waist]).sort(byDate);

const avgRange = (series, from, to) => {
  const v = series.filter(s => s[0] > from && s[0] <= to).map(s => s[1]);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

/**
 * Compare les moyennes de poids sur 7 jours glissants et conseille un ajustement calorique.
 * @returns {null | {current, previous, delta, message, warn}} null si pas assez de pesées.
 */
export function weightTrend() {
  const ws = weightSeries(), t = today();
  const current = avgRange(ws, addDays(t, -7), t);
  const previous = avgRange(ws, addDays(t, -14), addDays(t, -7));
  const older = avgRange(ws, addDays(t, -21), addDays(t, -14));
  if (current == null || previous == null) return null;

  const delta = current - previous;
  const waists = waistSeries();
  const waistDelta = waists.length >= 2 ? waists[waists.length - 1][1] - waists[waists.length - 2][1] : null;
  const waistDown = waistDelta != null && waistDelta < -0.4;

  if (delta < -0.8) return { current, previous, delta, warn: true, message: 'Perte trop rapide (plus de 0,8 kg/sem) : ajoute 150 kcal par jour (glucides ou lipides).' };
  if (delta > -0.2 && older != null && previous - older > -0.2 && !waistDown) return { current, previous, delta, warn: true, message: 'Poids stable depuis 2 semaines et taille qui ne baisse pas : retire 150 kcal par jour (jamais sur les protéines) ou ajoute 2 000 pas.' };
  if (delta > -0.2 && waistDown) return { current, previous, delta, warn: false, message: 'Poids stable mais tour de taille en baisse : recomposition en cours, ne change rien.' };
  return { current, previous, delta, warn: false, message: 'Rythme correct (−0,2 à −0,8 kg/sem). Continue ainsi.' };
}

/** Force maximale estimée (formule d'Epley). */
export const estimated1RM = (kg, reps) => kg * (1 + reps / 30);

/** Par exercice : meilleure série (1RM estimé) de chaque séance, dans l'ordre chronologique. */
export function exerciseStats() {
  const map = {};
  Object.values(state.logs)
    .filter(l => l.items)
    .sort((a, b) => a.date < b.date ? -1 : 1)
    .forEach(l => l.items.forEach(it => {
      const done = it.sets.filter(s => s.done && +s.reps > 0);
      if (!done.length || it.rx.fixed) return;
      const best = done.reduce((b, s) => { const v = estimated1RM(+s.kg || 0, +s.reps); return v > b.v ? { v, s } : b; }, { v: -1 });
      (map[it.ex] ||= { name: it.name, pts: [] }).pts.push({
        date: l.date, v: best.v, kg: +best.s.kg || 0, reps: +best.s.reps,
        all: done.map(s => `${s.kg || 0}×${s.reps}`).join(' · '),
      });
    }));
  return map;
}

/** Séances (muscu + cardio) prévues et faites depuis le début, jusqu'à aujourd'hui. */
export function adherence() {
  const t = today();
  let planned = 0, done = 0;
  for (let i = 0; i < PROGRAM_DAYS; i++) {
    const d = addDays(state.settings.start, i);
    if (d > t) break;
    const p = plan(d);
    if (p.kind === 'lift' || p.kind === 'cardio') { planned++; if (isDayDone(d, p)) done++; }
  }
  return { planned, done };
}
