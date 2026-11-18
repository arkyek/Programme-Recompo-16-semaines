/* Paramètres du programme : phases, séances, progression de charge, cibles nutritionnelles. */

export const PROGRAM_WEEKS = 16;
export const PROGRAM_DAYS = PROGRAM_WEEKS * 7;
export const DELOAD_WEEKS = [8, 16];

export const PHASES = { 1: 'Fondations', 2: 'Construction', 3: 'Progression', 4: 'Intensification' };

/* Catégories d'exercice : main (polyarticulaire principal), comp (complémentaire),
   iso (isolation), core (gainage), knee (rééducation genou).
   Options : max (séries max), sets/txt (format fixe), note (consigne affichée). */
export const SESSIONS = {
  fba: { t: 'Full body A', short: 'FB A', legs: false, items: [['squat', 'main'], ['bench', 'main'], ['row', 'comp'], ['glutebridge', 'iso'], ['ohp', 'comp', { max: 2 }], ['plank', 'core', { sets: 3, txt: '20–40 s' }], ['wallsit', 'knee', { sets: 4, txt: '30–45 s' }], ['hipabd', 'knee', { sets: 2, txt: '15 / côté' }]] },
  fbb: { t: 'Full body B', short: 'FB B', legs: false, items: [['rdl', 'main'], ['legpress', 'main'], ['pulldown', 'comp'], ['pushup', 'comp'], ['legcurl', 'iso', { max: 2 }], ['deadbug', 'core', { sets: 3, txt: '6 / côté' }], ['stepup', 'knee', { sets: 2, txt: '10 / jambe, gauche d\'abord' }], ['tke', 'knee', { sets: 2, txt: '15 / jambe, gauche d\'abord' }]] },
  ua: { t: 'Haut A', short: 'Haut A', items: [['bench', 'main'], ['row', 'main'], ['ohp', 'comp'], ['pulldown', 'comp'], ['latraise', 'iso'], ['curl', 'iso'], ['pushdown', 'iso']] },
  la: { t: 'Bas A', short: 'Bas A', legs: true, items: [['wallsit', 'knee', { sets: 2, txt: '45 s (échauffement)' }], ['squat', 'main'], ['rdl', 'comp'], ['legext', 'iso'], ['legcurl', 'iso'], ['calf', 'iso'], ['sideplank', 'core', { sets: 3, txt: '30 s / côté' }]], after: 'Option : 15 min de vélo en zone 2 après la séance.' },
  ub: { t: 'Haut B', short: 'Haut B', items: [['incline', 'main'], ['pulldown', 'main', { note: 'Prise serrée' }], ['dbrow', 'comp', { note: 'Par bras' }], ['pushup', 'comp', { note: 'Max − 2 reps ; baisser le support quand c\'est facile' }], ['facepull', 'iso'], ['curl', 'iso', { note: 'Version marteau' }], ['pushdown', 'iso']] },
  lb: { t: 'Bas B', short: 'Bas B', legs: true, items: [['hipthrust', 'main'], ['legpress', 'comp'], ['lunge', 'comp', { note: 'Par jambe, gauche d\'abord' }], ['legcurl', 'iso'], ['abductor', 'iso'], ['seatcalf', 'iso'], ['cablecrunch', 'iso']] },
};

/** Incrément de charge (kg) quand le haut de la fourchette est atteint. 0 = progression par variante. */
export const LOAD_INCREMENTS = { squat: 2, bench: 2, ohp: 2, incline: 2, curl: 1, latraise: 1, dbrow: 2, rdl: 2, lunge: 2, legpress: 5, hipthrust: 5, row: 2.5, pulldown: 2.5, legcurl: 2.5, legext: 2.5, pushdown: 2.5, facepull: 2.5, calf: 5, seatcalf: 5, abductor: 5, cablecrunch: 2.5, pushup: 0, glutebridge: 2.5, stepup: 0, tke: 0 };
export const DEFAULT_INCREMENT = 2.5;

/** Cibles quotidiennes, selon jour d'entraînement (lift) ou de repos (rest). */
export const TARGETS = { kcal: { lift: 2430, rest: 2210 }, prot: 170, fat: 75, carbs: { lift: 250, rest: 200 }, water: { lift: 3000, rest: 2500 }, sleep: 7.5 };

/** Aliments proposés en un clic dans « Ajouter un aliment » : [nom, kcal, protéines]. */
export const QUICK_FOODS = [['Whey 30 g', 113, 22], ['2 œufs', 140, 12], ['Skyr 150 g', 95, 16], ['Banane', 105, 1], ['20 g amandes', 120, 4], ['Repas libre', 900, 40]];

export const CARDIO_ACTIVITIES = ['Vélo', 'Elliptique', 'Rameur', 'Natation', 'Marche rapide'];
