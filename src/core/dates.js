/* Dates au format local « AAAA-MM-JJ » (pas de fuseau, pas d'heure). */

export const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const JOURS_COURTS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const DAY_MS = 864e5;

export const pad = n => String(n).padStart(2, '0');
export const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
export const today = () => ymd(new Date());
/** Jour de la semaine, lundi = 0 … dimanche = 6. */
export const weekday = s => (parse(s).getDay() + 6) % 7;
export const mondayOf = s => addDays(s, -weekday(s));

export const fmtDate = s => { const d = parse(s); return `${JOURS[weekday(s)]} ${d.getDate()} ${MOIS[d.getMonth()]}`; };
export const fmtShort = s => { const d = parse(s); return `${d.getDate()} ${MOIS[d.getMonth()]}`; };
