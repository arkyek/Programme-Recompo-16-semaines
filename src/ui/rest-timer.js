/* Minuteur de repos entre les séries (bandeau flottant). */
import { $, esc } from '../core/dom.js';
import { pad } from '../core/dates.js';
import { beep } from '../services/audio.js';

const EXTRA_SECONDS = 30;
const AUTO_HIDE_AFTER_S = 60;

let rest = null;
let interval;

export function startRest(seconds, label) {
  rest = { end: Date.now() + seconds * 1000, label, rang: false };
  clearInterval(interval);
  interval = setInterval(tick, 250);
  tick();
}

export function stopRest() {
  rest = null;
  clearInterval(interval);
  $('#timer').hidden = true;
}

function tick() {
  const el = $('#timer');
  if (!rest) { el.hidden = true; return; }
  const left = Math.round((rest.end - Date.now()) / 1000);
  if (left <= 0 && !rest.rang) { rest.rang = true; beep(3); }
  if (left < -AUTO_HIDE_AFTER_S) { stopRest(); return; }
  el.hidden = false;
  el.classList.toggle('end', left <= 0);
  const abs = Math.abs(left);
  el.innerHTML = `<div class="in">
    <span class="big">${left < 0 ? '+' : ''}${Math.floor(abs / 60)}:${pad(abs % 60)}</span>
    <span class="lb">${left <= 0 ? '<b>Repos terminé : série suivante</b>' : 'Repos · ' + esc(rest.label)}</span>
    <button data-r="add">+${EXTRA_SECONDS} s</button><button data-r="stop">OK</button></div>`;
}

export function initRestTimer() {
  $('#timer').addEventListener('click', e => {
    const b = e.target.closest('[data-r]');
    if (!b || !rest) return;
    if (b.dataset.r === 'stop') stopRest();
    else { rest.end += EXTRA_SECONDS * 1000; rest.rang = false; tick(); }
  });
}
