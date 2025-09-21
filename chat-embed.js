
// chat-embed.js — Widget ligero sin dependencias (usa tu endpoint n8n /chat)
(function(){
  const CHAT_URL = "https://agencia-ia-n8n.u2vajm.easypanel.host/webhook/ac6b8b71-edbe-4ff8-a944-2c24f4632fa7/chat";
  const KEY = "chatbot_impulso360_v1";

  // ---- Styles ----
  const css = `
  .ce-bubble{position:fixed;right:18px;bottom:18px;width:56px;height:56px;border-radius:999px;background:#6ae4ff;
    color:#0b0d14;display:grid;place-items:center;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:pointer;z-index:2147483647;border:none}
  .ce-panel{position:fixed;right:18px;bottom:86px;width:360px;max-width:95vw;background:#111323;color:#d7d8e0;border:1px solid rgba(255,255,255,.08);
    border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.45);overflow:hidden;z-index:2147483646;font-family:system-ui,Segoe UI,Roboto,sans-serif}
  .ce-hidden{display:none}
  .ce-h{display:flex;gap:8px;align-items:center;padding:12px 14px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08)}
  .ce-tt{font-weight:800;font-size:14px} .ce-sub{font-size:12px;color:#9aa0ae}
  .ce-x{margin-left:auto;background:none;border:0;font-size:18px;cursor:pointer;color:#d7d8e0}
  .ce-m{height:320px;overflow:auto;padding:12px;background:#0a0b10}
  .ce-row{display:flex;margin:8px 0}
  .ce-row.me{justify-content:flex-end}
  .ce-badge{max-width:78%;padding:8px 12px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#15182a;white-space:pre-wrap;line-height:1.25}
  .ce-row.me .ce-badge{background:#0f1a2e;border-color:rgba(106,228,255,.35)}
  .ce-inp{display:flex;gap:8px;align-items:center;border-top:1px solid rgba(255,255,255,.08);padding:10px;background:#111323}
  .ce-txt{flex:1;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px 12px;background:#0b0d14;color:#d7d8e0}
  .ce-send{border:0;background:linear-gradient(90deg,#6ae4ff,#a06bff);color:#0b0d14;padding:10px 14px;border-radius:12px;font-weight:800}
  .ce-sys{display:block;text-align:center;color:#9aa0ae;font-size:12px;margin:6px 0}
  `;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  // ---- DOM ----
  const bubble = document.createElement("button");
  bubble.className = "ce-bubble"; bubble.setAttribute("aria-label","Abrir chat");
  bubble.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 8h10M7 12h6" stroke="#0b0d14" stroke-width="2" stroke-linecap="round"/>
    <path d="M21 12c0 4.4-4.03 8-9 8a10.7 10.7 0 0 1-3.2-.48L3 21l1.49-4.47A7.9 7.9 0 0 1 3 12c0-4.4 4.03-8 9-8s9 3.6 9 8Z" stroke="#0b0d14" stroke-width="2" fill="none"/>
  </svg>`;

  const panel = document.createElement("section");
  panel.className = "ce-panel ce-hidden";
  panel.innerHTML = `
    <header class="ce-h">
      <div>
        <div class="ce-tt">Asistente IA</div>
        <div class="ce-sub">Con memoria y respuesta automática</div>
      </div>
      <button class="ce-x" aria-label="Cerrar">×</button>
    </header>
    <div class="ce-m" id="ce-m"></div>
    <form class="ce-inp" id="ce-f" autocomplete="off">
      <input class="ce-txt" id="ce-t" autocomplete="off" placeholder="Escribe tu mensaje…" />
      <button class="ce-send" type="submit">Enviar</button>
    </form>
  `;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(bubble);
    document.body.appendChild(panel);
  });

  const feed = panel.querySelector("#ce-m");
  const form = panel.querySelector("#ce-f");
  const input = panel.querySelector("#ce-t");
  const closeBtn = panel.querySelector(".ce-x");

  function sid(){
    let id = localStorage.getItem(KEY);
    if(!id){ id = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)); localStorage.setItem(KEY,id); }
    return id;
  }
  function add(role, text){
    if(role==="system"){
      const sp=document.createElement("span"); sp.className="ce-sys"; sp.textContent=text;
      feed.appendChild(sp); feed.scrollTop = feed.scrollHeight; return;
    }
    const row = document.createElement("div"); row.className = "ce-row " + (role==="user"?"me":"bot");
    const b = document.createElement("div"); b.className = "ce-badge"; b.textContent = text;
    row.appendChild(b); feed.appendChild(row); feed.scrollTop = feed.scrollHeight;
  }

  function toggle(open){
    const willOpen = open !== undefined ? open : panel.classList.contains("ce-hidden");
    panel.classList.toggle("ce-hidden", !willOpen);
    if (willOpen) input?.focus();
  }

  bubble.addEventListener("click", () => toggle());
  closeBtn.addEventListener("click", () => toggle(false));

  // Bienvenida
  add("assistant", "¡Hola! Soy tu asistente virtual, ¿en qué te ayudo?");

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const text = (input.value || "").trim(); if(!text) return;
    add("user", text); input.value = "";

    try{
      // Chat Trigger de n8n: enviamos el mensaje y la sesión. Adapta las claves si tu flujo espera otras.
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sid(), meta: { url: location.href } })
      });
      if(!res.ok){ throw new Error("HTTP "+res.status); }
      // El flujo debería devolver JSON con la propiedad "reply" o "message"
      let data = {}; try{ data = await res.json(); }catch(_){}
      const reply = data.reply || data.message || "He recibido tu mensaje.";
      add("assistant", String(reply));
    }catch(err){
      console.error("[chat-embed] error", err);
      add("assistant", "No he podido responder ahora. Intenta de nuevo en un momento.");
    }
  });

})();
