/* Graphiques SVG légers (sans dépendance). */
import { parse, fmtShort, DAY_MS } from '../../core/dates.js';
import { fmtNum } from '../../core/format.js';

const W = 340, H = 140, PAD = { l: 34, r: 10, t: 10, b: 20 };
const SMOOTHING_DAYS = 7;

/**
 * Courbe datée : valeurs saisies (trait fin) + moyenne glissante sur 7 jours (trait épais).
 * @param {Array<[string, number]>} series [date, valeur] triés par date
 */
export function lineChart(series, unit, dec = 1) {
  if (series.length < 2) return `<p class="empty">Au moins 2 valeurs pour afficher la courbe.</p>`;
  const xs = series.map(s => parse(s[0]) / DAY_MS), ys = series.map(s => s[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const yr = (y1 - y0) || 1, ymin = y0 - yr * 0.15, ymax = y1 + yr * 0.15;
  const X = x => PAD.l + (x - x0) / ((x1 - x0) || 1) * (W - PAD.l - PAD.r);
  const Y = y => PAD.t + (1 - (y - ymin) / (ymax - ymin)) * (H - PAD.t - PAD.b);

  const avg = xs.map(t => {
    const win = series.filter((_, j) => xs[j] > t - SMOOTHING_DAYS && xs[j] <= t).map(q => q[1]);
    return [t, win.reduce((a, b) => a + b, 0) / win.length];
  });
  const raw = series.map((s, i) => `${X(xs[i]).toFixed(1)},${Y(s[1]).toFixed(1)}`);
  const smooth = avg.map(a => `${X(a[0]).toFixed(1)},${Y(a[1]).toFixed(1)}`);
  const last = series[series.length - 1];

  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Courbe ${unit}">
    <line class="ax" x1="${PAD.l}" x2="${W - PAD.r}" y1="${Y(y1)}" y2="${Y(y1)}"/><line class="ax" x1="${PAD.l}" x2="${W - PAD.r}" y1="${Y(y0)}" y2="${Y(y0)}"/>
    <text x="${PAD.l - 4}" y="${Y(y1) + 3}" text-anchor="end">${fmtNum(y1, dec)}</text><text x="${PAD.l - 4}" y="${Y(y0) + 3}" text-anchor="end">${fmtNum(y0, dec)}</text>
    <text x="${PAD.l}" y="${H - 4}">${fmtShort(series[0][0])}</text><text x="${W - PAD.r}" y="${H - 4}" text-anchor="end">${fmtShort(last[0])}</text>
    <polyline class="ln2" points="${raw.join(' ')}"/><polyline class="ln" points="${smooth.join(' ')}"/>
    <circle class="pt" cx="${X(xs[xs.length - 1])}" cy="${Y(last[1])}" r="3.5"/></svg>
    <p class="small muted">Trait fin : valeurs saisies · trait épais : moyenne sur 7 jours · dernière : <b class="num">${fmtNum(last[1], dec)} ${unit}</b></p></div>`;
}

/** Mini-courbe de tendance. @param {Array<{v:number}>} pts */
export function sparkline(pts) {
  if (pts.length < 2) return '<svg class="spark"></svg>';
  const ys = pts.map(p => p.v), y0 = Math.min(...ys), y1 = Math.max(...ys) || 1;
  const P = pts.map((p, i) => `${(2 + i / (pts.length - 1) * 86).toFixed(1)},${(26 - (p.v - y0) / ((y1 - y0) || 1) * 22).toFixed(1)}`);
  return `<svg class="spark chart" viewBox="0 0 90 28"><polyline class="ln" points="${P.join(' ')}"/></svg>`;
}
