/* Schémas SVG « bonhomme bâton » des exercices (positions de début et de fin). */
import { EXERCISES } from '../../data/exercises.js';

const line = (a, b, cls) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}"/>`;

/** Matériel : r rectangle, L barre, c câble, b élastique, o poulie. */
function prop(p) {
  const [type] = p;
  if (type === 'r') return `<rect x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="1.5" class="eqr"/>`;
  if (type === 'L') return `<line x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}" class="eql" stroke-width="${p[5] || 3}"/>`;
  if (type === 'c') return `<line x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}" class="cab"/>`;
  if (type === 'b') return `<line x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}" class="band"/>`;
  if (type === 'o') return `<circle cx="${p[1]}" cy="${p[2]}" r="${p[3]}" class="pad"/>`;
  return '';
}

/** Dessine une position du corps (voir data/exercises.js pour les clés). */
function frame(P) {
  let s = `<svg viewBox="0 -8 120 104" role="img" aria-hidden="true">`;
  if (!P.ng) s += `<line x1="2" y1="92" x2="118" y2="92" class="gnd"/>`;
  (P.pr || []).forEach(p => { s += prop(p); });
  // membres du côté opposé, en arrière-plan
  if (P.k2) s += line(P.p, P.k2, 'lim2') + line(P.k2, P.f2, 'lim2');
  if (P.e2) s += line(P.s, P.e2, 'lim2') + line(P.e2, P.w2, 'lim2');
  s += line(P.s, P.p, 'lim') + line(P.p, P.k, 'lim') + line(P.k, P.f, 'lim');
  if (P.t) s += line(P.f, P.t, 'lim');
  s += line(P.s, P.h, 'lim') + line(P.s, P.e, 'lim') + line(P.e, P.w, 'lim');
  s += `<circle cx="${P.h[0]}" cy="${P.h[1]}" r="6" class="head"/>`;
  (P.d || []).forEach(d => { s += `<rect x="${d[0] - 6}" y="${d[1] - 2.5}" width="12" height="5" rx="2" class="db"/>`; });
  (P.pl || []).forEach(o => { s += `<circle cx="${o[0]}" cy="${o[1]}" r="${o[2]}" class="db"/>`; });
  return s + `</svg>`;
}

/** Illustration d'un exercice : une position, ou début → fin. */
export function exerciseFigure(id) {
  const x = EXERCISES[id];
  if (!x) return '';
  if (x.single || x.f.length === 1) return `<div class="illu single">${frame(x.f[0])}</div>`;
  return `<div class="illu">${frame(x.f[0])}<span class="arr">→</span>${frame(x.f[1])}</div>`;
}
