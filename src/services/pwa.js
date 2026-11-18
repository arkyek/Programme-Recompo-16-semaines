/* Intégration PWA : service worker (hors ligne) et stockage persistant. */

/** En local, pas de cache : chaque rechargement sert les fichiers modifiés. Ajouter ?sw pour tester le hors-ligne. */
const isLocalDev = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && !new URLSearchParams(location.search).has('sw');

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !isLocalDev) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
}

export function requestPersistentStorage() {
  navigator.storage?.persist?.().catch(() => { });
}

/** @returns {Promise<boolean|null>} null si l'information n'est pas disponible. */
export async function isStoragePersisted() {
  try { return navigator.storage?.persisted ? await navigator.storage.persisted() : null; }
  catch (e) { return null; }
}
