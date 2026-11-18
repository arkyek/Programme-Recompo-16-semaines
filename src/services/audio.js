/* Bips et vibrations (minuteurs). iOS exige un geste utilisateur pour activer l'audio. */
let ctx;
const audioContext = () => (ctx ||= new (window.AudioContext || window.webkitAudioContext)());

export function beep(count = 2) {
  try {
    const a = audioContext();
    for (let i = 0; i < count; i++) {
      const osc = a.createOscillator(), gain = a.createGain();
      osc.frequency.value = 880;
      osc.connect(gain); gain.connect(a.destination);
      const t = a.currentTime + i * 0.25;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t); osc.stop(t + 0.21);
    }
  } catch (e) { /* audio indisponible */ }
  try { navigator.vibrate?.([200, 100, 200]); } catch (e) { /* vibration indisponible */ }
}

/** Débloque l'audio au premier toucher (contrainte iOS Safari). */
export function unlockAudioOnTouch() {
  document.addEventListener('touchstart', () => {
    try { const a = audioContext(); if (a.state === 'suspended') a.resume(); } catch (e) { /* ignoré */ }
  }, { passive: true });
}
