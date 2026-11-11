/* Rabbis directory, US map, search and "Yahrzeits this week".
   Reads /rabbis.json (built by Jekyll from the _rabbis folder). */
(function () {
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var STATE_NAMES = window.STATE_NAMES || {};
  var cache = null;
  function load() {
    if (!cache) cache = fetch(BASE + '/rabbis.json').then(function (r) { return r.json(); }).then(function (list) {
      list.forEach(function (r) {
        if (typeof r.states === 'string') r.states = r.states ? [r.states] : [];
        r._hay = norm([r.name, r.hebrew, r.places, (r.states || []).map(function (s) { return s + ' ' + (STATE_NAMES[s] || ''); }).join(' '), r.yahrzeit].join(' '));
      });
      return list;
    });
    return cache;
  }
  function norm(s) { return (s || '').toLowerCase().replace(/[֑-ׇ]/g, '').replace(/[’'"״׳]/g, ''); }
  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function years(r) { return (r.born || r.died) ? (r.born || '?') + ' – ' + (r.died || '?') : ''; }
  function tile(r) {
    var img = r.portrait || (BASE + '/assets/images/portrait-placeholder.svg');
    return '<a class="rabbi-tile" href="' + r.url + '"><img src="' + img + '" alt="" loading="lazy"><span class="rt-body"><strong>' + esc(r.name) + '</strong>' +
      (r.hebrew ? '<span class="he">' + esc(r.hebrew) + '</span>' : '') +
      (years(r) ? '<span class="dates">' + years(r) + '</span>' : (r.yahrzeit ? '<span class="dates">Yahrzeit: ' + esc(r.yahrzeit) + '</span>' : '')) +
      (r.places ? '<span class="meta">' + esc(r.places.split('; ').slice(0, 3).join(' · ')) + '</span>' : '') + '</span></a>';
  }

  /* ---------- the map ---------- */
  function paintMap(svg, list, onPick) {
    var counts = {};
    list.forEach(function (r) { (r.states || []).forEach(function (s) { counts[s] = (counts[s] || 0) + 1; }); });
    var max = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; }).concat([1]));
    svg.querySelectorAll('.state').forEach(function (p) {
      var s = p.getAttribute('data-state'), n = counts[s] || 0;
      p.classList.toggle('has', n > 0);
      // scale: log so New York doesn't drown out everyone else
      var lvl = n ? Math.max(1, Math.round(5 * Math.log(1 + n) / Math.log(1 + max))) : 0;
      p.setAttribute('data-level', lvl);
      p.querySelector('title').textContent = p.getAttribute('data-name') + (n ? ' — ' + n + ' rabbi' + (n === 1 ? '' : 's') : '');
      if (n) p.addEventListener('click', function () { onPick(s); });
    });
    return counts;
  }

  /* ---------- Directory page (/rabbis/) ---------- */
  function directory(root) {
    var q = root.querySelector('#rq'), sel = root.querySelector('#rstate'), out = root.querySelector('#rresults'),
        status = root.querySelector('#rstatus'), svg = root.querySelector('svg.us-map'), letters = root.querySelector('#rletters');
    var letter = '';
    load().then(function (list) {
      var counts = paintMap(svg, list, function (s) { sel.value = s; letter = ''; run(true); });
      Object.keys(counts).sort(function (a, b) { return (STATE_NAMES[a] || a).localeCompare(STATE_NAMES[b] || b); }).forEach(function (s) {
        var o = document.createElement('option'); o.value = s; o.textContent = (STATE_NAMES[s] || s) + ' (' + counts[s] + ')'; sel.appendChild(o);
      });
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (L) {
        var has = list.some(function (r) { return (r.sort || '').toUpperCase().charAt(0) === L; });
        var b = document.createElement('button'); b.type = 'button'; b.textContent = L; b.disabled = !has;
        b.addEventListener('click', function () { letter = (letter === L ? '' : L); run(); });
        letters.appendChild(b);
      });
      var params = new URLSearchParams(location.search);
      if (params.get('state')) sel.value = params.get('state');
      if (params.get('q')) q.value = params.get('q');
      run(!!params.get('state'));
      function run(scroll) {
        var terms = norm(q.value).split(/\s+/).filter(Boolean), st = sel.value;
        var hits = list.filter(function (r) {
          return (!st || (r.states || []).indexOf(st) !== -1) &&
                 (!letter || (r.sort || '').toUpperCase().charAt(0) === letter) &&
                 terms.every(function (t) { return r._hay.indexOf(t) !== -1; });
        });
        svg.querySelectorAll('.state').forEach(function (p) { p.classList.toggle('picked', p.getAttribute('data-state') === st); });
        letters.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.textContent === letter); });
        status.textContent = hits.length + ' rabbi' + (hits.length === 1 ? '' : 's') + (st ? ' in ' + (STATE_NAMES[st] || st) : '') + (letter ? ' · ' + letter : '');
        out.innerHTML = hits.map(tile).join('');
        var url = new URL(location.href);
        st ? url.searchParams.set('state', st) : url.searchParams.delete('state');
        q.value ? url.searchParams.set('q', q.value) : url.searchParams.delete('q');
        history.replaceState(null, '', url);
        if (scroll) status.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      q.addEventListener('input', function () { run(); });
      sel.addEventListener('change', function () { run(true); });
      root.querySelector('#rclear').addEventListener('click', function () { q.value = ''; sel.value = ''; letter = ''; run(); });
    });
  }

  /* ---------- Home page map: clicking a state opens the directory ---------- */
  function homeMap(svg) {
    load().then(function (list) {
      var box = document.querySelector('#map-pick');
      paintMap(svg, list, function (s) {
        var inState = list.filter(function (r) { return (r.states || []).indexOf(s) !== -1; });
        svg.querySelectorAll('.state').forEach(function (p) { p.classList.toggle('picked', p.getAttribute('data-state') === s); });
        box.innerHTML = '<div class="mp-head"><strong>' + esc(STATE_NAMES[s] || s) + '</strong> · ' + inState.length + ' rabbi' + (inState.length === 1 ? '' : 's') +
          ' <a href="' + BASE + '/rabbis/?state=' + s + '">See all ›</a></div><div class="mp-list">' +
          inState.slice(0, 8).map(function (r) {
            return '<a href="' + r.url + '"><img src="' + (r.portrait || BASE + '/assets/images/portrait-placeholder.svg') + '" alt="" loading="lazy"><span>' + esc(r.name) + '</span></a>';
          }).join('') + '</div>';
      });
    });
  }

  /* ---------- Home page search ---------- */
  function homeSearch(form) {
    var input = form.querySelector('input'), drop = form.querySelector('.hs-results');
    input.addEventListener('input', function () {
      var terms = norm(input.value).split(/\s+/).filter(Boolean);
      if (!terms.length) { drop.hidden = true; return; }
      load().then(function (list) {
        var hits = list.filter(function (r) { return terms.every(function (t) { return r._hay.indexOf(t) !== -1; }); }).slice(0, 8);
        drop.innerHTML = (hits.length ? hits.map(function (r) {
          return '<a href="' + r.url + '"><strong>' + esc(r.name) + '</strong> <span class="he">' + esc(r.hebrew || '') + '</span><span class="meta">' + esc([years(r), (r.places || '').split('; ')[0]].filter(Boolean).join(' · ')) + '</span></a>';
        }).join('') : '<p class="meta">No rabbis found.</p>') +
          '<a class="hs-all" href="' + BASE + '/search/?q=' + encodeURIComponent(input.value) + '">Search the derashos and seforim for “' + esc(input.value) + '” ›</a>';
        drop.hidden = false;
      });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); location.href = BASE + '/rabbis/?q=' + encodeURIComponent(input.value); });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) drop.hidden = true; });
  }

  /* ---------- Yahrzeits this week ---------- */
  var HEB_MONTH = { 'Tishri': 'Tishrei', 'Heshvan': 'Cheshvan', 'Kislev': 'Kislev', 'Tevet': 'Teves', 'Shevat': 'Shevat',
    'Adar': 'Adar', 'Adar I': 'Adar', 'Adar II': 'Adar', 'Nisan': 'Nissan', 'Iyar': 'Iyar', 'Sivan': 'Sivan', 'Tamuz': 'Tammuz', 'Av': 'Av', 'Elul': 'Elul' };
  function hebDate(d) {
    var parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long' }).formatToParts(d);
    var day = +parts.find(function (p) { return p.type === 'day'; }).value;
    var m = parts.find(function (p) { return p.type === 'month'; }).value;
    return { day: day, month: HEB_MONTH[m] || m, raw: m };
  }
  function yahrzeits(box) {
    load().then(function (list) {
      var days = [], today = new Date();
      for (var i = 0; i < 7; i++) {
        var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i), h = hebDate(d);
        // a yahrzeit on the 30th falls on the 1st of the next month when this month has only 29 days
        var next = hebDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
        var who = list.filter(function (r) {
          if (!r.ym || !r.yd) return false;
          if (r.ym === h.month && r.yd === h.day) return true;
          return h.day === 29 && next.day === 1 && r.ym === h.month && r.yd === 30;
        });
        if (who.length) days.push({ date: d, h: h, who: who });
      }
      if (!days.length) { box.querySelector('.yz-list').innerHTML = '<p class="meta">No yahrzeits recorded for the coming week.</p>'; return; }
      box.querySelector('.yz-list').innerHTML = days.map(function (x) {
        var label = x.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        return '<div class="yz-day"><div class="yz-date"><strong>' + label + '</strong><span>' + x.h.day + ' ' + x.h.raw + '</span></div><div class="yz-people">' +
          x.who.map(function (r) {
            return '<a href="' + r.url + '"><img src="' + (r.portrait || BASE + '/assets/images/portrait-placeholder.svg') + '" alt="" loading="lazy"><span><strong>' + esc(r.name) + '</strong>' +
              (r.hebrew ? '<span class="he">' + esc(r.hebrew) + '</span>' : '') + '</span></a>';
          }).join('') + '</div></div>';
      }).join('');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dir = document.querySelector('#rabbi-directory'); if (dir) directory(dir);
    var hm = document.querySelector('#home-map svg.us-map'); if (hm) homeMap(hm);
    var hs = document.querySelector('#home-search'); if (hs) homeSearch(hs);
    var yz = document.querySelector('#yahrzeits'); if (yz) yahrzeits(yz);
  });
})();
