/* Progressive enhancement: every section stays visible without JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;
  const updateHeader = () => {
    document.documentElement.classList.toggle('is-scrolled', window.scrollY > 16);
    ticking = false;
  };
  updateHeader();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion.matches) entry.target.classList.add('keynote-enter');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.home-section, .research-row, .cv-section, .project-facts, .publication-feature').forEach(section => {
    if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
  });
});
