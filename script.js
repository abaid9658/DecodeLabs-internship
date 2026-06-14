'use strict';
gsap.registerPlugin(ScrollTrigger);

// ─── DOM REFS ──────────────────────────────
const preloader     = document.getElementById('preloader');
const cursorDot     = document.getElementById('cursorDot');
const cursorRing    = document.getElementById('cursorRing');
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const heroCanvas    = document.getElementById('heroCanvas');
const contactCanvas = document.getElementById('contactCanvas');
const heroCard      = document.getElementById('heroCard');
const sendBtn       = document.getElementById('sendBtn');
const formSuccess   = document.getElementById('formSuccess');

// ════════════════════════════════════════════
// 1. LOTTIE ANIMATIONS (via CDN player)
// ════════════════════════════════════════════
function injectLottieScript(cb) {
  if (document.querySelector('script[data-lottie]')) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';
  s.setAttribute('data-lottie', '1');
  s.onload = cb;
  document.head.appendChild(s);
}

// Lottie JSON URLs (lottiefiles public CDN)
const LOTTIE = {
  preloader: 'https://assets10.lottiefiles.com/packages/lf20_szlepvdh.json',  // coding loader
  about:     'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json',   // developer at desk
  contact:   'https://assets9.lottiefiles.com/packages/lf20_u25cckyh.json',   // mail send
  skills:    'https://assets4.lottiefiles.com/packages/lf20_fcfjwiyb.json',   // rocket
};

let lottieLib = null;

function loadLottie(containerId, url, options = {}) {
  const el = document.getElementById(containerId);
  if (!el || !lottieLib) return null;
  return lottieLib.loadAnimation({
    container: el,
    renderer: 'svg',
    loop: options.loop !== undefined ? options.loop : true,
    autoplay: options.autoplay !== undefined ? options.autoplay : true,
    path: url,
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
  });
}

function injectLottieContainers() {
  // Preloader lottie
  const preInner = preloader?.querySelector('.preloader__inner');
  if (preInner && !document.getElementById('lottie-preloader')) {
    const div = document.createElement('div');
    div.id = 'lottie-preloader';
    div.style.cssText = 'width:110px;height:110px;';
    // Insert before the text
    const txt = preInner.querySelector('.preloader__text');
    preInner.insertBefore(div, txt);
    // hide old cube
    const cube = preInner.querySelector('.preloader__cube');
    if (cube) cube.style.display = 'none';
  }

  // About section lottie — inject inside .about__scene replacing avatar
  const aboutScene = document.querySelector('.about__scene');
  if (aboutScene && !document.getElementById('lottie-about')) {
    const div = document.createElement('div');
    div.id = 'lottie-about';
    div.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:110px;height:110px;z-index:2;';
    const avatar = aboutScene.querySelector('.scene-avatar');
    if (avatar) avatar.replaceWith(div);
    else aboutScene.appendChild(div);
  }

  // Contact lottie — inject above contact info
  const contactInfo = document.querySelector('.contact__info');
  if (contactInfo && !document.getElementById('lottie-contact')) {
    const div = document.createElement('div');
    div.id = 'lottie-contact';
    div.style.cssText = 'width:130px;height:130px;margin-bottom:.5rem;';
    contactInfo.insertBefore(div, contactInfo.firstChild);
  }
}

function startLotties() {
  loadLottie('lottie-preloader', LOTTIE.preloader);
  loadLottie('lottie-about',     LOTTIE.about);
  loadLottie('lottie-contact',   LOTTIE.contact);
}

// ════════════════════════════════════════════
// 2. PRELOADER
// ════════════════════════════════════════════
window.addEventListener('load', () => {
  const messages = ['Booting system...','Loading assets...','Mounting React...','Connecting MongoDB...','Ready.'];
  const textEl   = preloader?.querySelector('.preloader__text');
  let i = 0;

  injectLottieScript(() => {
    lottieLib = window.lottie || null;
    injectLottieContainers();
    startLotties();
  });

  const iv = setInterval(() => {
    i++;
    if (i < messages.length) {
      if (textEl) textEl.textContent = messages[i];
    } else {
      clearInterval(iv);
      setTimeout(() => {
        preloader?.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAll();
      }, 300);
    }
  }, 450);
});

// ════════════════════════════════════════════
// 3. CUSTOM CURSOR
// ════════════════════════════════════════════
if (window.innerWidth > 768 && cursorDot) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (cursorRing) {
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
    }
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a,button,.tilt-card,input,textarea,.tool-badge,.cert-card,.exp-card__body').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hovered'));
  });
}

// ════════════════════════════════════════════
// 4. NAVBAR SCROLL
// ════════════════════════════════════════════
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar?.classList.toggle('scrolled', y > 60);
  gsap.to(navbar, { y: (y > lastY && y > 200) ? -80 : 0, duration: 0.4, ease: 'power2.inOut' });
  lastY = y;
}, { passive: true });

// Active nav highlight
document.querySelectorAll('section[id]').forEach(section => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)
        );
      }
    });
  }, { threshold: 0.35 }).observe(section);
});

// ════════════════════════════════════════════
// 5. HAMBURGER
// ════════════════════════════════════════════
hamburger?.addEventListener('click', () => {
  const open = mobileMenu?.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
  mobileMenu?.classList.remove('open');
  hamburger?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

// ════════════════════════════════════════════
// 6. THREE.JS — HERO PARTICLE FIELD
// ════════════════════════════════════════════
function initHeroThree() {
  if (!heroCanvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const W        = heroCanvas.offsetWidth;
  const H        = heroCanvas.offsetHeight;
  const camera   = new THREE.PerspectiveCamera(70, W / H, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  camera.position.z = 5;

  // Particle system
  const COUNT = 1800;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(COUNT * 3);
  const col   = new Float32Array(COUNT * 3);
  const palette = [
    new THREE.Color('#A5856E'),
    new THREE.Color('#A0D4E0'),
    new THREE.Color('#F2F0EA'),
    new THREE.Color('#c4a491'),
  ];
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    pos[i3]   = (Math.random() - 0.5) * 20;
    pos[i3+1] = (Math.random() - 0.5) * 20;
    pos[i3+2] = (Math.random() - 0.5) * 12;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i3] = c.r; col[i3+1] = c.g; col[i3+2] = c.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const particles = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.030, vertexColors: true, transparent: true, opacity: 0.68, sizeAttenuation: true,
  }));
  scene.add(particles);

  // Wireframe torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.32, 14, 56),
    new THREE.MeshBasicMaterial({ color: 0xA5856E, wireframe: true, transparent: true, opacity: 0.05 })
  );
  torus.position.set(3.5, -1, -3);
  scene.add(torus);

  // Wireframe icosahedron
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 1),
    new THREE.MeshBasicMaterial({ color: 0xA0D4E0, wireframe: true, transparent: true, opacity: 0.06 })
  );
  ico.position.set(-4, 1.5, -2);
  scene.add(ico);

  // Sparse connection lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0xA5856E, transparent: true, opacity: 0.04 });
  for (let i = 0; i < 45; i++) {
    const lg = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3((Math.random()-0.5)*14, (Math.random()-0.5)*14, (Math.random()-0.5)*6),
      new THREE.Vector3((Math.random()-0.5)*14, (Math.random()-0.5)*14, (Math.random()-0.5)*6),
    ]);
    scene.add(new THREE.Line(lg, lineMat));
  }

  let targetRX = 0, targetRY = 0;
  document.addEventListener('mousemove', e => {
    targetRY = (e.clientX / innerWidth  - 0.5) * 0.55;
    targetRX = (e.clientY / innerHeight - 0.5) * 0.32;
  });

  const clock = new THREE.Clock();
  (function animate() {
    const t = clock.getElapsedTime();
    particles.rotation.x += (targetRX - particles.rotation.x) * 0.018;
    particles.rotation.y += (targetRY - particles.rotation.y) * 0.018;
    particles.rotation.y += 0.0006;
    torus.rotation.x = t * 0.17; torus.rotation.y = t * 0.12;
    torus.position.y = -1 + Math.sin(t * 0.48) * 0.26;
    ico.rotation.x = t * 0.26; ico.rotation.z = t * 0.17;
    ico.position.y = 1.5 + Math.cos(t * 0.36) * 0.35;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();

  window.addEventListener('resize', () => {
    const nW = heroCanvas.offsetWidth, nH = heroCanvas.offsetHeight;
    camera.aspect = nW / nH; camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
}

// ════════════════════════════════════════════
// 7. THREE.JS — CONTACT FLOATING CUBES
// ════════════════════════════════════════════
function initContactThree() {
  if (!contactCanvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const W        = contactCanvas.offsetWidth;
  const H        = contactCanvas.offsetHeight;
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas: contactCanvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  camera.position.z = 8;

  const cubes = [];
  for (let i = 0; i < 18; i++) {
    const s    = Math.random() * 0.38 + 0.14;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(s, s, s),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xA5856E : 0xA0D4E0,
        wireframe: true, transparent: true, opacity: 0.25
      })
    );
    mesh.position.set((Math.random()-0.5)*16, (Math.random()-0.5)*10, (Math.random()-0.5)*5);
    mesh.userData = {
      rx: (Math.random()-0.5)*0.02,
      ry: (Math.random()-0.5)*0.02,
      fs: Math.random()*0.5+0.3,
      fa: Math.random()*0.28+0.1,
      oy: mesh.position.y
    };
    scene.add(mesh); cubes.push(mesh);
  }

  const clock = new THREE.Clock();
  (function animate() {
    const t = clock.getElapsedTime();
    cubes.forEach(c => {
      c.rotation.x += c.userData.rx;
      c.rotation.y += c.userData.ry;
      c.position.y  = c.userData.oy + Math.sin(t * c.userData.fs) * c.userData.fa;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = contactCanvas.offsetWidth / contactCanvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(contactCanvas.offsetWidth, contactCanvas.offsetHeight);
  });
}

// ════════════════════════════════════════════
// 8. HERO CARD 3D PARALLAX
// ════════════════════════════════════════════
function initHeroCard() {
  if (!heroCard || innerWidth < 1100) return;
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX / innerWidth  - 0.5);
    const dy = (e.clientY / innerHeight - 0.5);
    heroCard.style.transform =
      `translateY(-50%) perspective(1000px) rotateY(${-15 + dx*9}deg) rotateX(${5 - dy*5}deg)`;
  });
}

// ════════════════════════════════════════════
// 9. 3D TILT CARDS
// ════════════════════════════════════════════
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      gsap.to(card, { rotateX:-dy*8, rotateY:dx*8, transformPerspective:800, scale:1.02, duration:0.28, ease:'power2.out' });
    });
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { rotateX:0, rotateY:0, scale:1, duration:0.65, ease:'elastic.out(1,0.5)' })
    );
  });
}

// ════════════════════════════════════════════
// 10. ABOUT SCENE MOUSE TILT
// ════════════════════════════════════════════
function initAboutScene() {
  const scene   = document.querySelector('.about__scene');
  const section = document.querySelector('.about');
  if (!scene || !section) return;
  section.addEventListener('mousemove', e => {
    const r  = section.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
    const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
    gsap.to(scene, { rotateX:-dy*10, rotateY:dx*10, transformPerspective:900, duration:0.5, ease:'power2.out' });
  });
  section.addEventListener('mouseleave', () =>
    gsap.to(scene, { rotateX:0, rotateY:0, duration:1, ease:'elastic.out(1,0.5)' })
  );
}

// ════════════════════════════════════════════
// 11. BADGE REPEL
// ════════════════════════════════════════════
function initBadgeRepel() {
  const badges = document.querySelectorAll('.float-badge');
  const scene  = document.querySelector('.about__scene');
  if (!scene) return;
  scene.addEventListener('mousemove', e => {
    badges.forEach(b => {
      const br   = b.getBoundingClientRect();
      const dx   = e.clientX - (br.left + br.width/2);
      const dy   = e.clientY - (br.top  + br.height/2);
      const dist = Math.hypot(dx, dy);
      if (dist < 90) {
        const f = (90 - dist) / 90;
        gsap.to(b, { x:-(dx/dist)*f*20, y:-(dy/dist)*f*20, duration:0.28, ease:'power2.out' });
      } else {
        gsap.to(b, { x:0, y:0, duration:0.5, ease:'elastic.out(1,0.4)' });
      }
    });
  });
}

// ════════════════════════════════════════════
// 12. SCROLL REVEAL — GSAP
// ════════════════════════════════════════════
function initReveal() {
  // Section labels
  gsap.utils.toArray('.section-label').forEach(el =>
    gsap.fromTo(el, { opacity:0, x:-18 }, {
      opacity:1, x:0, duration:0.6, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 90%' }
    })
  );

  // Section headings
  gsap.utils.toArray('.section-heading').forEach(el =>
    gsap.fromTo(el, { opacity:0, y:26 }, {
      opacity:1, y:0, duration:0.8, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    })
  );

  // Section subs
  gsap.utils.toArray('.section-sub').forEach(el =>
    gsap.fromTo(el, { opacity:0, y:14 }, {
      opacity:1, y:0, duration:0.7, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 90%' }
    })
  );

  // About grid
  gsap.fromTo('.about__visual', { opacity:0, x:-45, rotateY:-15 }, {
    opacity:1, x:0, rotateY:0, duration:1.1, ease:'power3.out',
    scrollTrigger:{ trigger:'.about', start:'top 76%' }
  });
  gsap.fromTo('.about__text', { opacity:0, x:45 }, {
    opacity:1, x:0, duration:1.1, ease:'power3.out',
    scrollTrigger:{ trigger:'.about', start:'top 76%' }
  });
  gsap.fromTo('.meta-item', { opacity:0, x:16 }, {
    opacity:1, x:0, duration:0.5, stagger:0.1, ease:'power2.out',
    scrollTrigger:{ trigger:'.about__meta', start:'top 86%' }
  });
  gsap.fromTo('.stat-card', { opacity:0, y:22 }, {
    opacity:1, y:0, duration:0.5, stagger:0.1, ease:'back.out(1.4)',
    scrollTrigger:{ trigger:'.about__stats', start:'top 88%' }
  });

  // Skill categories
  gsap.utils.toArray('.skill-category').forEach(cat =>
    gsap.fromTo(cat, { opacity:0, y:36 }, {
      opacity:1, y:0, duration:0.75, ease:'power3.out',
      scrollTrigger:{ trigger:cat, start:'top 83%' }
    })
  );

  // Skill cards stagger
  gsap.fromTo('.skill-card', { opacity:0, y:32, scale:0.96 }, {
    opacity:1, y:0, scale:1, duration:0.55, stagger:0.08, ease:'back.out(1.4)',
    scrollTrigger:{ trigger:'.skills__categories', start:'top 78%' }
  });

  // Skill bars via IntersectionObserver
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { bar.classList.add('animated'); } });
    }, { threshold: 0.5 }).observe(bar);
  });

  // Tool badges
  gsap.utils.toArray('.tool-badge').forEach((b, i) =>
    gsap.fromTo(b, { opacity:0, scale:0.82 }, {
      opacity:1, scale:1, duration:0.4, delay: i * 0.055, ease:'back.out(1.6)',
      scrollTrigger:{ trigger:'.tools-row', start:'top 88%' }
    })
  );

  // Project cards
  gsap.fromTo('.project-card', { opacity:0, y:50, scale:0.96 }, {
    opacity:1, y:0, scale:1, duration:0.7, stagger:0.12, ease:'power3.out',
    scrollTrigger:{ trigger:'.projects__grid', start:'top 80%' }
  });

  // FYP Banner
  gsap.fromTo('.fyp-banner', { opacity:0, y:28 }, {
    opacity:1, y:0, duration:0.8, ease:'power3.out',
    scrollTrigger:{ trigger:'.fyp-banner', start:'top 88%' }
  });

  // Cert cards via IntersectionObserver with stagger delay
  const certObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 110);
        certObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.cert-card').forEach(c => certObs.observe(c));
}

// ════════════════════════════════════════════
// 13. EXPERIENCE TIMELINE REVEAL
// ════════════════════════════════════════════
function initExpReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 140);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.exp-card').forEach(c => obs.observe(c));
}

// ════════════════════════════════════════════
// 14. COUNTER ANIMATION
// ════════════════════════════════════════════
function initCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const target = parseInt(e.target.dataset.count);
        const suffix = e.target.dataset.suffix || '+';
        let cur = 0;
        const step = target / (1500 / 16);
        const update = () => {
          cur = Math.min(cur + step, target);
          e.target.textContent = Math.floor(cur) + suffix;
          if (cur < target) requestAnimationFrame(update);
          else e.target.textContent = target + suffix;
        };
        update();
      });
    }, { threshold: 0.6 }).observe(el);
  });
}

// ════════════════════════════════════════════
// 15. MAGNETIC BUTTONS
// ════════════════════════════════════════════
function initMagnetic() {
  if (innerWidth < 768) return;
  document.querySelectorAll('.btn,.nav-cta,.social-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top  + r.height/2);
      gsap.to(btn, { x:dx*0.2, y:dy*0.2, duration:0.3, ease:'power2.out' });
    });
    btn.addEventListener('mouseleave', () =>
      gsap.to(btn, { x:0, y:0, duration:0.5, ease:'elastic.out(1,0.4)' })
    );
  });
}

// ════════════════════════════════════════════
// 16. SMOOTH SCROLL
// ════════════════════════════════════════════
function initScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72, behavior:'smooth' });
    });
  });
}

// ════════════════════════════════════════════
// 17. CONTACT FORM
// ════════════════════════════════════════════
function initForm() {
  if (!sendBtn) return;
  sendBtn.addEventListener('click', () => {
    const n   = document.getElementById('name');
    const em  = document.getElementById('email');
    const msg = document.getElementById('message');
    const empty = [n, em, msg].filter(el => el && !el.value.trim());

    if (empty.length) {
      empty.forEach(el => {
        gsap.fromTo(el, { x:-7 }, { x:0, duration:0.45, ease:'elastic.out(1,0.3)' });
        el.style.borderColor = '#e74c3c';
        setTimeout(() => { el.style.borderColor = ''; }, 1600);
      });
      return;
    }

    const span = sendBtn.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Sending...';
    sendBtn.disabled = true;
    gsap.to(sendBtn, { scale:0.97, duration:0.15 });

    setTimeout(() => {
      span.textContent = orig;
      sendBtn.disabled = false;
      gsap.to(sendBtn, { scale:1, duration:0.3, ease:'back.out(2)' });

      if (formSuccess) {
        formSuccess.removeAttribute('aria-hidden');
        formSuccess.classList.add('show');
      }

      // Trigger lottie contact animation bounce
      if (lottieLib && document.getElementById('lottie-contact')) {
        const anim = loadLottie('lottie-contact', LOTTIE.contact, { loop:false });
      }

      if (n)   n.value   = '';
      if (em)  em.value  = '';
      if (msg) msg.value = '';

      setTimeout(() => formSuccess?.classList.remove('show'), 4500);
    }, 1400);
  });
}

// ════════════════════════════════════════════
// 18. TYPEWRITER — HERO EYEBROW
// ════════════════════════════════════════════
function initTypewriter() {
  const el = document.querySelector('.hero__eyebrow');
  if (!el) return;
  const txt = el.textContent;
  el.textContent = '';
  let i = 0;
  setTimeout(function type() {
    if (i < txt.length) { el.textContent += txt[i++]; setTimeout(type, 50); }
  }, 900);
}

// ════════════════════════════════════════════
// 19. MOCKUP CARD SHIMMER ON HOVER
// ════════════════════════════════════════════
function initMockupShimmer() {
  document.querySelectorAll('.project-card').forEach(card => {
    const els = card.querySelectorAll('.mockup-box,.mockup-row,.mockup-product-card,.mockup-hero-strip,.mockup-nav-strip');
    card.addEventListener('mouseenter', () =>
      gsap.fromTo(els, { opacity:0.25 }, { opacity:1, duration:0.4, stagger:0.04, ease:'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(els, { opacity:0.25, duration:0.3 })
    );
  });
}

// ════════════════════════════════════════════
// 20. PARALLAX ORBS ON SCROLL
// ════════════════════════════════════════════
function initOrbParallax() {
  const orbs = document.querySelectorAll('.orb');
  ScrollTrigger.create({
    trigger: '.hero', start:'top top', end:'bottom top',
    onUpdate: self => {
      const p = self.progress;
      if (orbs[0]) orbs[0].style.transform = `translate(${p*35}px,${p*-50}px)`;
      if (orbs[1]) orbs[1].style.transform = `translate(${p*-28}px,${p*38}px)`;
      if (orbs[2]) orbs[2].style.transform = `translate(${p*20}px,${p*28}px)`;
    }
  });
}

// ════════════════════════════════════════════
// 21. LOTTIE — LAZY LOAD ON SCROLL for about
// ════════════════════════════════════════════
function initLazyLotties() {
  if (!lottieLib) return;

  // About lottie triggers on scroll into view
  const aboutLottieEl = document.getElementById('lottie-about');
  if (aboutLottieEl) {
    let aboutAnim = null;
    ScrollTrigger.create({
      trigger: '.about',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (!aboutAnim) {
          aboutAnim = loadLottie('lottie-about', LOTTIE.about, { loop:true, autoplay:true });
        }
      }
    });
  }
}

// ════════════════════════════════════════════
// 22. FOOTER SOCIAL HOVER
// ════════════════════════════════════════════
function initFooter() {
  document.querySelectorAll('.footer__social a').forEach(a => {
    a.addEventListener('mouseenter', () => gsap.to(a, { rotate:8, duration:0.25, ease:'power2.out' }));
    a.addEventListener('mouseleave', () => gsap.to(a, { rotate:0, duration:0.4, ease:'elastic.out(1,0.5)' }));
  });
}

// ════════════════════════════════════════════
// MASTER INIT
// ════════════════════════════════════════════
function initAll() {
  initHeroThree();
  initContactThree();
  initHeroCard();
  initTilt();
  initAboutScene();
  initBadgeRepel();
  initReveal();
  initExpReveal();
  initCounters();
  initMagnetic();
  initScroll();
  initForm();
  initTypewriter();
  initMockupShimmer();
  initOrbParallax();
  initLazyLotties();
  initFooter();
}

// Accessibility
document.addEventListener('keydown',   () => document.body.classList.add('keyboard-nav'));
document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));