/* ==========================================================================
   The Hooks Collective — main.js
   Vanilla JS, no dependencies. Shared by all four pages, which don't all
   have the same elements (only contact.html has a form, for instance) —
   every lookup below is guarded so a missing element on one page never
   breaks the behaviors another page needs.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
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
  }

  /* ---------- Header scroll state (Home only) ----------
     On Home the header floats transparent over the hero photo; once the
     user scrolls past it, give it a solid background so it stays legible
     over whatever content follows. Harmless to run on every page — the
     .scrolled class only has a visual effect where body.page-home CSS
     reacts to it. */
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var updateHeaderScroll = function () {
      siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    };
    updateHeaderScroll();
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  }

  /* ---------- Hide placeholder images that aren't there yet ----------
     Lets the section's plain background show through until real photos
     land in assets/ */
  document.querySelectorAll('img[data-placeholder]').forEach(function (img) {
    var hide = function () { img.style.display = 'none'; };
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
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
  }

  /* ---------- Contact form (contact.html only) ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var success = document.getElementById('formSuccess');
    var errorEl = document.getElementById('formError');
    var sendAnother = document.getElementById('sendAnother');
    var submitBtn = form.querySelector('button[type="submit"]');

    var showError = function (msg) {
      if (errorEl) errorEl.textContent = msg;
    };

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

      // Preserve the button's markup (it has a gold arrow span inside) so
      // swapping in the "Sending…" state doesn't lose it on restore.
      var originalMarkup = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

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
          if (success) {
            success.hidden = false;
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        })
        .catch(function () {
          showError('That didn’t send. Email hello@thehookscollective.com directly and I’ll get right back to you.');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            if (originalMarkup !== null) submitBtn.innerHTML = originalMarkup;
          }
        });
    });

    if (sendAnother && success) {
      sendAnother.addEventListener('click', function () {
        form.reset();
        form.hidden = false;
        success.hidden = true;
        showError('');
        var first = form.querySelector('#firstName');
        if (first) first.focus();
      });
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
