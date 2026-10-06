(() => {
  const root = document.documentElement;
  const body = document.body;

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');
  const themeToggle = document.getElementById('themeToggle');

  const contactForm = document.getElementById('contactForm');

  const progressBar = document.getElementById('scrollProgressBar');
  const mouseGlow = document.getElementById('mouseGlow');
const heroCodeWindow =
  document.getElementById('heroCodeWindow');
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* =========================================
     THEME
  ========================================= */

  const setThemeIcon = () => {
    const icon = themeToggle?.querySelector('i');

    if (!icon) return;

    const isLight = root.dataset.theme === 'light';

    icon.className = isLight
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';

    themeToggle.setAttribute(
      'aria-label',
      isLight
        ? 'Switch to dark theme'
        : 'Switch to light theme'
    );
  };

  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  } else if (
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    root.dataset.theme = 'light';
  } else {
    root.dataset.theme = 'dark';
  }

  setThemeIcon();

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme =
      root.dataset.theme === 'light'
        ? 'dark'
        : 'light';

    localStorage.setItem(
      'portfolio-theme',
      root.dataset.theme
    );

    setThemeIcon();
  });

  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  const closeMenu = () => {
    nav?.classList.remove('open');

    menuToggle?.setAttribute(
      'aria-expanded',
      'false'
    );

    menuToggle?.setAttribute(
      'aria-label',
      'Open navigation menu'
    );

    body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open =
      !nav?.classList.contains('open');

    nav?.classList.toggle('open', open);

    menuToggle.setAttribute(
      'aria-expanded',
      String(open)
    );

    menuToggle.setAttribute(
      'aria-label',
      open
        ? 'Close navigation menu'
        : 'Open navigation menu'
    );

    body.classList.toggle(
      'menu-open',
      open
    );
  });

  nav
    ?.querySelectorAll('a')
    .forEach(link => {
      link.addEventListener(
        'click',
        closeMenu
      );
    });

  /* Close menu when clicking outside */

  document.addEventListener(
    'click',
    event => {
      if (
        !nav?.classList.contains('open')
      ) {
        return;
      }

      const clickedInsideNav =
        nav.contains(event.target);

      const clickedToggle =
        menuToggle?.contains(event.target);

      if (
        !clickedInsideNav &&
        !clickedToggle
      ) {
        closeMenu();
      }
    }
  );

  /* Close menu with Escape */

  document.addEventListener(
    'keydown',
    event => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }
  );

  /* Keep JS breakpoint equal to CSS */

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    }
  );

  /* =========================================
     HEADER + SCROLL PROGRESS
  ========================================= */

  const syncScrollUI = () => {
    header?.classList.toggle(
      'scrolled',
      window.scrollY > 18
    );

    if (!progressBar) return;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;

    const safeProgress =
      Math.min(
        Math.max(progress, 0),
        1
      );

    progressBar.style.transform =
      `scaleX(${safeProgress})`;
  };

  syncScrollUI();

  window.addEventListener(
    'scroll',
    syncScrollUI,
    {
      passive: true
    }
  );

  window.addEventListener(
    'resize',
    syncScrollUI
  );

  /* =========================================
     ACTIVE NAVIGATION SECTION
  ========================================= */

  const sections = [
    ...document.querySelectorAll(
      'main section[id]'
    )
  ];

  const navLinks = [
    ...document.querySelectorAll(
      '.nav-links a[href^="#"]'
    )
  ];

  if ('IntersectionObserver' in window) {
    const sectionObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              return;
            }

            navLinks.forEach(link => {
              const isActive =
                link.getAttribute('href') ===
                `#${entry.target.id}`;

              link.classList.toggle(
                'active',
                isActive
              );
            });
          });
        },
        {
          rootMargin:
            '-35% 0px -55% 0px',

          threshold: 0
        }
      );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const reveals =
    document.querySelectorAll(
      '.reveal'
    );

  if (
    reducedMotion ||
    !('IntersectionObserver' in window)
  ) {
    reveals.forEach(el => {
      el.classList.add('visible');
    });
  } else {
    const revealObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              'visible'
            );

            revealObserver.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.1,
          rootMargin:
            '0px 0px -40px 0px'
        }
      );

    reveals.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* =========================================
     MOUSE GLOW
  ========================================= */

  if (
    !reducedMotion &&
    mouseGlow &&
    window.matchMedia(
      '(pointer: fine)'
    ).matches
  ) {
    let animationFrame = null;

    window.addEventListener(
      'mousemove',
      event => {
        mouseGlow.classList.add(
          'active'
        );

        if (animationFrame) {
          cancelAnimationFrame(
            animationFrame
          );
        }

        animationFrame =
          requestAnimationFrame(() => {
            mouseGlow.style.left =
              `${event.clientX}px`;

            mouseGlow.style.top =
              `${event.clientY}px`;
          });
      },
      {
        passive: true
      }
    );

    document.addEventListener(
      'mouseleave',
      () => {
        mouseGlow.classList.remove(
          'active'
        );
      }
    );
  }
/* =========================================
   HERO CODE WINDOW 3D TILT
========================================= */

if (
  !reducedMotion &&
  heroCodeWindow &&
  window.matchMedia('(pointer: fine)').matches
) {
  let tiltFrame = null;

  heroCodeWindow.addEventListener(
    'mousemove',
    event => {
      const rect =
        heroCodeWindow.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      const centerX =
        rect.width / 2;

      const centerY =
        rect.height / 2;

      const rotateY =
        ((x - centerX) / centerX) * 4;

      const rotateX =
        ((centerY - y) / centerY) * 4;

      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
      }

      tiltFrame =
        requestAnimationFrame(() => {
          heroCodeWindow.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-4px)`;
        });
    },
    {
      passive: true
    }
  );

  heroCodeWindow.addEventListener(
    'mouseleave',
    () => {
      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
      }

      heroCodeWindow.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }
  );
}
  /* =========================================
     CONTACT FORM
  ========================================= */

  contactForm?.addEventListener(
    'submit',
    event => {
      event.preventDefault();

      const name =
        document
          .getElementById('contactName')
          ?.value.trim() || '';

      const email =
        document
          .getElementById('contactEmail')
          ?.value.trim() || '';

      const subject =
        document
          .getElementById('contactSubject')
          ?.value.trim() ||
        'Portfolio inquiry';

      const message =
        document
          .getElementById('contactMessage')
          ?.value.trim() || '';

      const bodyText =
`Name: ${name}
Email: ${email}

${message}`;

      const mailto =
        `mailto:chestermpalad@gmail.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyText)}`;

      window.location.href = mailto;
    }
  );
})();