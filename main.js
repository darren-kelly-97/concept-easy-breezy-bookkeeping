document.documentElement.classList.add('js');

document.querySelectorAll('[data-compare]').forEach((comparison) => {
  const panels = Array.from(comparison.querySelectorAll('[data-scope]'));
  const buttons = Array.from(comparison.querySelectorAll('[data-show-scope]'));
  const spread = comparison.querySelector('.comparison-spread');
  const mobile = window.matchMedia('(max-width: 700px)');
  let selected = mobile.matches ? 'basic' : 'both';

  function updateComparison() {
    panels.forEach((panel) => {
      panel.hidden = selected !== 'both' && panel.dataset.scope !== selected;
    });

    spread.classList.toggle('is-single', selected !== 'both');

    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.showScope === selected));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      selected = button.dataset.showScope;
      updateComparison();
    });
  });

  mobile.addEventListener('change', () => {
    selected = mobile.matches ? 'basic' : 'both';
    updateComparison();
  });

  updateComparison();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    spread.classList.add('is-aligned');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      spread.classList.add('is-aligned');
      observer.disconnect();
    }
  }, { threshold: 0.12 });

  observer.observe(spread);
});

document.querySelectorAll('form[data-mailto]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const fields = Array.from(form.elements).filter((field) =>
      field.name && field.value && !['submit', 'button'].includes(field.type)
    );
    const lines = fields.map((field) => {
      const label = field.dataset.label || field.labels?.[0]?.textContent.trim() || field.name;
      return `${label.replace(/\s*\*$/, '')}: ${field.value.trim()}`;
    });
    const subject = form.dataset.subject || 'Free consultation request';
    const recipient = form.dataset.mailto;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n\r\n'))}`;
  });
});