// ---------- Confetti / party popper engine ----------
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId = null;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = ['#D9695A', '#E8A33D', '#F3C57A', '#3D5A75', '#FFFDF8'];

function spawnConfetti(originX, originY, count = 90){
  for (let i = 0; i < count; i++){
    const angle = (Math.random() * Math.PI) - Math.PI;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.abs(Math.sin(angle) * speed) - 4,
      size: 5 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      gravity: 0.18 + Math.random() * 0.08,
      drag: 0.992,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      life: 0,
      maxLife: 130 + Math.random() * 50
    });
  }
  if (!animId) animate();
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.life++;

    const fade = Math.max(0, 1 - p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    if (p.shape === 'rect'){
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  particles = particles.filter(p => p.life < p.maxLife && p.y < canvas.height + 50);

  if (particles.length > 0){
    animId = requestAnimationFrame(animate);
  } else {
    animId = null;
  }
}

// ---------- Gallery: tap to unlock each photo ----------
const frames = document.querySelectorAll('[data-frame]');
const galleryProgress = document.getElementById('galleryProgress');
let unlockedCount = 0;

function updateProgress(){
  galleryProgress.textContent = `${unlockedCount} / ${frames.length} unlocked`;
  if (unlockedCount === frames.length){
    galleryProgress.textContent = 'all memories unlocked ✦';
  }
}
updateProgress();

frames.forEach(frame => {
  const inner = frame.querySelector('.polaroid-inner');

  inner.addEventListener('click', () => {
    if (frame.classList.contains('unlocked')) return;

    frame.classList.add('unlocked');
    unlockedCount++;
    updateProgress();

    const rect = inner.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
  });

  inner.setAttribute('tabindex', '0');
  inner.setAttribute('role', 'button');
  inner.setAttribute('aria-label', 'Tap to reveal this photo');
  inner.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      inner.click();
    }
  });
});

// ---------- Candle blow interaction ----------
const cakeWrap = document.getElementById('cakeWrap');
const cakeInstruction = document.getElementById('cakeInstruction');
const cakeResult = document.getElementById('cakeResult');

const wishes = [
  "May every road ahead be exactly as bright as this one. ❣️",
  "Wish sealed. Go make this year unforgettable. 🎉"
];

let blown = false;

function blowCandle(){
  if (blown) return;
  blown = true;

  cakeWrap.classList.add('blown');
  cakeInstruction.style.opacity = '0';

  const candle = document.getElementById('candle');
  const candleRect = candle.getBoundingClientRect();
  const originX = candleRect.left + candleRect.width / 2;
  const originY = candleRect.top;

  spawnConfetti(originX, originY);
  setTimeout(() => spawnConfetti(originX - 60, originY + 20), 120);
  setTimeout(() => spawnConfetti(originX + 60, originY + 20), 220);

  const message = wishes[Math.floor(Math.random() * wishes.length)];
  setTimeout(() => {
    cakeResult.textContent = message;
    cakeResult.classList.add('show');
  }, 300);
}

cakeWrap.addEventListener('click', blowCandle);
cakeWrap.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    blowCandle();
  }
});
cakeWrap.setAttribute('tabindex', '0');
cakeWrap.setAttribute('role', 'button');
cakeWrap.setAttribute('aria-label', 'Blow out the birthday candle');
