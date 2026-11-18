/* Consignes techniques d'un exercice (partagées entre la séance et le guide). */
import { esc } from '../../core/dom.js';

export const videoUrl = x => x.q ? 'https://www.youtube.com/results?search_query=' + encodeURIComponent(x.q) : null;

/** Liste des consignes, note genou et lien vers des démos vidéo. */
export function exerciseCues(x) {
  const url = videoUrl(x);
  return `<ul>${(x.cues || []).map(c => `<li>${esc(c)}</li>`).join('')}</ul>`
    + (x.knee ? `<div class="kn"><b>Genou :</b> ${esc(x.knee)}</div>` : '')
    + (url ? `<a href="${url}" target="_blank" rel="noopener">Voir des démos vidéo ↗</a>` : '');
}
