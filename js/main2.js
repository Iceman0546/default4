/**
 * THINK DIFFERENTLY WEBSITE — MAIN JAVASCRIPT
 * Handles: Navigation, Scroll Effects, Animations,
 *          Cookie Consent, Counter Animations, Gallery Lightbox
 */

'use strict';

// ============================================================
// SHARED SCROLL LOCK
// Nav menu, lightbox and cookie modal can each lock body scroll.
// A simple counter stops one of them from clobbering another's
// lock when it closes (e.g. closing the lightbox no longer
// re-enables scrolling if the mobile nav is still open).
// ============================================================
let scrollLockCount = 0;

function lockScroll() {
  scrollLockCount++;
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = '';
  }
}

// ============================================================
// NAVIGATION
// ============================================================
const navbar    = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
const scrollTop = document.querySelector('.scroll-top');

// Highlight active page link
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });
})();

// Sticky navbar + scroll-to-top visibility
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTop && scrollTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTop && scrollTop.classList.remove('visible');
  }
}, { passive: true });

function closeMobileNav() {
  if (!navLinks || !navLinks.classList.contains('open')) return;
  navLinks.classList.remove('open');
  navToggle && navToggle.classList.remove('open');
  navToggle && navToggle.setAttribute('aria-expanded', 'false');
  unlockScroll();
}

function openMobileNav() {
  if (!navLinks) return;
  navLinks.classList.add('open');
  navToggle && navToggle.classList.add('open');
  navToggle && navToggle.setAttribute('aria-expanded', 'true');
  lockScroll();
}

// Mobile hamburger toggle
navToggle && navToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // keep this click from also triggering the outside-click closer below
  if (navLinks && navLinks.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

// Close mobile nav on link click (let the navigation proceed as normal)
navLinks && navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

// Close mobile nav on outside tap/click
document.addEventListener('click', (e) => {
  if (!navLinks || !navLinks.classList.contains('open')) return;
  const clickedInsideMenu   = navLinks.contains(e.target);
  const clickedToggleButton = navToggle && navToggle.contains(e.target);
  if (!clickedInsideMenu && !clickedToggleButton) {
    closeMobileNav();
  }
});

// Close mobile nav on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
    closeMobileNav();
    navToggle && navToggle.focus();
  }
});

// Close mobile nav automatically if the viewport grows back to desktop width
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileNav();
  }
});

// Scroll to top
scrollTop && scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// INTERSECTION OBSERVER — FADE-IN ANIMATIONS
// ============================================================
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, 2000, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-value').forEach(el => counterObserver.observe(el));

// ============================================================
// GALLERY LIGHTBOX
// ============================================================
const lightbox      = document.querySelector('.lightbox');
const lightboxImg   = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      const alt = item.querySelector('img').alt || '';
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('open');
      lockScroll();
    });
  });

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    unlockScroll();
  }
}

// ============================================================
// GALLERY FILTER
// ============================================================
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        item.style.opacity = '0';
        setTimeout(() => { item.style.opacity = '1'; item.style.transition = 'opacity 0.4s'; }, 10);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ============================================================
// COOKIE CONSENT
// ============================================================
const COOKIE_KEY = 'think_differently_cookie_consent';

const cookieBanner  = document.querySelector('.cookie-banner');
const cookieModal   = document.querySelector('.cookie-modal');

function getCookieConsent() {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_KEY));
  } catch { return null; }
}

function setCookieConsent(data) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
}

function hideBanner() {
  cookieBanner && cookieBanner.classList.remove('show');
}

function showBanner() {
  setTimeout(() => {
    cookieBanner && cookieBanner.classList.add('show');
  }, 1200);
}

// Check if consent already given
if (!getCookieConsent()) {
  showBanner();
}

// Accept all
document.querySelector('.cookie-btn.accept') &&
  document.querySelector('.cookie-btn.accept').addEventListener('click', () => {
    setCookieConsent({ necessary: true, analytics: true, marketing: true, preferences: true });
    hideBanner();
    applyConsent({ analytics: true, marketing: true });
  });

// Reject all
document.querySelector('.cookie-btn.reject') &&
  document.querySelector('.cookie-btn.reject').addEventListener('click', () => {
    setCookieConsent({ necessary: true, analytics: false, marketing: false, preferences: false });
    hideBanner();
  });

// Open settings modal
document.querySelector('.cookie-btn.settings') &&
  document.querySelector('.cookie-btn.settings').addEventListener('click', () => {
    cookieModal && cookieModal.classList.add('open');
    lockScroll();
  });

// Close modal
document.querySelector('.cookie-modal-close') &&
  document.querySelector('.cookie-modal-close').addEventListener('click', () => {
    cookieModal && cookieModal.classList.remove('open');
    unlockScroll();
  });

cookieModal && cookieModal.addEventListener('click', (e) => {
  if (e.target === cookieModal) {
    cookieModal.classList.remove('open');
    unlockScroll();
  }
});

// Save preferences from modal
document.querySelector('.cookie-save-prefs') &&
  document.querySelector('.cookie-save-prefs').addEventListener('click', () => {
    const analytics   = document.querySelector('#cookie-analytics')?.checked || false;
    const marketing   = document.querySelector('#cookie-marketing')?.checked || false;
    const preferences = document.querySelector('#cookie-preferences')?.checked || false;

    setCookieConsent({ necessary: true, analytics, marketing, preferences });
    cookieModal && cookieModal.classList.remove('open');
    unlockScroll();
    hideBanner();
    applyConsent({ analytics, marketing });
  });

// Accept all from modal
document.querySelector('.cookie-accept-all') &&
  document.querySelector('.cookie-accept-all').addEventListener('click', () => {
    setCookieConsent({ necessary: true, analytics: true, marketing: true, preferences: true });
    cookieModal && cookieModal.classList.remove('open');
    unlockScroll();
    hideBanner();
    applyConsent({ analytics: true, marketing: true });
  });

function applyConsent({ analytics, marketing }) {
  // Placeholder: integrate analytics/marketing scripts here when consent given
  if (analytics) {
    console.log('[Cookie] Analytics cookies accepted.');
    // e.g., load Google Analytics
  }
  if (marketing) {
    console.log('[Cookie] Marketing cookies accepted.');
  }
}

// ============================================================
// PARALLAX EFFECT (subtle, performance-safe)
// ============================================================
const parallaxSections = document.querySelectorAll('.section-bg');

if (window.matchMedia('(min-width: 769px)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxSections.forEach(bg => {
      const parent = bg.closest('.bg-section, .hero-section, .about-hero, .gallery-hero, .contact-hero');
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + scrollY) * 0.15;
      bg.style.transform = `translateY(${offset * 0.3}px)`;
    });
  }, { passive: true });
}

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
