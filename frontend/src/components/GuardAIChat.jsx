import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User } from 'lucide-react';

export default function GuardAIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am GuardAI, your real-time Enterprise Cyber Threat Analyst. Ask me about attack vectors, payload entropy, Isolation Forest anomaly scoring, employee management, or mitigation steps.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to GuardAI engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 w-96 glass-panel border border-blue-500/40 shadow-2xl flex flex-col h-[520px] font-mono">
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1">
              GuardAI Specialist <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </h4>
            <span className="text-[10px] text-emerald-400">Enterprise SOC Assistant Online</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-1.5 rounded-lg ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`p-3 rounded-xl max-w-[80%] ${
              m.sender === 'user' ? 'bg-blue-600/30 text-slate-100 border border-blue-500/30' : 'bg-slate-900/90 text-slate-300 border border-slate-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-slate-400 text-xs italic flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 animate-spin" /> GuardAI is analyzing telemetry...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-900/80">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask GuardAI about threats or ML..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
