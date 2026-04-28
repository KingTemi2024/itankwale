/* ───────────────────────────────────────────────
   Itankwale — Frontend Script
   Optimised for low memory + CPU:
   - Countdown ticks once a second AND only while visible
     (pauses on tab hide and when scrolled off-screen)
   - Animations toggle on/off based on viewport visibility
   - All observers disconnect once their work is done
─────────────────────────────────────────────── */

(function () {
  'use strict';

  var doc = document;
  var supportsIO = 'IntersectionObserver' in window;

  // ── Helpers ────────────────────────────────────────────────────
  function $(id) { return doc.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function isValidEmail(v) { return v && v.indexOf('@') > 0 && v.indexOf('.') > 0; }

  // ── Countdown to Q4 2027 launch (Oct 1, 2027 09:00 local) ──────
  var launchTs = new Date('2027-10-01T09:00:00').getTime();
  var cd = {
    el: $('countdown'),
    d: $('cd-d'), h: $('cd-h'), m: $('cd-m'), s: $('cd-s'),
    visible: true,        // is the section in viewport?
    pageVisible: true,    // is the tab in foreground?
    timer: null,
    last: { d: null, h: null, m: null, s: null }
  };

  function renderCountdown() {
    if (!cd.el) return;
    var diff = launchTs - Date.now();

    if (diff <= 0) {
      cd.el.innerHTML =
        '<div style="font-family:var(--fm);font-size:14px;color:var(--g)">' +
        '\u2713 We have launched.</div>';
      stopCountdown();
      return;
    }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    // Only touch the DOM when the value actually changed.
    if (s !== cd.last.s && cd.s) { cd.s.textContent = pad(s); cd.last.s = s; }
    if (m !== cd.last.m && cd.m) { cd.m.textContent = pad(m); cd.last.m = m; }
    if (h !== cd.last.h && cd.h) { cd.h.textContent = pad(h); cd.last.h = h; }
    if (d !== cd.last.d && cd.d) { cd.d.textContent = pad(d); cd.last.d = d; }
  }

  function startCountdown() {
    if (cd.timer != null) return;
    renderCountdown();
    cd.timer = setInterval(renderCountdown, 1000);
  }
  function stopCountdown() {
    if (cd.timer != null) {
      clearInterval(cd.timer);
      cd.timer = null;
    }
  }
  function syncCountdown() {
    if (cd.visible && cd.pageVisible) startCountdown();
    else stopCountdown();
  }

  // Pause when tab is hidden (don't burn CPU in background tabs).
  doc.addEventListener('visibilitychange', function () {
    cd.pageVisible = !doc.hidden;
    if (cd.pageVisible) renderCountdown(); // catch up on return
    syncCountdown();
  });

  // Pause when countdown is scrolled off-screen.
  if (cd.el && supportsIO) {
    var cdObs = new IntersectionObserver(function (entries) {
      cd.visible = entries[0].isIntersecting;
      if (cd.visible) renderCountdown();
      syncCountdown();
    }, { threshold: 0.01 });
    cdObs.observe(cd.el);
  }

  syncCountdown();

  // ── Pulse animations: only run when on-screen ──────────────────
  // Affects .pulse-dot (launch pill, social strip) and the timeline "now" dot.
  var pulseNodes = doc.querySelectorAll('.pulse-dot, .tl-step.now .tl-dot');
  if (pulseNodes.length && supportsIO) {
    var pulseObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('pulse-on');
        else e.target.classList.remove('pulse-on');
      });
    }, { threshold: 0.01 });
    pulseNodes.forEach(function (n) { pulseObs.observe(n); });
  } else {
    // No IO support — just turn them on once and leave them.
    pulseNodes.forEach(function (n) { n.classList.add('pulse-on'); });
  }

  // ── Form helpers ───────────────────────────────────────────────
  function bumpSubCount() {
    var el = $('sub-num');
    if (!el) return;
    var n = parseInt(el.textContent, 10);
    if (!isNaN(n)) el.textContent = String(n + 1);
  }

  // ── Hero waitlist (visual only) ────────────────────────────────
  var heroBtn = $('hero-submit');
  var heroEmail = $('hero-email');
  var heroForm = $('hero-form');
  var heroSuccess = $('hero-success');

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

  // ── Newsletter tags (event delegation = one listener, not 6) ───
  var nlTags = $('nl-tags');
  if (nlTags) {
    nlTags.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains('nl-tag')) {
        t.classList.toggle('selected');
      }
    });
  }

  // ── Newsletter form (visual only) ──────────────────────────────
  var nlBtn = $('nl-submit');
  var nlEmail = $('nl-email');
  var nlForm = $('nl-form');
  var nlSuccess = $('nl-success');

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

  // ── Scroll-reveal: fire once, then disconnect ──────────────────
  var revealNodes = doc.querySelectorAll('.pillar, .stat-item, .tl-step');
  if (revealNodes.length) {
    if (supportsIO) {
      revealNodes.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
      var revealObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            obs.unobserve(e.target); // critical: free the observer slot
          }
        });
      }, { threshold: 0.1 });
      revealNodes.forEach(function (el) { revealObs.observe(el); });
    }
    // No IO support: leave elements at default styling (already visible). No-op.
  }
})();
