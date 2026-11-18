/* Conseils affichés (un par jour, en rotation). */
import { parse, DAY_MS } from '../core/dates.js';

export const TIPS = [
  'On ne perd pas le ventre avec des abdos : c\'est le déficit global et le cardio qui le font fondre.',
  'Dormir 5 h par nuit pendant une semaine fait chuter la testostérone de 10 à 15 %.',
  'Protéines : environ 170 g par jour, réparties en 4 prises de 35–45 g.',
  'Ne descends pas sous 75 g de lipides par jour : un régime pauvre en graisses fait baisser la testo.',
  'RIR 2 = tu t\'arrêtes quand il te reste 2 répétitions propres en réserve.',
  'Quand toutes les séries atteignent le haut de la fourchette, augmente la charge.',
  'Jamais de bain froid dans les 6 h après la muscu. Les jours de cardio ou de repos : oui.',
  'La balance peut stagner pendant que le tour de taille baisse : c\'est la recomposition.',
  'La créatine fait prendre 1 à 2 kg d\'eau dans le muscle au début. Ce n\'est pas du gras.',
  'Exercices sur une jambe : toujours commencer par la gauche (genou opéré), même nombre de reps à droite.',
  'Pas de café après 17 h : avec un coucher à 1 h, la caféine raccourcirait la nuit.',
  'Ta whey concentrée contient environ 1,5 g de lactose par dose. Si elle ballonne : passer à l\'isolat.',
  'Une pause debout de 2–3 min toutes les heures améliore la glycémie quand on travaille assis.',
  'Le cardio zone 2 se fait en pouvant parler en phrases complètes : 112 à 130 bpm.',
  'Le 4 × 4 min à 85–95 % de la FC max est la méthode la plus efficace pour gagner du souffle.',
  'La nicotine est un stimulant : pas de vape dans les 2 h avant le coucher.',
  'Déficit modéré (−300 à −500 kcal) : assez pour perdre du gras, sans freiner le muscle ni la testo.',
  'Un repas libre par semaine, protéines incluses. Pas de journée de triche entière.',
  'Repos entre séries : 2 min et plus sur les gros mouvements, 60–90 s sur l\'isolation.',
  'Sauna : 500 ml d\'eau par session, jamais avec de l\'alcool.',
  'Les semaines 8 et 16 sont des décharges : moitié moins de séries, charges −10 %. Elles font progresser.',
  'Pas de brasse au début : le ciseau fait travailler le genou en rotation (ménisque).',
  'Marcher 10–15 min après le déjeuner est le geste le plus efficace contre les pics de glycémie.',
  'Si la force baisse 2 séances de suite : vérifie le sommeil et ajoute 30 g de glucides avant la séance.',
  'Lactose : fromages affinés, skyr et lait sans lactose passent en général bien.',
  'Vitamine C en comprimé : inutile (et la tienne est périmée). Les fruits et le collagène suffisent.',
  'La musculation ne fait pas de muscle grâce au pic hormonal : c\'est la progression des charges qui compte.',
  'Les « testosterone boosters » du commerce n\'ont pas de preuve sérieuse : inutile d\'en acheter.',
];

export const tipOfDay = date => TIPS[Math.abs(Math.round(parse(date) / DAY_MS)) % TIPS.length];
