
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Hero from './components/Hero';
import HolographicCard from './components/ui/HolographicCard';
import { useToast } from './components/ui/Toast';
import { ShieldCheck, Mail, ArrowRight, Calendar, ExternalLink, X, Check, Zap, Gem, Crown, Rocket, Loader2 } from 'lucide-react';

// Lazy load heavy components
const ToolsSection = lazy(() => import('./components/ToolsSection'));
const Jarvis = lazy(() => import('./components/Jarvis'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const Integrations = lazy(() => import('./components/Integrations'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="animate-spin text-cyan-400" size={40} />
  </div>
);

const App: React.FC = () => {
  const toast = useToast();
  const [showBooking, setShowBooking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Check if user has visited before
  useEffect(() => {
    // NOTE: Commented out for demo purposes so user can see the onboarding update
    /*
    const visited = localStorage.getItem('creastilo_visited');
    if (visited) {
        setShowOnboarding(false);
    }
    */
  }, []);

  // Global toast event listener for service errors
  useEffect(() => {
    const handleToastEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, message } = customEvent.detail;
      if (toast && toast[type as keyof typeof toast]) {
        (toast[type as keyof typeof toast] as (msg: string) => void)(message);
      }
    };

    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, [toast]);

  const handleOnboardingComplete = () => {
      // Mark as visited
      localStorage.setItem('creastilo_visited', 'true');
      setShowOnboarding(false);
      toast.success('Sistema iniciado correctamente. ¡Bienvenido a Creastilo!');

      // Trigger Jarvis Welcome
      setTimeout(() => {
         window.dispatchEvent(new CustomEvent('system-online'));
      }, 500);
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      <Background />

      <Suspense fallback={<LoadingFallback />}>
        {showOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <>
              <Navbar onOpenBooking={() => setShowBooking(true)} />

              <main className="animate-in fade-in duration-1000">
                  <Hero />

                  <Suspense fallback={<LoadingFallback />}>
                    <Integrations />
                  </Suspense>

                  {/* Problems Section */}
                  <section id="problema" className="py-20 px-4 relative z-10">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                        <span className="text-sm font-mono text-cyan-400">// ANALYSIS</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Los <span className="gradient-text">Problemas</span> que Resolvemos
                    </h2>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                        { icon: "📉", title: "Tráfico sin Conversión", desc: "Miles de visitas en tu sitio web, pero pocos clientes potenciales registrados.", color: "cyan" },
                        { icon: "📝", title: "Formularios Aburridos", desc: "El 80% de los usuarios abandona al ver un formulario de contacto estático.", color: "purple" },
                        { icon: "🔌", title: "Datos Desconectados", desc: "Leads que mueren en un Excel en lugar de disparar acciones de venta inmediatas.", color: "pink" }
                        ].map((item, idx) => (
                        <HolographicCard key={idx} className="glass-card rounded-2xl p-8 border border-white/5 hover:border-white/10 h-full">
                            <div className={`w-16 h-16 rounded-xl bg-${item.color}-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-display">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </HolographicCard>
                        ))}
                    </div>
                </div>
                </section>

                <Suspense fallback={<LoadingFallback />}>
                  <ToolsSection />
                </Suspense>

                {/* Pricing / Access Tiers Section */}
                <section id="contacto" className="py-20 px-4 relative z-10 border-t border-white/5 bg-[#030014]/50">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                             <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                                Niveles de <span className="gradient-text">Acceso</span>
                            </h2>
                            <p className="text-gray-400 max-w-xl mx-auto">
                                Selecciona el ecosistema que mejor se adapte a tu etapa de crecimiento digital.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 items-start">
                            {/* Starter Plan */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all relative group h-full flex flex-col">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Zap size={24} /></div>
                                    <h3 className="font-bold text-xl">Creator Access</h3>
                                </div>
                                <div className="mb-6">
                                    <span className="text-2xl font-bold text-white">Bajo Demanda</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">Acceso puntual a herramientas de generación para campañas rápidas.</p>
                                <button onClick={() => setShowBooking(true)} className="w-full py-3 border border-white/20 rounded-lg font-bold hover:bg-white/10 transition-colors mb-8 mt-auto">Solicitar Invitación</button>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex gap-2"><Check size={16} className="text-cyan-400" /> Gen-IA Studio (Suite Creativa)</li>
                                    <li className="flex gap-2"><Check size={16} className="text-cyan-400" /> Clonación de Voz Básica</li>
                                    <li className="flex gap-2"><Check size={16} className="text-cyan-400" /> Pago por uso (Créditos)</li>
                                </ul>
                            </div>

                            {/* Growth Plan (Highlight) */}
                            <div className="bg-gradient-to-b from-[#1a1a2e] to-black border border-purple-500/50 rounded-2xl p-8 relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col h-full">
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">RECOMENDADO</div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Rocket size={24} /></div>
                                    <h3 className="font-bold text-xl">Business Growth</h3>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white">Consultar</span>
                                    <span className="text-gray-500 text-sm block mt-1">Implementación + Fee Mensual</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">Ecosistema completo de captación de leads y automatización CRM.</p>
                                <button onClick={() => setShowBooking(true)} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all mb-8 mt-auto">
                                    Agendar Demo
                                </button>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex gap-2"><Check size={16} className="text-purple-400" /> <strong>Todo el Ecosistema</strong></li>
                                    <li className="flex gap-2"><Check size={16} className="text-purple-400" /> Ruleta Promo (Leads Ilimitados)</li>
                                    <li className="flex gap-2"><Check size={16} className="text-purple-400" /> CRM Dashboard & Analytics</li>
                                    <li className="flex gap-2"><Check size={16} className="text-purple-400" /> Agente GEN-IA Personalizado</li>
                                    <li className="flex gap-2"><Check size={16} className="text-purple-400" /> Soporte Prioritario</li>
                                </ul>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-pink-500/30 transition-all relative group flex flex-col h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Crown size={24} /></div>
                                    <h3 className="font-bold text-xl">Neural Architect</h3>
                                </div>
                                <div className="mb-6">
                                    <span className="text-2xl font-bold text-white">A la medida</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">Arquitectura de software dedicada para altos volúmenes y corporativos.</p>
                                <button onClick={() => setShowBooking(true)} className="w-full py-3 border border-white/20 rounded-lg font-bold hover:bg-white/10 transition-colors mb-8 mt-auto">Contactar Ventas</button>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex gap-2"><Check size={16} className="text-pink-400" /> Integración ERP/SAP</li>
                                    <li className="flex gap-2"><Check size={16} className="text-pink-400" /> Modelos Gemini Fine-Tuned</li>
                                    <li className="flex gap-2"><Check size={16} className="text-pink-400" /> SLA & Infraestructura Dedicada</li>
                                </ul>
                            </div>
                        </div>

                        {/* Session Pricing FAQ */}
                        <div className="mt-16 bg-[#151c2f] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">¿Cómo comenzamos?</h3>
                                <p className="text-gray-400 text-sm max-w-2xl">
                                    Cada proyecto es único. No cobramos por decirte qué necesitas.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span><strong>Diagnóstico de Viabilidad (30 min):</strong> <span className="text-green-400 font-bold">100% SIN COSTO</span>.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                        <span><strong>Roadmap Técnico:</strong> Se bonifica al contratar el proyecto.</span>
                                    </li>
                                </ul>
                            </div>
                            <button 
                                onClick={() => setShowBooking(true)}
                                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform whitespace-nowrap"
                            >
                                Agendar Diagnóstico
                            </button>
                        </div>
                    </div>
                </section>

                <Suspense fallback={<LoadingFallback />}>
                  <FAQ />
                </Suspense>
            </main>

            <Suspense fallback={<LoadingFallback />}>
              <Footer />
            </Suspense>
          </>
        )}
      </Suspense>

      {/* GLOBAL BOOKING MODAL */}
      {showBooking && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-4xl h-[85vh] rounded-2xl relative shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#151515]">
                        <div className="flex items-center gap-2">
                             <Calendar className="text-cyan-400" size={20} />
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
                                onClick={() => setShowBooking(false)}
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

      <Suspense fallback={null}>
        <Jarvis />
      </Suspense>
    </div>
  );
};

export default App;
