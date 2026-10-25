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
  const fig = $('#fig');
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

  const cap = $('#caption'), gen = $('#gen'), cnt = $('#cnt'), rb = $('#rb');
  const say = (t, cls) => { cap.textContent = t; cap.className = 'caprow ' + (cls || ''); };
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
      say('› rewriting its own core · T2 · gates G0–G3', 'c-rw');
      for (let j = 0; j < 4; j++) { await rewrite(3 + Math.floor(Math.random() * 4)); await sleep(160); }
      g++; gen.textContent = g;
      say(`✓ hot-swapped mid-conversation · same log · gen ${g}`, 'c-ok'); await sleep(2400);
      say(`› rewriting again · gen ${g + 1}`, 'c-rw');
      await rewrite(5); await sleep(200);
      const bad = [...new Set(Array.from({length: 6}, pick))];
      bad.forEach(e => setc(e, 'bad'));
      say('✕ harm sentinel · error spike · H9', 'c-harm'); await sleep(1500);
      bad.forEach(e => setc(e, ''));
      r++; rb.textContent = r;
      say(`↺ the Root rolled the system back → gen ${g}`, 'c-root'); await sleep(2800);
    }
  })();

  // ── cross field ───────────────────────────────────
  function mixc(a, b, t) {
    const p = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16));
    const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
  }
  (() => {
    const host = $('.hero'), canvas = $('#field'), ctx = canvas.getContext('2d'), step = 32, R = 190;
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
        const a = Math.max(.1, 1 - Math.hypot((x - W*.5) / W, (y - H*.42) / H) * 1.55);
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
    const A = $('#tbA'), B = $('#tbB'), rdA = $('#rdA'), rdB = $('#rdB'), slider = $('#cap'), capv = $('#capv');
    const W = 300, H = 220, cell = 9, gap = 2, base = 196;
    let rewrites = 0, lastSide = 0, auto = !reduce, t = 0, userAt = 0;
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
        if (!fixed) mk(svg, 'rect', {x: cx - 70, y: base, width: 140, height: 5, fill: C.root});
        else mk(svg, 'line', {x1: cx - 70, y1: base + 2.5, x2: cx + 70, y2: base + 2.5, stroke: C.line2});
        mk(svg, 'text', {x: cx, y: base + 18, 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'IBM Plex Mono, monospace', fill: fixed ? C.mute : C.rootInk}, fixed ? 'drawn once, by hand' : 'ROOT · stays put');
      }
      if (side !== lastSide) { if (side > lastSide && lastSide) rewrites++; lastSide = side; }
      const lost = Math.max(0, side * side - 49);
      rdA.innerHTML = side > 7 ? `<span class="c-harm">✕ ceiling hit · ${lost} of ${side * side} cells don't fit</span>` : `model ${side}×${side} · fits, for now`;
      rdB.innerHTML = `model ${side}×${side} · <span class="c-rw">box rewritten ${rewrites}×</span> · Root unchanged`;
      capv.textContent = Math.round(cv);
    }
    slider.addEventListener('input', () => { auto = false; userAt = performance.now(); draw(+slider.value); });
    draw(+slider.value);
    let visible = false;
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe($('#twobox'));
    setInterval(() => {
      if (!auto && performance.now() - userAt > 9000 && !reduce) auto = true;
      if (!auto || !visible) return;
      t += .012; const v = 50 - 50 * Math.cos(t);
      slider.value = v; draw(v);
    }, 60);
  })();

  // ── 02 shape: layers ──────────────────────────────
  (() => {
    const D2 = {
      body: {t: 'Body', who: 'Rewritten by <b>the model</b>, from L0 — where every install starts.', items: [
        ['T0', 'Prompts and skills. Take effect on reload.'],
        ['T1', 'New tools as WebAssembly components, loaded in the same session.'],
        ['T2', 'The compiled Rust core: loop, provider client, context, built-in tools, boot. Hot-swapped.'],
        ['SELF.md', 'A map of its own body that fails a test if any path in it doesn\'t exist.']]},
      kernel: {t: 'Kernel', who: 'Rewritten by <b>the model</b>, from L1 — earned, not granted.', items: [
        ['admit', 'Takes a change request and checks it fits the budget for open changes.'],
        ['G0–G4', 'Runs the gates: build, self-map, boot probe, can-still-change, sealed regression.'],
        ['swap', 'Hands the live conversation to a new body at a step boundary.'],
        ['ADR-001', 'The swapper is never the swapped.']]},
      root: {t: 'Root', who: 'Rewritten by <b>nobody</b>. A separate process; only you can stop it.', items: [
        ['keys', 'Holds your API keys and meters every model call. The agent never holds a key.'],
        ['record', 'An append-only, Ed25519-signed lineage of every promotion, rollback and stop.'],
        ['undo', 'APFS clones before every change; rolls back to the last version that worked.'],
        ['stop', '/stop, /panic, a harm sentinel, a memory watchdog and a disk floor.']]},
    };
    const detail = $('#detail'), layers = $$('.layer');
    let cur = 'body', userPick = false;
    function show(k) {
      cur = k; layers.forEach(l => l.classList.toggle('on', l.dataset.l === k));
      const d = D2[k];
      detail.innerHTML = `<span class="lbl">${k === 'root' ? 'The fixed point' : 'Writable'}</span><h4>${d.t}</h4><div class="who">${d.who}</div><ul>${d.items.map(([a, b]) => `<li><code>${a}</code><span>${b}</span></li>`).join('')}</ul>`;
      $$('.x', detail).length || ['tl','tr','bl','br'].forEach(c => { const b = document.createElement('b'); b.className = 'x ' + c; detail.appendChild(b); });
    }
    layers.forEach(l => { l.addEventListener('click', () => { userPick = true; show(l.dataset.l); }); l.addEventListener('mouseenter', () => { userPick = true; show(l.dataset.l); }); });
    show('body');
    // tiers light up in turn, like changes landing
    const tiers = $$('.layer .tiers span');
    if (!reduce) setInterval(() => { const t = tiers[Math.floor(Math.random() * tiers.length)]; t.classList.add('rw'); setTimeout(() => t.classList.remove('rw'), 900); }, 1400);
    if (!reduce) setInterval(() => { if (userPick) return; const order = ['body', 'kernel', 'root']; show(order[(order.indexOf(cur) + 1) % 3]); }, 4200);
  })();

  // ── 03 story ──────────────────────────────────────
  (() => {
    const steps = $$('#steps .step'), scenes = $$('.scene'), ticks = $$('#ticks i'), foot = $('#vfoot');
    const feet = [
      'diagram · cells are parts of the body · cyan is the change in flight',
      'measured · v0.3.2 fresh install · M2 · mock model · no-op change · replayed fast · ↳ bundle-e2e-t2.json',
      'measured · v0.3.2 fresh install · M2 · mock model · no-op change · replayed fast · ↳ bundle-e2e-t2.json',
      'diagram of the overlapped hand-off · ↳ ADR-001 · hand-off stage 4.3 s measured, v0.3.2',
      'simulated signal · signals and actions from ADR-011 §3.3',
    ];
    // scene 0: cell grid
    const cg = $('#cg');
    const cgc = Array.from({length: 18 * 6}, (_, i) => { const e = document.createElement('i'); const row = Math.floor(i / 18); e.className = row < 1 ? 't0' : row < 3 ? 't1' : ''; e.dataset.base = e.className; cg.appendChild(e); return e; });
    let editTimer = 0;
    const startEdit = () => {
      clearInterval(editTimer); if (reduce) return;
      editTimer = setInterval(() => {
        const pool = cgc.slice(54); const e = pool[Math.floor(Math.random() * pool.length)];
        e.className = 'rw'; setTimeout(() => e.className = e.dataset.base, 1300);
      }, 180);
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
    const marks = [[.3, 'probe boots on a copy of the log'], [.6, 'step boundary · old pauses, releases the log'], [.62, ''], [.8, 'ready + 3 s settle'], [.9, 'rename(2) · old exits']];
    const mg = mk(hs, 'g');
    marks.forEach(([v, s], i) => { if (!s) return; const gg = mk(mg, 'g', {opacity: 0, 'data-v': v}); mk(gg, 'line', {x1: xs(v), y1: 16, x2: xs(v), y2: 150, stroke: C.line2, 'stroke-dasharray': '2 2'}); mk(gg, 'text', {x: xs(v) + 3, y: 172 + (i % 2) * 13}, s); });
    const play = mk(hs, 'line', {class: 'ph', x1: X0, y1: 14, x2: X0, y2: 152});
    const tl = mk(hs, 'text', {x: X0, y: 222, fill: C.ink}, '');
    mk(hs, 'text', {x: X0, y: 238}, 'one writer at a time');
    mk(hs, 'text', {x: X0, y: 251}, 'if the new body dies before rename(2), the old one resumes');
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
    const SIG = ['H1 crash loop','H2 deafness','H3 your undo','H4 scope','H5 money','H6 resources','H7 corrections','H8 wall time','H9 provider errors','H10 runaway turns','H11 egress','H12 veto'];
    const chips = $('#chips'); const chipEls = SIG.map(s => { const e = document.createElement('span'); e.textContent = s; chips.appendChild(e); return e; });
    const wc = $('#watch'), wx = wc.getContext('2d');
    const N = 160; let data = [], v = .3, spike = 0, tt = 0, marksW = [], above = false, watchOn = false;
    const nextV = () => { tt++; if (spike > 0) { spike--; v += (.86 - v) * .35; } else { v += (.3 - v) * .08 + (Math.random() - .5) * .05; if (Math.random() < .012) spike = 12; } return Math.max(.05, Math.min(.98, v + (Math.random() - .5) * .03)); };
    for (let i = 0; i < N; i++) data.push(nextV());
    function drawW() {
      const dpr = Math.min(devicePixelRatio || 1, 2), W = wc.clientWidth, H = wc.clientHeight;
      if (wc.width !== W * dpr) { wc.width = W * dpr; wc.height = H * dpr; }
      wx.setTransform(dpr, 0, 0, dpr, 0, 0); wx.clearRect(0, 0, W, H);
      wx.strokeStyle = C.line; wx.lineWidth = 1;
      for (let i = 1; i < 4; i++) { wx.beginPath(); wx.moveTo(0, Math.round(H*i/4)+.5); wx.lineTo(W, Math.round(H*i/4)+.5); wx.stroke(); }
      const thr = Math.round(H * .3) + .5;
      wx.strokeStyle = C.harm; wx.setLineDash([4, 4]); wx.beginPath(); wx.moveTo(0, thr); wx.lineTo(W, thr); wx.stroke(); wx.setLineDash([]);
      const dx = W / (N - 1);
      marksW.forEach(m => { const xx = (m - (tt - N + 1)) * dx; if (xx >= 0 && xx <= W) { wx.fillStyle = C.root; wx.fillRect(Math.round(xx), 0, 2, H); wx.fillStyle = C.rootInk; wx.font = '10px "IBM Plex Mono", monospace'; wx.fillText('↺ Root rolls back the change group', Math.min(xx + 6, W - 200), 12); } });
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
    const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activate(+e.target.dataset.s); }), {rootMargin: '-48% 0px -48% 0px'});
    steps.forEach(st => sio.observe(st));
    activate(0);
  })();

  // ── 04 trust: signals and ladder ──────────────────
  (() => {
    const S = [
      ['H1','acute','Crash or boot loop'], ['H2','acute','Deafness: it stops answering you'], ['H3','acute','You reverse it: /reject, /rollback, /panic'],
      ['H4','acute','Scope: a demoting refusal or an escapee'], ['H5','acute · chronic','Money: an hourly burst, or cost per turn'], ['H6','acute','Resources: memory kills, disk floor, spawn churn'],
      ['H7','chronic','Your corrections'], ['H8','chronic','Wall time per turn'], ['H9','chronic','Provider errors from malformed requests'],
      ['H10','chronic','Runaway turns: requests per turn'], ['H11','chronic','Egress volume per turn'], ['H12','always honoured','Veto: the agent asks to undo its own change'],
    ];
    const grid = $('#siggrid');
    const els2 = S.map(([id, cls, nm]) => { const d = document.createElement('div'); d.className = 'sig'; d.innerHTML = `<span class="id">${id}<span>${cls}</span></span><span class="nm">${nm}</span>`; grid.appendChild(d); return d; });
    if (!reduce) setInterval(() => { const e = els2[Math.floor(Math.random() * els2.length)]; e.classList.add('hot'); setTimeout(() => e.classList.remove('hot'), 1500); }, 2600);

    const L = [
      ['L0', 'Its whole body: prompts, tools, core', null],
      ['L1', '+ its own kernel', [['days at L0', '7'], ['your turns', '40'], ['change groups closed clean', '10'], ['direct-harm rollbacks, last 30 groups', '≤ 6'], ['other', 'baseline full · no demotion in 7 days']]],
      ['L2', '+ more open changes at once', [['days at L1', '21'], ['your turns', '150'], ['change groups closed clean', '40'], ['direct-harm rollbacks, last 30 groups', '≤ 4'], ['other', 'no quarantine in 14 days · 2 clean twin reports']]],
      ['L3', '+ more kinds of external action', [['days at L2', '30'], ['your turns', '400'], ['change groups closed clean', '100'], ['direct-harm rollbacks, last 30 groups', '≤ 3'], ['other', '4 clean weekly twin reports']]],
      ['L4', '+ the model itself, as a component', [['days at L3', '30'], ['your turns', '400'], ['change groups closed clean', '100'], ['direct-harm rollbacks, last 30 groups', '≤ 3'], ['other', 'you raise the charter cap to 4']]],
    ];
    const rungs = $('#rungs'), req = $('#req');
    const base = document.createElement('div'); base.className = 'base'; rungs.appendChild(base);
    const btns = L.map(([lv, ad], i) => { const b = document.createElement('button'); b.className = 'rung' + (i === 0 ? ' on' : ''); b.innerHTML = `<span class="lv">${lv}</span><span class="ad">${ad}</span>${i === 0 ? '<span class="here">v0.3 · here</span>' : ''}`; rungs.appendChild(b); return b; });
    const down = document.createElement('div'); down.className = 'down'; down.textContent = '▼ one level down on harm, a /panic, or a crash loop';
    rungs.parentNode.insertBefore(down, req);
    let userL = false, curL = 0;
    function showL(i) {
      curL = i; btns.forEach((b, j) => b.classList.toggle('on', j === i));
      const [lv, ad, rq] = L[i];
      req.innerHTML = `<span class="lbl">${lv} · ${i ? 'what earns it' : 'where every install starts'}</span><h4>${ad}</h4>` + (rq ? `<table>${rq.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table>` : `<p class="body">Already the whole body — prompts, tools and the compiled core. Only the kernel waits for L1. Every install starts here, and v0.3 is capped here.</p>`);
      ['tl','tr','bl','br'].forEach(c => { const b = document.createElement('b'); b.className = 'x ' + c; req.appendChild(b); });
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
  onView([$('#termA')], async () => {
    if (reduce) return;
    for (const p of ['1', '2', '3', '4']) { const ls = $$(`#termA .ln[data-pin="${p}"]`); ls.forEach(l => l.classList.add('hl')); await sleep(900); ls.forEach(l => l.classList.remove('hl')); }
  }, .5);
  onView([$('#ledger')], async () => {
    if (reduce) return;
    for (const rec of $$('#ledger .rec')) { rec.classList.add('flash'); await sleep(700); }
  }, .4);
})();
