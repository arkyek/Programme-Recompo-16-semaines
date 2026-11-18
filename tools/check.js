/* Vérifications sans dépendance, à lancer avant chaque mise en ligne : `npm run check`.
   1. Syntaxe de tous les modules JS.
   2. Tous les imports relatifs pointent vers un fichier existant.
   3. La liste de cache du service worker correspond exactement aux fichiers de l'app. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const walk = dir => readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const rel = p => './' + relative(root, p).split('\\').join('/');
let errors = 0;
const fail = msg => { errors++; console.error('✗ ' + msg); };

const scripts = walk(join(root, 'src')).filter(f => f.endsWith('.js'));
for (const file of scripts) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
  catch (e) { fail(`Syntaxe : ${rel(file)}\n${e.stderr}`); }
  const src = readFileSync(file, 'utf8');
  for (const [, spec] of src.matchAll(/(?:import|export)[^'"]*from\s+'(\.[^']+)'/g)) {
    if (!existsSync(resolve(dirname(file), spec))) fail(`Import introuvable dans ${rel(file)} : ${spec}`);
  }
}

// Évalue sw.js sans les gestionnaires d'événements pour récupérer FILES
const sw = readFileSync(join(root, 'sw.js'), 'utf8').replace(/self\.addEventListener[\s\S]*/, '');
const cached = new Function(sw + '; return FILES;')();
const assets = ['src', 'styles', 'assets'].flatMap(d => walk(join(root, d))).map(rel)
  .concat(['./index.html', './manifest.webmanifest']);
for (const f of cached) if (f !== './' && !existsSync(join(root, f))) fail(`sw.js met en cache un fichier absent : ${f}`);
for (const f of assets) if (!cached.includes(f)) fail(`Fichier absent du cache sw.js : ${f}`);

if (errors) { console.error(`\n${errors} problème(s).`); process.exit(1); }
console.log(`✓ ${scripts.length} modules, ${cached.length} fichiers en cache : tout est cohérent.`);
