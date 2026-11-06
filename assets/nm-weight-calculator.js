(() => {
  function init(root) {
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

  const initAll = (scope = document) => scope.querySelectorAll('[data-nm-calc]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initAll());
  else initAll();
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
