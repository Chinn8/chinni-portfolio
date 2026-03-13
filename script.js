/* =============================================
   CHINNI NOVAHU — Portfolio Script
   Three.js background + Anime.js animations
   + Scroll reveals + Form + Nav interactions
   ============================================= */

// =============================================
// LOADER
// =============================================
// ---- Bulletproof loader: never gets stuck ----
let loaderDone = false;
function hideLoader() {
  if (loaderDone) return;
  loaderDone = true;
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
  initHeroAnimations();
}

// Try on window load (ideal path)
window.addEventListener('load', () => setTimeout(hideLoader, 1200));
// Fallback: if window.load is slow or blocked
document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 2500));
// Hard timeout — always hides within 3s no matter what
setTimeout(hideLoader, 3000);

// =============================================
// THREE.JS — HERO BACKGROUND (Floating Particles)
// =============================================
function initThreeBackground() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 30;

  // Particle system
  const PARTICLE_COUNT = 280;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const alphas = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    sizes[i]  = Math.random() * 1.8 + 0.4;
    alphas[i] = Math.random() * 0.6 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0x00f0c8,
    size: 0.18,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Connecting lines (subtle geometric grid)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f0c8,
    transparent: true,
    opacity: 0.04,
    blending: THREE.AdditiveBlending,
  });

  // A few floating wireframe shapes
  const shapes = [];
  for (let i = 0; i < 5; i++) {
    const geoShape = Math.random() > 0.5
      ? new THREE.OctahedronGeometry(Math.random() * 3 + 1, 0)
      : new THREE.TetrahedronGeometry(Math.random() * 2 + 1, 0);
    const matShape = new THREE.MeshBasicMaterial({
      color: 0x00f0c8,
      wireframe: true,
      transparent: true,
      opacity: 0.05 + Math.random() * 0.06,
    });
    const mesh = new THREE.Mesh(geoShape, matShape);
    mesh.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 20 - 5
    );
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.003,
      rotY: (Math.random() - 0.5) * 0.003,
      floatSpeed: Math.random() * 0.0005 + 0.0003,
      floatAmp: Math.random() * 1.5 + 0.5,
      floatOffset: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const t = frame * 0.001;

    // Rotate particle cloud slowly
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    // Camera mouse parallax (gentle)
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.025;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);

    // Float shapes
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotX;
      s.rotation.y += s.userData.rotY;
      s.position.y += Math.sin(t * s.userData.floatSpeed * 1000 + s.userData.floatOffset) * 0.002;
    });

    renderer.render(scene, camera);
  }

  animate();
}

// =============================================
// ANIME.JS — HERO ENTRANCE ANIMATIONS
// =============================================
function initHeroAnimations() {
  // Start Three.js background
  initThreeBackground();

  const tl = anime.timeline({ easing: 'easeOutExpo' });

  tl.add({
    targets: '.hero-greeting',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 700,
  })
  .add({
    targets: '.hero-name .line',
    opacity: [0, 1],
    translateY: [60, 0],
    duration: 900,
    delay: anime.stagger(120),
  }, '-=400')
  .add({
    targets: '.hero-role',
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 600,
  }, '-=400')
  .add({
    targets: '.hero-tagline',
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 600,
  }, '-=400')
  .add({
    targets: '.hero-cta',
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 600,
  }, '-=300')
  .add({
    targets: '.hero-scroll-hint',
    opacity: [0, 1],
    duration: 600,
  }, '-=200');
}

// =============================================
// SCROLL REVEAL
// =============================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same grid
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = (idx % 6) * 80; // max 6 per row

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  reveals.forEach(el => observer.observe(el));
}

// Also animate section titles
function initTitleReveal() {
  const titles = document.querySelectorAll('.section-title, .section-label, .about-desc, .contact-tagline');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          easing: 'easeOutExpo',
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  titles.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// Timeline items
function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach(el => observer.observe(el));
}

// =============================================
// NAVBAR SCROLL BEHAVIOR
// =============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile menu toggle
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// =============================================
// SMOOTH ACTIVE LINK (HIGHLIGHT CURRENT SECTION)
// =============================================
function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

// =============================================
// SKILL ITEMS ANIMATION ON HOVER (Anime.js micro)
// =============================================
function initSkillMicro() {
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      anime({
        targets: item,
        paddingLeft: ['0px', '10px'],
        duration: 250,
        easing: 'easeOutCubic',
      });
    });
    item.addEventListener('mouseleave', () => {
      anime({
        targets: item,
        paddingLeft: ['10px', '0px'],
        duration: 250,
        easing: 'easeOutCubic',
      });
    });
  });
}

// =============================================
// TAG STAGGER ANIMATION
// =============================================
function initTagsReveal() {
  const tags = document.querySelector('.skill-tags');
  if (!tags) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: '.skill-tags .tag',
          opacity: [0, 1],
          translateY: [10, 0],
          scale: [0.9, 1],
          duration: 400,
          delay: anime.stagger(60),
          easing: 'easeOutBack',
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(tags);

  // Set initial opacity
  document.querySelectorAll('.skill-tags .tag').forEach(t => t.style.opacity = '0');
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const name    = document.getElementById('name')?.value    || '';
    const email   = document.getElementById('email')?.value   || '';
    const message = document.getElementById('message')?.value || '';

    btn.textContent = 'Opening Gmail...';
    btn.disabled = true;

    // Build Gmail compose URL with pre-filled subject & body
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const gmailURL = `https://mail.google.com/mail/?view=cm&to=chinninovahu@gmail.com&su=${subject}&body=${body}`;

    // Open Gmail in new tab
    window.open(gmailURL, '_blank');

    // Show success message
    success.classList.add('show');
    form.reset();
    btn.textContent = 'Send Message →';
    btn.disabled = false;

    if (typeof anime !== 'undefined') {
      anime({
        targets: success,
        opacity: [0, 1],
        translateY: [5, 0],
        duration: 400,
        easing: 'easeOutExpo',
      });
    }
  });

  // Glowing input focus effect
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      anime({
        targets: input,
        boxShadow: ['0 0 0 0 rgba(0,240,200,0)', '0 0 0 3px rgba(0,240,200,0.12)'],
        duration: 300,
        easing: 'easeOutCubic',
      });
    });
    input.addEventListener('blur', () => {
      anime({
        targets: input,
        boxShadow: ['0 0 0 3px rgba(0,240,200,0.12)', '0 0 0 0 rgba(0,240,200,0)'],
        duration: 300,
        easing: 'easeOutCubic',
      });
    });
  });
}

// =============================================
// CURSOR TRAIL (subtle)
// =============================================
function initCursorTrail() {
  const trail = document.createElement('div');
  trail.id = 'cursor-trail';
  Object.assign(trail.style, {
    position: 'fixed',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00f0c8',
    pointerEvents: 'none',
    zIndex: '9998',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s',
    opacity: '0',
  });
  document.body.appendChild(trail);

  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    trail.style.opacity = '0.6';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.2;
    ty += (my - ty) * 0.2;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mouseleave', () => trail.style.opacity = '0');
}

// =============================================
// NUMBER COUNTER ANIMATION (Hero stat)
// =============================================
function initCounters() {
  // Future: add stats counters. Placeholder for now.
}

// =============================================
// INIT ALL
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveLinks();
  initScrollReveal();
  initTitleReveal();
  initTimelineReveal();
  initSkillMicro();
  initTagsReveal();
  initContactForm();
  initCursorTrail();
});

// Active nav link style (add CSS dynamically)
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-links a.active { color: var(--accent); } .nav-links a.active::after { width: 100%; }`;
document.head.appendChild(activeStyle);
