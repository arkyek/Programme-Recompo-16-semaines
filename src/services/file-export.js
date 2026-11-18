/* Sortie d'un fichier vers l'utilisateur : feuille de partage iOS, sinon téléchargement. */

/**
 * @returns {Promise<'shared'|'downloaded'|'cancelled'|'failed'>}
 */
export async function shareOrDownload(content, filename, mime = 'application/json', title = filename) {
  try {
    const file = new File([content], filename, { type: mime });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title });
      return 'shared';
    }
  } catch (e) {
    if (e?.name === 'AbortError') return 'cancelled';
  }
  try {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return 'downloaded';
  } catch (e) {
    return 'failed';
  }
}
