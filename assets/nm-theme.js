(() => {
  const stepFor = (track) => {
    const item = track.firstElementChild;
    if (!item) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  };
  const atEnd = (track) => track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

  function initProductSlider(root) {
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

  function initReviews(root) {
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

  function initCalculator(root) {
    const range = root.querySelector('[data-nm-range]');
    if (!range || range.dataset.nmBound) return;
    range.dataset.nmBound = 'true';
    const weightEl = root.querySelector('[data-nm-weight]');
    const lossEl = root.querySelector('[data-nm-loss]');
    const pct = parseFloat(root.dataset.percent) || 20;
    const unit = root.dataset.unit || 'lb.';
    const update = () => {
      const weight = parseInt(range.value, 10);
      const loss = Math.round((weight * pct) / 100);
      weightEl.textContent = `${weight}${unit}`;
      lossEl.textContent = `${loss}${unit}`;
      range.setAttribute('aria-valuetext', `${weight} ${unit}`);
    };
    range.addEventListener('input', update);
    update();
  }

  function init(scope = document) {
    scope.querySelectorAll('[data-nm-products]').forEach(initProductSlider);
    scope.querySelectorAll('[data-nm-reviews]').forEach(initReviews);
    scope.querySelectorAll('[data-nm-calc]').forEach(initCalculator);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();

  document.addEventListener('shopify:section:load', (event) => init(event.target));
})();
