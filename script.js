/* ───────────────────────────────────────────────
   Itankwale — Frontend Script
   - Countdown to launch
   - Hero waitlist + newsletter form (visual demo)
   - Newsletter tag selection
   - Scroll-reveal animations
─────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Countdown to Q4 2027 launch (Oct 1, 2027 09:00 local) ──────
  var launch = new Date('2027-10-01T09:00:00');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    var diff = launch - new Date();
    var el = document.getElementById('countdown');
    if (!el) return;

    if (diff <= 0) {
      el.innerHTML =
        '<div style="font-family:var(--fm);font-size:14px;color:var(--g)">' +
        '\u2713 We have launched.</div>';
      return;
    }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    var dEl = document.getElementById('cd-d');
    var hEl = document.getElementById('cd-h');
    var mEl = document.getElementById('cd-m');
    var sEl = document.getElementById('cd-s');
    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── Helpers ─────────────────────────────────────────────────────
  function isValidEmail(value) {
    return value && value.indexOf('@') > 0 && value.indexOf('.') > 0;
  }

  function bumpSubCount() {
    var el = document.getElementById('sub-num');
    if (!el) return;
    var n = parseInt(el.textContent, 10);
    if (!isNaN(n)) el.textContent = String(n + 1);
  }

  // ── Hero waitlist (visual only) ─────────────────────────────────
  var heroBtn = document.getElementById('hero-submit');
  var heroEmail = document.getElementById('hero-email');
  var heroForm = document.getElementById('hero-form');
  var heroSuccess = document.getElementById('hero-success');

  function heroSubmit() {
    if (!heroEmail) return;
    var v = heroEmail.value.trim();
    if (!isValidEmail(v)) {
      heroEmail.style.borderColor = 'rgba(248,113,113,0.5)';
      return;
    }
    if (heroForm) heroForm.style.display = 'none';
    if (heroSuccess) heroSuccess.style.display = 'block';
    bumpSubCount();
  }

  if (heroBtn) heroBtn.addEventListener('click', heroSubmit);
  if (heroEmail) {
    heroEmail.addEventListener('input', function () {
      heroEmail.style.borderColor = '';
    });
    heroEmail.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') heroSubmit();
    });
  }

  // ── Newsletter tags ─────────────────────────────────────────────
  var tags = document.querySelectorAll('.nl-tag[data-tag]');
  tags.forEach(function (tag) {
    tag.addEventListener('click', function () {
      tag.classList.toggle('selected');
    });
  });

  // ── Newsletter form (visual only) ───────────────────────────────
  var nlBtn = document.getElementById('nl-submit');
  var nlEmail = document.getElementById('nl-email');
  var nlForm = document.getElementById('nl-form');
  var nlSuccess = document.getElementById('nl-success');

  function nlSubmit() {
    if (!nlEmail) return;
    var v = nlEmail.value.trim();
    if (!isValidEmail(v)) {
      nlEmail.style.borderColor = 'rgba(248,113,113,0.5)';
      return;
    }
    if (nlForm) nlForm.style.display = 'none';
    if (nlSuccess) nlSuccess.style.display = 'block';
    bumpSubCount();
  }

  if (nlBtn) nlBtn.addEventListener('click', nlSubmit);
  if (nlEmail) {
    nlEmail.addEventListener('input', function () {
      nlEmail.style.borderColor = '';
    });
  }

  // ── Scroll-reveal for cards / stats / timeline steps ────────────
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pillar, .stat-item, .tl-step').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      obs.observe(el);
    });
  }
})();
