/* Session 1 twist wheel: one spin per team. A respin needs a written reason
   and the facilitator password. The result is saved before the wheel moves,
   so refreshing the page cannot be used to re-roll. Every respin is logged. */
(function () {
  'use strict';
  var TWISTS = [
    'Must work for someone over 70',
    'Must work for a child under 8',
    'Must work for someone who is blind or has low vision',
    'Must work for someone who is deaf or hard of hearing',
    'Must work for someone who is just learning English',
    'Must work for people who have never used a smartphone',
    'Must work with no internet connection',
    'Must work in a very noisy place',
    'Must work in a remote village, far from any shop or hospital',
    'Must work outdoors in bad weather',
    'Must work in a crowded place, like a packed train',
    'Must work somewhere phones are not allowed',
    'Must cost nothing to run',
    'Must need no new hardware',
    'Must work on a 10-year-old phone',
    'Must use almost no battery',
    'Must be run by volunteers, not paid staff',
    'Must be set up by one person in under 5 minutes',
    'Must not use any personal data',
    'Must show why the AI made its choice',
    'Must be safe for a child to use alone',
    'Must treat every group of people fairly',
    'Must let a human step in and overrule the AI',
    'Must stay safe if someone tries to trick or misuse it',
    'Must work in under 10 seconds',
    'Must be fun enough that people choose to use it',
    'Must make someone smile',
    'Must bring together people who would not normally meet',
    'Must still be useful in 10 years’ time',
    'Must help a million people, not just one'
  ];
  var PASS_HASH = 0xb47a69cf;   // facilitator password (hashed so it is not readable in the page)
  var PREFIX = 'mega9plan:', N = TWISTS.length, SEG = 360 / N;
  var COLS = ['#4E259E', '#0C6382', '#7147DC', '#5ED1DD'], INK = ['#fff', '#fff', '#fff', '#18191C'];

  var box = document.querySelector('.twist-box'); if (!box) return;
  var $ = function (s, r) { return (r || box).querySelector(s); };
  var get = function (k) { try { return localStorage.getItem(PREFIX + k); } catch (e) { return null; } };
  var set = function (k, v) { try { if (v == null) localStorage.removeItem(PREFIX + k); else localStorage.setItem(PREFIX + k, v); } catch (e) {} };
  var hidden = $('input[data-key="s1.twist"]'), svg = $('.tw-wheel'), wrap = $('.tw-wheel-wrap'), pointer = $('.tw-pointer');
  var result = $('.tw-result'), spinBtn = $('.tw-spin'), hub = $('.tw-hub'), respinBtn = $('.tw-respin'), logEl = $('.tw-log');
  var dlg = document.querySelector('.tw-dlg');
  var P = window.megaPlanner || { confetti: function () {}, toast: function () {}, refresh: function () {} };

  /* ---- draw the wheel ---- */
  var NS = 'http://www.w3.org/2000/svg', g = document.createElementNS(NS, 'g'); svg.appendChild(g);
  function pt(a, r) { var t = (a - 90) * Math.PI / 180; return [r * Math.cos(t), r * Math.sin(t)]; }
  for (var i = 0; i < N; i++) {
    var a0 = i * SEG, a1 = a0 + SEG, p0 = pt(a0, 96), p1 = pt(a1, 96);
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', 'M0 0 L' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + ' A96 96 0 0 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + ' Z');
    path.setAttribute('fill', COLS[i % 4]); path.setAttribute('stroke', '#fff'); path.setAttribute('stroke-width', '0.8');
    g.appendChild(path);
    var c = pt(a0 + SEG / 2, 80), tx = document.createElementNS(NS, 'text');
    tx.setAttribute('x', c[0].toFixed(2)); tx.setAttribute('y', c[1].toFixed(2));
    tx.setAttribute('transform', 'rotate(' + (a0 + SEG / 2) + ' ' + c[0].toFixed(2) + ' ' + c[1].toFixed(2) + ')');
    tx.setAttribute('fill', INK[i % 4]); tx.setAttribute('class', 'tw-num'); tx.textContent = i + 1;
    g.appendChild(tx);
  }
  var rim = document.createElementNS(NS, 'circle'); rim.setAttribute('r', '97'); rim.setAttribute('fill', 'none'); rim.setAttribute('stroke', '#18191C'); rim.setAttribute('stroke-width', '3'); svg.appendChild(rim);
  for (var d = 0; d < N; d++) { var q = pt(d * SEG, 97), dot = document.createElementNS(NS, 'circle'); dot.setAttribute('cx', q[0].toFixed(2)); dot.setAttribute('cy', q[1].toFixed(2)); dot.setAttribute('r', '1.6'); dot.setAttribute('fill', '#FFC400'); svg.appendChild(dot); }

  var rot = 0, spinning = false;
  function setRot(r) { rot = r; g.setAttribute('transform', 'rotate(' + r + ')'); }
  function angleFor(i) { return -((i + 0.5) * SEG); }   // rotation that puts slice i under the pointer

  /* ---- state ---- */
  function current() { var n = parseInt(get('s1.twist.n'), 10); return isNaN(n) ? -1 : n; }
  function log() { try { return JSON.parse(get('s1.twist.log') || '[]'); } catch (e) { return []; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function show(animated) {
    var n = current();
    if (n < 0) {
      spinBtn.hidden = false; respinBtn.hidden = true; hub.disabled = false; hub.textContent = 'SPIN'; logEl.hidden = true;
      return;
    }
    result.innerHTML = '<div class="tw-card' + (animated ? ' reveal' : '') + '"><small>Your twist: number ' + (n + 1) + '</small><b>' + esc(TWISTS[n]) + '</b><span>Your idea must work with this. Use it on slide 2.</span></div>';
    spinBtn.hidden = true; respinBtn.hidden = false; hub.disabled = true; hub.textContent = '\u2713'; hub.setAttribute('aria-label', 'Wheel already spun');
    var L = log();
    if (L.length) {
      logEl.hidden = false;
      logEl.innerHTML = '<b>Respun ' + L.length + (L.length === 1 ? ' time' : ' times') + ' (with a facilitator)</b>' + L.map(function (e) {
        return '<div>Twist ' + (e.from + 1) + ' &rarr; ' + (e.to + 1) + ': “' + esc(e.why) + '” <span>' + esc(e.at) + '</span></div>';
      }).join('');
    } else logEl.hidden = true;
  }

  function pick(exclude) {
    var n, buf = new Uint32Array(1);
    do { if (window.crypto && crypto.getRandomValues) { crypto.getRandomValues(buf); n = buf[0] % N; } else n = Math.floor(Math.random() * N); } while (n === exclude);
    return n;
  }

  function spin(reason) {
    if (spinning) return;
    var prev = current(), n = pick(prev);
    // save first, so a refresh mid-spin does not give a free re-roll
    set('s1.twist.n', String(n));
    if (prev >= 0) { var L = log(); L.push({ from: prev, to: n, why: reason, at: new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) }); set('s1.twist.log', JSON.stringify(L)); }
    hidden.value = ''; hidden.dispatchEvent(new Event('input'));
    spinning = true; spinBtn.disabled = respinBtn.disabled = hub.disabled = true;
    result.innerHTML = '<div class="tw-empty tw-going"><b>Spinning...</b>Where will it land?</div>';
    wrap.classList.add('spinning');

    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var start = rot, jitter = (Math.random() - 0.5) * SEG * 0.6;
    var base = angleFor(n) + jitter, turns = reduce ? 1 : 6;
    var end = base + 360 * Math.ceil((start - base) / 360 + turns);   // always spin forwards (clockwise)
    var dur = reduce ? 600 : 5200, t0 = performance.now(), lastSeg = null;
    function ease(t) { return 1 - Math.pow(1 - t, 4); }
    (function frame(now) {
      var t = Math.min(1, (now - t0) / dur), r = start + (end - start) * ease(t);
      setRot(r);
      var seg = Math.floor(((-r % 360) + 360) % 360 / SEG);
      if (seg !== lastSeg) { lastSeg = seg; pointer.classList.remove('tick'); void pointer.offsetWidth; pointer.classList.add('tick'); }
      if (t < 1) requestAnimationFrame(frame);
      else {
        setRot(((end % 360) + 360) % 360);
        spinning = false; wrap.classList.remove('spinning'); spinBtn.disabled = respinBtn.disabled = false;
        hidden.value = 'Twist ' + (n + 1) + ': ' + TWISTS[n]; hidden.dispatchEvent(new Event('input'));
        show(true); P.confetti(); P.toast('Your twist: ' + TWISTS[n]);
      }
    })(t0);
  }

  spinBtn.addEventListener('click', function () { if (current() < 0) spin(''); });
  hub.addEventListener('click', function () { if (current() < 0) spin(''); });

  /* ---- respin: reason + facilitator password ---- */
  function hash(s) { var h = 0x811c9dc5; var b = new TextEncoder().encode(s); for (var i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  var why = document.getElementById('tw-why'), pass = document.getElementById('tw-pass'), err = dlg.querySelector('.tw-err');
  respinBtn.addEventListener('click', function () { why.value = ''; pass.value = ''; err.textContent = ''; dlg.showModal(); why.focus(); });
  dlg.querySelector('.tw-cancel').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var reason = why.value.trim();
    if (reason.length < 20) { err.textContent = 'Please explain a bit more (at least a full sentence).'; why.focus(); return; }
    if (hash(pass.value.trim().toLowerCase()) !== PASS_HASH) { err.textContent = 'That password is not right. Ask a facilitator.'; pass.value = ''; pass.focus(); return; }
    dlg.close(); spin(reason);
  });

  /* ---- start: restore the saved twist and park the wheel on it ---- */
  var n0 = current();
  if (n0 >= 0) { setRot(((angleFor(n0) % 360) + 360) % 360); var want = 'Twist ' + (n0 + 1) + ': ' + TWISTS[n0]; if (hidden.value !== want) { hidden.value = want; hidden.dispatchEvent(new Event('input')); } }
  show(false);

  // another tab on this laptop spun the wheel: follow it
  window.addEventListener('storage', function (e) {
    if (e.key === PREFIX + 's1.twist.n' || e.key === PREFIX + 's1.twist.log') { var n = current(); if (n >= 0) setRot(((angleFor(n) % 360) + 360) % 360); show(false); }
  });
})();
