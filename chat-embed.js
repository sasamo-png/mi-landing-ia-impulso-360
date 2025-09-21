document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIGURACIÓN ---
  // URL actualizada con tu endpoint de n8n.
  const chatUrl = 'https://agencia-ia-n8n.u2vajm.easypanel.host/webhook/ac6b8b71-edbe-4ff8-a944-2c24f4632fa7/chat';

  // --- CREACIÓN DE ELEMENTOS ---
  const chatBubble = document.createElement('div');
  chatBubble.id = 'ia-chat-bubble';
  chatBubble.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;

  const chatContainer = document.createElement('div');
  chatContainer.id = 'ia-chat-container';
  chatContainer.innerHTML = `
    <div id="ia-chat-header">
      <span>Asistente Virtual</span>
      <button id="ia-chat-close">&times;</button>
    </div>
    <iframe id="ia-chat-iframe" src="" frameborder="0" style="display:none;"></iframe>
    <div id="ia-chat-loader">Cargando...</div>
  `;

  document.body.appendChild(chatBubble);
  document.body.appendChild(chatContainer);

  // --- ESTILOS CSS ---
  const styles = `
    :root {
      --chat-primary-color: #007bff;
      --chat-text-color: #ffffff;
    }
    #ia-chat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background-color: var(--chat-primary-color);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      transition: transform 0.2s ease-in-out;
      z-index: 9998;
    }
    #ia-chat-bubble:hover {
      transform: scale(1.1);
    }
    #ia-chat-bubble svg {
      color: var(--chat-text-color);
      width: 32px;
      height: 32px;
    }
    #ia-chat-container {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 90%;
      max-width: 380px;
      height: 70vh;
      max-height: 600px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.25);
      background-color: #fff;
      display: flex;
      flex-direction: column;
      transform: translateY(20px) scale(0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease-in-out;
      z-index: 9999;
      overflow: hidden;
    }
    #ia-chat-container.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      visibility: visible;
    }
    #ia-chat-header {
      background-color: var(--chat-primary-color);
      color: var(--chat-text-color);
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
    }
    #ia-chat-close {
      background: none;
      border: none;
      color: var(--chat-text-color);
      font-size: 24px;
      cursor: pointer;
      padding: 0 5px;
    }
    #ia-chat-iframe {
      flex-grow: 1;
      border: none;
      width: 100%;
      height: 100%;
    }
    #ia-chat-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-family: 'Outfit', sans-serif;
        color: #999;
    }
    @media (max-width: 480px) {
      #ia-chat-container {
        width: calc(100% - 20px);
        height: calc(100% - 80px);
        max-height: none;
        bottom: 10px;
        right: 10px;
        top: 70px;
      }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // --- LÓGICA DE FUNCIONAMIENTO ---
  const bubble = document.getElementById('ia-chat-bubble');
  const container = document.getElementById('ia-chat-container');
  const closeButton = document.getElementById('ia-chat-close');
  const iframe = document.getElementById('ia-chat-iframe');
  const loader = document.getElementById('ia-chat-loader');

  let isChatLoaded = false;

  function toggleChat() {
    container.classList.toggle('open');
    // Carga el iframe solo la primera vez que se abre el chat
    if (container.classList.contains('open') && !isChatLoaded) {
      iframe.src = chatUrl;
      iframe.onload = () => {
        loader.style.display = 'none';
        iframe.style.display = 'block';
      };
      isChatLoaded = true;
    }
  }

  bubble.addEventListener('click', toggleChat);
  closeButton.addEventListener('click', toggleChat);
});