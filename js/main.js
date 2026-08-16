/* ==========================================================================
   The Hooks Collective — main.js
   Vanilla JS. No dependencies.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById('navbar');
  var onScroll = function () {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  var closeMenu = function () {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- Hide placeholder images that aren't there yet ----------
     Lets the gradient behind each frame show until real photos land in assets/ */
  document.querySelectorAll('img[data-placeholder]').forEach(function (img) {
    var hide = function () { img.style.display = 'none'; };
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');
  var sendAnother = document.getElementById('sendAnother');

  var showError = function (msg) { errorEl.textContent = msg; };

  var validate = function () {
    var required = form.querySelectorAll('[required]');
    var firstBad = null;

    required.forEach(function (field) {
      var value = field.value.trim();
      var bad = !value || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      field.classList.toggle('invalid', bad);
      if (bad && !firstBad) firstBad = field;
    });

    if (firstBad) {
      showError(firstBad.type === 'email' && firstBad.value.trim()
        ? 'Check the email address — it looks incomplete.'
        : 'Fill in the highlighted fields to send your message.');
      firstBad.focus();
      return false;
    }

    showError('');
    return true;
  };

  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('invalid')) {
      e.target.classList.remove('invalid');
      showError('');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var body = new URLSearchParams(new FormData(form)).toString();

    // CUSTOMIZE: posts to Netlify Forms at the site root. If this site ends up on
    // GitHub Pages instead, swap the URL below for a Formspree endpoint.
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Bad response');
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        showError('That didn\u2019t send. Email hello@thehookscollective.com directly and I\u2019ll get right back to you.');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
  });

  sendAnother.addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    showError('');
    form.querySelector('#firstName').focus();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
