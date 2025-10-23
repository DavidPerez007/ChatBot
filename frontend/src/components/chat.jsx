import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hola 👋 ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: input,
          // Opcional: enviar IDs de documentos activos
          document_ids: documents.filter(doc => doc.isActive).map(doc => doc.id)
        }),
      });
      const data = await res.json();
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log(files)
    
    if (files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
        console.log(file)
      });

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        const newDocuments = result.documents.map(doc => ({
          id: doc.id || Date.now() + Math.random(),
          name: doc.original_name,
          size: doc.size,
          type: doc.type,
          uploadDate: new Date().toLocaleDateString(),
          isActive: true, // Para RAG - si está activo se usa en las consultas
          chunks: doc.chunks || 0, // Número de chunks creados
          status: 'processed'
        }));

        setDocuments(prev => [...prev, ...newDocuments]);
        
        setMessages(prev => [
          ...prev,
          { 
            sender: "bot", 
            text: `Documentos procesados correctamente. ${result.chunks_total || 0} fragmentos creados para RAG.` 
          }
        ]);
      } else {
        throw new Error(result.error || 'Error al subir documentos');
      }
    } catch(error) {
      console.error('Error subiendo documentos:', error);
      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: `Error al procesar documentos: ${error.message}` 
        }
      ]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_document/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Documento eliminado correctamente." }
        ]);
      }
    } catch (error) {
      console.error('Error eliminando documento:', error);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const toggleDocumentActive = async (id) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, isActive: !doc.isActive } : doc
      )
    );

    try {
      const doc = documents.find(d => d.id === id);
      await fetch(`http://localhost:5000/documents/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !doc.isActive })
      });
    } catch (error) {
      console.error('Error actualizando estado del documento:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-50 dark:bg-gray-800 p-4 hidden md:block border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <h1 className="text-xl font-bold dark:text-white mb-6">ARK RAG</h1>
        
        {/* Botón para subir documentos */}
        <div className="mb-6">
          <label className={`block w-full ${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white text-center px-4 py-2 rounded-lg cursor-pointer transition-colors`}>
            {uploading ? 'Subiendo...' : 'Subir Documentos'}
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt"
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            PDF, Word, Excel, PowerPoint, TXT
          </p>
        </div>

        {/* Lista de documentos subidos */}
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Documentos ({documents.length})
            </h3>
            <span className="text-xs text-gray-500">
              {documents.filter(d => d.isActive).length} activos
            </span>
          </div>
          
          {documents.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic py-4">
              No hay documentos subidos
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`bg-white dark:bg-gray-700 p-3 rounded-lg border transition-all ${
                    doc.isActive 
                      ? 'border-green-500 dark:border-green-400' 
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(doc.size / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.uploadDate}
                        </span>
                        {doc.chunks > 0 && (
                          <>
                            <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-xs text-blue-500">
                              {doc.chunks} chunks
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => toggleDocumentActive(doc.id)}
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          doc.isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}
                        title={doc.isActive ? 'Desactivar para RAG' : 'Activar para RAG'}
                      >
                        {doc.isActive ? '✓' : '○'}
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar documento"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.status === 'processed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-xs text-gray-500 capitalize">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información RAG */}
        {documents.length > 0 && (
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
              Modo RAG Activado
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              El chat usará los documentos activos (✓) para responder tus preguntas.
            </p>
          </div>
        )}
      </aside>

      {/* Chat principal */}
      <main className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-white">Chat con RAG</h2>
          {documents.filter(d => d.isActive).length > 0 && (
            <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">
              RAG: {documents.filter(d => d.isActive).length} doc(s)
            </span>
          )}
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
                className={`max-w-xl px-4 py-2 rounded-lg ${
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
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  Procesando con RAG...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <textarea
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 resize-none focus:ring focus:ring-blue-500"
              rows="2"
              placeholder={
                documents.filter(d => d.isActive).length > 0 
                  ? "Haz una pregunta sobre tus documentos..." 
                  : "Escribe tu mensaje..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}