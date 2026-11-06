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
    const prev = root.querySelector('[data-nm-prev]');
    const next = root.querySelector('[data-nm-next]');
    if (!track || !prev || !next || track.dataset.nmBound) return;
    track.dataset.nmBound = 'true';
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = atEnd(track);
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -stepFor(track), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: stepFor(track), behavior: 'smooth' }));
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }

  const initAll = (scope = document) => scope.querySelectorAll('[data-nm-reviews]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
