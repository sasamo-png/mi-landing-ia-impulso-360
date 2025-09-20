/* ===== Utilidades ===== */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

/* ===== Año dinámico ===== */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

/* ===== Menú móvil ===== */
const menuBtn = $("#menuToggle");
const menu = $("#menu");
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ===== Scroll suave ===== */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      menu?.classList?.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  });
});

/* ===== Aparición al hacer scroll ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); });
}, { threshold: 0.15 });
$$(".reveal-on-scroll").forEach(el => io.observe(el));

/* ===== Fondo de partículas (canvas) ===== */
const defaultParticles = {
  particleCount: 95,
  size: { min: 1.1, max: 2.4 },
  speed: { min: 0.15, max: 0.45 },
  color: "rgba(106,228,255,0.9)",
  connect: true,
  connectDistance: 110
};
function rand(min, max){ return Math.random() * (max - min) + min; }
function startParticles(cfg = defaultParticles){
  const canvas = $("#bg"); if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height;
  function resize(){
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize); resize();
  const particles = Array.from({ length: cfg.particleCount }, () => ({
    x: rand(0, width), y: rand(0, height),
    vx: rand(cfg.speed.min, cfg.speed.max) * (Math.random() > .5 ? 1 : -1),
    vy: rand(cfg.speed.min, cfg.speed.max) * (Math.random() > .5 ? 1 : -1),
    r: rand(cfg.size.min, cfg.size.max)
  }));
  function step(){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = cfg.color;
    for (let p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    }
    if (cfg.connect){
      ctx.strokeStyle = "rgba(160,107,255,0.25)";
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x-b.x, a.y-b.y);
          if (dist < cfg.connectDistance){
            ctx.globalAlpha = 1 - (dist / cfg.connectDistance);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
fetch("/particles.json")
  .then(r => r.ok ? r.json() : defaultParticles)
  .then(cfg => startParticles({ ...defaultParticles, ...cfg }))
  .catch(() => startParticles(defaultParticles));

/* ===== Formulario de contacto (ENVÍO A N8N) ===== */
const form = document.getElementById("form-contacto");
if (form) {
  const estado = document.getElementById("estado");
  const btn = document.getElementById("btn-enviar");

  // URL de PRODUCCIÓN de tu Webhook (con el workflow activado en n8n)
  const WEBHOOK_URL = "https://agencia-ia-n8n.u2vajm.easypanel.host/webhook/1d8a6255-14db-4314-874d-4e72759be8e2";

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene que la página se recargue

    if (form.website?.value) return; // honeypot

    if (!document.getElementById("privacidad")?.checked) {
      mostrar("Debes aceptar la política de privacidad.");
      return;
    }

    const tel = (form.telefono?.value || "").replace(/[^\d+]/g, "");
    const payload = {
      nombre:  form.nombre?.value.trim()  || "",
      email:   form.email?.value.trim()   || "",
      asunto:  form.asunto?.value         || "",
      telefono: tel,
      mensaje: form.mensaje?.value.trim() || "",
      fuente:  "landing-agencia"
    };

    try {
      bloquear(true);
      mostrar("Enviando…");

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      await res.json().catch(() => ({}));
      mostrar("¡Enviado! Te contactamos pronto.");
      form.reset();
    } catch (err) {
      console.error(err);
      mostrar("Error al enviar. Intenta de nuevo.");
    } finally {
      bloquear(false);
    }
  });

  function mostrar(msg) { if (estado){ estado.style.display = "block"; estado.textContent = msg; } }
  function bloquear(v) { if (btn){ btn.disabled = v; btn.style.opacity = v ? .6 : 1; } }
}