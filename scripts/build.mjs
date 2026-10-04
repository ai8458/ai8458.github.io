import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const {apps,categories} = JSON.parse(await readFile(path.join(root,'apps.json'),'utf8'));
const names = new Map(categories.map(category => [category.id,category.label]));
const ids = new Set();
for (const app of apps) {
  if (!names.has(app.category) || ids.has(app.id)) throw new Error(`Invalid category or duplicate app: ${app.id}`);
  ids.add(app.id);
  for (const key of ['url','source']) {
    const url = new URL(app[key]);
    if (url.protocol !== 'https:' || !['ai8458.github.io','github.com'].includes(url.hostname)) throw new Error(`Invalid ${key}: ${app.id}`);
  }
  await access(path.join(root, app.image));
}
const arrow = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const cards = apps.map((app,index) => `<article class="app-card" data-category="${escape(app.category)}" data-search="${escape([app.name,app.english,app.description,app.detail,app.keywords].join(' '))}">
  <a class="app-link" href="${escape(app.url)}" data-app="${escape(app.id)}" aria-label="${escape(app.action)}：${escape(app.name)}">
    <div class="card-preview ${escape(app.id)}"><img src="${escape(app.image)}" alt="${escape(app.imageAlt)}" width="800" height="500" loading="eager" decoding="async"><span class="category-label">${escape(names.get(app.category))}</span>${app.badge ? `<span class="new-badge"><i></i>${escape(app.badge)}</span>` : ''}<span class="preview-arrow">${arrow}</span></div>
    <div class="card-body"><span class="card-kicker">${escape(app.english)}</span><h3>${escape(app.name)}</h3><p>${escape(app.description)}</p><div class="card-footer"><span>${escape(app.detail)}</span><span class="card-action">${escape(app.action)} ${arrow}</span></div></div>
  </a>
  <a class="source-link" href="${escape(app.source)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(app.name)} GitHub 源码（新标签页）" title="查看源码"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/></svg></a>
</article>`).join('\n');
const filters = [{id:'all',label:'全部应用'},...categories].map(category => `<button type="button" class="filter${category.id === 'all' ? ' selected' : ''}" data-filter="${escape(category.id)}" aria-pressed="${category.id === 'all'}">${escape(category.label)}<span>${category.id === 'all' ? apps.length : apps.filter(app => app.category === category.id).length}</span></button>`).join('\n');
const template = await readFile(path.join(root,'index.template.html'),'utf8');
const output = template.replace('<!-- APP_CARDS -->',cards).replace('<!-- FILTERS -->',filters).replaceAll('{{APP_COUNT}}',String(apps.length));
if (process.argv.includes('--check')) {
  if (await readFile(path.join(root,'index.html'),'utf8') !== output) throw new Error('index.html is stale. Run npm run build.');
  console.log(`${apps.length} apps: catalog, assets and generated HTML verified.`);
} else {
  await writeFile(path.join(root,'index.html'),output);
  console.log(`Built index.html with ${apps.length} apps.`);
}
