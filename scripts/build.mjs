import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const {apps,categories} = JSON.parse(await readFile(path.join(root, 'apps.json'), 'utf8'));
const names = new Map(categories.map(category => [category.id, category.label]));
const ids = new Set();
for (const app of apps) {
  if (!names.has(app.category) || ids.has(app.id)) throw new Error('Invalid category or duplicate app: ' + app.id);
  ids.add(app.id);
  const url = new URL(app.url);
  if (url.protocol !== 'https:' || !['ai8458.github.io', 'github.com'].includes(url.hostname)) throw new Error('Invalid URL: ' + app.id);
}
const groups = categories.map(category => `<section class="app-group" aria-labelledby="group-${escape(category.id)}">
  <h2 id="group-${escape(category.id)}">${escape(category.label)}</h2>
  <ul>${apps.filter(app => app.category === category.id).map(app => `
    <li class="app-item" data-category="${escape(app.category)}" data-search="${escape([app.name, app.english, app.description, app.keywords].join(' '))}">
      <a class="app-link" href="${escape(app.url)}" data-app="${escape(app.id)}"><span class="item-copy"><span class="item-name">${escape(app.name)}</span><span class="item-description">${escape(app.description)}</span></span><span class="open-label" aria-hidden="true">${app.category === 'source' ? '源码' : '打开'} ↗</span></a>
    </li>`).join('')}
  </ul>
</section>`).join('\n');
const filters = [{id:'all', label:'全部'}, ...categories].map(category => `<button type="button" class="filter${category.id === 'all' ? ' selected' : ''}" data-filter="${escape(category.id)}" aria-pressed="${category.id === 'all'}">${escape(category.label)}</button>`).join('\n');
const template = await readFile(path.join(root, 'index.template.html'), 'utf8');
const output = template.replace('<!-- APP_GROUPS -->', groups).replace('<!-- FILTERS -->', filters).replaceAll('{{ITEM_COUNT}}', String(apps.length));
if (process.argv.includes('--check')) {
  if (await readFile(path.join(root, 'index.html'), 'utf8') !== output) throw new Error('index.html is stale. Run npm run build.');
  console.log(apps.length + ' directory entries and generated HTML verified.');
} else {
  await writeFile(path.join(root, 'index.html'), output);
  console.log('Built index.html with ' + apps.length + ' directory entries.');
}
