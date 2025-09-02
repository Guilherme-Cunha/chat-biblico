const { createApp } = Vue;

createApp({
  data() {
    return {
      input: "",
      messages: [
        { from: "bot", text: "Olá! 👋 Sou seu assistente bíblico. Pode fazer sua pergunta." }
      ],
      backendUrl: "https://server-chat-biblico.vercel.app/api/chat" // sua API no Vercel
    };
  },
  methods: {
    async sendMessage() {
      const text = this.input.trim();
      if (!text) return;

      // adiciona mensagem do usuário
      this.messages.push({ from: "user", text });
      this.input = "";

      try {
        const response = await fetch(this.backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "user", content: text }
            ]
          })
        });

        const data = await response.json();

        // pega a resposta do bot
        const reply = data.reply?.content || "Não encontrei uma resposta.";
        this.messages.push({ from: "bot", text: reply });

        // rola o scroll para o final
        this.$nextTick(() => {
          const messagesDiv = document.getElementById("messages");
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });

      } catch (err) {
        console.error(err);
        this.messages.push({ from: "bot", text: "⚠️ Erro ao conectar com o servidor." });
      }
    }
  }
}).mount("#app");
