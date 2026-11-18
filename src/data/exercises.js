/* Catalogue des exercices : fiche (nom, muscles, consignes, genou)
   et coordonnées des deux positions du schéma (début → fin).
   Clés des positions : h tête, s épaules, p bassin, k/k2 genoux, f/f2 pieds, t orteils,
   e/e2 coudes, w/w2 poignets, d haltères, pl disques, pr matériel, single/note : affichage. */

const STAND = { h: [60, 13], s: [60, 24], p: [60, 50], k: [61, 71], f: [60, 91] };
const pose = (a, b) => Object.assign({}, a, b);

export const EXERCISES = {
  squat: {
    n: "Squat goblet sur box", m: "Quadriceps, fessiers, gainage", cues: ["Haltère contre la poitrine, coudes sous l'haltère", "Hanches en arrière, s'asseoir sur la box sans s'affaler, puis remonter", "Genoux dans l'axe des orteils, talons au sol"], knee: "Ménisque opéré : descendre jusqu'aux cuisses parallèles, pas plus bas sous charge lourde. Abaisser la box progressivement.", q: "goblet box squat technique",
    f: [pose(STAND, { e: [66, 36], w: [66, 28], pr: [['r', 34, 74, 16, 18]], d: [[68, 28]] }), { h: [63, 38], s: [57, 47], e: [68, 58], w: [68, 50], p: [44, 72], k: [64, 68], f: [62, 91], pr: [['r', 34, 74, 16, 18]], d: [[70, 50]] }]
  },
  bench: {
    n: "Développé couché haltères", m: "Pectoraux, triceps, épaules", cues: ["Omoplates serrées et basses, pieds au sol", "Descendre les haltères au niveau de la poitrine, coudes à ~45° du corps", "Pousser vers le haut sans claquer les haltères"], q: "développé couché haltères technique",
    f: [{ h: [24, 62], s: [34, 66], p: [64, 66], k: [84, 63], f: [90, 91], e: [34, 51], w: [34, 36], d: [[34, 35]], pr: [['r', 18, 70, 70, 4], ['r', 24, 74, 4, 18], ['r', 78, 74, 4, 18]] }, { h: [24, 62], s: [34, 66], p: [64, 66], k: [84, 63], f: [90, 91], e: [30, 76], w: [34, 60], d: [[34, 59]], pr: [['r', 18, 70, 70, 4], ['r', 24, 74, 4, 18], ['r', 78, 74, 4, 18]] }]
  },
  row: {
    n: "Tirage horizontal assis (poulie)", m: "Dos (grand dorsal, rhomboïdes), biceps", cues: ["Dos droit, poitrine sortie", "Tirer la poignée vers le nombril en serrant les omoplates", "Revenir lentement bras tendus sans arrondir le dos"], q: "tirage horizontal poulie basse technique",
    f: [{ h: [54, 39], s: [50, 47], p: [42, 72], k: [62, 60], f: [82, 68], e: [64, 54], w: [78, 60], pr: [['r', 28, 74, 26, 4], ['r', 38, 78, 4, 14], ['r', 84, 54, 4, 28], ['o', 104, 64, 3], ['c', 78, 60, 104, 64]] }, { h: [43, 37], s: [42, 46], p: [42, 72], k: [62, 60], f: [82, 68], e: [30, 58], w: [46, 62], pr: [['r', 28, 74, 26, 4], ['r', 38, 78, 4, 14], ['r', 84, 54, 4, 28], ['o', 104, 64, 3], ['c', 46, 62, 104, 64]] }]
  },
  glutebridge: {
    n: "Pont fessier au sol", m: "Fessiers, ischio-jambiers", cues: ["Pieds à plat, talons proches des fesses", "Pousser dans les talons, serrer les fessiers en haut 2 s", "Ne pas cambrer : bassin légèrement rétroversé"], q: "pont fessier glute bridge technique",
    f: [{ h: [18, 85], s: [28, 88], p: [52, 88], k: [66, 70], f: [76, 91], e: [38, 90], w: [48, 90] }, { h: [18, 85], s: [28, 87], p: [50, 72], k: [68, 68], f: [76, 91], e: [38, 90], w: [48, 90] }]
  },
  hipthrust: {
    n: "Hip thrust (barre ou machine)", m: "Fessiers, ischio-jambiers", cues: ["Haut du dos sur le banc, barre sur le pli de hanche (avec mousse)", "Monter jusqu'à l'alignement épaules-hanches-genoux, menton rentré", "Tibias verticaux en haut, pause 1 s"], knee: "Très peu de contrainte sur la rotule : exercice prioritaire.", q: "hip thrust technique",
    f: [{ h: [22, 58], s: [30, 62], p: [50, 82], k: [68, 66], f: [74, 91], e: [40, 72], w: [49, 78], pr: [['r', 6, 62, 24, 30], ['L', 38, 78, 62, 78, 2]], pl: [[50, 78, 6]] }, { h: [21, 57], s: [30, 62], p: [54, 63], k: [74, 62], f: [76, 91], e: [42, 66], w: [53, 58], pr: [['r', 6, 62, 24, 30], ['L', 42, 58, 66, 58, 2]], pl: [[54, 58, 6]] }]
  },
  ohp: {
    n: "Développé militaire assis haltères", m: "Épaules, triceps", cues: ["Dossier vertical, abdos serrés, pas de cambrure", "Haltères à hauteur d'oreilles, pousser vers le haut", "Redescendre contrôlé jusqu'au menton"], q: "développé militaire haltères assis technique",
    f: [{ h: [49, 37], s: [48, 46], p: [48, 72], k: [68, 72], f: [70, 91], e: [55, 58], w: [57, 46], d: [[57, 45]], pr: [['r', 40, 74, 26, 4], ['r', 50, 78, 4, 14], ['r', 38, 38, 4, 36]] }, { h: [49, 37], s: [48, 46], p: [48, 72], k: [68, 72], f: [70, 91], e: [56, 32], w: [56, 17], d: [[56, 16]], pr: [['r', 40, 74, 26, 4], ['r', 50, 78, 4, 14], ['r', 38, 38, 4, 36]] }]
  },
  plank: {
    n: "Planche sur avant-bras", m: "Gainage (transverse, grand droit)", cues: ["Coudes sous les épaules", "Corps aligné de la tête aux talons, fessiers serrés", "Respirer normalement ; arrêter si les hanches tombent"], q: "planche gainage technique", single: true,
    f: [{ h: [22, 68], s: [30, 73], e: [30, 90], w: [42, 90], p: [60, 77], k: [80, 83], f: [100, 89] }]
  },
  deadbug: {
    n: "Dead bug", m: "Gainage profond, anti-extension", cues: ["Bas du dos plaqué au sol en permanence", "Étendre lentement un bras et la jambe opposée", "Expirer en étendant, revenir et changer de côté"], q: "dead bug exercice technique",
    f: [{ h: [16, 84], s: [26, 86], p: [54, 86], k: [62, 68], f: [80, 68], e: [28, 72], w: [30, 58] }, { h: [16, 84], s: [26, 86], p: [54, 86], k: [74, 82], f: [96, 85], e: [14, 76], w: [3, 71], k2: [62, 68], f2: [80, 68], e2: [28, 72], w2: [30, 58] }]
  },
  rdl: {
    n: "Soulevé de terre roumain haltères", m: "Ischio-jambiers, fessiers, lombaires", cues: ["Genoux légèrement fléchis et fixes", "Pousser les hanches en arrière, dos plat, haltères le long des cuisses", "Descendre jusqu'à mi-tibia ou l'étirement des ischios, puis remonter en serrant les fessiers"], knee: "Genou quasi immobile : bien toléré.", q: "soulevé de terre roumain haltères technique",
    f: [pose(STAND, { e: [60, 37], w: [60, 50], d: [[60, 52]] }), { h: [78, 29], s: [71, 35], p: [48, 50], k: [56, 71], f: [60, 91], e: [71, 49], w: [71, 62], d: [[71, 64]] }]
  },
  legpress: {
    n: "Presse à cuisses 45°", m: "Quadriceps, fessiers", cues: ["Bas du dos collé au dossier", "Pieds largeur d'épaules, milieu de plateforme", "Descendre jusqu'à ~90° au genou, ne pas verrouiller en haut"], knee: "Pieds plus hauts sur la plateforme = moins de contrainte sur la rotule. Amplitude réduite si besoin.", q: "presse à cuisses 45 technique",
    f: [{ h: [16, 46], s: [22, 54], p: [40, 74], k: [60, 62], f: [78, 48], e: [30, 70], w: [40, 78], pr: [['L', 12, 48, 40, 80, 5], ['L', 48, 88, 102, 36, 2], ['L', 72, 40, 86, 56, 5]] }, { h: [16, 46], s: [22, 54], p: [40, 74], k: [47, 52], f: [64, 62], e: [30, 70], w: [40, 78], pr: [['L', 12, 48, 40, 80, 5], ['L', 48, 88, 102, 36, 2], ['L', 58, 54, 72, 70, 5]] }]
  },
  pulldown: {
    n: "Tirage vertical (lat pulldown)", m: "Grand dorsal, biceps", cues: ["Cuisses bloquées sous les boudins", "Tirer la barre vers le haut de la poitrine, coudes vers les hanches", "Légère inclinaison arrière, pas d'élan"], q: "tirage vertical poulie haute technique",
    f: [{ h: [49, 37], s: [48, 46], p: [48, 72], k: [68, 72], f: [70, 91], e: [52, 30], w: [55, 15], pr: [['r', 38, 74, 26, 4], ['r', 48, 78, 4, 14], ['o', 66, 66, 4], ['L', 44, 15, 66, 15, 3], ['c', 55, 15, 55, -8]] }, { h: [45, 37], s: [46, 46], p: [48, 72], k: [68, 72], f: [70, 91], e: [42, 58], w: [54, 44], pr: [['r', 38, 74, 26, 4], ['r', 48, 78, 4, 14], ['o', 66, 66, 4], ['L', 43, 44, 65, 44, 3], ['c', 55, 44, 55, -8]] }]
  },
  pushup: {
    n: "Pompes inclinées (mains sur banc)", m: "Pectoraux, triceps, gainage", cues: ["Mains un peu plus larges que les épaules", "Corps gainé comme une planche", "Poitrine jusqu'au bord du banc ; baisser la hauteur du support quand 3 × 15 sont faciles"], q: "pompes inclinées technique",
    f: [{ h: [70, 38], s: [62, 44], p: [38, 66], k: [24, 78], f: [10, 91], e: [64, 55], w: [66, 66], pr: [['r', 62, 66, 30, 4], ['r', 64, 70, 4, 22], ['r', 86, 70, 4, 22]] }, { h: [70, 56], s: [62, 60], p: [40, 73], k: [25, 82], f: [10, 91], e: [50, 70], w: [66, 66], pr: [['r', 62, 66, 30, 4], ['r', 64, 70, 4, 22], ['r', 86, 70, 4, 22]] }]
  },
  legcurl: {
    n: "Leg curl assis", m: "Ischio-jambiers", cues: ["Genou aligné avec l'axe de la machine", "Fléchir en 1 s, tenir 1 s, revenir en 2–3 s", "Garder les hanches collées au siège"], knee: "Protège le genou en renforçant les ischios : prioritaire.", q: "leg curl assis machine technique",
    f: [{ h: [35, 31], s: [34, 40], p: [36, 66], k: [60, 66], f: [82, 70], e: [42, 54], w: [52, 62], pr: [['r', 24, 68, 38, 4], ['r', 40, 72, 4, 20], ['r', 24, 34, 4, 34], ['o', 56, 61, 4], ['o', 83, 75, 4]] }, { h: [35, 31], s: [34, 40], p: [36, 66], k: [60, 66], f: [56, 88], e: [42, 54], w: [52, 62], pr: [['r', 24, 68, 38, 4], ['r', 40, 72, 4, 20], ['r', 24, 34, 4, 34], ['o', 56, 61, 4], ['o', 61, 91, 4]] }]
  },
  wallsit: {
    n: "Chaise contre le mur (isométrique)", m: "Quadriceps (sans impact)", cues: ["Dos plaqué au mur, cuisses à l'horizontale (90°)", "Tenir 30–45 s, 3 à 5 fois, 1–2 min de repos", "Poids réparti sur les deux pieds, genoux dans l'axe"], knee: "Renforce le quadriceps sans mouvement ni impact : idéal pour le genou opéré.", q: "chaise contre le mur wall sit technique", single: true,
    f: [{ h: [35, 35], s: [34, 44], p: [36, 70], k: [58, 70], f: [58, 91], e: [44, 56], w: [50, 48], pr: [['r', 24, 0, 5, 92]] }]
  },
  hipabd: {
    n: "Abduction de hanche couché sur le côté", m: "Moyen fessier (stabilité du genou)", cues: ["Allongé sur le côté, corps aligné", "Monter la jambe du dessus à ~30°, orteils vers l'avant", "Descendre lentement, ne pas basculer le bassin en arrière"], knee: "Une hanche solide stabilise le genou et limite les rotations néfastes au ménisque.", q: "side lying hip abduction technique", note: "vue de face",
    f: [{ h: [14, 82], s: [26, 86], p: [56, 86], k: [78, 87], f: [100, 88], e: [18, 90], w: [10, 84], e2: [38, 80], w2: [44, 88] }, { h: [14, 82], s: [26, 86], p: [56, 86], k: [77, 79], f: [98, 72], e: [18, 90], w: [10, 84], e2: [38, 80], w2: [44, 88], k2: [78, 87], f2: [100, 88] }]
  },
  stepup: {
    n: "Step-up sur marche basse", m: "Quadriceps, fessiers, équilibre", cues: ["Marche de 15–20 cm au départ", "Pousser avec le pied posé sur la marche, pas avec celui du sol", "Genou dans l'axe du 2e orteil, descendre lentement"], knee: "Commencer par la jambe gauche. Monter progressivement la marche jusqu'à 30–40 cm.", q: "step up exercice technique",
    f: [{ h: [56, 15], s: [55, 24], p: [52, 50], k: [70, 58], f: [68, 76], k2: [50, 71], f2: [46, 91], e: [55, 38], w: [56, 50], pr: [['r', 60, 76, 32, 16]] }, { h: [66, 5], s: [66, 14], p: [66, 40], k: [67, 58], f: [68, 76], k2: [63, 60], f2: [58, 80], e: [66, 28], w: [67, 40], pr: [['r', 60, 76, 32, 16]] }]
  },
  tke: {
    n: "Extension terminale du genou (élastique)", m: "Vaste médial (quadriceps)", cues: ["Élastique derrière le genou, attaché devant", "Partir genou légèrement fléchi, tendre complètement en serrant la cuisse", "Tenir 2 s en extension"], knee: "Renforce la fin d'extension, souvent déficitaire après une chirurgie du ménisque. Commencer par la gauche.", q: "terminal knee extension band",
    f: [{ h: [55, 13], s: [55, 22], p: [56, 48], k: [64, 70], f: [58, 91], k2: [54, 70], f2: [52, 91], e: [56, 36], w: [57, 48], pr: [['r', 100, 40, 4, 52], ['b', 64, 70, 100, 66]] }, { h: [56, 13], s: [56, 22], p: [57, 48], k: [58, 70], f: [58, 91], k2: [54, 70], f2: [52, 91], e: [57, 36], w: [58, 48], pr: [['r', 100, 40, 4, 52], ['b', 58, 70, 100, 66]] }]
  },
  dbrow: {
    n: "Rowing haltère unilatéral", m: "Dos, biceps", cues: ["Une main et un genou sur le banc, dos plat", "Tirer l'haltère vers la hanche, coude près du corps", "Descendre bras tendu en étirant le dos"], q: "rowing haltère unilatéral technique",
    f: [{ h: [42, 46], s: [52, 48], p: [82, 48], k: [76, 70], f: [74, 91], k2: [84, 66], f2: [100, 66], e2: [52, 57], w2: [52, 66], e: [54, 62], w: [54, 76], d: [[54, 78]], pr: [['r', 40, 66, 62, 4], ['r', 44, 70, 4, 22], ['r', 96, 70, 4, 22]] }, { h: [42, 46], s: [52, 48], p: [82, 48], k: [76, 70], f: [74, 91], k2: [84, 66], f2: [100, 66], e2: [52, 57], w2: [52, 66], e: [67, 39], w: [60, 54], d: [[60, 56]], pr: [['r', 40, 66, 62, 4], ['r', 44, 70, 4, 22], ['r', 96, 70, 4, 22]] }]
  },
  latraise: {
    n: "Élévations latérales", m: "Deltoïde moyen (largeur d'épaules)", cues: ["Légère flexion des coudes", "Monter les haltères sur les côtés jusqu'à l'horizontale", "Charge légère, aucun élan, descente en 2 s"], q: "élévations latérales haltères technique", note: "vue de face",
    f: [{ h: [60, 12], s: [60, 23], p: [60, 50], k: [55, 71], f: [54, 91], k2: [65, 71], f2: [66, 91], e: [53, 36], w: [51, 48], e2: [67, 36], w2: [69, 48], d: [[51, 50], [69, 50]] }, { h: [60, 12], s: [60, 23], p: [60, 50], k: [55, 71], f: [54, 91], k2: [65, 71], f2: [66, 91], e: [46, 25], w: [33, 26], e2: [74, 25], w2: [87, 26], d: [[33, 26], [87, 26]] }]
  },
  curl: {
    n: "Curl haltères (ou marteau)", m: "Biceps, brachial", cues: ["Coudes collés au corps et immobiles", "Monter sans balancer le buste", "Descendre complètement en 2 s ; version marteau : paumes face à face"], q: "curl biceps haltères technique",
    f: [pose(STAND, { e: [61, 37], w: [62, 51], d: [[62, 53]] }), pose(STAND, { e: [61, 37], w: [69, 27], d: [[70, 27]] })]
  },
  pushdown: {
    n: "Extension triceps à la poulie", m: "Triceps", cues: ["Coudes collés au corps, fixes", "Tendre complètement les bras vers le bas", "Remonter jusqu'à ~90° seulement"], q: "extension triceps poulie haute corde technique",
    f: [{ h: [64, 16], s: [62, 25], p: [58, 50], k: [59, 71], f: [58, 91], e: [62, 38], w: [72, 32], pr: [['o', 82, -4, 3], ['c', 72, 32, 82, -4]] }, { h: [64, 16], s: [62, 25], p: [58, 50], k: [59, 71], f: [58, 91], e: [62, 38], w: [64, 54], pr: [['o', 82, -4, 3], ['c', 64, 54, 82, -4]] }]
  },
  incline: {
    n: "Développé incliné haltères (30°)", m: "Haut des pectoraux, épaules", cues: ["Banc à 30°, omoplates serrées", "Descendre les haltères au haut de la poitrine", "Pousser vers le haut et légèrement vers l'intérieur"], q: "développé incliné haltères technique",
    f: [{ h: [25, 38], s: [30, 46], p: [44, 70], k: [64, 70], f: [68, 91], e: [33, 33], w: [36, 19], d: [[36, 18]], pr: [['L', 24, 42, 42, 72, 5], ['r', 38, 72, 26, 4], ['r', 48, 76, 4, 16]] }, { h: [25, 38], s: [30, 46], p: [44, 70], k: [64, 70], f: [68, 91], e: [20, 57], w: [28, 45], d: [[28, 44]], pr: [['L', 24, 42, 42, 72, 5], ['r', 38, 72, 26, 4], ['r', 48, 76, 4, 16]] }]
  },
  facepull: {
    n: "Face pull (poulie, corde)", m: "Arrière d'épaule, coiffe des rotateurs", cues: ["Poulie à hauteur de visage", "Tirer la corde vers le front en écartant les mains", "Coudes hauts, serrer les omoplates 1 s"], q: "face pull corde technique",
    f: [pose(STAND, { h: [57, 15], s: [56, 24], p: [56, 50], k: [57, 71], f: [56, 91], e: [70, 24], w: [84, 22], pr: [['o', 106, 22, 3], ['c', 84, 22, 106, 22]] }), pose(STAND, { h: [56, 15], s: [56, 24], p: [56, 50], k: [57, 71], f: [56, 91], e: [46, 22], w: [62, 16], pr: [['o', 106, 22, 3], ['c', 62, 16, 106, 22]] })]
  },
  legext: {
    n: "Leg extension (amplitude contrôlée)", m: "Quadriceps", cues: ["Dos contre le dossier, genou aligné avec l'axe", "Tendre la jambe, tenir 1 s, redescendre en 3 s", "Charges modérées, 12–15 reps"], knee: "Faible contrainte pour le ménisque : amplitude complète, charge modérée. Possible en unilatéral pour vérifier l'équilibre gauche/droite.", q: "leg extension machine technique",
    f: [{ h: [35, 31], s: [34, 40], p: [36, 66], k: [60, 66], f: [58, 88], e: [42, 54], w: [50, 64], pr: [['r', 24, 68, 38, 4], ['r', 40, 72, 4, 20], ['r', 24, 34, 4, 34], ['o', 63, 88, 4]] }, { h: [35, 31], s: [34, 40], p: [36, 66], k: [60, 66], f: [82, 62], e: [42, 54], w: [50, 64], pr: [['r', 24, 68, 38, 4], ['r', 40, 72, 4, 20], ['r', 24, 34, 4, 34], ['o', 83, 57, 4]] }]
  },
  calf: {
    n: "Mollets debout", m: "Mollets (gastrocnémiens)", cues: ["Monter sur la pointe des pieds le plus haut possible", "Tenir 1 s en haut", "Descendre lentement, étirement en bas (sur une marche si possible)"], q: "mollets debout machine technique",
    f: [{ h: [60, 13], s: [60, 24], p: [60, 50], k: [60, 71], f: [58, 88], t: [66, 91], e: [60, 37], w: [60, 50] }, { h: [60, 6], s: [60, 17], p: [60, 43], k: [60, 64], f: [60, 82], t: [66, 91], e: [60, 30], w: [60, 43] }]
  },
  sideplank: {
    n: "Planche latérale", m: "Obliques, moyen fessier", cues: ["Coude sous l'épaule, corps aligné", "Hanches hautes, ne pas tourner le buste", "Version facile : genoux au sol"], q: "planche latérale technique", note: "vue de face", single: true,
    f: [{ h: [25, 58], s: [34, 64], e: [34, 88], w: [44, 90], p: [64, 75], k: [84, 82], f: [104, 89], e2: [48, 63], w2: [62, 72] }]
  },
  abductor: {
    n: "Machine à abducteurs", m: "Moyen fessier", cues: ["Dos contre le dossier", "Écarter les genoux, tenir 1 s", "Revenir lentement sans laisser claquer les poids"], q: "machine abducteurs technique", note: "vue de face",
    f: [{ h: [60, 26], s: [60, 37], p: [60, 62], k: [52, 74], f: [50, 91], k2: [68, 74], f2: [70, 91], e: [50, 48], w: [47, 60], e2: [70, 48], w2: [73, 60], pr: [['r', 52, 22, 16, 40], ['r', 42, 62, 36, 4], ['o', 49, 73, 3], ['o', 71, 73, 3]] }, { h: [60, 26], s: [60, 37], p: [60, 62], k: [42, 72], f: [42, 90], k2: [78, 72], f2: [78, 90], e: [50, 48], w: [47, 60], e2: [70, 48], w2: [73, 60], pr: [['r', 52, 22, 16, 40], ['r', 42, 62, 36, 4], ['o', 39, 71, 3], ['o', 81, 71, 3]] }]
  },
  seatcalf: {
    n: "Mollets assis", m: "Soléaire", cues: ["Coussin sur le bas des cuisses", "Monter les talons au maximum, tenir 1 s", "Descendre lentement en étirement"], q: "mollets assis machine technique",
    f: [{ h: [35, 29], s: [34, 38], p: [36, 64], k: [60, 64], f: [60, 86], t: [68, 90], e: [44, 52], w: [56, 58], pr: [['r', 22, 66, 30, 4], ['r', 34, 70, 4, 22], ['r', 52, 58, 16, 4]] }, { h: [35, 26], s: [34, 35], p: [36, 62], k: [60, 58], f: [61, 80], t: [68, 90], e: [44, 49], w: [56, 53], pr: [['r', 22, 66, 30, 4], ['r', 34, 70, 4, 22], ['r', 52, 52, 16, 4]] }]
  },
  cablecrunch: {
    n: "Crunch à la poulie haute", m: "Grand droit de l'abdomen", cues: ["À genoux, corde tenue près du front", "Enrouler la colonne en rapprochant les côtes du bassin", "Les hanches ne bougent pas, expirer en descendant"], q: "crunch poulie haute corde technique",
    f: [{ h: [64, 30], s: [60, 38], p: [56, 64], k: [56, 90], f: [34, 90], e: [68, 40], w: [66, 32], pr: [['o', 72, -4, 3], ['c', 66, 32, 72, -4]] }, { h: [80, 58], s: [74, 52], p: [54, 64], k: [56, 90], f: [34, 90], e: [80, 62], w: [78, 54], pr: [['o', 72, -4, 3], ['c', 78, 54, 72, -4]] }]
  },
  lunge: {
    n: "Fente arrière haltères", m: "Quadriceps, fessiers", cues: ["Grand pas en arrière, buste droit", "Descendre jusqu'à ce que le genou arrière frôle le sol", "Pousser dans le talon avant pour revenir"], knee: "Commencer par la jambe gauche. La fente arrière est plus douce pour le genou que la fente avant.", q: "fente arrière haltères technique",
    f: [pose(STAND, { k2: [59, 71], f2: [60, 91], e: [60, 37], w: [60, 50], d: [[60, 52]] }), { h: [54, 29], s: [53, 38], p: [52, 64], k: [72, 66], f: [72, 91], k2: [46, 86], f2: [26, 90], e: [53, 52], w: [53, 64], d: [[53, 66]] }]
  }
};
