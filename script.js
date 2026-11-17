
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shell = document.querySelector('.site-shell');
  const loader = document.querySelector('.loader');
  const typewriter = document.querySelector('[data-typewriter]');
  const typewriterPhrases = ['Digital Experiences', 'Web Experiences', 'Scalable Products', 'Creative Interfaces'];
  let typewriterPhraseIndex = 0;
  let typewriterTimer = null;
  let typewriterStarted = false;
  document.body.classList.add('is-loading');

  // Keep project assets and destinations editable in each article's data attributes.
  document.querySelectorAll('.project[data-project]').forEach((project) => {
    const title = project.querySelector('h3');
    const description = project.querySelector('.project__description');
    const technologies = project.querySelector('.project__technologies');
    if (title) title.textContent = project.dataset.project;
    if (description && project.dataset.description) description.textContent = project.dataset.description;
    if (technologies && project.dataset.technologies) {
      technologies.textContent = project.dataset.technologies.split(',').map((technology) => technology.trim()).join(' · ');
    }
    let visual = project.querySelector('.project-placeholder');
    const liveUrl = project.dataset.liveUrl?.trim();
    if (visual && liveUrl) {
      const projectLink = document.createElement('a');
      projectLink.className = visual.className;
      projectLink.href = liveUrl;
      projectLink.target = '_blank';
      projectLink.rel = 'noreferrer';
      projectLink.setAttribute('aria-label', `Open ${project.dataset.project} live preview`);
      while (visual.firstChild) projectLink.append(visual.firstChild);
      visual.replaceWith(projectLink);
      visual = projectLink;
    }
    const imagePath = project.dataset.image?.trim();
    if (visual && imagePath) {
      const image = document.createElement('img');
      image.className = 'project-image';
      image.src = imagePath;
      image.alt = `${project.dataset.project} project preview`;
      image.loading = 'lazy';
      visual.prepend(image);
      visual.classList.add('has-image');
      visual.setAttribute('aria-label', `${project.dataset.project} project preview`);
    }

    const links = project.querySelector('.project__links');
    if (!links) return;
    links.replaceChildren();
    [
      ['data-case-study-url', 'Case study'],
      ['data-live-url', 'Live preview'],
    ].forEach(([field, label]) => {
      const url = project.dataset[field.replace('data-', '').replace(/-([a-z])/g, (_, char) => char.toUpperCase())]?.trim();
      const item = url ? document.createElement('a') : document.createElement('span');
      if (url) {
        item.href = url;
        item.target = '_blank';
        item.rel = 'noreferrer';
      } else {
        item.textContent = `${label} URL · add when available`;
      }
      if (url) item.innerHTML = `${label} <span aria-hidden="true">↗</span>`;
      links.append(item);
    });
  });

  function startTypewriter() {
    if (!typewriter || prefersReduced || typewriterStarted) return;
    typewriterStarted = true;

    const eraseCharacter = () => {
      typewriter.textContent = typewriter.textContent.slice(0, -1);
      if (typewriter.textContent.length > 0) {
        typewriterTimer = window.setTimeout(eraseCharacter, 48);
        return;
      }
      typewriterPhraseIndex = (typewriterPhraseIndex + 1) % typewriterPhrases.length;
      typewriterTimer = window.setTimeout(typeCharacter, 260);
    };

    const typeCharacter = () => {
      const phrase = typewriterPhrases[typewriterPhraseIndex];
      typewriter.textContent = phrase.slice(0, typewriter.textContent.length + 1);
      if (typewriter.textContent.length < phrase.length) {
        typewriterTimer = window.setTimeout(typeCharacter, 82);
        return;
      }
      typewriterTimer = window.setTimeout(eraseCharacter, 1450);
    };

    // The initial phrase is already in the HTML so it remains readable before JS runs.
    typewriterTimer = window.setTimeout(eraseCharacter, 1450);
  }

  const stopTypewriter = () => {
    window.clearTimeout(typewriterTimer);
    typewriterTimer = null;
    typewriterStarted = false;
  };
  window.addEventListener('pagehide', stopTypewriter);
  window.addEventListener('pageshow', () => {
    if (shell.classList.contains('is-visible')) startTypewriter();
  });

  const revealSite = () => {
    shell.classList.add('is-visible');
    loader?.classList.add('is-done');
    document.body.classList.remove('is-loading');
    startTypewriter();
    animateHero();
    window.setTimeout(() => loader?.remove(), 1100);
  };

  function animateHero() {
    if (prefersReduced || !window.gsap) return;
    gsap.from('.hero__eyebrow', { y: 14, opacity: 0, duration: .7, delay: .16, ease: 'power3.out' });
    gsap.from('.hero__title > span:not(.visually-hidden)', { yPercent: 110, opacity: 0, duration: 1.1, stagger: .13, delay: .2, ease: 'power4.out' });
    gsap.from('.hero__intro, .hero__actions, .scroll-cue', { y: 18, opacity: 0, duration: .8, stagger: .12, delay: .65, ease: 'power3.out' });
    gsap.to('.orbital--one', { rotation: 326, duration: 28, repeat: -1, ease: 'none' });
    gsap.to('.orbital--two', { rotation: -308, duration: 34, repeat: -1, ease: 'none' });
    gsap.to('.orbital__core', { y: -10, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.particle--a', { y: -15, x: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to('.hero__title', { yPercent: 12, scale: .93, opacity: .28, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__orbital', { yPercent: 24, rotate: 15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.utils.toArray('.section-kicker, .display-heading, .about__copy, .expertise-item, .project, .playground__top, .certificate-card, .certificates__intro, .timeline-item, .contact__main').forEach((el) => {
        gsap.from(el, { y: 28, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      gsap.to('.timeline__line i', { height: '100%', ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 72%', end: 'bottom 65%', scrub: true } });
      gsap.utils.toArray('.project__visual').forEach((visual) => {
        gsap.fromTo(visual, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)', duration: .9, ease: 'power3.out', scrollTrigger: { trigger: visual, start: 'top 88%', once: true } });
      });
    }
  }

  if (prefersReduced || !window.gsap) {
    revealSite();
  } else {
    let progress = { value: 0 };
    gsap.to(progress, { value: 100, duration: 1.05, ease: 'power2.inOut', onUpdate: () => {
      const count = document.querySelector('.loader__count');
      const bar = document.querySelector('.loader__rule span');
      if (count) count.textContent = String(Math.round(progress.value)).padStart(2, '0');
      if (bar) bar.style.width = `${progress.value}%`;
    }, onComplete: revealSite });
  }

  // Lenis and ScrollTrigger share one animation frame and one scroll source.
  if (!prefersReduced && window.Lenis) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .9 });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      window.addEventListener('resize', () => ScrollTrigger.refresh());
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -65 });
    }));
  }

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuCloseButton = document.querySelector('.mobile-menu__close');
  const toggleMenu = (open) => {
    const wasOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu?.classList.toggle('is-open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open && window.gsap && !prefersReduced) gsap.fromTo('.mobile-menu nav a', { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: .45, stagger: .07, delay: .18, ease: 'power3.out' });
    if (open) menuCloseButton?.focus({ preventScroll: true });
    else if (wasOpen) menuButton?.focus({ preventScroll: true });
  };
  menuButton?.addEventListener('click', () => toggleMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menuCloseButton?.addEventListener('click', () => toggleMenu(false));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') toggleMenu(false); });

  // Certificate viewer: gather light particles, then reveal the original file in place.
  const certificateViewer = document.querySelector('.certificate-viewer');
  const certificateContent = certificateViewer?.querySelector('.certificate-viewer__content');
  const certificateParticles = certificateViewer?.querySelector('.certificate-viewer__particles');
  const certificateCaption = certificateViewer?.querySelector('.certificate-viewer__caption');
  const certificateClose = certificateViewer?.querySelector('.certificate-viewer__close');
  let previousCertificateTrigger = null;
  let particleTween = null;
  const closeCertificate = () => {
    if (!certificateViewer?.classList.contains('is-open')) return;
    particleTween?.kill();
    certificateViewer.classList.remove('is-revealed');
    certificateViewer.classList.remove('is-open');
    certificateViewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('certificate-open');
    window.setTimeout(() => { if (!certificateViewer.classList.contains('is-open')) certificateContent.replaceChildren(); }, 350);
    previousCertificateTrigger?.focus({ preventScroll: true });
  };
  document.querySelectorAll('[data-certificate]').forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      previousCertificateTrigger = card;
      const file = card.dataset.certificate;
      const title = card.querySelector('h3')?.textContent || 'Certificate';
      certificateContent.replaceChildren();
      if (file.toLowerCase().endsWith('.pdf')) {
        const frame = document.createElement('iframe');
        frame.src = `${card.href}#toolbar=0&navpanes=0&view=FitH`;
        frame.title = title;
        certificateContent.append(frame);
      } else {
        const image = document.createElement('img');
        image.src = card.href;
        image.alt = title;
        certificateContent.append(image);
      }
      certificateCaption.textContent = title;
      certificateViewer.classList.add('is-open');
      certificateViewer.classList.remove('is-revealed');
      certificateViewer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('certificate-open');
      certificateClose.focus({ preventScroll: true });
      certificateParticles.replaceChildren();
      if (!prefersReduced && window.gsap) {
        const fragments = [];
        for (let i = 0; i < 48; i += 1) {
          const dot = document.createElement('i');
          const angle = Math.random() * Math.PI * 2;
          const radius = 100 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * .55;
          dot.dataset.x = String(Math.cos(angle) * radius);
          dot.dataset.y = String(Math.sin(angle) * radius);
          certificateParticles.append(dot);
          fragments.push(dot);
        }
        particleTween?.kill();
        particleTween = gsap.to(fragments, { x: 0, y: 0, scale: 1.5, opacity: 1, duration: .72, stagger: .008, ease: 'power3.in', onComplete: () => {
          gsap.to(fragments, { opacity: 0, scale: 0, duration: .18, onComplete: () => certificateViewer.classList.add('is-revealed') });
        } });
        fragments.forEach((dot) => gsap.set(dot, { x: dot.dataset.x, y: dot.dataset.y, scale: .6 }));
      } else certificateViewer.classList.add('is-revealed');
    });
  });
  certificateClose?.addEventListener('click', closeCertificate);
  certificateViewer?.addEventListener('click', (event) => { if (event.target === certificateViewer) closeCertificate(); });
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCertificate(); });

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Pointer parallax and magnetic button response are desktop-only.
  const hero = document.querySelector('.hero');
  if (!prefersReduced && matchMedia('(pointer:fine)').matches) {
    hero?.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const bounds = hero.getBoundingClientRect();
      const burst = document.createElement('span');
      burst.className = 'hero-burst';
      burst.style.left = `${event.clientX - bounds.left}px`;
      burst.style.top = `${event.clientY - bounds.top}px`;
      for (let index = 0; index < 10; index += 1) {
        const ray = document.createElement('i');
        ray.style.setProperty('--ray', `${index * 36}deg`);
        ray.style.animationDelay = `${index * 12}ms`;
        burst.append(ray);
      }
      hero.append(burst);
      window.setTimeout(() => burst.remove(), 850);
    });
    hero?.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      const orb = document.querySelector('.hero__orbital');
      if (orb) orb.style.transform = `translate(${x * 16}px, ${y * 14}px)`;
    });
    hero?.addEventListener('pointerleave', () => { const orb = document.querySelector('.hero__orbital'); if (orb) orb.style.transform = ''; });
    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - rect.left - rect.width / 2;
        const dy = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${dx * .08}px, ${dy * .12}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
    const cursor = document.querySelector('.custom-cursor');
    window.addEventListener('pointermove', (event) => {
      if (!cursor) return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.querySelectorAll('.project__visual[href]').forEach((visual) => {
      visual.addEventListener('pointerenter', () => cursor?.classList.add('is-active'));
      visual.addEventListener('pointerleave', () => cursor?.classList.remove('is-active'));
    });
    const play = document.querySelector('.playground__canvas');
    play?.addEventListener('pointermove', (event) => {
      const rect = play.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      play.querySelector('.play-shape--ring').style.transform = `translate(${x * 38}px, ${y * 28}px) rotate(${x * 15}deg)`;
      play.querySelector('.play-shape--cube').style.transform = `translate(${x * -25}px, ${y * 22}px) rotateX(${30 + y * 20}deg) rotateY(${40 + x * 30}deg)`;
      play.querySelector('.play-shape--sphere').style.transform = `translate(${x * 46}px, ${y * -30}px)`;
      play.querySelector('.play-crosshair').style.transform = `translate(calc(-50% + ${x * -15}px), calc(-50% + ${y * -12}px)) skew(${x * 5}deg)`;
    });
    play?.addEventListener('pointerleave', () => {
      play.querySelectorAll('.play-shape').forEach((shape) => { shape.style.transform = ''; });
      play.querySelector('.play-crosshair').style.transform = '';
    });
  }

  // Open a prefilled Gmail compose draft; the visitor reviews and sends it.
  const form = document.querySelector('.contact-form');
  const toast = document.querySelector('.form-toast');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const recipient = 'akhilpatyal49@gmail.com';
    const values = new FormData(form);
    const subject = String(values.get('subject') || '').trim();
    const body = `Name: ${String(values.get('name') || '').trim()}\nEmail: ${String(values.get('email') || '').trim()}\n\n${String(values.get('message') || '').trim()}`;
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: recipient, su: subject, body });
    const gmailUrl = `https://mail.google.com/mail/?${params.toString()}`;
    const composeWindow = window.open(gmailUrl, '_blank');

    if (composeWindow) {
      composeWindow.opener = null;
      if (toast) {
        toast.textContent = 'Gmail draft opened in a new tab. Review and send it there.';
        toast.classList.add('is-visible');
        window.setTimeout(() => toast.classList.remove('is-visible'), 5000);
      }
      return;
    }

    window.location.assign(gmailUrl);
  });
  window.addEventListener('load', () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    // Failsafe for CDN delays or script errors; never trap the visitor behind the loader.
    window.setTimeout(() => { if (!shell.classList.contains('is-visible')) revealSite(); }, 2400);
  }, { once: true });
})();



