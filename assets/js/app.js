/* =========================================================
   MIRAFIORE — scroll motion engine (vanilla, no deps)
   ========================================================= */
(() => {
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. PRELOADER ---------- */
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPct');
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 14);
    bar.style.width = p + '%';
    pct.textContent = String(Math.floor(p)).padStart(2, '0');
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('locked');
        document.body.classList.add('ready');
      }, 420);
    }
  }, 170);
  document.body.classList.add('locked');

  /* ---------- 2. CUSTOM CURSOR ---------- */
  const cur = document.getElementById('cursor');
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });

  /* ---------- 3. NAV state ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;

  /* ---------- 4. SCROLL-LINKED ELEMENTS ---------- */
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const pin = document.getElementById('collezione');
  const pinTrack = document.getElementById('pinTrack');
  const pinBar = document.getElementById('pinBar');
  const marquee = document.getElementById('marqueeTrack');
  let marqX = 0;

  // give the pinned section enough scroll length for its horizontal travel
  function sizePin() {
    if (!pin) return;
    const travel = Math.max(0, pinTrack.scrollWidth - innerWidth + 80);
    pin.style.height = (innerHeight + travel * 1.15) + 'px';
    pin.dataset.travel = travel;
  }
  sizePin();
  addEventListener('resize', sizePin);
  addEventListener('load', sizePin);

  /* ---------- 5. WORD-BY-WORD MANIFESTO ---------- */
  const wordsEl = document.querySelector('[data-words]');
  let words = [];
  if (wordsEl) {
    wordsEl.innerHTML = wordsEl.textContent.trim().split(/\s+/)
      .map(w => `<span class="w">${w}</span>`).join(' ');
    words = [...wordsEl.querySelectorAll('.w')];
  }

  /* ---------- 6. RAF LOOP ---------- */
  let sy = scrollY, ease = scrollY;
  function raf() {
    sy = scrollY;
    ease = lerp(ease, sy, 0.12);

    // cursor
    cx = lerp(cx, tx, 0.18); cy = lerp(cy, ty, 0.18);
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;

    // nav
    if (sy > innerHeight * 0.8) nav.classList.add('solid'); else nav.classList.remove('solid');
    if (sy > lastY && sy > innerHeight * 1.2) nav.classList.add('hide'); else nav.classList.remove('hide');
    lastY = sy;

    // parallax layers
    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax);
      const off = (r.top + r.height / 2 - innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0,${off.toFixed(2)}px,0)`;
    });

    // pinned horizontal gallery
    if (pin) {
      const r = pin.getBoundingClientRect();
      const travel = +pin.dataset.travel || 0;
      const prog = clamp(-r.top / (pin.offsetHeight - innerHeight || 1));
      pinTrack.style.transform = `translate3d(${(-prog * travel).toFixed(2)}px,0,0)`;
      pinBar.style.width = (prog * 100).toFixed(2) + '%';
    }

    // marquee: constant drift + scroll velocity
    if (marquee) {
      marqX -= 0.6 + Math.abs(sy - ease) * 0.05;
      const half = marquee.scrollWidth / 2;
      if (-marqX >= half) marqX += half;
      marquee.style.transform = `translate3d(${marqX.toFixed(2)}px,0,0)`;
    }

    // manifesto word highlight
    if (words.length) {
      const r = wordsEl.getBoundingClientRect();
      const prog = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.25));
      const n = Math.floor(prog * words.length * 1.15);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }

    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ---------- 7. REVEALS ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal,.reveal-up,.sw').forEach(el => io.observe(el));

  /* ---------- 8. COUNTERS ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      let n = 0;
      const t = setInterval(() => {
        n += Math.max(1, Math.ceil(end / 22));
        if (n >= end) { n = end; clearInterval(t); }
        el.textContent = n;
      }, 45);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---------- 9. SMOOTH ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', ev => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      ev.preventDefault();
      window.scrollTo({ top: t.offsetTop, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- 10. AUDIO SPOT + WAVEFORM ---------- */
  const audio = document.getElementById('spotAudio');
  const wrap = document.querySelector('.player');
  const btn = document.getElementById('playBtn');
  const wave = document.getElementById('wave');
  const time = document.getElementById('playTime');
  if (wave) {
    for (let i = 0; i < 38; i++) wave.appendChild(document.createElement('i'));
    const bars = [...wave.children];
    let anim;
    const animate = () => {
      bars.forEach((b, i) => {
        const v = audio.paused ? 18 : 18 + Math.abs(Math.sin(Date.now() / 220 + i * .5)) * 70 * (0.5 + Math.random() * .6);
        b.style.height = Math.min(100, v) + '%';
      });
      anim = requestAnimationFrame(animate);
    };
    animate();
    btn.addEventListener('click', () => {
      if (audio.paused) { audio.play(); wrap.classList.add('playing'); }
      else { audio.pause(); wrap.classList.remove('playing'); }
    });
    audio.addEventListener('ended', () => wrap.classList.remove('playing'));
    audio.addEventListener('timeupdate', () => {
      const d = audio.duration || 30, c = audio.currentTime;
      time.textContent = `Voce · ${Math.floor(c / 60)}:${String(Math.floor(c % 60)).padStart(2, '0')} / ${Math.floor(d / 60)}:${String(Math.floor(d % 60)).padStart(2, '0')}`;
    });
  }
})();
