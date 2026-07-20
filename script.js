window.addEventListener("load", async () => {
  if (sessionStorage.getItem("visit")) return;

  try {
    const res = await fetch("/.netlify/functions/visit");

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    sessionStorage.setItem("visit", "1");
  } catch (err) {
    console.error("Visit error:", err);
  }
});

// Секретная кнопка — нажми D+E+V одновременно
const keys = new Set();

document.addEventListener("keydown", e => {
  keys.add(e.key.toLowerCase());

  if (keys.has("d") && keys.has("e") && keys.has("v")) {
    document.getElementById("devBtn").style.display = "block";
  }
});

document.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));

// ==========================
// Кастомный курсор
// ==========================

const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");

let mouseX = 0,
    mouseY = 0;

let ringX = 0,
    ringY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.25;
  ringY += (mouseY - ringY) * 0.25;

  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";

  requestAnimationFrame(animateRing);
}

animateRing();

document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => ring.classList.add("hover"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
});

// ==========================
// Частицы
// ==========================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = Array.from({ length: 300 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.3,
  speedX: (Math.random() - 0.5) * 0.3,
  speedY: (Math.random() - 0.5) * 0.3,
  opacity: Math.random() * 0.5 + 0.1,
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 240, 74, ${p.opacity})`;
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  requestAnimationFrame(drawParticles);
}

drawParticles();