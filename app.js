(() => {
  const cards = [...document.querySelectorAll('.app-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.getElementById('search');
  const count = document.getElementById('results-count');
  const empty = document.getElementById('empty-state');
  const random = document.getElementById('random-app');
  const clear = document.getElementById('clear-search');
  let category = 'all';

  const normalize = value => value.normalize('NFKC').toLocaleLowerCase('zh-CN').trim();
  function update() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matches = (category === 'all' || card.dataset.category === category) && words.every(word => normalize(card.dataset.search).includes(word));
      card.hidden = !matches;
      if (matches) visible++;
    }
    for (const filter of filters) {
      const selected = filter.dataset.filter === category;
      filter.classList.toggle('selected',selected);
      filter.setAttribute('aria-pressed',String(selected));
    }
    count.textContent = `找到 ${visible} 个小世界`;
    empty.hidden = visible > 0;
    random.disabled = visible === 0;
    clear.hidden = search.value.length === 0;
  }
  for (const filter of filters) filter.addEventListener('click', () => { category = filter.dataset.filter; update(); });
  search.addEventListener('input',update);
  search.addEventListener('keydown',event => { if (event.key === 'Escape') { search.value = ''; update(); } });
  clear.addEventListener('click',() => { search.value = ''; update(); search.focus(); });
  document.getElementById('reset-filters').addEventListener('click',() => { category = 'all'; search.value = ''; update(); search.focus(); });
  random.addEventListener('click', () => {
    const candidates = cards.filter(card => !card.hidden);
    if (!candidates.length) return;
    const card = candidates[Math.floor(Math.random() * candidates.length)];
    window.location.assign(card.querySelector('.app-link').href);
  });
  document.querySelectorAll('[data-interactive]').forEach(element => { element.hidden = false; });
  document.documentElement.classList.add('enhanced');
  update();
})();
