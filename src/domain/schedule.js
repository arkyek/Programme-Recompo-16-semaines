/* Calendrier du programme : quelle activité, quel jour, dans quelle phase. */
import { state } from '../state/store.js';
import { parse, weekday, fmtShort, DAY_MS } from '../core/dates.js';
import { PHASES, SESSIONS, PROGRAM_WEEKS, DELOAD_WEEKS } from '../config/program.js';

/** Position d'une date dans le programme : semaine (1–16, 0 avant), phase (1–4, 0 hors programme). */
export function weekInfo(date) {
  const i = Math.round((parse(date) - parse(state.settings.start)) / DAY_MS);
  const w = i < 0 ? 0 : Math.floor(i / 7) + 1;
  const phase = w >= 1 && w <= PROGRAM_WEEKS ? Math.ceil(w / 4) : 0;
  return { i, w, wd: weekday(date), phase, deload: DELOAD_WEEKS.includes(w) };
}

/** Activité prévue par le programme (sans tenir compte d'un éventuel déplacement). */
export function basePlan(date) {
  const { w, wd, phase } = weekInfo(date);
  if (!phase) return { kind: 'free' };
  if (phase === 1) {
    // Full body lun/mer/ven, alternance A-B-A puis B-A-B
    if ([0, 2, 4].includes(wd)) {
      const seq = w % 2 ? ['fba', 'fbb', 'fba'] : ['fbb', 'fba', 'fbb'];
      return { kind: 'lift', sid: seq[[0, 2, 4].indexOf(wd)] };
    }
    if (wd === 1) return { kind: 'cardio', cid: 'z2' };
    if (wd === 5) return { kind: 'cardio', cid: 'z2', pool: true };
    if (wd === 3) return { kind: 'active' };
    return { kind: 'rest' };
  }
  // Phases 2–4 : haut / bas sur 4 jours
  const split = { 0: 'ua', 1: 'la', 3: 'ub', 4: 'lb' };
  if (split[wd]) return { kind: 'lift', sid: split[wd] };
  if (wd === 2) return { kind: 'cardio', cid: 'z2' };
  if (wd === 5) return { kind: 'cardio', cid: w >= 6 ? 'int' : 'z2' };
  return { kind: 'rest' };
}

function overridePlan(code) {
  if (SESSIONS[code]) return { kind: 'lift', sid: code };
  if (code === 'z2' || code === 'int') return { kind: 'cardio', cid: code };
  return { kind: code };
}

export function kindLabel(p) {
  if (p.kind === 'lift') return SESSIONS[p.sid].t;
  if (p.kind === 'cardio') return p.cid === 'int' ? 'Intervalles vélo' : 'Cardio zone 2' + (p.pool ? ' · piscine' : '');
  if (p.kind === 'active') return 'Repos actif';
  if (p.kind === 'rest') return 'Repos';
  return p.w < 1 ? 'Avant le programme' : 'Programme terminé';
}

function shortLabel(p) {
  if (p.kind === 'lift') return SESSIONS[p.sid].short;
  if (p.kind === 'cardio') return p.cid === 'int' ? 'Interv.' : 'Z2';
  if (p.kind === 'active') return 'Actif';
  if (p.kind === 'rest') return 'Repos';
  return '';
}

/** Activité effective du jour : programme + déplacement éventuel + infos de semaine et libellés. */
export function plan(date) {
  const override = state.days[date]?.override;
  const p = Object.assign({}, override ? overridePlan(override) : basePlan(date), weekInfo(date), { date, moved: !!override });
  p.label = kindLabel(p);
  p.short = shortLabel(p);
  p.nut = p.kind === 'lift' ? 'lift' : 'rest';
  return p;
}

/** Ligne « Semaine X · Phase Y » affichée en en-tête. */
export function phaseLine(p) {
  if (!p.phase) return p.w < 1 ? `Début le ${fmtShort(state.settings.start)}` : 'Programme terminé · bravo';
  return `Semaine ${p.w} · Phase ${p.phase} ${PHASES[p.phase]}${p.deload ? ' · décharge' : ''}`;
}

/* ---------- Cardio et activité quotidienne ---------- */

export const zone2Minutes = w => w <= 2 ? 20 : w <= 5 ? 30 : w <= 8 ? 35 : 40;
export const stepGoal = w => w <= 2 ? 7000 : w <= 4 ? 8000 : w === 5 ? 8500 : w <= 8 ? 9000 : 10000;

export function intervalsFor(p) {
  const short = { n: 6, on: 60, off: 120, label: '6 × (1 min fort / 2 min facile)' };
  if (p.w < 6) return { ...short, early: true };
  const base = p.w <= 8 ? short : { n: 4, on: 240, off: 180, label: '4 × (4 min à 158–177 bpm / 3 min facile)' };
  if (p.deload) {
    const n = Math.ceil(base.n * 0.6);
    return { ...base, n, label: base.label.replace(/^\d+/, n) + ' · décharge' };
  }
  return base;
}
