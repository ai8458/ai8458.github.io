(() => {
  const items = [...document.querySelectorAll('.app-item')];
  const groups = [...document.querySelectorAll('.app-group')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.getElementById('search');
  const clear = document.getElementById('clear-search');
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase('zh-CN').trim();
  let category = 'all';

  function update() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const item of items) {
      const matches = (category === 'all' || item.dataset.category === category)
        && words.every(word => normalize(item.dataset.search).includes(word));
      item.hidden = !matches;
      if (matches) visible++;
    }
    for (const group of groups) group.hidden = ![...group.querySelectorAll('.app-item')].some(item => !item.hidden);
    for (const filter of filters) {
      const selected = filter.dataset.filter === category;
      filter.classList.toggle('selected', selected);
      filter.setAttribute('aria-pressed', String(selected));
    }
    document.getElementById('results-count').textContent = visible + ' 项';
    document.getElementById('empty-state').hidden = visible > 0;
    clear.hidden = search.value.length === 0;
  }

  filters.forEach(filter => filter.addEventListener('click', () => { category = filter.dataset.filter; update(); }));
  search.addEventListener('input', update);
  search.addEventListener('keydown', event => { if (event.key === 'Escape') { search.value = ''; update(); } });
  clear.addEventListener('click', () => { search.value = ''; update(); search.focus(); });
  document.getElementById('reset-filters').addEventListener('click', () => { category = 'all'; search.value = ''; update(); search.focus(); });
  document.querySelectorAll('[data-interactive]').forEach(element => { element.hidden = false; });
  update();
})();
