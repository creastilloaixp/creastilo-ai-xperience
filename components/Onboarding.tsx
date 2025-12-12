
import React, { useState, useEffect } from 'react';
import { ChevronRight, Fingerprint, Cpu, Zap } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'boot' | 'ready'>('boot');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Fast Boot Sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('ready'), 400); // Short delay before revealing UI
          return 100;
        }
        // Random increment for realistic "loading" feel
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
      // Initialize Audio Context immediately on user gesture to unlock iOS Audio
      geminiService.initializeAudio();
      
      setIsUnlocking(true);
      // Cinematic exit delay
      setTimeout(() => {
          onComplete();
      }, 800);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#030014] text-white flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${isUnlocking ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#030014] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
          
          {/* LOGO AREA */}
          <div className={`transition-all duration-1000 flex flex-col items-center ${step === 'boot' ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100 blur-0'}`}>
              <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative z-10 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl p-[1px]">
                     <div className="w-full h-full bg-[#050510] rounded-xl flex items-center justify-center">
                        <Cpu size={40} className="text-white" />
                     </div>
                  </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-wider text-white text-center leading-tight">
                  CREASTILO
              </h1>
              <p className="text-cyan-400 font-mono text-xs tracking-[0.6em] mt-3 uppercase animate-pulse">
                  AI Xperience
              </p>
          </div>

          {/* LOADING STATE */}
          {step === 'boot' && (
             <div className="w-64 mt-12 space-y-2">
                 <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>INITIALIZING NEURAL NET...</span>
                    <span>{progress}%</span>
                 </div>
                 <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" 
                        style={{ width: `${progress}%` }}
                    ></div>
                 </div>
             </div>
          )}

          {/* READY STATE (UNLOCK) */}
          {step === 'ready' && (
              <div className="mt-16 animate-in slide-in-from-bottom-8 fade-in duration-700 w-full flex flex-col items-center">
                  
                  <button 
                    onClick={handleUnlock}
                    className="group relative w-full max-w-xs h-14 rounded-full overflow-hidden cursor-pointer transition-all active:scale-95 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(64,212,247,0.2)]"
                  >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                              <Fingerprint size={20} />
                          </div>
                          
                          <span className="text-sm font-bold text-white tracking-widest uppercase group-hover:tracking-[0.2em] transition-all">
                              Acceder al Sistema
                          </span>

                          <div className="w-10 h-10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                              <ChevronRight size={20} />
                          </div>
                      </div>
                  </button>

                  <div className="mt-8 flex gap-2">
                      <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                  </div>
              </div>
          )}
      </div>
      
      {/* VERSION TAG */}
      <div className="absolute bottom-6 font-mono text-[10px] text-gray-600">
        v2.5.0 <span className="text-gray-800 mx-2">|</span> GEMINI INTEGRATED
      </div>
    </div>
  );
};

export default Onboarding;
