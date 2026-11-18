/* Service worker : met toute l'app en cache pour l'utiliser hors ligne.
   À chaque mise à jour : changer VERSION.
   À chaque fichier ajouté, renommé ou supprimé : mettre à jour la liste ci-dessous
   (un seul fichier manquant fait échouer l'installation hors ligne). */
const VERSION = 'recompo-v2';

const SHELL = ['./', './index.html', './manifest.webmanifest',
  './assets/icons/icon-180.png', './assets/icons/icon-192.png', './assets/icons/icon-512.png'];

const STYLES = [
  'base/tokens', 'base/reset', 'base/motion', 'layout/app-shell',
  'components/blocks', 'components/data', 'components/exercise', 'components/figure',
  'components/forms', 'components/rest-timer', 'components/sheet', 'components/toast',
  'views/calendar', 'views/cardio', 'views/guide', 'views/today',
].map(f => `./styles/${f}.css`);

const SCRIPTS = [
  'main',
  'core/dates', 'core/dom', 'core/format', 'core/icons',
  'config/program', 'config/tips',
  'data/exercises', 'content/guide',
  'state/store',
  'domain/prescription', 'domain/progress', 'domain/schedule', 'domain/timeline', 'domain/training-log',
  'services/audio', 'services/file-export', 'services/pwa', 'services/wake-lock',
  'ui/router', 'ui/shell', 'ui/rest-timer',
  'ui/components/chart', 'ui/components/exercise-info', 'ui/components/figure',
  'views/calendar.view', 'views/guide.view',
  'views/today/today.view', 'views/today/add-food-sheet',
  'views/session/session.view', 'views/session/exercise-card', 'views/session/free-exercise-sheet', 'views/session/cardio.view',
  'views/progress/progress.view', 'views/progress/measure-sheet',
  'views/settings/settings.view', 'views/settings/backup-sheets',
  'views/shared/move-activity-sheet',
].map(f => `./src/${f}.js`);

const FILES = [...SHELL, ...STYLES, ...SCRIPTS];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Cache d'abord (hors ligne), puis mise à jour en arrière-plan quand le réseau répond.
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    return cached || (await net) || cache.match('./index.html');
  }));
});
