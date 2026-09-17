(() => {
  const links = [...document.querySelectorAll('.cv-nav a[href^="#"]')];
  const entries = links.map(link => ({
    link,
    section: document.getElementById(link.hash.slice(1)),
  })).filter(entry => entry.section);
  if (!entries.length) return;

  let scheduled = false;
  let navigationTarget = null;
  let navigationTimeout = null;
  function topInset() {
    const navbar = document.getElementById('navbar');
    const navBottom = navbar?.getBoundingClientRect().bottom ?? 0;
    const sectionBar = window.innerWidth <= 850
      ? document.querySelector('.cv-sidebar')?.getBoundingClientRect().height ?? 0
      : 0;
    return navBottom + sectionBar + 18;
  }
  function activeThreshold() {
    const rootPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const sectionMargin = parseFloat(getComputedStyle(entries[0].section).scrollMarginTop) || 0;
    return Math.max(topInset(), rootPadding + sectionMargin) + 12;
  }
  function highlight(active) {
    for (const entry of entries) {
      if (entry === active) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
  }
  function clearNavigation() {
    navigationTarget = null;
    if (navigationTimeout !== null) window.clearTimeout(navigationTimeout);
    navigationTimeout = null;
  }
  function update() {
    if (navigationTarget) {
      if (Math.abs(navigationTarget.section.getBoundingClientRect().top - topInset()) > 4) {
        highlight(navigationTarget);
        scheduled = false;
        return;
      }
      clearNavigation();
    }
    const threshold = activeThreshold();
    let active = entries[0];
    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top <= threshold) active = entry;
      else break;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = entries[entries.length - 1];
    }
    highlight(active);
    scheduled = false;
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('scrollend', () => { clearNavigation(); schedule(); });
  for (const entry of entries) {
    entry.link.addEventListener('click', event => {
      event.preventDefault();
      history.pushState(null, '', entry.link.hash);
      const targetTop = window.scrollY + entry.section.getBoundingClientRect().top - topInset();
      const top = Math.max(0, targetTop);
      clearNavigation();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, top);
        root.style.scrollBehavior = previousBehavior;
        update();
        return;
      }
      navigationTarget = entry;
      highlight(entry);
      window.scrollTo({ top, behavior: 'smooth' });
      navigationTimeout = window.setTimeout(() => { clearNavigation(); schedule(); }, 2000);
    });
  }
  update();
})();
