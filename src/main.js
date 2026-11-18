/* Recompo 16 — point d'entrée.
   Toutes les données restent sur le téléphone (localStorage), sauvegarde/restauration en JSON.

   Organisation :
     core/     utilitaires sans dépendance (DOM, dates, formats)
     config/   paramètres du programme et conseils
     data/     catalogue des exercices        content/  texte du guide
     state/    stockage des données utilisateur
     domain/   règles métier (planning, prescription, progression, statistiques)
     services/ API du navigateur (audio, écran, fichiers, PWA)
     ui/       routeur, éléments d'interface et composants réutilisables
     views/    un dossier ou fichier par onglet */
import { onPersistError, persistOnHide } from './state/store.js';
import { registerServiceWorker, requestPersistentStorage } from './services/pwa.js';
import { unlockAudioOnTouch } from './services/audio.js';
import { initRouter, registerViews, render } from './ui/router.js';
import { toast } from './ui/shell.js';
import { initRestTimer } from './ui/rest-timer.js';
import { todayView } from './views/today/today.view.js';
import { calendarView } from './views/calendar.view.js';
import { sessionView } from './views/session/session.view.js';
import { progressView } from './views/progress/progress.view.js';
import { guideView } from './views/guide.view.js';
import { settingsView } from './views/settings/settings.view.js';

onPersistError(() => toast('Sauvegarde impossible : stockage plein ou bloqué'));
persistOnHide();

registerViews({
  today: todayView,
  cal: calendarView,
  session: sessionView,
  progress: progressView,
  guide: guideView,
  settings: settingsView,
});
initRouter();
initRestTimer();
unlockAudioOnTouch();

requestPersistentStorage();
registerServiceWorker();

render();
