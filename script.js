/* ═══════════════════════════════════════════════
   LEAD COLLEGE — JavaScript
   Handles: sticky header, mega menus, mobile menu,
   carousel, FAQ accordion, scroll reveals,
   sector bar animation
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* Light and dark appearance preference. */
  const themeToggle = document.getElementById('theme-toggle');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('lead-theme'); } catch (_) {}
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.body.dataset.theme = savedTheme;
  }
  function updateThemeToggle() {
    const isLight = document.body.dataset.theme !== 'dark';
    const nextLabel = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle?.setAttribute('aria-label', nextLabel);
    themeToggle?.setAttribute('title', nextLabel);
    themeToggle?.setAttribute('aria-pressed', String(!isLight));
  }
  updateThemeToggle();
  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme;
    try { localStorage.setItem('lead-theme', nextTheme); } catch (_) {}
    updateThemeToggle();
  });

  /* Switch the faculty directory between MBA and MCA profiles. */
  const facultyTabs = Array.from(document.querySelectorAll('[data-faculty-tab]'));
  const facultySelectButtons = Array.from(document.querySelectorAll('[data-faculty-select]'));
  const facultyDirectory = document.getElementById('faculty-directory');
  function selectFacultyProgram(program, options = {}) {
    const selectedTab = facultyTabs.find(tab => tab.dataset.facultyTab === program);
    if (!selectedTab) return;
    facultyTabs.forEach(tab => {
      const active = tab === selectedTab;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    if (options.focus) selectedTab.focus();
    if (options.scroll && facultyDirectory) {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      facultyDirectory.scrollIntoView({ behavior, block: 'start' });
    }
  }
  facultyTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectFacultyProgram(tab.dataset.facultyTab));
    tab.addEventListener('keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % facultyTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + facultyTabs.length) % facultyTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = facultyTabs.length - 1;
      else return;
      event.preventDefault();
      selectFacultyProgram(facultyTabs[nextIndex].dataset.facultyTab, { focus: true });
    });
  });
  facultySelectButtons.forEach(button => button.addEventListener('click', () => {
    selectFacultyProgram(button.dataset.facultySelect, { scroll: true });
  }));

  /* Preview the hero in LEAD navy without changing the page-wide theme. */
  const heroThemeControls = Array.from(document.querySelectorAll('.hero-theme-toggle'));
  const heroThemeSurfaces = Array.from(document.querySelectorAll('.hero-section, .mobile-hero-wrap, .hero-announcement-group, .hero-announcement'));
  let savedHeroTheme = null;
  try { savedHeroTheme = localStorage.getItem('lead-hero-theme'); } catch (_) {}
  let heroTheme = savedHeroTheme === 'light' ? 'light' : 'navy';
  function updateHeroTheme() {
    heroThemeSurfaces.forEach(surface => { surface.dataset.heroTheme = heroTheme; });
    const nextTheme = heroTheme === 'navy' ? 'light' : 'navy';
    const label = `Try ${nextTheme === 'navy' ? 'navy' : 'light'} look`;
    heroThemeControls.forEach(control => {
      control.setAttribute('aria-pressed', String(heroTheme === 'navy'));
      control.setAttribute('aria-label', `Switch hero background to ${nextTheme}`);
      const text = control.querySelector('.hero-theme-toggle-label');
      if (text) text.textContent = label;
    });
  }
  updateHeroTheme();
  heroThemeControls.forEach(control => control.addEventListener('click', () => {
    heroTheme = heroTheme === 'navy' ? 'light' : 'navy';
    try { localStorage.setItem('lead-hero-theme', heroTheme); } catch (_) {}
    updateHeroTheme();
  }));

  /* ════════════════════════════════════
     STICKY HEADER
  ════════════════════════════════════ */
  const header = document.getElementById('main-header');
  const stripH = document.querySelector('.top-strip');

  function alignMegaPanels() {
    if (!header) return;
    const bottom = Math.max(0, header.getBoundingClientRect().bottom);
    header.style.setProperty('--mega-panel-top', `${bottom}px`);
  }
  alignMegaPanels();
  window.addEventListener('resize', alignMegaPanels, { passive: true });
  window.addEventListener('scroll', alignMegaPanels, { passive: true });

  function updateHeader() {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* Sticky home-section navigation for prospective students. */
  const sectionNavLinks = Array.from(document.querySelectorAll('.student-subnav-link'));
  const sectionTargets = sectionNavLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function setActiveSectionNav(targetId) {
    sectionNavLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${targetId}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  sectionNavLinks.forEach(link => link.addEventListener('click', () => {
    setActiveSectionNav(link.getAttribute('href').slice(1));
  }));

  if ('IntersectionObserver' in window && sectionTargets.length) {
    const sectionNavObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSectionNav(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.15, 0.4] });
    sectionTargets.forEach(section => sectionNavObserver.observe(section));
  }


  /* ════════════════════════════════════
     MOBILE HAMBURGER
  ════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavSearch = document.getElementById('mobile-nav-search');
  const mobileSearchEmpty = document.getElementById('mobile-search-empty');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) mobileMenuClose?.focus();
  });
  mobileMenuClose?.addEventListener('click', closeMobileMenu);

  mobileNavSearch?.addEventListener('input', () => {
    const query = mobileNavSearch.value.trim().toLocaleLowerCase();
    const groups = Array.from(mobileMenu.querySelectorAll('.mobile-nav-group'));
    let totalMatches = 0;
    groups.forEach(group => {
      const sections = Array.from(group.querySelectorAll('.mobile-nav-subgroups section'));
      let groupMatches = 0;
      sections.forEach(section => {
        const links = Array.from(section.querySelectorAll('a'));
        let sectionMatches = 0;
        links.forEach(link => {
          const matches = !query || link.textContent.toLocaleLowerCase().includes(query);
          link.hidden = !matches;
          if (matches) sectionMatches += 1;
        });
        section.hidden = Boolean(query) && sectionMatches === 0;
        groupMatches += sectionMatches;
      });
      group.hidden = Boolean(query) && groupMatches === 0;
      if (query) group.open = groupMatches > 0;
      else group.open = false;
      totalMatches += groupMatches;
    });
    if (mobileSearchEmpty) mobileSearchEmpty.hidden = !query || totalMatches > 0;
  });

  // Close on link tap
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));


  /* ════════════════════════════════════
     DESKTOP MEGA MENU
  ════════════════════════════════════ */
  const navItems = document.querySelectorAll('.nav-item.has-dropdown');

  navItems.forEach(item => {
    const btn = item.querySelector('.nav-btn');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      alignMegaPanels();
      const isOpen = item.classList.contains('open');
      navItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.nav-btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    navItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.nav-btn').setAttribute('aria-expanded', 'false');
    });
  });

  // Keep header dark while mega menu open
  navItems.forEach(item => {
    item.addEventListener('click', () => header.classList.add('scrolled'));
  });


  /* ════════════════════════════════════
     CAROUSEL — Internships / Alumni
  ════════════════════════════════════ */
  const slides = Array.from(document.querySelectorAll('.alumni-slide'));
  const dots   = Array.from(document.querySelectorAll('.cdot'));
  let current  = 0;
  let autoTimer;

  function goTo(index) {
    if (!slides.length || !dots.length) return;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function resetAuto() {
    clearInterval(autoTimer);
    if (!slides.length || !dots.length) return;
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  document.getElementById('alumni-next')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  document.getElementById('alumni-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  resetAuto();

  /* Horizontal alumni stories rail. */
  const alumniRail = document.getElementById('alumni-rail');
  const alumniProgress = document.getElementById('alumni-rail-progress');
  const alumniRailPrev = document.getElementById('alumni-rail-prev');
  const alumniRailNext = document.getElementById('alumni-rail-next');
  function updateAlumniRailProgress() {
    if (!alumniRail || !alumniProgress) return;
    const maxScroll = alumniRail.scrollWidth - alumniRail.clientWidth;
    const visibleRatio = alumniRail.clientWidth / Math.max(alumniRail.scrollWidth, 1);
    const travel = Math.max(0, 100 - visibleRatio * 100);
    const position = maxScroll > 0 ? alumniRail.scrollLeft / maxScroll : 0;
    alumniProgress.style.width = `${Math.min(100, visibleRatio * 100)}%`;
    alumniProgress.style.transform = `translateX(${travel * position / Math.max(visibleRatio, .01)}%)`;
  }
  alumniRailPrev?.addEventListener('click', () => alumniRail?.scrollBy({ left: -alumniRail.clientWidth * .82, behavior: 'smooth' }));
  alumniRailNext?.addEventListener('click', () => alumniRail?.scrollBy({ left: alumniRail.clientWidth * .82, behavior: 'smooth' }));
  alumniRail?.addEventListener('scroll', updateAlumniRailProgress, { passive: true });
  window.addEventListener('resize', updateAlumniRailProgress, { passive: true });
  updateAlumniRailProgress();


  /* ════════════════════════════════════
     FAQ ACCORDION
  ════════════════════════════════════ */
  const faqBtns = document.querySelectorAll('.faq-q');

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqBtns.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const id = b.getAttribute('aria-controls');
        const panel = document.getElementById(id);
        if (panel) panel.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const id = btn.getAttribute('aria-controls');
        const panel = document.getElementById(id);
        if (panel) panel.classList.add('open');
      }
    });
  });


  /* ════════════════════════════════════
     SCROLL REVEAL
  ════════════════════════════════════ */
  const revealTargets = document.querySelectorAll(
    '.hero-section, .stats-banner-section, .accred-section, ' +
    '.outcomes-banner, .employers-section, .programs-section, .faculty-section, .venture-section, .alumni-section, ' +
    '.admissions-section, .faq-section'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════════
     STAT BANNER — counter animation
  ════════════════════════════════════ */
  const statBanner = document.querySelector('.stats-banner');

  if (statBanner) {
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-banner-item').forEach((item, i) => {
            item.style.animation = `fadeInUp 0.5s ease ${i * 0.08}s both`;
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statObserver.observe(statBanner);
  }


  /* ════════════════════════════════════
     PROGRAM CARDS — stagger animation
  ════════════════════════════════════ */
  const programCards = document.querySelectorAll('.program-card');
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        programCards.forEach((card, i) => {
          card.style.animation = `fadeInUp 0.6s ease ${i * 0.12}s both`;
        });
        cardObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  if (programCards.length) cardObserver.observe(programCards[0].closest('.programs-section') || programCards[0]);


  /* ════════════════════════════════════
     ACCRED BADGES — stagger
  ════════════════════════════════════ */
  const accredBadges = document.querySelectorAll('.accred-badge');
  const badgeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        accredBadges.forEach((badge, i) => {
          badge.style.animation = `fadeInUp 0.5s ease ${i * 0.07}s both`;
        });
        badgeObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  if (accredBadges.length) badgeObserver.observe(accredBadges[0].closest('.accred-section') || accredBadges[0]);


  /* ════════════════════════════════════
     CTA BUTTON PRESS FEEDBACK
  ════════════════════════════════════ */
  document.querySelectorAll('.btn-lime, .btn-outline-white, .btn-outline-lime').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ════════════════════════════════════
     MEGA MENU — close on outside click
  ════════════════════════════════════ */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navItems.forEach(i => i.classList.remove('open'));
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

});


/* ════════════════════════════════════
   GLOBAL KEYFRAMES (injected via JS)
════════════════════════════════════ */
const kf = document.createElement('style');
kf.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(kf);
