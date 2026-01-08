
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';
import { getExpertAdvice } from '../services/geminiService';
import { Bird } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIConsultantProps {
  birds: Bird[];
}

const AIConsultant: React.FC<AIConsultantProps> = ({ birds }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hola, soy tu consultor experto de GalloMaster. ¿En qué puedo ayudarte hoy con la gestión de tu granja, genética o salud de tus aves?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const farmContext = {
      totalBirds: birds.length,
      breeds: Array.from(new Set(birds.map(b => b.breed))),
      activeTraining: birds.filter(b => b.status === 'En Entrenamiento').length
    };

    const response = await getExpertAdvice(userMsg, farmContext);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response || 'Sin respuesta.' }]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" />
            Consultor Digital Experto
          </h1>
          <p className="text-slate-400 text-sm">IA entrenada en genética avícola profesional.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-bold">
          <Info size={14} />
          Potenciado por Gemini 3
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        <div 
          ref={scrollRef}
          className="flex-1 p-6 space-y-6 overflow-y-auto scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-500' : 'bg-amber-500'
              }`}>
                {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-slate-900" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot size={18} className="text-slate-900" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                El experto está analizando...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta sobre alimentación, cruces genéticos, salud..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-4 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-tighter">La IA puede cometer errores. Consulta siempre con un veterinario calificado para temas médicos urgentes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction label="Sugerir Cruces" prompt="Basado en mi inventario actual, ¿cuál sería el mejor cruce para velocidad?" onSelect={setInput} />
        <QuickAction label="Dieta de Cuido" prompt="¿Cuál es la mejor dieta de proteínas para la etapa de cuido de 21 días?" onSelect={setInput} />
        <QuickAction label="Calendario Salud" prompt="Genera un calendario básico de desparasitación para pollos recién nacidos." onSelect={setInput} />
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ label: string, prompt: string, onSelect: (p: string) => void }> = ({ label, prompt, onSelect }) => (
  <button 
    onClick={() => onSelect(prompt)}
    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-amber-500/50 transition-colors group"
  >
    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-200">{prompt}</p>
  </button>
);

export default AIConsultant;
