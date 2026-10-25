(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (p, tag, a = {}, txt) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; p.appendChild(e); return e; };
  const pad = (v, n) => String(Math.round(v)).padStart(n, '0');
  const onView = (els, fn, threshold = .35) => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } }), {threshold});
    els.forEach(el => io.observe(el));
  };
  const bodyData = fetch('assets/body.json').then(r => r.json()).catch(() => null);
  const C = {ink: css('--ink'), bg: css('--bg'), mute: css('--mute'), dim: css('--dim'), line: css('--line'), line2: css('--line-2'),
             root: css('--root'), rootInk: css('--root-ink'), rw: css('--rewrite'), pass: css('--pass'), harm: css('--harm'), tile: css('--tile')};

  // registration crosses
  $$('.plate').forEach(p => ['tl','tr','bl','br'].forEach(c => { const b = document.createElement('b'); b.className = 'x ' + c; p.appendChild(b); }));

  // copy buttons
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'copied ✓'; } catch { b.textContent = 'select ↑'; }
    setTimeout(() => b.textContent = 'copy', 1800);
  }));

  // ── the cell matrix ───────────────────────────────
  const G = {I:["#####","..#..","..#..","..#..","..#..","..#..","#####"],
             N:["#...#","#...#","##..#","#.#.#","#..##","#...#","#...#"],
             T:["#####","..#..","..#..","..#..","..#..","..#..","..#.."]};
  const cells = []; let x0 = 0;
  for (const ch of "INIT") { G[ch].forEach((row, r) => [...row].forEach((v, c) => v === "#" && cells.push([x0 + c, r]))); x0 += 6; }
  const U = 10, CS = 8.4, D = .8;

  // ── hero figure ───────────────────────────────────
  const fig = $('#fig'); if (fig) {
  const ann = mk(fig, 'g', {class: 'ann'});
  mk(ann, 'line', {class: 'dl', x1: 0, y1: -14, x2: 230, y2: -14});
  [0, 230].forEach(x => mk(ann, 'line', {class: 'dl', x1: x, y1: -17, x2: x, y2: -11}));
  mk(ann, 'rect', {x: 96, y: -17.5, width: 38, height: 7, fill: C.bg});
  mk(ann, 'text', {x: 115, y: -12.7, 'text-anchor': 'middle'}, '23 cells');
  mk(ann, 'line', {class: 'dl', x1: -14, y1: 0, x2: -14, y2: 70});
  [0, 70].forEach(y => mk(ann, 'line', {class: 'dl', x1: -17, y1: y, x2: -11, y2: y}));
  mk(ann, 'text', {x: -18, y: 37, 'text-anchor': 'end'}, '7');
  mk(ann, 'path', {class: 'll', d: 'M 226 5 L 248 -6 L 330 -6'});
  mk(ann, 'circle', {cx: 226, cy: 5, r: 1, fill: C.dim});
  mk(ann, 'text', {x: 250, y: -8.5, class: 'k'}, 'BODY');
  mk(ann, 'text', {x: 250, y: -1}, 'prompts · tools · compiled core');
  mk(ann, 'text', {x: 250, y: 4.6}, 'the model may rewrite every cell');
  mk(ann, 'path', {class: 'll', d: 'M 226 84 L 248 96 L 330 96'});
  mk(ann, 'circle', {cx: 226, cy: 84, r: 1, fill: C.rootInk});
  mk(ann, 'text', {x: 250, y: 93.5, class: 'kr'}, 'ROOT');
  mk(ann, 'text', {x: 250, y: 101}, 'keys · record · rollback · off switch');
  mk(ann, 'text', {x: 250, y: 106.6}, 'the one thing it can never rewrite');
  const els = cells.map(([cx, cy]) => mk(fig, 'rect', {class: 'c', x: cx*U + D, y: cy*U + D, width: CS, height: CS, rx: 1.2}));
  mk(fig, 'rect', {x: D, y: 8*U + D, width: 23*U - 2*D, height: 6, fill: C.root});

  const cap = $('#caption'), gen = $('#gen') || {}, cnt = $('#cnt') || {}, rb = $('#rb') || {};
  const say = (t, cls) => { if (!cap) return; cap.textContent = t; cap.className = 'caprow ' + (cls || ''); };
  let g = 41, n = 0, r = 0;
  const pick = () => els[Math.floor(Math.random() * els.length)];
  const setc = (e, c) => e.setAttribute('class', 'c' + (c ? ' ' + c : ''));
  async function rewrite(k) {
    const batch = [...new Set(Array.from({length: k}, pick))];
    for (const e of batch) { setc(e, 'rw'); await sleep(60); }
    await sleep(420);
    for (const e of batch) { setc(e, 'ok'); n++; cnt.textContent = n; await sleep(40); }
    await sleep(380);
    for (const e of batch) setc(e, '');
  }
  (async () => {
    if (reduce) { say('› every cell can be rewritten · the Root line cannot'); return; }
    await sleep(1100);
    for (;;) {
      say('› rewriting its own core · running the four checks', 'c-rw');
      for (let j = 0; j < 4; j++) { await rewrite(3 + Math.floor(Math.random() * 4)); await sleep(160); }
      g++; gen.textContent = g;
      say(`✓ new core swapped in · same conversation · gen ${g}`, 'c-ok'); await sleep(2400);
      say(`› rewriting again · gen ${g + 1}`, 'c-rw');
      await rewrite(5); await sleep(200);
      const bad = [...new Set(Array.from({length: 6}, pick))];
      bad.forEach(e => setc(e, 'bad'));
      say('✕ harm detected · error spike', 'c-harm'); await sleep(1500);
      bad.forEach(e => setc(e, ''));
      r++; rb.textContent = r;
      say(`↺ the Root rolled the system back → gen ${g}`, 'c-root'); await sleep(2800);
    }
  })();
  }

  // ── cross field ───────────────────────────────────
  function mixc(a, b, t) {
    const p = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16));
    const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
  }
  (() => {
    const host = $('.hero'), canvas = $('#field'); if (!host || !canvas) return; const ctx = canvas.getContext('2d'), step = 32, R = 190;
    let W = 0, H = 0, mx = -1e4, my = -1e4, tx = -1e4, ty = -1e4, raf = 0;
    const px = $('#px'), py = $('#py');
    function size() { const dpr = Math.min(devicePixelRatio || 1, 2); W = host.clientWidth; H = host.clientHeight; canvas.width = W*dpr; canvas.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); draw(); }
    function draw() {
      raf = 0; ctx.clearRect(0, 0, W, H);
      const on = tx > -1e3;
      if (on) { mx += (tx - mx) * .2; my += (ty - my) * .2; }
      for (let y = step + 56; y < H; y += step) for (let x = step; x < W; x += step) {
        const k = on ? Math.max(0, 1 - Math.hypot(x - mx, y - my) / R) : 0;
        const s = 2.5 + k * 4.5;
        const a = Math.max(.22, 1 - Math.hypot((x - W*.72) / W, (y - H*.45) / H) * 1.5);
        ctx.globalAlpha = Math.min(1, a + k);
        ctx.strokeStyle = k > .02 ? mixc(C.line2, C.ink, k * .8) : C.line2;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x - s, y + .5); ctx.lineTo(x + s, y + .5); ctx.moveTo(x + .5, y - s); ctx.lineTo(x + .5, y + s); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (on) {
        ctx.strokeStyle = C.rw; ctx.globalAlpha = .38; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(0, Math.round(my) + .5); ctx.lineTo(W, Math.round(my) + .5); ctx.moveTo(Math.round(mx) + .5, 56); ctx.lineTo(Math.round(mx) + .5, H); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
        const sx = Math.round(mx / step) * step, sy = Math.round((my - 56) / step) * step + 56;
        ctx.strokeRect(sx - 6.5, sy - 6.5, 13, 13);
        ctx.fillStyle = C.mute; ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillText(`${pad(sx / step, 2)}:${pad((sy - 56) / step, 2)}`, sx + 11, sy - 9);
        px.textContent = pad(mx, 4); py.textContent = pad(my, 4);
        if (Math.abs(tx - mx) + Math.abs(ty - my) > .4) raf = requestAnimationFrame(draw);
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    host.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const b = host.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; if (mx < -1e3) { mx = tx; my = ty; } kick(); });
    host.addEventListener('pointerleave', () => { tx = ty = mx = my = -1e4; kick(); });
    new ResizeObserver(size).observe(host); size();
  })();

  // ── nav: progress, active link, scrolled ──────────
  const nav = $('#nav'), prog = $('#prog'), links = $$('#links a');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (100 * scrollY / Math.max(1, max)) + '%';
    nav.classList.toggle('scrolled', scrollY > 8);
  };
  addEventListener('scroll', onScroll, {passive: true}); onScroll();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), {rootMargin: '-45% 0px -50% 0px'});
  $$('main > section').forEach(s => io.observe(s));
  const coords = () => $$('.sec').forEach(s => { const c = $('.coord', s); if (c) c.textContent = 'y ' + pad(s.offsetTop, 5); });
  addEventListener('resize', coords); document.fonts.ready.then(coords); coords();

  // ── reveals, rules, count-ups ─────────────────────
  if (reduce) $$('.reveal').forEach(e => e.classList.add('in'));
  else onView($$('.reveal'), e => e.classList.add('in'), .12);
  onView($$('.sh'), e => e.classList.add('seen'), .5);
  const fmt = (v, dec) => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
  onView($$('.num[data-to]'), el => {
    const to = +el.dataset.to, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', small = $('small', el).outerHTML;
    if (reduce) { el.innerHTML = pre + fmt(to, dec) + small; return; }
    const t0 = performance.now(), Dur = 1200;
    const f = now => { const k = Math.min(1, (now - t0) / Dur), e = 1 - Math.pow(1 - k, 3); el.innerHTML = pre + fmt(to * e, dec) + small; if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, .5);

  // ── 01 two harnesses ──────────────────────────────
  (() => {
    const A = $('#tbA'), B = $('#tbB'), rdA = $('#rdA'), rdB = $('#rdB'), slider = $('#cap'), capv = $('#capv'); if (!A || !B) return;
    const W = 300, H = 200, cell = 9, gap = 2, base = 172;
    let rewrites = 0, lastSide = 1, auto = !reduce, t = 0, userAt = 0;
    function draw(cv) {
      const side = 2 + Math.round(cv / 100 * 14);            // model: side × side cells
      const pitch = cell + gap, size = side * pitch - gap;
      const cx = W / 2;
      for (const [svg, fixed] of [[A, true], [B, false]]) {
        svg.innerHTML = '';
        const frame = fixed ? 7 * pitch + 18 : size + 20;       // fixed harness frame vs rewritten frame
        const fy = base - 10 - frame, fx = cx - frame / 2;
        const hit = fixed && side > 7;
        // cells: the ones that don't fit a fixed frame press against it, faded
        const g = mk(svg, 'g');
        const ox = cx - size / 2, oy = base - 20 - size;
        for (let i = 0; i < side; i++) for (let j = 0; j < side; j++) {
          const x = ox + i * pitch, y = oy + j * pitch;
          const out = fixed && (x < fx + 4 || x + cell > fx + frame - 4 || y < fy + 4);
          mk(g, 'rect', {x, y, width: cell, height: cell, rx: 1.4, fill: out ? C.harm : C.ink, opacity: out ? .22 : 1});
        }
        // frame
        mk(svg, 'rect', {x: fx, y: fy, width: frame, height: frame, fill: 'none', stroke: hit ? C.harm : (fixed ? C.ink : C.rw), 'stroke-width': hit ? 1.4 : 1, 'stroke-dasharray': fixed ? '0' : '3 3'});
        if (fixed) {
          // hand-drawn dimension, frozen
          mk(svg, 'text', {x: fx + frame + 6, y: fy + 8, 'font-size': 8, 'font-family': 'IBM Plex Mono, monospace', fill: hit ? C.harm : C.mute}, hit ? 'ceiling' : 'fixed');
        } else {
          mk(svg, 'text', {x: fx + frame + 6, y: fy + 8, 'font-size': 8, 'font-family': 'IBM Plex Mono, monospace', fill: C.rw}, 'rewritten');
        }
        // the floor: for INIT, the Root; for the fixed harness, nothing special
        if (!fixed) mk(svg, 'rect', {x: cx - 70, y: base + 1.5, width: 140, height: 2, fill: C.root});
        else mk(svg, 'line', {x1: cx - 70, y1: base + 2.5, x2: cx + 70, y2: base + 2.5, stroke: C.line2});
        mk(svg, 'text', {x: cx, y: base + 18, 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'IBM Plex Mono, monospace', fill: fixed ? C.mute : C.ink}, fixed ? 'drawn once, by hand' : 'ROOT · stays put');
      }
      if (side !== lastSide) { if (side > lastSide && lastSide) rewrites++; lastSide = side; }
      const lost = Math.max(0, side * side - 49);
      rdA.innerHTML = side > 7 ? `<span class="c-harm">✕ ceiling · ${lost} of ${side * side} cells don't fit</span>` : `fits, for now · frame drawn once, by hand`;
      rdB.innerHTML = `<span class="c-rw">frame redrawn ${rewrites}×</span> · Root unchanged`;
      capv.textContent = `model ${side}×${side}`;
    }
    slider.addEventListener('input', () => { auto = false; userAt = performance.now(); draw(+slider.value); });
    if (reduce) { slider.value = 62; } draw(+slider.value);
    let visible = false;
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe($('#twobox'));
    setInterval(() => {
      if (!auto && performance.now() - userAt > 9000 && !reduce) auto = true;
      if (!auto || !visible) return;
      t += .012; const v = 50 - 50 * Math.cos(t);
      slider.value = v; draw(v);
    }, 60);
  })();

  // ── 03 shape: the real body map ───────────────────
  (async () => {
    const grid = $('#bmgrid'); if (!grid) return;
    let data;
    data = await bodyData; if (!data) return;
    const hov = $('#bmhov'), evBox = $('#bmev');
    $('#bmv').textContent = data.version; $('#bmf').textContent = data.files.length;
    $('#bmt').textContent = Math.round(data.tokens / 1000) + 'k';
    const tierName = ['prompt / skill', 'tool · WebAssembly', 'compiled core · Rust'];
    const cellsB = data.files.map(([p, t, k]) => {
      const i = document.createElement('i'); i.className = 't' + k; i.dataset.p = p; i.dataset.t = t; i.dataset.k = k;
      const ev = data.events[p];
      if (ev) i.classList.add('ev', ev[2] === 'kept' ? 'kept' : ev[2] === 'rolled back' ? 'rolled' : 'prom');
      grid.appendChild(i); return i;
    });
    const show = i => { hov.innerHTML = `<b style="font-weight:500">${i.dataset.p}</b> · ${(+i.dataset.t).toLocaleString('en-US')} tok · ${tierName[i.dataset.k]}`; };
    grid.addEventListener('pointerover', e => { if (e.target.tagName === 'I') show(e.target); });
    const idle = matchMedia('(pointer: coarse)').matches ? 'tap a cell' : 'hover a cell'; hov.textContent = idle;
    grid.addEventListener('pointerleave', () => { hov.textContent = idle; });
    grid.addEventListener('click', e => { if (e.target.tagName === 'I') show(e.target); });
    const evs = Object.entries(data.events).sort((x, y) => x[1][0] < y[1][0] ? -1 : 1);
    const btns = evs.map(([p, [date, txt, st]]) => {
      const b = document.createElement('button');
      const cls = st === 'kept' ? 'kept' : st === 'rolled back' ? 'rolled' : 'promoted';
      b.innerHTML = `<span class="p">${p}</span><span class="st ${cls}">${date} · ${st}</span><span class="d">${txt}</span>`;
      const cell = cellsB.find(c => c.dataset.p === p);
      b.addEventListener('mouseenter', () => { grid.classList.add('dimmed'); cell.classList.add('hl'); show(cell); btns.forEach(x => x.classList.toggle('on', x === b)); });
      b.addEventListener('mouseleave', () => { grid.classList.remove('dimmed'); cell.classList.remove('hl'); });
      evBox.appendChild(b); return b;
    });
    // illustrative churn on the core tier, labelled in the legend as the ring = real changes
    if (!reduce) {
      const core = cellsB.filter(c => c.dataset.k === '2' && !c.classList.contains('ev'));
      setInterval(() => { const c = core[Math.floor(Math.random() * core.length)]; c.classList.add('flash'); setTimeout(() => c.classList.remove('flash'), 500); }, 700);
    }
  })();

  // ── 01 versus rows ────────────────────────────────
  if ($('#versus')) onView($$('#versus .vr'), r => { r.classList.add('in'); setTimeout(() => r.classList.add('done'), reduce ? 0 : 1200); }, .5);

  // ── live version from GitHub ──────────────────────
  (() => { try { const c = JSON.parse(sessionStorage.getItem('init-rel') || 'null'); if (c) return Promise.resolve(c); } catch {} return fetch('https://api.github.com/repos/nagisanzenin/INIT-Agent/releases/latest').then(r => r.ok ? r.json() : null).then(j => { try { j && sessionStorage.setItem('init-rel', JSON.stringify({tag_name: j.tag_name, published_at: j.published_at})); } catch {} return j; }); })().then(j => {
    if (!j || !j.tag_name) return;
    const v = $('#ver'); if (v) v.textContent = j.tag_name; $('#nver').textContent = j.tag_name; const fv = $('#fver'); if (fv) fv.textContent = 'INIT ' + j.tag_name;
    $('#nver').title = 'latest release · ' + (j.published_at || '').slice(0, 10);
  }).catch(() => {});

  // ── keys ──────────────────────────────────────────
  (() => {
    const ov = $('#gridov'), keys = $('#keys'), secs = $$('main > section.sec');
    addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(document.activeElement.tagName)) return;
      if (!ov || !keys) return;
      if (e.key === 'g' || e.key === 'G') ov.classList.toggle('on');
      else if (e.key === '?') keys.classList.toggle('on');
      else if (e.key === 'Escape') { keys.classList.remove('on'); ov.classList.remove('on'); }
      else if (e.key === 'r' || e.key === 'R') { const b = $('#rreplay'); b && b.click(); }
      else if (/^[1-9]$/.test(e.key) && secs[+e.key - 1]) secs[+e.key - 1].scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
    });
    const mm = $('#mm'); if (mm) mm.addEventListener('click', () => { const o = nav.classList.toggle('open'); mm.setAttribute('aria-expanded', o); mm.textContent = o ? 'close ▴' : 'menu ▾'; });
    $$('#links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); if (mm) { mm.textContent = 'menu ▾'; mm.setAttribute('aria-expanded', false); } }));
    console.log('%cINIT', 'font:700 22px monospace;letter-spacing:4px', '\nEverything is writable, except the Root.\nSource: https://github.com/nagisanzenin/INIT-Agent · press G for the grid');
  })();

  // ── 03 story ──────────────────────────────────────
  (() => {
    const steps = $$('#steps .step'), scenes = $$('.scene'), ticks = $$('#ticks i'), foot = $('#vfoot'); if (!steps.length) return;
    const feet = [
      'diagram · cells are parts of the body · cyan is the change in flight',
      'measured · v0.3.2 fresh install · M2 · mock model · no-op change · replayed fast · ↳ bundle-e2e-t2.json',
      'measured · v0.3.2 fresh install · M2 · mock model · no-op change · replayed fast · ↳ bundle-e2e-t2.json',
      'diagram of the overlapped hand-off · ↳ ADR-001 · hand-off stage 4.3 s measured, v0.3.2',
      'simulated signal · signals and actions from ADR-011 §3.3',
    ];
    // scene 0: cell grid
    const cg = $('#cg');
    let hero = null;
    bodyData.then(d => {
      if (!d) return;
      d.files.forEach(([p, t, k]) => { const e = document.createElement('i'); e.className = k === 0 ? 'l0' : k === 1 ? 'l1' : ''; if (p === 'src/loop/mod.rs') { e.classList.add('proto'); hero = e; } e.title = p; cg.appendChild(e); });
    });
    let editTimer = 0;
    const startEdit = () => {
      clearInterval(editTimer); if (reduce) return;
      editTimer = setInterval(() => hero && hero.classList.toggle('go'), 520);
    };
    // gates
    const gates = $$('#gates .gate'), nested = $('#nested');
    let gateRun = 0;
    async function runGates(focus) {
      const my = ++gateRun;
      nested.classList.toggle('show', focus === 2);
      gates.forEach((gt, i) => {
        gt.classList.toggle('dim', focus === 1 ? i > 1 : false);
        gt.classList.remove('done'); $('.tr i', gt).style.width = '0'; $('.t', gt).textContent = '—';
      });
      const list = focus === 1 ? gates.slice(0, 2) : gates;
      for (const gt of list) {
        if (my !== gateRun) return;
        const s = +gt.dataset.s, bar = $('.tr i', gt), tt = $('.t', gt);
        if (focus === 2 && gates.indexOf(gt) < 2) { bar.style.width = '100%'; gt.classList.add('done'); tt.textContent = '✓ ' + s + ' s'; continue; }
        const Dur = reduce ? 0 : Math.max(450, s / 120 * 1000), t0 = performance.now();
        await new Promise(res => { const f = now => { if (my !== gateRun) return res(); const k = Dur ? Math.min(1, (now - t0) / Dur) : 1; bar.style.width = (k * 100) + '%'; tt.textContent = (s * k).toFixed(s < 20 ? 1 : 0) + ' s'; k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
        if (my !== gateRun) return;
        gt.classList.add('done'); tt.textContent = '✓ ' + s + ' s';
      }
    }
    // hand-off timeline
    const hs = $('#hand');
    const X0 = 90, X1 = 420, T = [0, 1], xs = v => X0 + (X1 - X0) * v;
    mk(hs, 'text', {x: 0, y: 46}, 'old body');
    mk(hs, 'text', {x: 0, y: 96}, 'new body');
    mk(hs, 'text', {x: 0, y: 146}, 'the log');
    [40, 90].forEach(y => mk(hs, 'rect', {class: 'lane', x: X0, y: y - 10, width: X1 - X0, height: 14, rx: 2}));
    const oldBar = mk(hs, 'rect', {class: 'old', x: X0, y: 30, height: 14, rx: 2, width: 0});
    const newBar = mk(hs, 'rect', {class: 'new', x: xs(.3), y: 80, height: 14, rx: 2, width: 0});
    const logOld = mk(hs, 'rect', {x: X0, y: 136, height: 6, width: 0, fill: C.ink});
    const logNew = mk(hs, 'rect', {x: xs(.62), y: 136, height: 6, width: 0, fill: C.pass});
    mk(hs, 'line', {x1: X0, y1: 139, x2: X1, y2: 139, stroke: C.line2, 'stroke-dasharray': '2 3'});
    const marks = [[.3, 'new core boots on a copy'], [.6, 'pause · log handed over'], [.62, ''], [.8, 'ready + 3 s settle'], [.9, 'swap · old core exits']];
    const mg = mk(hs, 'g');
    let row = 0; marks.forEach(([v, lab]) => { if (!lab) return; row++; const gg = mk(mg, 'g', {opacity: 0, 'data-v': v}); mk(gg, 'line', {x1: xs(v), y1: 16, x2: xs(v), y2: 150, stroke: C.line2, 'stroke-dasharray': '2 2'}); mk(gg, 'rect', {x: xs(v) - 6, y: 152, width: 12, height: 12, fill: C.ink}); mk(gg, 'text', {x: xs(v), y: 161, 'text-anchor': 'middle', fill: C.bg}, String(row)); mk(gg, 'text', {x: X0 + (row - 1 < 2 ? 0 : 190), y: 184 + ((row - 1) % 2) * 14}, row + '  ' + lab); });
    const play = mk(hs, 'line', {class: 'ph', x1: X0, y1: 14, x2: X0, y2: 152});
    const tl = mk(hs, 'text', {x: X0, y: 226, fill: C.ink}, '');
    mk(hs, 'text', {x: X0, y: 246}, 'one writer at a time · a failed swap changes nothing');
    let handRun = 0;
    async function runHand() {
      const my = ++handRun; const Dur = 5200, t0 = performance.now();
      return new Promise(res => {
        const f = now => {
          if (my !== handRun) return res();
          const v = reduce ? 1 : Math.min(1, (now - t0) / Dur);
          play.setAttribute('x1', xs(v)); play.setAttribute('x2', xs(v));
          oldBar.setAttribute('width', Math.max(0, xs(Math.min(v, .9)) - X0));
          oldBar.setAttribute('opacity', v > .6 && v < .9 ? .35 : 1);
          newBar.setAttribute('width', Math.max(0, xs(Math.max(.3, v)) - xs(.3)));
          newBar.setAttribute('class', v > .8 ? 'newok' : 'new');
          logOld.setAttribute('width', Math.max(0, xs(Math.min(v, .6)) - X0));
          logNew.setAttribute('width', Math.max(0, xs(Math.max(.62, v)) - xs(.62)));
          $$('g[data-v]', mg).forEach(gg => gg.setAttribute('opacity', v >= +gg.dataset.v ? 1 : 0));
          tl.textContent = v < .3 ? 'old body working' : v < .6 ? 'both running · new body probed beside the old' : v < .62 ? 'lock taken by the kernel' : v < .9 ? 'new body owns the log · hand-off stage 4.3 s' : 'swapped · same conversation';
          v < 1 ? requestAnimationFrame(f) : res();
        };
        reduce ? f(performance.now()) : requestAnimationFrame(f);
      });
    }
    // watch: signal chips + chart
    const SIG = ['H1','H2','H3','H4','H5','H6','H7','H8','H9','H10','H11','H12'];
    const chips = $('#chips'); const chipEls = SIG.map(s => { const e = document.createElement('span'); e.textContent = s; chips.appendChild(e); return e; });
    const wc = $('#watch'), wx = wc.getContext('2d');
    const N = 160; let data = [], v = .3, spike = 0, tt = 0, marksW = [], above = false, watchOn = false;
    const nextV = () => { tt++; if (spike > 0) { spike--; v += (.86 - v) * .35; } else { v += (.3 - v) * .08 + (Math.random() - .5) * .05; if (Math.random() < .012) spike = 12; } return Math.max(.05, Math.min(.98, v + (Math.random() - .5) * .03)); };
    for (let i = 0; i < N; i++) { if (i === 96) spike = 12; const y = nextV(); data.push(y); if (y > .7 && !above) { above = true; marksW.push(tt + 5); } if (y < .5) above = false; }
    function drawW() {
      const dpr = Math.min(devicePixelRatio || 1, 2), W = wc.clientWidth, H = wc.clientHeight;
      if (wc.width !== W * dpr) { wc.width = W * dpr; wc.height = H * dpr; }
      wx.setTransform(dpr, 0, 0, dpr, 0, 0); wx.clearRect(0, 0, W, H);
      wx.strokeStyle = C.line; wx.lineWidth = 1;
      for (let i = 1; i < 4; i++) { wx.beginPath(); wx.moveTo(0, Math.round(H*i/4)+.5); wx.lineTo(W, Math.round(H*i/4)+.5); wx.stroke(); }
      const thr = Math.round(H * .3) + .5;
      wx.strokeStyle = C.harm; wx.setLineDash([4, 4]); wx.beginPath(); wx.moveTo(0, thr); wx.lineTo(W, thr); wx.stroke(); wx.setLineDash([]);
      const dx = W / (N - 1);
      marksW.forEach(m => { const xx = (m - (tt - N + 1)) * dx; if (xx >= 0 && xx <= W) { wx.strokeStyle = C.ink; wx.setLineDash([3, 3]); wx.beginPath(); wx.moveTo(Math.round(xx) + .5, 0); wx.lineTo(Math.round(xx) + .5, H); wx.stroke(); wx.setLineDash([]); wx.fillStyle = C.ink; wx.font = '10px "IBM Plex Mono", monospace'; const lab = '↺ rolled back'; const w = wx.measureText(lab).width; wx.fillText(lab, Math.min(xx + 6, W - w - 2), 12); } });
      wx.strokeStyle = C.ink; wx.lineWidth = 1.25; wx.beginPath();
      data.forEach((y, i) => { const X = i * dx, Y = H * (1 - y); i ? wx.lineTo(X, Y) : wx.moveTo(X, Y); }); wx.stroke();
      wx.fillStyle = C.mute; wx.font = '10px "IBM Plex Mono", monospace'; wx.fillText('H5b · cost per turn vs your baseline', 0, H - 4);
    }
    setInterval(() => {
      if (!watchOn || reduce) return;
      data.shift(); const y = nextV(); data.push(y);
      if (y > .7 && !above) { above = true; marksW.push(tt + 5); chipEls[4].classList.add('hot'); setTimeout(() => chipEls[4].classList.remove('hot'), 1600); }
      if (y < .5) above = false;
      marksW = marksW.filter(m => m > tt - N);
      drawW();
    }, 70);

    let curS = -1;
    function activate(s) {
      if (s === curS) return; curS = s;
      steps.forEach(st => st.classList.toggle('on', +st.dataset.s === s));
      ticks.forEach((t, i) => t.classList.toggle('on', i <= s));
      const sceneIdx = s === 2 ? 1 : s;
      scenes.forEach(sc => sc.classList.toggle('on', +sc.dataset.s === sceneIdx));
      foot.textContent = feet[s];
      watchOn = s === 4;
      if (s === 0) startEdit(); else clearInterval(editTimer);
      if (s === 1 || s === 2) runGates(s); else gateRun++;
      if (s === 3) runHand(); else handRun++;
      if (s === 4) drawW();
    }
    // scroll-driven: the step whose box contains the viewport's centre is active
    let pend = 0;
    const pickStep = () => {
      pend = 0; const mid = innerHeight / 2; let best = 0;
      steps.forEach(st => { const r = st.getBoundingClientRect(); if (r.top <= mid) best = +st.dataset.s; });
      activate(best);
    };
    addEventListener('scroll', () => { if (!pend) pend = requestAnimationFrame(pickStep); }, {passive: true});
    addEventListener('resize', pickStep);
    activate(0); pickStep();
    if (matchMedia('(max-width: 900px)').matches) {
      $('.story').classList.add('flat');
      onView([$('.story .viz')], () => { startEdit(); runGates(2); runHand(); watchOn = true; drawW(); }, .2);
    }
  })();

  // ── 04 trust: signals and ladder ──────────────────
  (() => {
    const S = [
      ['H1','acute','Crash or boot loop'], ['H2','acute','Deafness: it stops answering you'], ['H3','acute','You reverse it: /reject, /rollback, /panic'],
      ['H4','acute','Scope: a demoting refusal or an escapee'], ['H5','acute · chronic','Money: an hourly burst, or cost per turn'], ['H6','acute','Resources: memory kills, disk floor, spawn churn'],
      ['H7','chronic','Your corrections'], ['H8','chronic','Wall time per turn'], ['H9','chronic','Provider errors from malformed requests'],
      ['H10','chronic','Runaway turns: requests per turn'], ['H11','chronic','Egress volume per turn'], ['H12','always honoured','Veto: the agent asks to undo its own change'],
    ];
    const grid = $('#siggrid'); if (!grid) return;
    const els2 = S.map(([id, cls, nm]) => { const d = document.createElement('div'); d.className = 'sig'; d.innerHTML = `<span class="id">${id}<span>${cls}</span></span><span class="nm">${nm}</span>`; grid.appendChild(d); return d; });
    if (!reduce) setInterval(() => { const e = els2[Math.floor(Math.random() * els2.length)]; e.classList.add('hot'); setTimeout(() => e.classList.remove('hot'), 1500); }, 2600);

    const L = [
      ['L0', 'Its whole body: prompts, tools, core', null],
      ['L1', '+ its own kernel', [['days at L0', '7'], ['your turns', '40'], ['change groups closed clean', '10'], ['direct-harm rollbacks, last 30 groups', '≤ 6'], ['other', 'baseline full · no demotion in 7 days']]],
      ['L2', '+ more open changes at once', [['days at L1', '21'], ['your turns', '150'], ['change groups closed clean', '40'], ['direct-harm rollbacks, last 30 groups', '≤ 4'], ['other', 'no quarantine in 14 days · 2 clean twin reports']]],
      ['L3', '+ more kinds of external action', [['days at L2', '30'], ['your turns', '400'], ['change groups closed clean', '100'], ['direct-harm rollbacks, last 30 groups', '≤ 3'], ['other', '4 clean weekly twin reports']]],
      ['L4', '+ the model itself, as a component', [['days at L3', '30'], ['your turns', '400'], ['change groups closed clean', '100'], ['direct-harm rollbacks, last 30 groups', '≤ 3'], ['other', 'you raise the charter cap to 4']]],
    ];
    const rungs = $('#rungs'), req = $('#req'); if (!rungs || !req) return;
    const base = document.createElement('div'); base.className = 'base'; rungs.appendChild(base);
    const btns = L.map(([lv, ad], i) => { const b = document.createElement('button'); b.className = 'rung' + (i === 0 ? ' on' : ''); b.innerHTML = `<span class="lv">${lv}</span><span class="ad">${ad}</span>${i === 0 ? '<span class="here">v0.3 · here</span>' : ''}`; rungs.appendChild(b); return b; });
    const down = document.createElement('div'); down.className = 'down'; down.textContent = '▼ one level down on harm, a /panic, or a crash loop';
    req.parentNode.insertBefore(down, req);
    let userL = false, curL = 0;
    function showL(i) {
      curL = i; btns.forEach((b, j) => b.classList.toggle('on', j === i));
      const [lv, ad, rq] = L[i];
      req.innerHTML = `<span class="lbl">${lv} · ${i ? 'what earns it' : 'where every install starts'}</span><h4>${ad}</h4>` + (rq ? `<table>${rq.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table>` : `<p class="body">Already the whole body — prompts, tools and the compiled core. Only the kernel waits for L1. Every install starts here, and v0.3 is capped here.</p>`);
    }
    btns.forEach((b, i) => { b.addEventListener('mouseenter', () => { userL = true; showL(i); }); b.addEventListener('click', () => { userL = true; showL(i); }); });
    showL(0);
    if (!reduce) setInterval(() => { if (!userL) showL((curL + 1) % 5); }, 3600);
  })();

  // ── 05 record: pins and ledger ────────────────────
  $$('#pinsA li').forEach(li => {
    const lines = $$(`#termA .ln[data-pin="${li.dataset.pin}"]`);
    li.addEventListener('mouseenter', () => lines.forEach(l => l.classList.add('hl')));
    li.addEventListener('mouseleave', () => lines.forEach(l => l.classList.remove('hl')));
  });
  if ($('#termA')) onView([$('#termA')], async () => {
    if (reduce) return;
    for (const p of ['1', '2', '3', '4']) { const ls = $$(`#termA .ln[data-pin="${p}"]`); ls.forEach(l => l.classList.add('hl')); await sleep(900); ls.forEach(l => l.classList.remove('hl')); }
  }, .5);
  if ($('#ledger')) onView([$('#ledger')], async () => {
    if (reduce) return;
    for (const rec of $$('#ledger .rec')) { rec.classList.add('flash'); await sleep(700); }
  }, .4);

  // ── record: real logs, replayed ──
  (() => {
    const body = $('#rbody'); if (!body) return;
    const clock = $('#rclock'), file = $('#rfile'), note = $('#rnote'), prompt = $('#rprompt'), tabBox = $('#rtabs');
    const T = id => $(id) || {};   // optional telemetry readouts
    const tLog = T('#tLog'), tEv = T('#tEv'), tW = T('#tWall');
    const S = [
      { tab: 'swap its core', file: 'sessions/20261020-093001-1599d5.jsonl', note: 'real log · DeepSeek · 2026-10-20 · condensed', speed: 1.3,
        prompt: '› (the agent has edited its own core on branch evo/doc-loop and asked to promote it)',
        L: [
        [0.0, 'tool', '▸ initctl promote  <span class="okk">✓ G0 337 s · G1 4 s · G2 22 s · G3 761 s</span>', 'checks pass'],
        [0.4, 'mu', '  state: awaiting_boundary — the old core keeps the conversation until a pause'],
        [5.5, 'rl', '[boot] reason=promote · sha=50e08e1 · same session log', 'new core booted'],
        [6.0, 'rl', '[init:notice] promoted: {"handoff":true}'],
        [7.5, 'u', '› Which commit are you running now, and what did your last change do? Two lines.'],
        [8.5, 'mu', '[init:signals] context 4% · cache 92% last · up 0m'],
        [10.5, 'a', '● Running 50e08e1 (provisional; parent LKG 016a684 — note my local body checkout still points at 016a684 while the kernel runs 50e08e1).', 'same conversation'],
        [12.0, 'a', '  My last change added a one-line summary at the top of src/loop/mod.rs; documentation only, no code path changed.'],
        [13.0, 'mu', 'new process · same conversation · provider cache kept'],
      ]},
      { tab: 'roll back', file: 'root/lineage/lineage.jsonl · records 88–90', note: 'real signed record · DeepSeek · 2026-10-21 · gated mode', speed: 1.2,
        prompt: '› (proof sprint: the agent changed its shell tool to print a hint when a leading cd fails)',
        L: [
        [0.0, 'mu', '08:32:33.794Z  seq 88 · by root · sealed_g4'],
        [0.4, 'bad', '  d = −50‰ (−5.0 points) · n 29 × 3 · status inferior', 'scored no better'],
        [1.8, 'mu', '08:32:33.857Z  seq 89 · by kernel · gate g4'],
        [2.2, 'bad', '  verdict reject · reason score_inferior', 'rejected'],
        [4.6, 'mu', '08:32:42.579Z  seq 90 · by kernel · body_rollback'],
        [5.0, 'rl', '  c88be5f → aaf07b7 · reason gate.g4.score_inferior', 'rolled back'],
        [6.4, 'okk', 'audit-verify: lineage ok · sha256 chain · ed25519'],
        [7.6, 'mu', '9 s from verdict to rollback · −5.0 is inside the 5.7-point noise floor: refused, not proven harmful'],
      ]},
      { tab: 'add a tool', file: 'sessions/20261020-073230-dd1b56.jsonl', note: 'real log · DeepSeek · 2026-10-20 · condensed', speed: 9,
        prompt: '› Sort the 40 version strings in work/a2/versions.txt by SemVer precedence. Do it with a T1 extension named semver-sort that you write, reload and call through the ext tool.',
        L: [
        [1.7, 'a', "● I'll start by looking at the task input and my extension-authoring skill."],
        [6.8, 'tool', '▸ read body/skills/ext-authoring/SKILL.md  <span class="okk">✓</span>'],
        [23.3, 'a', "● Now I'll write the semver-sort extension."],
        [35.2, 'tool', '▸ write ext/semver-sort/src/lib.rs  <span class="okk">✓ 363 lines</span>', 'tool written'],
        [87.0, 'tool', '▸ cargo test  <span class="okk">✓ 8 passed; 0 failed</span>', '8 tests pass'],
        [92.0, 'tool', '▸ cargo build --target wasm32-wasip2  <span class="okk">✓</span>'],
        [107.1, 'rl', '[init:reload] + semver-sort 0.1.0 (trial, compiled in 75 ms)', 'tool loaded'],
        [108.5, 'tool', '▸ ext semver-sort  <span class="bad">✕ /work/work/a2/versions.txt: No such file or directory</span>'],
        [110.6, 'a', "● The tool's /work maps to INIT_HOME/work, so paths are relative to that."],
        [110.7, 'tool', '▸ ext semver-sort  <span class="okk">✓ {"count":40, "sorted":["0.0.0","0.0.1",…]}</span>', 'tool used'],
        [114.1, 'tool', '▸ verify with an independent Python check  <span class="okk">✓ 40 lines</span>'],
        [116.6, 'mu', '26 turns · 1 min 57 s · the new tool stays in its toolset, on trial'],
      ]},
    ];

    // ── DEMO HOOK ───────────────────────────────────────────────────────────
    // The real user-chair demo (owner asks INIT to change a visible behaviour of its own core, it swaps,
    // then undoes) becomes tab 1 here when it lands. Steps:
    //   1. condense research/demo/replay.json into site/assets/demo.json with ONE entry of the shape used in S:
    //      {tab, file, note, speed, prompt, L: [[t_seconds, cls, html, event?], ...]}
    //      cls ∈ u (user) · a (assistant) · tool · rl (Root/boot) · okk · bad · mu (muted)
    //   2. take `tab` and `note` from research/demo/SUMMARY.md (model, date, what was condensed, any caveat)
    //   3. set DEMO_URL below. Nothing is fetched while it is null, so no 404 in the console.
    const DEMO_URL = null; // e.g. 'assets/demo.json'
    let run = 0, k = 0, tabs = [];
    function build() {
      tabBox.innerHTML = '';
      tabs = S.map((ss, j) => { const b = document.createElement('button'); b.textContent = `${j + 1} · ${ss.tab}`; b.appendChild(document.createElement('i')); b.addEventListener('click', () => play(j)); tabBox.appendChild(b); return b; });
    }
    function play(i) {
      const my = ++run; k = i; const ss = S[i];
      tabs.forEach((b, j) => { b.classList.toggle('on', j === i); b.style.setProperty('--p', '0%'); });
      body.innerHTML = ''; prompt.textContent = ss.prompt; file.textContent = ss.file; note.textContent = ss.note;
      tLog.textContent = `${i + 1} / ${S.length}`; tEv.textContent = '–';
      const last = ss.L[ss.L.length - 1][0], t0 = performance.now(); let shown = 0;
      const tick = () => {
        if (my !== run) return;
        const t = reduce ? 1e9 : (performance.now() - t0) / 1000 * ss.speed;
        while (shown < ss.L.length && ss.L[shown][0] <= t) {
          const [ts, cls, txt, ev] = ss.L[shown];
          const d = document.createElement('div'); d.className = 'ln ' + cls;
          d.innerHTML = `<span class="t">${ts.toFixed(1).padStart(5, ' ')}</span>` + txt;
          body.appendChild(d); if (reduce) d.classList.add('in'); else requestAnimationFrame(() => d.classList.add('in'));
          if (ev) tEv.textContent = ev; shown++;
          while (body.children.length > 12) body.removeChild(body.firstChild);
        }
        const tc = Math.min(t, last);
        clock.textContent = `t +${tc.toFixed(1)} s`; tW.textContent = `${tc.toFixed(1)} s`;
        tabs[i].style.setProperty('--p', (100 * tc / last) + '%');
        if (shown < ss.L.length) requestAnimationFrame(tick);
        else { const c = document.createElement('span'); c.className = 'cur'; body.lastChild.appendChild(c); if (!reduce) setTimeout(() => { if (my === run) play((i + 1) % S.length); }, 5000); }
      };
      tick();
    }
    $('#rreplay').addEventListener('click', () => play(k));
    const start = () => { build(); if (reduce) play(0); else setTimeout(() => play(0), 600); };
    if (DEMO_URL) fetch(DEMO_URL).then(r => r.ok ? r.json() : null).then(d => { if (d && d.L) S.unshift(d); }).catch(() => {}).finally(start);
    else start();
  })();

  // ── nav over the night section ──
  (() => {
    const night = $('.night'); if (!night) return;
    const check = () => { const r = night.getBoundingClientRect(); nav.classList.toggle('dark', r.top < 56 && r.bottom > 56); };
    addEventListener('scroll', check, {passive: true}); check();
  })();
})();
