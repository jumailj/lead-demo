/* ═══════════════════════════════════════════════
   LEAD COLLEGE — JavaScript
   Handles: sticky header, mega menus, mobile menu,
   carousel, FAQ accordion, scroll reveals,
   sector bar animation
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

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

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link tap
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


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
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  document.getElementById('alumni-next')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  document.getElementById('alumni-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  resetAuto();


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
    '.outcomes-banner, .programs-section, .alumni-section, ' +
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
     SECTOR BARS — animate on first view
  ════════════════════════════════════ */
  const sectorBars = document.querySelectorAll('.sector-bar');

  // Reset to 0 width initially
  sectorBars.forEach(bar => {
    const target = getComputedStyle(bar).getPropertyValue('--pct').trim();
    bar.style.setProperty('--pct-target', target);
    bar.style.setProperty('--pct', '0%');
  });

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sectorBars.forEach(bar => {
          const target = bar.style.getPropertyValue('--pct-target');
          bar.style.setProperty('--pct', target);
        });
        barObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const sectorCard = document.querySelector('.sector-card');
  if (sectorCard) barObserver.observe(sectorCard);


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
