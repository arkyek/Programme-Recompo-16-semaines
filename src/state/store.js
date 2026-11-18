/* Source unique des données utilisateur, persistées dans localStorage.

   Forme de l'état :
   {
     v: 1,
     settings: { start: 'AAAA-MM-JJ' (lundi S1), slot: 'soir' | 'midi' },
     days:     { [date]: { checks, water, steps, sleep, weight, note, extra[], override } },
     logs:     { ['date|séance' | 'date|cardio']: journal de séance },
     measures: [ { date, weight, waist, hr, bike, stepL, stepR } ]
   }

   `state` est un binding ES « vivant » : après replaceState(), les modules qui
   l'importent voient automatiquement le nouvel objet. */
import { today, mondayOf, addDays } from '../core/dates.js';

const STORAGE_KEY = 'recompo.v1';
const SCHEMA_VERSION = 1;
const SAVE_DELAY_MS = 200;

/** Prochain lundi (ou aujourd'hui si on est lundi). */
function defaultStart() {
  const t = today(), m = mondayOf(t);
  return m === t ? t : addDays(m, 7);
}

export function createEmptyState() {
  return { v: SCHEMA_VERSION, settings: { start: defaultStart(), slot: 'soir' }, days: {}, logs: {}, measures: [] };
}

function normalize(v) {
  v.days ||= {};
  v.logs ||= {};
  v.measures ||= [];
  v.settings.slot ||= 'soir';
  return v;
}

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (v && v.settings) return normalize(v);
  } catch (e) { /* données illisibles : on repart de zéro */ }
  return createEmptyState();
}

export let state = load();

let onError = () => { };
/** Callback appelé si l'écriture échoue (stockage plein ou bloqué). */
export function onPersistError(fn) { onError = fn; }

export function persistNow() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    onError(e);
    return false;
  }
}

let saveTimer;
/** Sauvegarde différée (regroupe les saisies rapides). */
export function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistNow, SAVE_DELAY_MS);
}

export function replaceState(next) {
  state = normalize(next);
  persistNow();
}

export function resetState() {
  replaceState(createEmptyState());
}

/** Entrée du jour (créée si absente). */
export const dayEntry = date => (state.days[date] ||= {});

/** Valide et convertit le contenu d'un fichier de sauvegarde. Lève une erreur si invalide. */
export function parseBackup(text) {
  const v = JSON.parse(text);
  if (!v || !v.settings || !v.logs) throw new Error('Sauvegarde invalide');
  return normalize(v);
}

export const serialize = () => JSON.stringify(state, null, 1);

/** Écrit immédiatement quand l'app passe en arrière-plan (iOS peut la fermer sans prévenir). */
export function persistOnHide() {
  addEventListener('pagehide', persistNow);
  document.addEventListener('visibilitychange', () => { if (document.hidden) persistNow(); });
}
