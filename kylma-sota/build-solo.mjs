import { readFile, writeFile } from 'node:fs/promises';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html, css, app, content, cards, game, solo] = await Promise.all([
  read('public/index.html'), read('public/style.css'), read('public/app.js'), read('public/content.js'),
  read('src/cards.js'), read('src/game.js'), read('src/solo.js'),
]);

function section(first, last) {
  const left = app.indexOf(first);
  const right = app.indexOf(last, left);
  if (left < 0 || right < 0) throw new Error(`Source section missing: ${first}`);
  return app.slice(left, right);
}

const ui = (section('function mapRegions(', 'async function play(') + section('function nuclearEnding(', 'function showState('))
  .replace('<p>Huone <b>${view.code}</b> · Pelaat', '<p>Pelaat')
  .replace('Keskustele parisi kanssa', 'Pohdi pelin jälkeen')
  .replace('Palaa aloitukseen</button>', 'Pelaa uudelleen</button>');

const js = [content, cards, game, solo, ui, 'leave();']
  .map(source => source.replace(/^import .+\n/gm, '').replace(/^export /gm, ''))
  .join('\n');
const output = html
  .replace('Kahden pelaajan oppimispeli kylmästä sodasta.', 'Kylmän sodan oppimispelin yksinpelikokeilu.')
  .replace('<link rel="stylesheet" href="/style.css">', () => `<style>\n${css}\n.solo-lobby { max-width: 680px; }\n.solo-lobby .primary { margin-top: .5rem; }\n</style>`)
  .replace(/\s*<script type="module" src="\/app\.js"><\/script>/, '')
  .replace('</body>', () => `<script>\n'use strict';\n${js}\n</script>\n</body>`);

await writeFile(process.argv[2] ?? 'Kylma_sota_kokeilu.html', output, 'utf8');
