/* Journée type, du réveil au coucher : repas, compléments, séance, conseils. */
import { state } from '../state/store.js';
import { parse } from '../core/dates.js';
import { fmtNum } from '../core/format.js';
import { SESSIONS } from '../config/program.js';
import { stepGoal, zone2Minutes, intervalsFor } from './schedule.js';

/** Tri chronologique d'une journée qui se termine après minuit. */
const chronoKey = t => (t < '05:00' ? '2' : '1') + t;

/**
 * @returns {Array<{k, t, title, dt?, meal?, kcal?, prot?, sup?, tip?, action?}>}
 *   k : identifiant stable (sert aux cases cochées), t : heure « HH:MM ».
 */
export function timeline(p) {
  const lift = p.kind === 'lift', midi = state.settings.slot === 'midi', w = p.w;
  const ashwagandha = w >= 1 && w <= 8;
  const month = parse(p.date).getMonth(), vitD = month >= 9 || month <= 3;
  const items = [];
  const add = o => items.push(o);

  add({ k: 'wake', t: '08:30', title: 'Réveil', dt: 'Lumière du jour 10–20 min.' + ([0, 2, 4].includes(p.wd) ? ' Pesée à jeun après les toilettes, à noter ci-dessus.' : ''), tip: 'Même heure de lever chaque jour, week-end compris (± 30 min). C\'est la régularité qui fait la qualité du sommeil.' });
  add({
    k: 'bk', t: '09:00', title: 'Petit-déjeuner', meal: true, kcal: lift ? 736 : 667, prot: lift ? 52 : 61,
    dt: lift ? '70 g flocons d\'avoine + 250 ml lait sans lactose + 30 g whey (après cuisson) + 1 banane · 2 œufs' : '70 g flocons d\'avoine + 250 ml lait sans lactose + 30 g whey (après cuisson) · 2 œufs · pas de banane',
    sup: ['Multivitamines 1 gél.', ...(vitD ? ['Vitamine D3 1 000–2 000 UI'] : []), 'Oméga-3 ½ dose', ...(!lift ? ['Collagène 10–15 g'] : [])],
    tip: 'Café plutôt 1 h après le multivitamines (meilleure absorption du fer et du zinc).'
  });
  add({ k: 'move', t: '10:00', title: 'Pauses actives (toute la journée)', dt: 'Debout 2–3 min toutes les 45–60 min. Objectif du jour : ' + fmtNum(stepGoal(w)) + ' pas.', tip: 'Le métier assis est le plus gros frein du programme. Mets un minuteur sur le téléphone.' });

  if (lift) {
    add({ k: 'pre', t: midi ? '11:30' : '16:45', title: 'Collation pré-séance', meal: true, kcal: 236, prot: 13, dt: '1 pomme · 20 g amandes', sup: ['Collagène 10–15 g', 'Café optionnel (dernier de la journée, avant 17 h)'], tip: 'Le collagène 30–60 min avant la séance nourrit tendons et genoux pendant l\'effort.' });
    add({ k: 'train', t: midi ? '12:15' : '18:00', title: 'Séance · ' + SESSIONS[p.sid].t, action: 'session', dt: 'Échauffement 8 min, puis les exercices dans l\'ordre. Boire 500–750 ml.', tip: 'Note chaque série : c\'est ce qui permet de savoir quand augmenter la charge.' });
    add({ k: 'spa', t: midi ? '13:20' : '19:20', title: 'Sauna (option)', dt: '2–3 passages de 10–15 min, douche tiède entre deux, 500 ml d\'eau.', tip: 'Pas de zone froide aujourd\'hui : dans les 6 h après la muscu, elle freine la prise de muscle.' });
  } else if (p.kind === 'cardio') {
    add({ k: 'train', t: p.w && p.wd >= 5 ? '11:00' : '12:15', title: p.label, action: 'cardio', dt: p.cid === 'int' ? intervalsFor(p).label + ', 10 min d\'échauffement, 5 min retour au calme.' : zone2Minutes(w) + ' min à 112–130 bpm (on peut parler en phrases).' + (p.pool ? ' Crawl ou dos, pas de brasse.' : ''), tip: 'Vélo, elliptique, rameur ou piscine. Pas de course avant la semaine 9.' });
    add({ k: 'spa', t: '19:00', title: 'Spa (option)', dt: 'Sauna 12 min → douche → froid 1–2 min → repos 5 min, × 2–3. Jacuzzi, hammam ou grotte à sel pour la détente.', tip: 'Le froid est permis aujourd\'hui : pas de musculation dans les 6 h.' });
  } else if (p.kind === 'active' || p.kind === 'rest') {
    add({ k: 'walk', t: '12:15', title: p.kind === 'active' ? 'Marche 30–45 min' : 'Marche 45–60 min', dt: 'Allure tranquille, idéalement dehors.', tip: 'Les pas comptent souvent plus que les séances dans la dépense de la journée.' });
  }

  add({
    k: 'lunch', t: lift && midi ? '13:45' : '13:00', title: 'Déjeuner + 10 min de marche', meal: true, kcal: lift ? 695 : 588, prot: lift ? 50 : 49,
    dt: lift ? '180 g poulet (cru) · 80 g riz basmati (cru) · 250 g légumes · 15 g huile d\'olive' : '180 g poulet (cru) · 50 g riz basmati (cru) · 250 g légumes · 15 g huile d\'olive',
    sup: ['Créatine 5 g', 'Oméga-3 ½ dose'], tip: 'La créatine se prend tous les jours, repos compris. L\'heure compte peu, la régularité compte.'
  });
  if (!lift) add({ k: 'pre', t: '16:45', title: 'Collation', meal: true, kcal: 200, prot: 4, dt: '1 pomme · 20 g amandes', sup: ['Café optionnel (dernier de la journée, avant 17 h)'] });
  add({ k: 'dinner', t: '20:00', title: 'Dîner', meal: true, kcal: 620, prot: 39, dt: '150 g saumon (ou 180 g poulet, 160 g bœuf 5 %, 200 g cabillaud, 3 œufs + 150 g blancs) · 250 g pommes de terre · 250 g légumes · 5 g huile d\'olive', tip: 'Saumon 2 fois par semaine maximum, varier les autres jours.' });
  add({ k: 'snack', t: '23:30', title: 'Collation du soir', meal: true, kcal: 140, prot: 17, dt: '150 g skyr nature + 100 g fruits rouges', tip: 'Protéines lentes pour la nuit. Le skyr contient peu de lactose.' });
  add({ k: 'night', t: '00:00', title: 'Routine du coucher', dt: 'Écrans coupés, chambre noire à 17–19 °C.', sup: ['Magnésium 2 gél. (250 mg)', ...(ashwagandha ? ['Ashwagandha 600 mg'] : [])], tip: ashwagandha ? 'Ashwagandha : semaines 1 à 8, puis 4 semaines de pause.' : 'Pause ashwagandha (S9–S12). Si besoin : rhodiola + safran le matin, jamais avec l\'ashwagandha.' });
  add({ k: 'sleep', t: '01:00', title: 'Coucher', dt: 'Objectif 7 h 30 de sommeil.' });

  return items.sort((a, b) => chronoKey(a.t) < chronoKey(b.t) ? -1 : 1);
}

/** Calories et protéines des repas cochés + aliments ajoutés. */
export function mealsTotals(date, p) {
  const d = state.days[date] || {}, checks = d.checks || {};
  let kcal = 0, prot = 0;
  timeline(p).forEach(it => { if (it.meal && checks[it.k]) { kcal += it.kcal; prot += it.prot; } });
  (d.extra || []).forEach(x => { kcal += +x.kcal || 0; prot += +x.prot || 0; });
  return { kcal, prot };
}
