/* =========================================================================
   THE TOAD WHALE — interactions
   ========================================================================= */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* Failsafe: if any effect below blows up, the copy must still be readable. */
  window.addEventListener('error', () => {
    document.documentElement.classList.remove('js');
  });

  /* ---------------------------------------------------------------- year */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------- deep space bg */
  const canvas = $('#space');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1;
    let stars = [], rocks = [], bubbles = [];
    let scrollY = window.scrollY;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(220, Math.round((w * h) / 7000));
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.25,
        z: Math.random() * 0.9 + 0.1,            // depth → parallax + brightness
        t: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.006          // twinkle speed
      }));

      rocks = Array.from({ length: Math.max(6, Math.round(w / 220)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 16 + 5,
        z: Math.random() * 0.6 + 0.2,
        a: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 0.006,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.1,
        pts: Array.from({ length: 8 }, () => Math.random() * 0.45 + 0.75)
      }));

      bubbles = Array.from({ length: Math.round(w / 90) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.4 + 0.6,
        v: Math.random() * 0.28 + 0.08,
        o: Math.random() * 0.35 + 0.08,
        d: Math.random() * Math.PI * 2
      }));
    }

    function frame(now) {
      ctx.clearRect(0, 0, w, h);
      const par = scrollY * 0.28;

      /* stars */
      for (const st of stars) {
        st.t += st.s;
        const tw = 0.45 + Math.sin(st.t) * 0.55;
        let y = (st.y - par * st.z) % h;
        if (y < 0) y += h;
        ctx.globalAlpha = Math.max(0, tw * st.z);
        ctx.fillStyle = st.z > 0.72 ? '#cdefff' : '#ffffff';
        ctx.beginPath();
        ctx.arc(st.x, y, st.r * st.z + 0.2, 0, Math.PI * 2);
        ctx.fill();
        if (st.r > 1.25 && tw > 0.85) {
          ctx.globalAlpha = (tw - 0.85) * 1.6;
          ctx.strokeStyle = '#9ee0ff';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(st.x - 4, y); ctx.lineTo(st.x + 4, y);
          ctx.moveTo(st.x, y - 4); ctx.lineTo(st.x, y + 4);
          ctx.stroke();
        }
      }

      /* rising plankton / bubbles — a nod to the deep */
      for (const b of bubbles) {
        b.y -= b.v;
        b.d += 0.01;
        if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }
        ctx.globalAlpha = b.o;
        ctx.fillStyle = '#7ed2ff';
        ctx.beginPath();
        ctx.arc(b.x + Math.sin(b.d) * 8, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* drifting asteroids */
      for (const rk of rocks) {
        rk.x += rk.vx; rk.y += rk.vy; rk.a += rk.va;
        if (rk.x < -60) rk.x = w + 60; if (rk.x > w + 60) rk.x = -60;
        if (rk.y < -60) rk.y = h + 60; if (rk.y > h + 60) rk.y = -60;

        let y = (rk.y - par * rk.z * 0.6) % h;
        if (y < 0) y += h;

        ctx.save();
        ctx.translate(rk.x, y);
        ctx.rotate(rk.a);
        ctx.globalAlpha = 0.5 + rk.z * 0.4;
        const g = ctx.createLinearGradient(-rk.r, -rk.r, rk.r, rk.r);
        g.addColorStop(0, '#39424f');
        g.addColorStop(0.55, '#161c26');
        g.addColorStop(1, '#080b11');
        ctx.fillStyle = g;
        ctx.beginPath();
        rk.pts.forEach((p, i) => {
          const ang = (i / rk.pts.length) * Math.PI * 2;
          const px = Math.cos(ang) * rk.r * p;
          const py = Math.sin(ang) * rk.r * p * 0.85;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    build();
    requestAnimationFrame(frame);
    window.addEventListener('resize', build);
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  }

  /* ------------------------------------------------------------ spotlight */
  const spot = $('.spotlight');
  if (spot && !reduced) {
    let tx = 50, ty = 30, cx = 50, cy = 30, raf = null;
    window.addEventListener('pointermove', (e) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      spot.style.setProperty('--mx', cx + '%');
      spot.style.setProperty('--my', cy + '%');
      raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : null;
    }
  }

  /* ------------------------------------------------------------------ nav */
  const nav = $('#nav');
  const burger = $('#burger');
  const navLinks = $('#navLinks');

  const onScroll = () => {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* active section highlighting */
  const sections = $$('section[id]');
  const linkFor = {};
  $$('#navLinks a').forEach(a => { linkFor[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const a = linkFor[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Object.values(linkFor).forEach(l => l.classList.remove('active'));
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* --------------------------------------------------------- scroll reveal */
  const revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const sibs = Array.from(el.parentElement ? el.parentElement.children : []);
        const idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
        el.classList.add('in');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('in'));
  }

  /* ------------------------------------------------------------ 3D tilt */
  if (!reduced && window.matchMedia('(hover:hover)').matches) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        const rx = ((py / r.height) - 0.5) * -7;
        const ry = ((px / r.width) - 0.5) * 9;
        card.style.setProperty('--px', px + 'px');
        card.style.setProperty('--py', py + 'px');
        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.015)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------- counters */
  const fmt = (n) => n.toLocaleString('en-US');
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const dur = 1500;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(target * eased)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => { c.textContent = fmt(parseFloat(c.dataset.count) || 0) + (c.dataset.suffix || ''); });
  }

  /* ------------------------------------------------------ text scramble */
  if (!reduced) {
    const chars = '$#@%&*<>/\\|=+ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $$('[data-scramble]').forEach((el, k) => {
      const final = el.dataset.scramble;
      let f = 0;
      const total = 34 + k * 6;
      const start = performance.now() + k * 220;
      (function run(now) {
        if (now < start) return requestAnimationFrame(run);
        f++;
        let out = '';
        for (let i = 0; i < final.length; i++) {
          const revealAt = (i / final.length) * total * 0.72;
          if (f > revealAt + 8 || final[i] === ' ') out += final[i];
          else out += chars[(Math.random() * chars.length) | 0];
        }
        el.textContent = out;
        if (f < total) requestAnimationFrame(run);
        else el.textContent = final;
      })(performance.now());
    });
  }

  /* --------------------------------------------------------- copy the CA */
  const toast = $('#toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function wireCopy(btnId, codeId) {
    const btn = $(btnId), code = $(codeId);
    if (!btn || !code) return;
    btn.addEventListener('click', async () => {
      const text = code.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const label = $('span', btn);
        if (label) label.textContent = 'Copied';
        btn.classList.add('copied');
        showToast('Contract address copied');
        setTimeout(() => {
          if (label) label.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        showToast('Copy failed — select it manually');
      }
    });
  }
  wireCopy('#caCopy', '#caText');
  wireCopy('#caCopy2', '#caText2');

  /* ------------------------------------------- portal parallax on cursor
     The transform lives on the wrapper — .portal itself is owned by the
     float keyframes, and an animation would win over an inline style. */
  const art = $('.hero__art');
  if (art && !reduced && window.matchMedia('(hover:hover)').matches) {
    let px = 0, py = 0, ax = 0, ay = 0, running = false;
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / window.innerWidth - 0.5) * 26;
      py = (e.clientY / window.innerHeight - 0.5) * 20;
      if (!running) { running = true; requestAnimationFrame(glide); }
    }, { passive: true });
    function glide() {
      ax += (px - ax) * 0.07;
      ay += (py - ay) * 0.07;
      art.style.transform = `translate3d(${ax.toFixed(2)}px, ${ay.toFixed(2)}px, 0)`;
      if (Math.abs(px - ax) > 0.2 || Math.abs(py - ay) > 0.2) requestAnimationFrame(glide);
      else running = false;
    }
  }

  /* ------------------------------------------- one open FAQ item at a time */
  const faqItems = $$('.faq details');
  faqItems.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) faqItems.forEach(o => { if (o !== d) o.open = false; });
    });
  });
})();
