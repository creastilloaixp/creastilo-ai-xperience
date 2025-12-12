
import React, { useState, useEffect } from 'react';
import { geminiService } from '../../services/geminiService';
import { apiClient } from '../../lib/apiClient';
import { v4 as uuidv4 } from 'uuid';
import { Trophy, Loader2, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, Database, Zap, LayoutDashboard, Ticket, ArrowRight } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Prize {
  id: number;
  label: string;
  color: string;
  textColor: string;
  prob: string;
  stock: number;
  weight: number;
}

const INITIAL_PRIZES: Prize[] = [
  { id: 1, label: "Shot 2x1", color: "#40d4f7", textColor: "black", prob: "22%", stock: 30, weight: 22 }, 
  { id: 2, label: "10% OFF", color: "#ec4899", textColor: "white", prob: "25%", stock: 50, weight: 25 },
  { id: 3, label: "Gracias por participar", color: "#334155", textColor: "white", prob: "33%", stock: 9999, weight: 33 },
  { id: 4, label: "Combo Nachos 3x", color: "#22c55e", textColor: "black", prob: "10%", stock: 10, weight: 10 },
  { id: 5, label: "Merch sorpresa", color: "#fbbf24", textColor: "black", prob: "7%", stock: 6, weight: 7 },
  { id: 6, label: "Gran Premio: Cena", color: "#8b5cf6", textColor: "white", prob: "3%", stock: 2, weight: 3 },
];

const SEGMENT_ANGLE = 360 / INITIAL_PRIZES.length;

const Roulette: React.FC = () => {
  const toast = useToast();
  const [prizes, setPrizes] = useState(INITIAL_PRIZES);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [savedToCRM, setSavedToCRM] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      name: '',
      whatsapp: '',
      acceptedTerms: false
  });

  // Anti-fraud state
  const [hasSpun, setHasSpun] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('creastilo_roulette_state');
    if (savedState) {
        try {
            const { spun, prizeId } = JSON.parse(savedState);
            if (spun) {
                setHasSpun(true);
                const savedPrize = INITIAL_PRIZES.find(p => p.id === prizeId);
                if (savedPrize) {
                    setWinner(savedPrize);
                    toast.info('Ya has participado anteriormente. Reinicia para probar de nuevo.');
                }
            }
        } catch (e) {
            toast.error('Error al cargar estado previo de la ruleta.');
        }
    }
  }, [toast]);

  const canSpin = formData.name.length > 2 && formData.whatsapp.length > 5 && formData.acceptedTerms && !hasSpun;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  const spinWheel = async () => {
    if (isSpinning || analyzing || winner || !canSpin) return;

    toast.info('Girando la ruleta...');
    setIsSpinning(true);
    setHasSpun(true);
    setSavedToCRM(false);

    // Logic to select winner based on weighted probability
    const totalWeight = prizes.reduce((sum, p) => p.stock > 0 ? sum + p.weight : sum, 0);
    let randomVal = Math.random() * totalWeight;
    let selectedPrizeIndex = -1;
    
    // Fallback if no stock
    if (totalWeight <= 0) {
        selectedPrizeIndex = prizes.findIndex(p => p.label.includes("Gracias"));
    } else {
        for (let i = 0; i < prizes.length; i++) {
            if (prizes[i].stock > 0) {
                randomVal -= prizes[i].weight;
                if (randomVal <= 0) {
                    selectedPrizeIndex = i;
                    break;
                }
            }
        }
    }
    
    if (selectedPrizeIndex === -1) selectedPrizeIndex = 2; // Default to 'Gracias'

    // --- ACCURATE ROTATION LOGIC ---
    // We want the winning segment to land at 0deg (Top).
    // The segment 'i' is drawn from Angle(i) to Angle(i+1).
    // The center of segment 'i' is: index * SEGMENT_ANGLE + (SEGMENT_ANGLE / 2).
    // To bring this center to 0deg, we must rotate the wheel backwards by this amount.
    const targetBaseRotation = 360 - (selectedPrizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    
    // Add multiple full spins (e.g., 5 spins = 1800deg)
    const spins = 360 * 5;
    
    // Add slight randomization within the segment (±40% of segment width) to avoid robotic precision
    const fuzz = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.8);
    
    // Calculate the total rotation needed. 
    // We calculate the delta required to reach the target from the current rotation
    const currentRotMod = rotation % 360;
    const distanceToTarget = (targetBaseRotation - currentRotMod + 360) % 360;
    
    const finalRotation = rotation + distanceToTarget + spins + fuzz;
    
    setRotation(finalRotation);

    setTimeout(async () => {
      setIsSpinning(false);
      
      const prize = prizes[selectedPrizeIndex];
      setWinner(prize);
      
      // Update Stock
      setPrizes(prev => prev.map(p => p.id === prize.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
      
      // --- Save to Supabase via Backend API ---
      const couponCode = `${formData.name.substring(0,3).toUpperCase()}-${prize.id}X-${Math.floor(Math.random()*999)}`;

      const newLead = {
          name: formData.name,
          email: `${formData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
          phone: formData.whatsapp,
          prize_id: prize.id,
          prize_label: prize.label,
          coupon_code: couponCode,
          estimated_value: prize.id === 6 ? 800 : prize.id === 2 ? 120 : 50
      };

      try {
        const response = await apiClient.post<{ success: boolean; lead: any }>('/leads/create', newLead);

        // Save Roulette State (Anti-fraud demo) in localStorage
        localStorage.setItem('creastilo_roulette_state', JSON.stringify({
            spun: true,
            prizeId: prize.id,
            timestamp: new Date().toISOString()
        }));

        setSavedToCRM(true);
        toast.success(`¡Felicidades ${formData.name}! Ganaste: ${prize.label}`);
      } catch (error) {
        toast.error('Error guardando lead en CRM');
        console.error('Lead save error:', error);
      }

      setAnalyzing(true);

      // Trigger Gemini to generate a custom coupon/message based on user data
      try {
        const analysis = await geminiService.generateText(
            `User ${formData.name} won "${prize.label}". Write a very short (max 10 words) exciting notification for their CRM record.`,
            "You are a backend CRM bot."
        );
        setAiAnalysis(analysis);
        toast.success('Lead guardado en CRM exitosamente!');
      } catch (error) {
        toast.warning('Premio guardado, pero no se pudo generar análisis AI.');
      } finally {
        setAnalyzing(false);
      }

      // Notify User
      const event = new CustomEvent('trigger-jarvis', { detail: `Felicidades ${formData.name}, he registrado tu premio ${prize.label} en el CRM. Tu cupón es ${couponCode}.` });
      window.dispatchEvent(event);
      
    }, 4000); 
  };

  const resetStock = () => {
      setPrizes(INITIAL_PRIZES);
      setHasSpun(false);
      setWinner(null);
      setSavedToCRM(false);
      setFormData({ name: '', whatsapp: '', acceptedTerms: false });
      localStorage.removeItem('creastilo_roulette_state');
      toast.info('Ruleta reiniciada. Puedes girar de nuevo!');
  };

  const goToCRM = () => {
      // Dispatch event to switch tab to CRM
      window.dispatchEvent(new CustomEvent('change-tool-tab', { detail: 'crm' }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
        
        {/* LEFT COLUMN: Roulette Visual */}
        <div className="flex flex-col items-center justify-center relative min-h-[500px] border border-white/5 rounded-2xl bg-[#030014] p-8 order-1 shadow-2xl overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Pointer */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 w-8 h-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[35px] border-t-white"></div>
            </div>

            {/* Wheel */}
            <div 
                className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-[10px] border-[#1e293b] relative shadow-2xl overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.2, 0, 0.2, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Segments */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-full"
                  style={{
                      background: `conic-gradient(
                          ${prizes.map((p, i) => `${p.color} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`).join(', ')}
                      )`
                  }}
                ></div>

                {/* Text Labels */}
                {prizes.map((prize, index) => {
                    const angle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                    // Determine font size based on length
                    const isLongText = prize.label.length > 15;
                    const fontSizeClass = isLongText ? "text-[10px]" : "text-xs md:text-sm";
                    
                    return (
                      <div
                          key={prize.id}
                          className="absolute w-full h-full top-0 left-0"
                          style={{ transform: `rotate(${angle}deg)` }}
                      >
                          {/* Inner container for the "Radius" line */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-8 pt-6 md:pt-10 pb-16 flex justify-center items-start origin-bottom">
                              <span 
                                  className={`font-bold uppercase tracking-widest text-center select-none ${fontSizeClass}`}
                                  style={{ 
                                      color: prize.textColor,
                                      writingMode: 'vertical-rl', 
                                      textOrientation: 'mixed',
                                      // No rotation needed for Rim -> Center flow with vertical-rl
                                      // Just ensure it doesn't overflow
                                      maxHeight: '100%'
                                  }}
                              >
                                  {prize.label}
                              </span>
                          </div>
                      </div>
                    )
                })}

                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center border-4 border-gray-200">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-300"></div>
                </div>
            </div>
            
            <p className="text-gray-500 text-[10px] mt-8 font-mono text-center max-w-xs">
                *Esta demo guarda los registros localmente para mostrarlos en el CRM.
            </p>

            {/* Winner Overlay */}
            {winner && !analyzing && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-500 p-6 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse"></div>
                        <Trophy size={64} className="text-yellow-400 relative z-10" />
                    </div>
                    
                    <h3 className="text-white text-2xl font-bold mb-2">¡Felicidades!</h3>
                    <p className="text-gray-400 text-sm mb-4">Has ganado:</p>
                    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/50 p-6 rounded-xl mb-6 w-full max-w-sm">
                         <p className="text-cyan-400 text-2xl md:text-3xl font-black">{winner.label}</p>
                    </div>

                    {savedToCRM && (
                        <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-bold animate-pulse">
                            <CheckCircle2 size={14} />
                            Lead Inyectado en CRM Exitosamente
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button 
                            onClick={goToCRM} 
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(64,212,247,0.4)] transition-all flex items-center gap-2"
                        >
                            Ver en Dashboard CRM <ArrowRight size={16} />
                        </button>
                    </div>
                    
                    <button 
                        onClick={resetStock} 
                        className="mt-4 text-xs text-gray-500 hover:text-white underline"
                    >
                        Reiniciar prueba
                    </button>
                </div>
            )}
            
            {/* Loading Overlay */}
            {analyzing && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl">
                    <Loader2 size={48} className="text-cyan-400 animate-spin mb-4" />
                    <p className="text-cyan-400 font-mono text-sm">Synchronizing Data...</p>
                    <p className="text-gray-400 text-xs mt-2">Injecting Lead to Salesforce...</p>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: Form & Data */}
        <div className="space-y-8 order-2">
            
            {/* Header */}
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Datos para girar</h2>
                <p className="text-gray-400 text-sm">Simula la experiencia de usuario final. Completa el formulario para habilitar el giro.</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 ml-1">Nombre Completo</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez" 
                        disabled={hasSpun}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 ml-1">WhatsApp</label>
                    <input 
                        type="tel" 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="+52 1 55..." 
                        disabled={hasSpun}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors disabled:opacity-50"
                    />
                  </div>
                  
                  <label className="flex items-center gap-3 cursor-pointer group py-2">
                      <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${formData.acceptedTerms ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600 group-hover:border-cyan-400'} ${hasSpun ? 'opacity-50' : ''}`}>
                          <input 
                              type="checkbox" 
                              name="acceptedTerms"
                              checked={formData.acceptedTerms}
                              onChange={handleInputChange}
                              disabled={hasSpun}
                              className="hidden"
                          />
                          {formData.acceptedTerms && <CheckCircle2 size={14} className="text-black" />}
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-300">Acepto términos y privacidad</span>
                  </label>

                  <div className="flex gap-4 pt-2">
                      <button 
                          onClick={spinWheel}
                          disabled={!canSpin || isSpinning}
                          className={`flex-1 py-3.5 rounded-lg font-bold text-white shadow-lg transition-all relative overflow-hidden group
                          ${canSpin && !isSpinning
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(64,212,247,0.4)] hover:-translate-y-0.5' 
                              : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
                      >
                          <span className="relative z-10">{isSpinning ? 'Girando...' : 'Girar ruleta'}</span>
                          {canSpin && !isSpinning && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                      </button>
                      
                      <button 
                          onClick={resetStock}
                          className="px-4 py-3 rounded-lg bg-[#0f172a] border border-gray-700 text-gray-400 font-medium hover:text-white hover:border-gray-500 transition-colors flex items-center gap-2"
                          title="Reset Demo"
                      >
                          <RefreshCw size={18} className={isSpinning ? "animate-spin" : ""} />
                          <span className="hidden sm:inline">Reiniciar</span>
                      </button>
                  </div>
            </div>

            {/* Table */}
            <div className="bg-[#0f172a] rounded-xl border border-gray-800 overflow-hidden shadow-inner">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Premios (probabilidad • stock)</h3>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-900/50 text-gray-500 font-mono text-[10px] uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Premio</th>
                                <th className="px-4 py-3 text-right">Prob.</th>
                                <th className="px-4 py-3 text-right">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {prizes.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-4 py-2.5 font-medium text-gray-300 group-hover:text-white transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                                            {p.label}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-right text-gray-500 font-mono">{p.prob}</td>
                                    <td className={`px-4 py-2.5 text-right font-mono font-bold ${p.stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                                        {p.stock}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Status / Errors */}
            <div className="min-h-[24px]">
                {hasSpun && !winner && (
                    <div className="flex items-center gap-2 text-orange-400 text-sm animate-pulse">
                        <AlertCircle size={16} />
                        <span>Ya has participado. Reinicia el stock para probar de nuevo.</span>
                    </div>
                )}
                {!hasSpun && (
                    <p className="text-sm text-gray-500">Aún no has girado.</p>
                )}
            </div>

        </div>
      </div>

      {/* FOOTER EXPLAINER SECTION */}
      <div className="mt-8 border-t border-white/10 pt-8">
        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-cyan-400">//</span> De inicio a fin
        </h4>
        
        <div className="grid md:grid-cols-5 gap-4">
             {[
                 { step: "1", icon: <LayoutDashboard size={20} />, text: <>El usuario completa su <strong className="text-white">formulario con consentimiento</strong>.</> },
                 { step: "2", icon: <ShieldCheck size={20} />, text: <>La app valida <strong className="text-white">antifraude</strong> y resuelve premio por stock.</> },
                 { step: "3", icon: <Ticket size={20} />, text: <>Se genera un <strong className="text-white">cupón único</strong> y se registra en CRM/DB.</> },
                 { step: "4", icon: <Zap size={20} />, text: <>Se disparan <strong className="text-white">automatizaciones</strong> para canje y upsell.</> },
                 { step: "5", icon: <Database size={20} />, text: <>El <strong className="text-white">dashboard</strong> muestra KPIs en tiempo real.</> }
             ].map((item, idx) => (
                 <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 relative group hover:bg-white/10 transition-colors">
                     <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 font-display group-hover:text-white/10 transition-colors">{item.step}</div>
                     <div className="text-cyan-400 mb-3 bg-cyan-950/30 w-fit p-2 rounded-lg">{item.icon}</div>
                     <p className="text-xs text-gray-400 leading-relaxed pr-2">{item.text}</p>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default Roulette;
