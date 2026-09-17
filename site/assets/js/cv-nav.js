(() => {
  const links = [...document.querySelectorAll('.cv-nav a[href^="#"]')];
  const entries = links.map(link => ({
    link,
    section: document.getElementById(link.hash.slice(1)),
  })).filter(entry => entry.section);
  if (!entries.length) return;

  let scheduled = false;
  function update() {
    const threshold = window.innerWidth <= 850 ? 154 : 122;
    let active = entries[0];
    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top <= threshold) active = entry;
      else break;
    }
    for (const entry of entries) {
      if (entry === active) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
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
  update();
})();
