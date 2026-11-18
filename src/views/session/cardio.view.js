/* Vue « Cardio » : minuteur guidé (zone 2 ou intervalles) et enregistrement. */
import { $, esc } from '../../core/dom.js';
import { pad, fmtShort } from '../../core/dates.js';
import { CARDIO_ACTIVITIES } from '../../config/program.js';
import { save } from '../../state/store.js';
import { phaseLine, zone2Minutes, intervalsFor } from '../../domain/schedule.js';
import { ensureCardioLog, cardioKey } from '../../domain/training-log.js';
import { beep } from '../../services/audio.js';
import { keepAwake } from '../../services/wake-lock.js';
import { setHeader, toast } from '../../ui/shell.js';

const WARMUP_S = 600, COOLDOWN_S = 300;

/** Minuteur en cours : survit aux changements d'onglet. */
let running = null;
let interval;

/** Étapes du minuteur : [libellé, durée (s), style]. */
function buildPhases(p) {
  const iv = p.cid === 'int' ? intervalsFor(p) : null;
  if (!iv) return [['Zone 2 · 112–130 bpm', zone2Minutes(p.w) * 60, '']];
  const reps = Array.from({ length: iv.n }, (_, i) => [[`Fort ${i + 1}/${iv.n}`, iv.on, 'on'], [`Récupération ${i + 1}/${iv.n}`, iv.off, 'off']]).flat();
  return [['Échauffement facile', WARMUP_S, ''], ...reps, ['Retour au calme', COOLDOWN_S, '']];
}

const totalMinutes = phases => Math.round(phases.reduce((a, b) => a + b[1], 0) / 60);

function currentStep(phases, elapsed) {
  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    if (elapsed < acc + phases[i][1]) return { idx: i, left: Math.ceil(acc + phases[i][1] - elapsed) };
    acc += phases[i][1];
  }
  return null;
}

function draw() {
  if (!running) return;
  const { phases } = running;
  const step = currentStep(phases, (Date.now() - running.t0) / 1000);
  // Les bips continuent même si l'utilisateur a changé d'onglet
  const ph = $('#c-ph'), clk = $('#c-clk'), nx = $('#c-next');
  const visible = ph && $('#view').dataset.cardio === running.key;

  if (!step) {
    if (!running.finished) { running.finished = true; beep(4); if (visible) $('#c-min').value = totalMinutes(phases); }
    if (visible) { ph.textContent = 'Terminé'; ph.className = 'phasebox off'; clk.textContent = '0:00'; nx.textContent = ''; }
    return;
  }
  if (running.idx !== step.idx) { if (running.idx != null) beep(step.idx % 2 ? 2 : 1); running.idx = step.idx; }
  if (!visible) return;
  ph.textContent = phases[step.idx][0];
  ph.className = 'phasebox ' + phases[step.idx][2];
  clk.textContent = `${Math.floor(step.left / 60)}:${pad(step.left % 60)}`;
  nx.textContent = phases[step.idx + 1] ? 'Ensuite : ' + phases[step.idx + 1][0] : 'Dernière phase';
}

function start(key, phases) {
  beep(1);
  running = { key, phases, t0: Date.now(), idx: null };
  clearInterval(interval);
  interval = setInterval(draw, 250);
  keepAwake(true);
  draw();
}

/** Arrête le minuteur et renvoie la durée écoulée (min), ou null s'il ne tournait pas. */
function stop() {
  const minutes = running ? Math.round((Date.now() - running.t0) / 60000) : null;
  running = null;
  clearInterval(interval);
  keepAwake(false);
  return minutes;
}

export function cardioView(p) {
  const key = cardioKey(p.date), lg = ensureCardioLog(p), phases = buildPhases(p);
  const iv = p.cid === 'int' ? intervalsFor(p) : null;
  setHeader({ eyebrow: phaseLine(p) + ' · ' + fmtShort(p.date), title: p.label });

  const view = $('#view');
  view.dataset.cardio = key;
  view.innerHTML = `
    <div class="card hl"><h2>${iv ? esc(iv.label) : zone2Minutes(p.w) + ' min en zone 2'}</h2>
      <p class="muted small">${iv ? 'Fort : 158–177 bpm (3–4 mots maximum). Récupération : pédaler très facilement.' : 'Zone 2 : 112–130 bpm, on peut parler en phrases complètes, respiration par le nez possible.'} ${p.pool ? 'Piscine : crawl ou dos, pas de ciseau de brasse.' : 'Vélo, elliptique ou rameur.'}</p>
      ${iv?.early ? '<div class="warnbox">Intervalles prévus à partir de la semaine 6 : cette semaine, fais plutôt de la zone 2.</div>' : ''}
      <div class="phasebox" id="c-ph">Prêt</div><div class="bigclock" id="c-clk">${totalMinutes(phases)}:00</div><p class="muted small" id="c-next" style="text-align:center"></p>
      <div class="row"><button class="btn grow" data-act="start">Démarrer</button><button class="btn sec" data-act="stop">Arrêter</button></div>
      <p class="muted small">Garde l'app ouverte : un bip marque chaque changement de phase.</p>
    </div>
    <div class="card"><h3>Enregistrer</h3>
      <div class="fgrid">
        <div class="field"><label for="c-min">Durée (min)</label><input id="c-min" type="number" inputmode="numeric" value="${esc(lg.min)}"></div>
        <div class="field"><label for="c-hr">FC moyenne</label><input id="c-hr" type="number" inputmode="numeric" value="${esc(lg.hr)}" placeholder="bpm"></div>
      </div>
      <div class="field"><label for="c-act">Activité</label><select id="c-act">${CARDIO_ACTIVITIES.map(a => `<option ${lg.act === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
      <button class="btn block" data-act="save">${lg.done ? 'Cardio enregistré ✓' : 'Enregistrer le cardio'}</button></div>
    <div class="tip"><b>Après.</b> Jour sans muscu : sauna + zone froide 2–3 min possibles. Le cardio se fait loin de la muscu ou après elle.</div>`;

  if (running?.key === key) draw();

  view.onclick = e => {
    const btn = e.target.closest('[data-act]');
    const act = btn?.dataset.act;
    if (act === 'start') start(key, phases);
    if (act === 'stop') {
      const minutes = stop();
      if (minutes != null) $('#c-min').value = minutes;
      $('#c-ph').textContent = 'Arrêté';
      $('#c-ph').className = 'phasebox';
    }
    if (act === 'save') {
      Object.assign(lg, { min: $('#c-min').value, hr: $('#c-hr').value, act: $('#c-act').value, kind: p.cid, done: true });
      save();
      toast('Cardio enregistré');
      btn.textContent = 'Cardio enregistré ✓';
    }
  };
}
