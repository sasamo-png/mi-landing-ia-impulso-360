import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.esm.js";

createChat({
  webhookUrl: "https://agencia-ia-n8n.u2vajm.easypanel.host/webhook/ac6b8b71-edbe-4ff8-a944-2c24f4632fa7/chat",
  target: "#n8n-chat",
  mode: "window", // "window" = burbuja flotante, "inline" = incrustado fijo
  i18n: {
    es: {
      title: "Asistente IA",
      subtitle: "Con memoria y respuesta automática",
      inputPlaceholder: "Escribe tu mensaje…",
      sendButton: "Enviar",
    },
  },
  defaultLanguage: "es",
  showWelcomeScreen: true,
  initialMessages: [
    { role: "assistant", content: "¡Hola! Soy tu asistente virtual, ¿en qué te ayudo?" }
  ],
  chatSessionKey: "chatbot_impulso360_v1"
});
