
import React, { useState, useEffect, useRef } from 'react';
import { ToolType, Message } from '../types';
import GenAIStudio from './Tools/GenAIStudio';
import Roulette from './Tools/Roulette';
import CRMTool from './Tools/CRMTool';
import NeuralArchitect from './Tools/NeuralArchitect';
import { ScanFace, BrainCircuit, Globe, Sparkles, Fingerprint, ArrowLeft, Play, Save, Check, Sliders, Palette, Mic2, Cpu, Workflow, TrendingUp, DollarSign, MessageCircle, Send, Bot, User, Mic, Gamepad2, MessageSquareText, Zap, BookOpen, X, Target, ListOrdered, Lightbulb } from 'lucide-react';
import { geminiService, GEN_IA_INSTRUCTION } from '../services/geminiService';

// --- TACTICAL GUIDE DATA ---
const MODULE_GUIDES: Record<string, { title: string, objective: string, steps: string[], proTip: string }> = {
    [ToolType.Roulette]: {
        title: "Protocolo de Captación (Lead Gen)",
        objective: "Convertir tráfico anónimo en perfiles validados mediante gamificación de alto impacto.",
        steps: [
            "El usuario llena el formulario (Consentimiento de datos).",
            "El algoritmo valida Device-ID para prevenir fraude.",
            "Giro con probabilidad ponderada y control de stock real.",
            "Inyección inmediata del Lead a la base de datos CRM."
        ],
        proTip: "Los premios con stock bajo (<5) aumentan la tasa de conversión un 40% por sentido de urgencia."
    },
    [ToolType.CRM]: {
        title: "Centro de Inteligencia (Analytics)",
        objective: "Visualizar y gestionar el ciclo de vida del dato en tiempo real.",
        steps: [
            "Revisa 'Ganadores Recientes' para ver ingresos en vivo.",
            "Usa la pestaña 'Premios' para ajustar stock en caliente sin tocar código.",
            "Filtra la 'Base de Leads' para segmentar audiencias.",
            "Exporta la data para campañas de retargeting."
        ],
        proTip: "Filtra por estado 'No Canjeados' y envía un blast de WhatsApp para recuperar esos leads."
    },
    [ToolType.GenAI]: {
        title: "Prisma Lab: Suite de Refracción Creativa",
        objective: "Refractar una idea simple en un espectro completo de activos digitales (Texto, Imagen, Voz).",
        steps: [
            "Community AI: Define tono y plataforma para crear campañas virales.",
            "Editor Inteligente: Pule textos corporativos o expande ideas.",
            "Sintetizador Visual: Crea imágenes para ads con Nano Banana Pro.",
            "Voz: Clona o genera audio para videos y demos."
        ],
        proTip: "Usa el 'Modo Pro' en el Editor para tareas que requieran razonamiento complejo y no solo corrección."
    },
    [ToolType.Avatar]: {
        title: "Agente Autónomo (GEN-IA)",
        objective: "Atención y venta 24/7 sin intervención humana.",
        steps: [
            "El usuario reclama un premio vía WhatsApp (Trigger).",
            "GEN-IA intercepta la conversación automáticamente.",
            "Valida el código del cupón contra la base de datos.",
            "Ejecuta upsell o agenda la visita del cliente."
        ],
        proTip: "El agente tiene acceso de lectura a la base de datos de premios para validar autenticidad."
    },
    [ToolType.Neural]: {
        title: "Arquitecto de Sistemas",
        objective: "Diseño de infraestructura a medida para corporativos.",
        steps: [
            "Visualiza la topología de tu red actual.",
            "Identifica nodos de integración (Legacy/API).",
            "Define reglas de negocio complejas.",
            "Solicita una arquitectura personalizada Enterprise."
        ],
        proTip: "Las soluciones Enterprise incluyen fine-tuning de modelos propios con tu data histórica."
    }
};

const TutorialOverlay: React.FC<{ tool: ToolType, onClose: () => void }> = ({ tool, onClose }) => {
    const guide = MODULE_GUIDES[tool];
    if (!guide) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0f1423] border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(64,212,247,0.15)] overflow-hidden relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 p-6 border-b border-white/10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono border border-cyan-500/30 uppercase tracking-widest">
                                MODO TÁCTICO
                             </span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white">{guide.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/40 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Objective */}
                    <div className="flex gap-4">
                        <div className="mt-1 p-2 bg-cyan-500/10 rounded-lg text-cyan-400 h-fit">
                            <Target size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-1">Objetivo Estratégico</h4>
                            <p className="text-gray-400 leading-relaxed">{guide.objective}</p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex gap-4">
                        <div className="mt-1 p-2 bg-purple-500/10 rounded-lg text-purple-400 h-fit">
                            <ListOrdered size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Flujo Operativo</h4>
                            <ul className="space-y-3">
                                {guide.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-gray-400">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono border border-white/10">
                                            {idx + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex gap-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400 h-fit">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wide mb-1">Pro Tip</h4>
                            <p className="text-sm text-yellow-200/80 italic">"{guide.proTip}"</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#0b0f19] p-4 border-t border-white/5 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        Entendido, iniciar operación
                    </button>
                </div>
            </div>
        </div>
    );
};

const ToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.Roulette);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Avatar State
  const [avatarMode, setAvatarMode] = useState<'landing' | 'studio' | 'examples'>('landing');

  // Listen for external commands to switch tabs (e.g. from Hero buttons)
  useEffect(() => {
    const handleTabChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail === 'crm') {
            setActiveTab(ToolType.CRM);
        }
    };

    window.addEventListener('change-tool-tab', handleTabChange);
    return () => window.removeEventListener('change-tool-tab', handleTabChange);
  }, []);

  // Proactive Selling: Trigger Jarvis to speak when user explores specific tools
  useEffect(() => {
    const triggerJarvis = (message: string) => {
        const event = new CustomEvent('trigger-jarvis', { detail: message });
        window.dispatchEvent(event);
    };

    switch (activeTab) {
        case ToolType.CRM:
            triggerJarvis("¿Notas los 'Puntos Calientes' (i) en el Dashboard? Pasa el cursor para ver cómo nuestra IA predictiva ahorra recursos.");
            break;
        case ToolType.Roulette:
            triggerJarvis("Esta Ruleta no es un juego. Valida teléfonos, previene fraude por Device-ID y empuja el lead directo a tu CRM.");
            break;
        case ToolType.GenAI:
            triggerJarvis("Bienvenido a Prisma Lab. Aquí transformamos tus conceptos puros en múltiples formatos creativos.");
            break;
        case ToolType.Avatar:
            // Custom GEN-IA Welcome in the component itself
            break;
        case ToolType.Neural:
            triggerJarvis("Este es el Arquitecto Neural. Describe cualquier lógica de negocio, por compleja que sea, y observa cómo generamos el plano.");
            break;
    }
  }, [activeTab, avatarMode]);

  const renderContent = () => {
    switch (activeTab) {
      case ToolType.GenAI:
        return <GenAIStudio />;
      
      case ToolType.Roulette:
        return <Roulette />;

      case ToolType.CRM:
        return <CRMTool />;

      case ToolType.Neural:
        return <NeuralArchitect />;
        
      case ToolType.Avatar:
         return <GenIAInterface />;

      default:
        return (
            <div className="text-center p-12">
                <h3 className="text-2xl font-bold text-gray-500">Select a tool to view details</h3>
            </div>
        );
    }
  };

  return (
    <section id="herramientas" className="py-20 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <span className="text-sm font-mono text-pink-400">// STACK</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Nuestras <span className="gradient-text">Herramientas</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                Explora nuestras soluciones interactivas. Cada módulo está diseñado para escalar tus operaciones.
            </p>
        </div>

        {/* Tabs & Tutorial Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap justify-center gap-3">
                {[
                    { id: ToolType.Roulette, label: '🎡 Ruleta', color: 'purple' },
                    { id: ToolType.CRM, label: '📊 CRM', color: 'pink' },
                    { id: ToolType.GenAI, label: '💎 Prisma Lab', color: 'cyan' },
                    { id: ToolType.Avatar, label: '💬 GEN-IA', color: 'blue' },
                    { id: ToolType.Neural, label: '⚡ Neural', color: 'green' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all glass-card font-mono text-xs md:text-sm border hover:border-${tab.color}-400/50 ${activeTab === tab.id ? `border-${tab.color}-400 bg-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'border-transparent text-gray-400'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-cyan-400 hover:bg-white/10 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_10px_rgba(64,212,247,0.2)]"
            >
                <BookOpen size={14} />
                Guía Operativa
            </button>
        </div>

        {/* Container */}
        <div className="glass-card rounded-2xl min-h-[600px] overflow-hidden shadow-2xl relative">
            {showTutorial && <TutorialOverlay tool={activeTab} onClose={() => setShowTutorial(false)} />}
            {renderContent()}
        </div>
      </div>
    </section>
  );
};

// --- GEN-IA COMMAND CENTER ---
const GenIAInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: '¡Hola! Soy GEN-IA de Creastilo. He sido activada mediante el protocolo de reclamo de premios. ¿Cómo puedo asistirte hoy?', sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const history = messages.map(m => ({
            role: m.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: m.text }]
        }));

        // Use the GEN-IA specific Persona Instruction
        const responseText = await geminiService.chat(userMsg.text, history, GEN_IA_INSTRUCTION);
        
        const botMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            text: responseText, 
            sender: 'bot', 
            timestamp: new Date() 
        };
        
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);

        // Auto-speak if active (optional, for now triggered manually or by button)
        // geminiService.generateAndPlaySpeech(responseText, 'Kore');
    };

    const playMessage = (text: string) => {
        setIsSpeaking(true);
        geminiService.generateAndPlaySpeech(text, 'Kore').then(() => {
            setTimeout(() => setIsSpeaking(false), 5000); // Rough estimate for visualizer
        });
    };

    return (
        <div className="grid lg:grid-cols-2 h-full min-h-[650px]">
            {/* LEFT: VISUAL AVATAR & INJECTION EXPLANATION */}
            <div className="relative bg-gradient-to-b from-[#0f1423] to-black p-8 flex flex-col items-center justify-center border-r border-white/5">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/20 group mb-8">
                    {/* Placeholder image for GEN-IA */}
                    <img 
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                        alt="GEN-IA Avatar" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-cyan-900/10"></div>
                    
                    {/* Holographic Overlays */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold rounded border border-cyan-500/30 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-cyan-600'}`}></span>
                            ONLINE
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold rounded border border-purple-500/30">
                            AGENT INJECTED
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-3xl font-display font-bold text-white mb-1">GEN-IA</h3>
                        <p className="text-cyan-300 font-mono text-xs mb-4">CSM & Ventas • Activada por WhatsApp</p>
                    </div>
                </div>

                {/* VISUAL FLOW DIAGRAM (INJECTION MECHANISM) */}
                <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3 text-center">Mecanismo de Inyección</p>
                    <div className="flex items-center justify-between px-2">
                        {/* Step 1: Minigame */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                                <Gamepad2 size={20} />
                            </div>
                            <span className="text-[10px] text-gray-400">Dinámica</span>
                        </div>

                        {/* Arrow */}
                        <div className="h-[2px] w-8 bg-gradient-to-r from-purple-500/50 to-green-500/50"></div>

                        {/* Step 2: WhatsApp Pre-written */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30 relative">
                                <MessageSquareText size={20} />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-[10px] text-gray-400">Mensaje Pre-escrito</span>
                        </div>

                        {/* Arrow */}
                        <div className="h-[2px] w-8 bg-gradient-to-r from-green-500/50 to-cyan-500/50"></div>

                        {/* Step 3: Agent Activation */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 relative">
                                <Zap size={20} />
                                <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-lg animate-pulse"></div>
                            </div>
                            <span className="text-[10px] text-white font-bold">GEN-IA (Inyección)</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-gray-500 mt-4 italic leading-tight">
                        "El agente se inyecta en la conversación cuando el usuario reclama su premio."
                    </p>
                </div>
            </div>

            {/* RIGHT: COMMAND CENTER (CHAT) */}
            <div className="flex flex-col bg-[#050510]">
                {/* Header */}
                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={18} className="text-cyan-400" />
                        <span className="font-bold text-sm text-white">Canal Seguro</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500">SESSION ID: 8X-992</div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/40 relative">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300 relative z-10`}>
                            <div className={`flex flex-col gap-1 max-w-[85%]`}>
                                <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar Bubble */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-purple-600' : 'bg-cyan-600'}`}>
                                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`rounded-2xl p-4 text-sm shadow-md ${
                                        msg.sender === 'user' 
                                            ? 'bg-purple-500/20 text-purple-100 border border-purple-500/30 rounded-br-none' 
                                            : 'bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                                
                                {/* Bot Actions */}
                                {msg.sender === 'bot' && (
                                    <div className="flex gap-2 ml-10">
                                        <button 
                                            onClick={() => playMessage(msg.text)}
                                            className="text-[10px] flex items-center gap-1 text-cyan-400 hover:text-white transition-colors"
                                        >
                                            <Play size={10} /> Escuchar (Voz Gen-IA)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start relative z-10 ml-10">
                            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-white/5">
                    <div className="relative flex items-center gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe tu consulta o pide una demo..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none pr-12 transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-[10px] text-gray-600 font-mono">GEN-IA powered by Gemini 2.5 Flash & Pro models.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolsSection;
