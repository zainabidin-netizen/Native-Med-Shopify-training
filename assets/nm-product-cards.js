(() => {
  const stepFor = (track) => {
    const item = track.firstElementChild;
    if (!item) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return item.getBoundingClientRect().width + gap;
  };
  const atEnd = (track) => track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

  function init(root) {
    const track = root.querySelector('[data-nm-track]');
    const next = root.querySelector('[data-nm-next]');
    if (!track || !next || next.dataset.nmBound) return;
    next.dataset.nmBound = 'true';
    const sync = () => {
      next.hidden = track.scrollWidth <= track.clientWidth + 2;
    };
    next.addEventListener('click', () => {
      if (atEnd(track)) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: stepFor(track), behavior: 'smooth' });
    });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }

  const initAll = (scope = document) => scope.querySelectorAll('[data-nm-products]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
