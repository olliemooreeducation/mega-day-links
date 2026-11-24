/* Y9 AI-pprentice digital team planning sheet.
   Everything typed is saved straight away in this browser (localStorage),
   so a closed tab, refresh or crash does not lose work. One laptop per team. */
(function () {
  'use strict';
  var PREFIX = 'mega9plan:';
  var PAGE = document.body.getAttribute('data-page');
  var canStore = (function () { try { localStorage.setItem(PREFIX + 't', '1'); localStorage.removeItem(PREFIX + 't'); return true; } catch (e) { return false; } })();
  var get = function (k) { try { return localStorage.getItem(PREFIX + k); } catch (e) { return null; } };
  var set = function (k, v) {
    try { if (v === '' || v == null) localStorage.removeItem(PREFIX + k); else localStorage.setItem(PREFIX + k, v); return true; }
    catch (e) { flagSave(false, 'Storage full! Tell a member of staff.'); return false; }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- saved indicator ---------- */
  var savedEl = $('.p-saved'), savedTimer;
  function flagSave(ok, msg) {
    if (!savedEl) return;
    savedEl.classList.toggle('busy', !ok);
    savedEl.textContent = msg;
  }
  function saved() {
    if (!canStore) return;
    flagSave(true, 'Saved on this laptop');
    clearTimeout(savedTimer);
  }
  if (!canStore) flagSave(false, 'Not saving! Tell a member of staff.');
  else flagSave(true, 'Saves as you type');

  /* ---------- simple fields ---------- */
  function load(el) {
    var k = el.getAttribute('data-key'), v = get(k);
    if (el.type === 'checkbox') el.checked = v === '1';
    else if (el.type === 'radio') el.checked = v === el.value;
    else el.value = v || '';
  }
  function store(el) {
    var k = el.getAttribute('data-key');
    if (el.type === 'checkbox') set(k, el.checked ? '1' : '');
    else if (el.type === 'radio') { if (el.checked) set(k, el.value); }
    else set(k, el.value);
    saved();
  }
  $$('[data-key]').forEach(function (el) {
    load(el);
    el.addEventListener(el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT' ? 'change' : 'input', function () { store(el); refresh(); });
  });

  /* ---------- numbered steps (How it works) ---------- */
  $$('[data-steps]').forEach(function (wrap) {
    var key = wrap.getAttribute('data-steps'), min = +wrap.getAttribute('data-rows') || 4;
    var list = [];
    try { list = JSON.parse(get(key) || '[]'); } catch (e) { list = []; }
    while (list.length < min) list.push('');
    var rows = $('.steps', wrap);
    function persist() { var clean = list.slice(); while (clean.length && !clean[clean.length - 1].trim()) clean.pop(); set(key, clean.length ? JSON.stringify(clean) : ''); saved(); refresh(); }
    function draw(focusIdx) {
      rows.innerHTML = '';
      list.forEach(function (txt, i) {
        var r = document.createElement('div'); r.className = 'step-row';
        r.innerHTML = '<span class="step-n">' + (i + 1) + '</span><input class="p" type="text" aria-label="Step ' + (i + 1) + '" placeholder="' + (i === 0 ? 'First, the user...' : 'Then...') + '">' +
          (list.length > min ? '<button type="button" class="step-x" aria-label="Remove step ' + (i + 1) + '">✕</button>' : '');
        var inp = $('input', r); inp.value = txt;
        inp.addEventListener('input', function () { list[i] = inp.value; persist(); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (i === list.length - 1) { list.push(''); draw(i + 1); } else { var n = rows.querySelectorAll('input')[i + 1]; if (n) n.focus(); } } });
        var x = $('.step-x', r); if (x) x.addEventListener('click', function () { list.splice(i, 1); persist(); draw(); });
        rows.appendChild(r);
      });
      if (focusIdx != null) { var f = rows.querySelectorAll('input')[focusIdx]; if (f) f.focus(); }
    }
    draw();
    wrap._filled = function () { return list.filter(function (t) { return t.trim(); }).length; };
    wrap._text = function () { return list.filter(function (t) { return t.trim(); }).map(function (t, i) { return (i + 1) + '. ' + t.trim(); }).join('\n'); };
    var add = $('.add-step', wrap); if (add) add.addEventListener('click', function () { list.push(''); draw(list.length - 1); });
  });

  /* ---------- idea sentence ---------- */
  $$('[data-sentence]').forEach(function (box) {
    var out = $('.sentence-out', box);
    function build() {
      var w = function (k) { return (get(k) || '').trim(); };
      var who = w('s1.idea.who'), what = w('s1.idea.what'), how = w('s1.idea.how');
      return (who || what || how) ? 'Our startup helps ' + (who || '...') + ' to ' + (what || '...') + ' using AI to ' + (how || '...') + '.' : '';
    }
    box._text = build;
    box._update = function () { var t = build(); out.textContent = t || 'Your sentence appears here as you type.'; out.classList.toggle('ready', !!(t && t.indexOf('...') < 0)); };
    box._update();
  });

  /* ---------- sketch pad ---------- */
  $$('[data-pad]').forEach(function (wrap) {
    var base = wrap.getAttribute('data-pad');
    var cv = $('canvas', wrap), ctx = cv.getContext('2d'), hint = $('.pad-hint', wrap);
    var W = 1200, H = 800; cv.width = W; cv.height = H;
    var cur = '1', color = '#18191C', size = 6, erase = false, drawing = false, last = null, undo = [], inked = {};
    function key() { return base + '.' + cur; }
    function showHint() { hint.style.display = inked[cur] ? 'none' : 'grid'; }
    function loadPad() {
      ctx.clearRect(0, 0, W, H); undo = [];
      var d = get(key()); inked[cur] = !!d;
      if (d) { var img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0, W, H); }; img.src = d; }
      showHint();
    }
    ['1', '2'].forEach(function (n) { inked[n] = !!get(base + '.' + n); });
    function savePad() { try { set(key(), inked[cur] ? cv.toDataURL('image/png') : ''); saved(); } catch (e) {} refresh(); }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
    cv.addEventListener('pointerdown', function (e) {
      e.preventDefault(); cv.setPointerCapture(e.pointerId); drawing = true; last = pos(e);
      if (undo.length > 25) undo.shift(); undo.push(ctx.getImageData(0, 0, W, H));
      ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(last.x, last.y, (erase ? size * 3 : size) / 2, 0, Math.PI * 2); ctx.fill();
      inked[cur] = true; showHint();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drawing) return; var p = pos(e);
      ctx.strokeStyle = color; ctx.lineWidth = erase ? size * 3 : size; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p;
    });
    function end() { if (!drawing) return; drawing = false; ctx.globalCompositeOperation = 'source-over'; savePad(); }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('pointerleave', end);

    $$('.sw', wrap).forEach(function (b) { b.addEventListener('click', function () { color = b.getAttribute('data-c'); erase = false; $$('.sw', wrap).forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); $('[data-t="erase"]', wrap).setAttribute('aria-pressed', 'false'); }); });
    $$('.sz', wrap).forEach(function (b) { b.addEventListener('click', function () { size = +b.getAttribute('data-s'); $$('.sz', wrap).forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); }); });
    $('[data-t="erase"]', wrap).addEventListener('click', function () { erase = !erase; this.setAttribute('aria-pressed', erase); });
    function empty() { var d = ctx.getImageData(0, 0, W, H).data; for (var i = 3; i < d.length; i += 16) if (d[i]) return false; return true; }
    $('[data-t="undo"]', wrap).addEventListener('click', function () { if (!undo.length) return; ctx.putImageData(undo.pop(), 0, 0); inked[cur] = !empty(); showHint(); savePad(); });
    $('[data-t="clear"]', wrap).addEventListener('click', function () { if (!inked[cur] || !confirm('Clear this whole sketch?')) return; undo.push(ctx.getImageData(0, 0, W, H)); ctx.clearRect(0, 0, W, H); inked[cur] = false; showHint(); savePad(); });
    $('[data-t="save"]', wrap).addEventListener('click', function () {
      var c2 = document.createElement('canvas'); c2.width = W; c2.height = H; var x = c2.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.drawImage(cv, 0, 0);
      var a = document.createElement('a'); var team = (get('team.name') || 'team').replace(/[^a-z0-9]+/gi, '-');
      a.download = team + '-sketch-' + cur + '.png'; a.href = c2.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); toast('Sketch downloaded: add it to slide 5');
    });
    $$('.pad-tab', wrap).forEach(function (b) { b.addEventListener('click', function () { cur = b.getAttribute('data-n'); $$('.pad-tab', wrap).forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); loadPad(); }); });
    wrap._filled = function () { return inked['1'] || inked['2']; };
    loadPad();
  });

  /* ---------- copy buttons ---------- */
  function boxText(box) {
    if (box._text) return box._text();
    var parts = $$('[data-copy]', box), lines = [];
    parts.forEach(function (el) {
      var lab = el.getAttribute('data-copy'), v = el._text ? el._text() : (el.value || '').trim();
      if (!v) return;
      lines.push(lab ? lab + ': ' + v : v);
    });
    return lines.join('\n');
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, no) {
      var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
      try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); } t.remove();
    });
  }
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-box]'); var t = boxText(box);
      if (!t) { toast('Nothing to copy yet: fill in the box first'); return; }
      copy(t).then(function () {
        var o = b.textContent; b.classList.add('ok'); b.textContent = 'Copied! ✓';
        toast('Copied. Paste it into ' + (b.getAttribute('data-slide') || 'your slide') + ' in Canva');
        setTimeout(function () { b.classList.remove('ok'); b.textContent = o; }, 1800);
      }, function () { toast('Copy did not work: select the text and press Ctrl+C'); });
    });
  });

  /* ---------- progress, ticks, celebrations ---------- */
  function ok(el) {
    if (el._filled) return el.hasAttribute('data-steps') ? el._filled() >= (+el.getAttribute('data-min') || 2) : el._filled();
    if (el.getAttribute('data-req') === 'any') return $$('input,textarea,select', el).some(function (i) { return (i.type === 'checkbox' || i.type === 'radio') ? i.checked : i.value.trim(); });
    if (el.type === 'checkbox') return el.checked;
    return (el.value || '').trim().length > 0;
  }
  function isDone(box) { var reqs = $$('[data-req]', box); return reqs.length > 0 && reqs.every(ok); }
  var boxes = $$('[data-box]'), stops = $$('.stop'), first = true;
  var MSGS = ['Let’s go! Start with the first box.', 'Nice start!', 'Great teamwork, keep going.', 'Over halfway there!', 'Nearly done. You’ve got this!', 'All done! Brilliant work.'];
  function refresh() {
    $$('[data-sentence]').forEach(function (b) { b._update(); });
    var done = 0;
    boxes.forEach(function (b) {
      var d = isDone(b), was = b.classList.contains('done');
      b.classList.toggle('done', d); if (d) done++;
      if (d && !was && !first) { b.classList.add('pop'); setTimeout(function () { b.classList.remove('pop'); }, 400); }
    });
    var pct = boxes.length ? done / boxes.length : 0;
    var bar = $('.p-bar i'); if (bar) bar.style.width = (pct * 100) + '%';
    var cnt = $('.p-count'); if (cnt) cnt.textContent = done + ' of ' + boxes.length + ' done';
    var msg = $('.p-msg'); if (msg) msg.textContent = pct >= 1 ? MSGS[5] : MSGS[Math.min(4, Math.floor(pct * 4) + (done ? 1 : 0))];
    var pr = $('.p-progress'), wasFull = pr && pr.classList.contains('full');
    if (pr) pr.classList.toggle('full', pct >= 1);
    if (pct >= 1 && !wasFull && !first) { confetti(); toast('Every box done. Amazing!'); }
    set('progress.' + PAGE, String(Math.round(pct * 100)));
    stops.forEach(function (s) {
      var all = $$('input[type=checkbox]', s).every(function (i) { return i.checked; }), was = s.classList.contains('done');
      s.classList.toggle('done', all);
      if (all && !was && !first) confetti();
    });
    tabs();
    first = false;
  }
  function tabs() {
    $$('.p-tab').forEach(function (t) {
      var n = t.getAttribute('data-n'), v = +(get('progress.' + n) || 0);
      $('.p-mini i', t).style.width = v + '%'; t.classList.toggle('done', v >= 100);
      t.setAttribute('title', v + '% done');
    });
  }

  /* ---------- confetti + toast ---------- */
  var toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var toastT; function toast(m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); }
  function confetti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.getElementById('confetti'); if (!c) { c = document.createElement('canvas'); c.id = 'confetti'; document.body.appendChild(c); }
    var x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    var cols = ['#4E259E', '#7147DC', '#0C6382', '#5ED1DD', '#9EEEF2', '#FFC400'], P = [];
    for (var i = 0; i < 160; i++) P.push({ x: c.width / 2 + (Math.random() - .5) * 200, y: c.height * .35, vx: (Math.random() - .5) * 16, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[i % cols.length], a: Math.random() * 6, s: (Math.random() - .5) * .3 });
    var t = 0; (function tick() {
      x.clearRect(0, 0, c.width, c.height); t++;
      P.forEach(function (p) { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.s; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
      if (t < 150) requestAnimationFrame(tick); else x.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* ---------- keep two open tabs in step ---------- */
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf(PREFIX) !== 0) return;
    var k = e.key.slice(PREFIX.length);
    $$('[data-key="' + k + '"]').forEach(function (el) { if (document.activeElement !== el) load(el); });
    if (k.indexOf('progress.') === 0) tabs(); else refresh();
  });

  /* ---------- staff: clear the laptop for a new team ---------- */
  var reset = $('.staff-reset button');
  if (reset) reset.addEventListener('click', function () {
    if (!confirm('STAFF ONLY: this deletes this team’s planning sheet (all 3 sessions) from this laptop. Continue?')) return;
    if (!confirm('Are you sure? This cannot be undone.')) return;
    Object.keys(localStorage).forEach(function (k) { if (k.indexOf(PREFIX) === 0) localStorage.removeItem(k); });
    location.reload();
  });

  refresh();
})();
