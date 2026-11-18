/* Formatage des nombres et des durées (fr-FR). */

export const fmtNum = (n, dec = 0) => (n == null || isNaN(n))
  ? '—'
  : Number(n).toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Durée de repos lisible : 45 s, 2 min, 2 min 30. */
export const restTxt = s => s >= 60 ? (s % 60 ? `${Math.floor(s / 60)} min ${s % 60}` : `${s / 60} min`) : `${s} s`;

/** Lit un nombre saisi (accepte la virgule). Renvoie null si vide ou invalide. */
export function parseNum(value) {
  const n = parseFloat(String(value ?? '').replace(',', '.'));
  return isNaN(n) ? null : n;
}

export const roundTo = (x, step) => Math.round(x / step) * step;
export const clampPct = (value, target) => Math.max(0, Math.min(100, Math.round(value / target * 100)));
