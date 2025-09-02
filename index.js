import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! Sou seu assistente bíblico. O que deseja saber hoje?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, data.reply]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Área do chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl max-w-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white shadow-md text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500">Digitando...</p>}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-xl px-3 py-2 mr-2 outline-none"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
