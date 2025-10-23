import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hola 👋 ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    console.log(input)
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      console.log(data)

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response || "No se recibió respuesta." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al conectar con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Permitir enviar con Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-50 dark:bg-gray-800 p-4 hidden md:block border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold dark:text-white mb-6">ARK</h1>
      </aside>

      {/* Chat principal */}
      <main className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Chat</h2>
        </header>

        {/* Lista de mensajes */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 text-sm italic">Escribiendo...</div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <textarea
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 resize-none focus:ring focus:ring-blue-500"
              rows="2"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
