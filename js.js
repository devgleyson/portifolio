
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, follX = 0, follY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});


function animateFollower() {
  follX += (mouseX - follX) * 0.12;
  follY += (mouseY - follY) * 0.12;
  follower.style.left = follX + 'px';
  follower.style.top  = follY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();


document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.borderColor = 'rgba(0,255,170,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(0,255,170,0.5)';
  });
});


const canvas = document.getElementById('canvas-bg');
const ctx    = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#00ffaa' : Math.random() > 0.5 ? '#00cfff' : '#a855f7';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles(n = 100) {
  particles = Array.from({ length: n }, () => new Particle());
}
initParticles();

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.18;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();


const phrases = [
  'Construindo o futuro com código...',
  'Software Engineering Student',
  'Open Source Enthusiast 🌍',
  'Always Learning, Always Building',
  'Clean Code Advocate ✨',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 40 : 80);
}
typeEffect();


const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});


const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const level = fill.closest('.skill-item')?.dataset.level || '0';
          fill.style.width = level + '%';
        });
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));


const skillCategories = document.querySelectorAll('.skill-category');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.skill-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          const fill  = item.querySelector('.skill-fill');
          const level = item.dataset.level || '0';
          if (fill) fill.style.width = level + '%';
        }, i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillCategories.forEach(el => skillObserver.observe(el));


function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + '+';
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCount);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);


const form = document.getElementById('contact-form');
const btnSend = document.getElementById('btn-send');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    shake(form);
    return;
  }

  btnSend.textContent = 'Enviado! ✅';
  btnSend.style.background = 'linear-gradient(135deg, #00ffaa, #00cf99)';
  btnSend.disabled = true;

  setTimeout(() => {
    form.reset();
    btnSend.textContent = 'Enviar Mensagem ✈️';
    btnSend.style.background = '';
    btnSend.disabled = false;
  }, 3000);
});

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
}


const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);


document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


const logo = document.querySelector('.nav-logo');
logo?.addEventListener('mouseenter', () => {
  logo.style.filter = 'drop-shadow(0 0 8px rgba(0,255,170,0.8))';
});
logo?.addEventListener('mouseleave', () => {
  logo.style.filter = '';
});

const codeWin = document.querySelector('.code-window');
let targetRx = 0, targetRy = 0, currentRx = 0, currentRy = 0;

if (codeWin) {
  codeWin.style.animation = 'none';
}

let floatT = 0;
function animateCodeWin() {
  floatT += 0.012;
  const floatY = Math.sin(floatT) * -12;
  currentRx += (targetRx - currentRx) * 0.08;
  currentRy += (targetRy - currentRy) * 0.08;
  if (codeWin) {
    codeWin.style.transform = `translateY(${floatY}px) rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
  }
  requestAnimationFrame(animateCodeWin);
}
animateCodeWin();

document.addEventListener('mousemove', (e) => {
  if (!codeWin) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  targetRx = ((e.clientY - cy) / cy) * -4;
  targetRy = ((e.clientX - cx) / cx) * 4;
});
