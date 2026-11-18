/* Prescription d'un exercice (séries, fourchette de reps, RIR, repos) selon la catégorie et la phase. */

const BY_PHASE = {
  1: (cat, w) => ({ sets: w <= 2 ? 2 : 3, reps: cat === 'iso' ? [12, 15] : [10, 12], rir: '3', rest: cat === 'iso' ? 60 : 90 }),
  2: cat => cat === 'iso'
    ? { sets: 3, reps: [12, 15], rir: '1–2', rest: 60 }
    : { sets: 3, reps: [8, 12], rir: '2', rest: cat === 'main' ? 120 : 90 },
  3: cat => cat === 'main' ? { sets: 4, reps: [6, 10], rir: '1–2', rest: 150 }
    : cat === 'comp' ? { sets: 3, reps: [8, 12], rir: '2', rest: 120 }
      : { sets: 3, reps: [10, 15], rir: '1', rest: 60 },
  4: cat => cat === 'main' ? { sets: 4, reps: [5, 8], rir: '1', rest: 180 }
    : cat === 'comp' ? { sets: 3, reps: [6, 10], rir: '1–2', rest: 120 }
      : { sets: 3, reps: [10, 15], rir: '0–1', rest: 60 },
};

/**
 * @param {string} cat  main | comp | iso | core | knee
 * @param {object} opt  options de la séance (max, sets, txt)
 * @param {object} p    plan du jour (phase, w, deload)
 */
export function prescription(cat, opt = {}, p) {
  if (cat === 'core' || cat === 'knee') {
    return { sets: p.deload ? Math.max(1, Math.ceil(opt.sets / 2)) : opt.sets, txt: opt.txt, fixed: true, rest: cat === 'knee' ? 60 : 45 };
  }
  const r = BY_PHASE[p.phase || 1](cat, p.w || 1);
  if (opt.max) r.sets = Math.min(r.sets, opt.max);
  if (p.deload) { r.sets = Math.ceil(r.sets / 2); r.rir = '3'; r.deload = true; }
  return r;
}
