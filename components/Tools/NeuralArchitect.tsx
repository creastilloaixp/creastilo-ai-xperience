
import React, { useState } from 'react';
import { Workflow, Cpu, Layers, ArrowRight, Zap, Database, Network, Calendar, CheckCircle2, Rocket, X, ExternalLink, Box, Activity, Lock } from 'lucide-react';

const NeuralArchitect: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  const benefits = [
      {
          icon: <Network className="text-cyan-400" />,
          title: "Orquestación Total",
          desc: "Unificamos tu caos operativo. Tu ERP antiguo, tu CRM moderno y tus APIs personalizadas hablando un mismo idioma."
      },
      {
          icon: <Cpu className="text-purple-400" />,
          title: "Cerebros Digitales",
          desc: "Agentes autónomos que ejecutan procesos complejos (Aprobaciones, Logística, Soporte) sin intervención humana."
      },
      {
          icon: <Box className="text-green-400" />,
          title: "Infraestructura Líquida",
          desc: "Arquitecturas que escalan horizontalmente. Si tu tráfico se multiplica por 10x, tu software se adapta automáticamente."
      }
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#050505]">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Grid Pattern */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
        ></div>

        <div className="grid lg:grid-cols-2 h-full relative z-10">
            
            {/* LEFT: THE PITCH */}
            <div className="p-8 lg:p-12 flex flex-col justify-center h-full overflow-y-auto custom-scrollbar relative">
                <div className="mb-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono mb-6 animate-in slide-in-from-left-4">
                        <Rocket size={12} /> ENTERPRISE SOLUTIONS
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                        Rompe las barreras del <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Software Estándar.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                        ¿Tu visión es demasiado compleja para una plantilla? 
                        <br/><br/>
                        En <strong>Neural Architect</strong>, no vendemos "apps". Diseñamos ecosistemas digitales vivos. 
                        Conectamos tus reglas de negocio únicas con inteligencia artificial avanzada para crear ventajas competitivas reales.
                    </p>
                </div>

                <div className="space-y-4 mb-10 relative z-10">
                    {benefits.map((item, i) => (
                        <div key={i} className="group flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-green-500/30 transition-all duration-300">
                            <div className="mt-1 p-2 bg-black/40 rounded-lg group-hover:scale-110 transition-transform">{item.icon}</div>
                            <div>
                                <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{item.title}</h4>
                                <p className="text-sm text-gray-400 leading-snug">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative z-10">
                    <button 
                        onClick={() => setShowCalendar(true)}
                        className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <Calendar size={20} className="relative z-10" />
                        <span className="relative z-10">Agendar Sesión de Estrategia</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
                    </button>
                    <p className="mt-4 text-xs text-gray-500 font-mono flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-500" />
                        Consultoría gratuita de 30 min para evaluar viabilidad técnica.
                    </p>
                </div>
            </div>

            {/* RIGHT: THE VISUAL PROOF (Living Blueprint) */}
            <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-[#020202] border-l border-white/5 overflow-hidden">
                
                {/* Radar Scan Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
                     <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,197,94,0.1)_60deg,transparent_60deg)] animate-[spin_4s_linear_infinite]"></div>
                </div>

                {/* The Schematic Container */}
                <div className="relative w-[400px] h-[400px]">
                    
                    {/* Connection Lines Layer (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
                                <stop offset="50%" stopColor="rgba(34, 197, 94, 0.5)" />
                                <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
                            </linearGradient>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#4ade80" />
                            </marker>
                        </defs>
                        
                        {/* Connecting Lines */}
                        {/* Top to Center */}
                        <line x1="50%" y1="15%" x2="50%" y2="40%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M200,60 L200,160" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" opacity="0.6" />

                        {/* Bottom Left to Center */}
                        <line x1="20%" y1="80%" x2="40%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M80,320 L160,240" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1.5s_linear_infinite]" opacity="0.6" />

                        {/* Bottom Right to Center */}
                        <line x1="80%" y1="80%" x2="60%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <path d="M320,320 L240,240" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1.2s_linear_infinite]" opacity="0.6" />
                    </svg>

                    {/* Central Core (The "Brain") */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-xl animate-pulse"></div>
                            <div className="w-24 h-24 bg-black border border-green-500/50 rounded-xl flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.15)] z-10 overflow-hidden">
                                {/* Hexagon Grid bg inside */}
                                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '8px 8px'}}></div>
                                
                                <Workflow size={32} className="text-green-400 mb-1 relative z-10" />
                                <span className="text-[10px] font-mono text-green-200 tracking-widest relative z-10">CORE</span>
                                
                                {/* Scan line inside core */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-green-400/50 blur-[2px] animate-[scan_2s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Satellite Node 1 (Legacy Data) */}
                    <div className="absolute top-[5%] left-1/2 -translate-x-1/2 hover:scale-110 transition-transform cursor-pointer group">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-[#111] border border-gray-700 group-hover:border-purple-500 rounded-lg flex items-center justify-center shadow-lg transition-colors relative">
                                <Database size={24} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                                <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                            </div>
                            <div className="bg-black/50 px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-gray-400">LEGACY DATA</div>
                        </div>
                    </div>

                    {/* Satellite Node 2 (External APIs) */}
                    <div className="absolute bottom-[10%] left-[10%] hover:scale-110 transition-transform cursor-pointer group">
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-[#111] border border-gray-700 group-hover:border-cyan-500 rounded-lg flex items-center justify-center shadow-lg transition-colors relative">
                                <Network size={24} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                <div className="absolute -right-1 -top-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-75"></div>
                            </div>
                            <div className="bg-black/50 px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-gray-400">API GATEWAY</div>
                        </div>
                    </div>

                    {/* Satellite Node 3 (Security/Logic) */}
                    <div className="absolute bottom-[10%] right-[10%] hover:scale-110 transition-transform cursor-pointer group">
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-[#111] border border-gray-700 group-hover:border-yellow-500 rounded-lg flex items-center justify-center shadow-lg transition-colors relative">
                                <Lock size={24} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                                <div className="absolute -right-1 -top-1 w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-150"></div>
                            </div>
                            <div className="bg-black/50 px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-gray-400">SECURITY</div>
                        </div>
                    </div>

                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <Activity size={14} className="text-green-400 animate-pulse" />
                    <span className="text-xs font-mono text-gray-300">System Status: <span className="text-green-400">OPTIMAL</span></span>
                </div>

            </div>
        </div>

        {/* BOOKING MODAL */}
        {showCalendar && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-4xl h-[85vh] rounded-2xl relative shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#151515]">
                        <div className="flex items-center gap-2">
                             <Calendar className="text-green-400" size={20} />
                             <div>
                                <h3 className="font-bold text-white text-sm">Agendar Sesión de Estrategia</h3>
                                <p className="text-[10px] text-gray-500">Selecciona una fecha disponible</p>
                             </div>
                        </div>
                        <div className="flex gap-2">
                             <a 
                                href="https://calendar.app.google/ZmAFz6Gvoq3qGZZ36" 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Abrir en ventana nueva"
                             >
                                <ExternalLink size={20} />
                             </a>
                             <button 
                                onClick={() => setShowCalendar(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                             >
                                <X size={20} />
                             </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-white relative">
                        <iframe 
                            src="https://calendar.app.google/ZmAFz6Gvoq3qGZZ36" 
                            style={{border: 0}} 
                            width="100%" 
                            height="100%" 
                            title="Schedule Appointment"
                        ></iframe>
                    </div>
                </div>
            </div>
        )}
        
        {/* CSS for custom keyframes that Tailwind might miss */}
        <style>{`
            @keyframes dash {
                to {
                    stroke-dashoffset: -20;
                }
            }
            @keyframes scan {
                0%, 100% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            @keyframes shimmer {
                100% { transform: translateX(100%); }
            }
        `}</style>
    </div>
  );
};

export default NeuralArchitect;
