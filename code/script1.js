// ================== CAMBIA AQUÍ TUS DATOS ==================
const CONFIG = {
  nombre: "Hector",              // ej: "Carlos" (o usa el link con ?nombre=Carlos)
  firma: "Ernesto",

  // Pon tus fotos en la carpeta "fotos" (ojo: usa "/" y revisa si son .jpg o .png)
  // Para agregar más: "../fotos/foto1.jpg", "../fotos/foto2.jpg", ...
  fotos: ["../fotos/foto1.webp"],

  // Foto redonda de la primera pantalla
  avatar: "../fotos/foto1.webp",


  // Cada texto entre comillas es un párrafo de la carta
  carta: [
    "Pasala bien hermanito que disfrutes tu vagancia en Iquitos. ¡Gracias por ser tan buen amigo y por estar siempre ahí!"
  ]
};
// ==========================================================

const params = new URLSearchParams(location.search);
const nombre = (params.get('nombre') || CONFIG.nombre).trim();
const firma = (params.get('de') || CONFIG.firma).trim();
if (nombre) document.title = '¡Feliz cumpleaños, ' + nombre + '!';

const azar = (a, b) => a + Math.random() * (b - a);
const COLORES = ['#bfa475', '#1e4e5e', '#4c5262', '#ffffff', '#bfa475', '#ffffff'];
const color = () => COLORES[Math.floor(Math.random() * COLORES.length)];

// ---------- Llenar las pantallas con los datos ----------
const fotos = document.getElementById('fotos');
CONFIG.fotos.forEach((src, i) => {
  const img = document.createElement('img');
  img.src = src; img.alt = 'Recuerdo ' + (i + 1);
  fotos.appendChild(img);
});

document.getElementById('avatar').src = CONFIG.avatar;
if (nombre) document.getElementById('saludo').textContent = '¡Feliz cumpleaños, ' + nombre + '!';

document.getElementById('tituloCarta').textContent = '¡Feliz cumpleaños' + (nombre ? ', ' + nombre : '') + '!!';
const carta = document.getElementById('carta');
CONFIG.carta.forEach(texto => {
  const p = document.createElement('p');
  p.textContent = texto;
  carta.appendChild(p);
});
if (firma) {
  const p = document.createElement('p');
  p.className = 'firma'; p.textContent = '— ' + firma;
  carta.appendChild(p);
}

// ---------- Cambiar de pantalla ----------
function mostrar(id) {
  const actual = document.querySelector('.pantalla.activa');
  actual.classList.remove('activa');
  document.getElementById(id).classList.add('activa');
  scrollTo(0, 0);
  if (id === 'p7') rafagaConfeti(innerWidth / 2, innerHeight * .45, 140, 12);
}

// Cualquier botón con data-ir="pX" te lleva a esa pantalla
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ir]');
  if (b) mostrar(b.dataset.ir);
});
document.getElementById('otraVez').addEventListener('click', () => location.reload());

// ---------- Gatitos flotando ----------
function corazon() {
  const h = document.createElement('div');
  h.className = 'corazon gatito';
  h.textContent = '🐱';
  h.style.left = azar(2, 95) + 'vw';
  h.style.fontSize = azar(16, 34) + 'px';
  h.style.animationDuration = azar(8, 14) + 's, ' + azar(2.2, 3.8) + 's';
  h.addEventListener('animationend', e => { if (e.animationName === 'subir') h.remove(); });
  document.body.appendChild(h);
}
for (let i = 0; i < 3; i++) setTimeout(corazon, i * 600);
setInterval(corazon, 2500);

// ---------- Confeti y humo (canvas) ----------
const fx = document.getElementById('fx'), c = fx.getContext('2d');
let W, H, parts = [];

function ajustar() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  fx.width = W * dpr; fx.height = H * dpr;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', ajustar);
ajustar();

function rafagaConfeti(x, y, n, fuerza) {
  for (let i = 0; i < n; i++) {
    const ang = azar(-Math.PI * .95, -Math.PI * .05), v = azar(3, fuerza);
    parts.push({ t: 'c', x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v,
      w: azar(6, 11), h: azar(4, 7), rot: azar(0, 6), vr: azar(-.25, .25),
      col: color(), osc: azar(0, 6), vida: 0, max: azar(240, 360) });
  }
}

function lluviaConfeti(n) {
  for (let i = 0; i < n; i++) {
    parts.push({ t: 'c', x: azar(0, W), y: azar(-H * .6, -10), vx: azar(-1, 1), vy: azar(1, 3),
      w: azar(6, 11), h: azar(4, 7), rot: azar(0, 6), vr: azar(-.2, .2),
      col: color(), osc: azar(0, 6), vida: 0, max: 600 });
  }
}

function humo(x, y) {
  for (let i = 0; i < 14; i++) {
    parts.push({ t: 'h', x: x + azar(-3, 3), y, vx: azar(-.35, .35), vy: azar(-1.4, -.6),
      r: azar(2, 4), vida: -i * 3, max: azar(70, 100) });
  }
}

function bucle() {
  c.clearRect(0, 0, W, H);
  for (const p of parts) {
    p.vida++;
    if (p.vida < 0) continue;
    const resto = 1 - p.vida / p.max;
    if (p.t === 'c') {
      p.vy += .07; p.vx *= .99; p.vy *= .99;
      p.x += p.vx + Math.sin(p.vida * .08 + p.osc) * .6; p.y += p.vy;
      p.rot += p.vr; p.osc += .1;
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.cos(p.osc));
      c.globalAlpha = Math.min(1, resto * 3);
      c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      c.restore();
    } else {
      p.x += p.vx; p.y += p.vy; p.r += .12;
      c.globalAlpha = .35 * resto;
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill();
    }
  }
  c.globalAlpha = 1;
  parts = parts.filter(p => p.vida <= p.max && p.y < H + 60);
  requestAnimationFrame(bucle);
}
requestAnimationFrame(bucle);

// ---------- Pantalla 1: soplar las velas ----------
const p1 = document.getElementById('p1');
const pastel = document.getElementById('pastel');
let soplado = false;

function armarTitulo() {
  const l1 = document.getElementById('linea1');
  const texto = nombre ? '¡Feliz cumpleaños,' : '¡Feliz cumpleaños!';
  Array.from(texto).forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'letra'; s.textContent = ch;
    s.style.animationDelay = (i * .045) + 's';
    l1.appendChild(s);
  });
  const n = document.getElementById('nombre');
  n.textContent = nombre ? nombre + '!' : '';
  n.style.display = nombre ? 'block' : 'none';
  n.style.animationDelay = (texto.length * .045 + .1) + 's, 0s';
}

function soplar() {
  if (soplado) return;
  soplado = true;
  pastel.classList.add('apagada');
  document.querySelectorAll('.mecha').forEach(m => {
    const r = m.getBoundingClientRect();
    humo(r.left + r.width / 2, r.top);
  });
  setTimeout(() => {
    p1.classList.add('celebrando');
    armarTitulo();
    const r = pastel.getBoundingClientRect();
    rafagaConfeti(r.left + r.width / 2, r.top + r.height * .4, 160, 13);
    lluviaConfeti(100);
  }, 650);
}

pastel.addEventListener('click', soplar);
pastel.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); soplar(); } });
