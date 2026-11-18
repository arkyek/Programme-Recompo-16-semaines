/* Garde l'écran allumé pendant un minuteur cardio (si le navigateur le permet). */
let lock = null;

export async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) lock = await navigator.wakeLock.request('screen');
    else if (!on && lock) { await lock.release(); lock = null; }
  } catch (e) { /* refusé ou non supporté */ }
}
