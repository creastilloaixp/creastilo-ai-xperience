
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic, MicOff, Activity } from 'lucide-react';
import { geminiService, GEN_IA_INSTRUCTION } from '../services/geminiService';
import { Message } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useToast } from './ui/Toast';

const Jarvis: React.FC = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hola. Soy Gen-IA. ¿En qué puedo ayudarte a potenciar tu negocio hoy?', sender: 'bot', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Voice Mode State & Refs ---
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null); // Type 'any' used to store the session promise/object
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isVoiceMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  // Listen for custom trigger events from other components
  useEffect(() => {
    const handleTrigger = (event: Event) => {
        const customEvent = event as CustomEvent;
        const text = customEvent.detail;
        
        // Don't duplicate if the last message is the same
        setMessages(prev => {
            if (prev[prev.length - 1].text === text) return prev;
            
            // If closed, increment unread count
            if (!isOpen) {
                setUnreadCount(prevCount => prevCount + 1);
            }
            
            return [...prev, {
                id: Date.now().toString(),
                text: text,
                sender: 'bot',
                timestamp: new Date()
            }];
        });
    };

    const handleSystemOnline = () => {
        geminiService.generateAndPlaySpeech("Hola. Todo listo. Es un gusto recibirte en la Experiencia Creastilo. Vamos a crear algo increíble.", "Aoede");
        setUnreadCount(1);
    };

    window.addEventListener('trigger-jarvis', handleTrigger);
    window.addEventListener('system-online', handleSystemOnline);
    
    return () => {
        window.removeEventListener('trigger-jarvis', handleTrigger);
        window.removeEventListener('system-online', handleSystemOnline);
    };
  }, [isOpen]);

  const toggleChat = () => {
      setIsOpen(!isOpen);
      if (!isOpen) setUnreadCount(0);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
        role: m.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
    }));

    const responseText = await geminiService.chat(userMsg.text, history, GEN_IA_INSTRUCTION);
    
    const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: responseText, 
        sender: 'bot', 
        timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  // --- Voice Logic Start ---

  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const startVoiceSession = async () => {
    try {
      setIsVoiceMode(true);
      setIsConnected(false); // Waiting for connection

      // 1. Setup Audio Input (Mic)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true
        } 
      });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;
      
      const source = inputCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Processor for PCM 16kHz Mono
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 2. Setup Audio Output (Speaker)
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 3. Connect to Gemini Live
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            setIsConnected(true);
            
            // Stream audio from the microphone to the model.
            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = floatTo16BitPCM(inputData);
                
                // Encode to base64 for transport
                const uint8 = new Uint8Array(pcm16);
                let binary = '';
                const len = uint8.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(uint8[i]);
                }
                const b64 = btoa(binary);

                sessionPromise.then(session => {
                     session.sendRealtimeInput({ 
                        media: { 
                            mimeType: 'audio/pcm;rate=16000', 
                            data: b64 
                        } 
                     });
                });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription (User & Bot)
            if (message.serverContent?.turnComplete) {
                // Turn complete logic if needed
            }

            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
                 const text = message.serverContent.modelTurn.parts[0].text;
                 // Ideally append this to the chat, but we use audio primarily here
            }

            // Handle Audio Output
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
                setIsSpeaking(true);
                const arrayBuffer = base64ToArrayBuffer(audioData);
                
                // Decode raw PCM 24kHz (Gemini standard output)
                const audioBuffer = outputCtx.createBuffer(1, arrayBuffer.byteLength / 2, 24000);
                const channelData = audioBuffer.getChannelData(0);
                const view = new DataView(arrayBuffer);
                
                for (let i = 0; i < channelData.length; i++) {
                    const int16 = view.getInt16(i * 2, true);
                    channelData[i] = int16 / 32768.0;
                }

                const bufferSource = outputCtx.createBufferSource();
                bufferSource.buffer = audioBuffer;
                bufferSource.connect(outputCtx.destination);
                
                // Simple queue logic
                const currentTime = outputCtx.currentTime;
                const startTime = Math.max(currentTime, nextStartTimeRef.current);
                bufferSource.start(startTime);
                nextStartTimeRef.current = startTime + audioBuffer.duration;
                
                audioQueueRef.current.push(bufferSource);

                bufferSource.onended = () => {
                    const index = audioQueueRef.current.indexOf(bufferSource);
                    if (index > -1) audioQueueRef.current.splice(index, 1);
                    if (audioQueueRef.current.length === 0) setIsSpeaking(false);
                };
            }
          },
          onclose: () => {
            console.log('Gemini Live Closed');
            setIsConnected(false);
            setIsVoiceMode(false);
          },
          onerror: (err) => {
            toast.error('Error en sesión de voz con IA');
            setIsConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              // 'Aoede' is often a good warm/detailed voice. If not, we stick to a balanced one.
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } }
          },
          systemInstruction: `Eres Gen-IA, la copiloto virtual de Creastilo AI Xperience.
          
          TU VOZ Y TONO:
          - Eres una **HÍBRIDA DIGITAL-ORGÁNICA**.
          - Tu voz debe sonar humana y cálida, pero con una precisión y cadencia sutilmente tecnológica.
          - No eres ni 100% humano ni 100% robot. Eres la evolución de ambos.
          
          CONTEXTO APP:
          Estás integrada en la plataforma web de Creastilo (Ruleta para leads, CRM, Avatares, Prisma Lab).
          
          TU OBJETIVO:
          Ayudar al usuario a navegar, explicarle las herramientas y enamorarlo de la visión de Creastilo, siempre con una sonrisa en la voz.`,
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (error) {
      toast.error('No se pudo iniciar sesión de voz');
      setIsVoiceMode(false);
    }
  };

  const stopVoiceSession = () => {
    // 1. Close Gemini Session
    if (sessionRef.current) {
        // There isn't a direct .close() on the promise wrapper easily accessible without resolving, 
        // but removing the stream tracks stops input. 
        // We rely on unmounting/state change to stop logic.
        sessionRef.current = null;
    }

    // 2. Stop Mic Stream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }

    // 3. Stop Processor
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }

    if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
    }

    // 4. Close Contexts
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }

    // 5. Clear Queue
    audioQueueRef.current.forEach(source => source.stop());
    audioQueueRef.current = [];

    setIsVoiceMode(false);
    setIsConnected(false);
    setIsSpeaking(false);
    nextStartTimeRef.current = 0;
  };

  const toggleVoice = () => {
      if (isVoiceMode) {
          stopVoiceSession();
      } else {
          startVoiceSession();
      }
  };

  return (
    <>
      {/* Floating Button */}
      <div 
        onClick={toggleChat}
        className={`fixed bottom-8 right-8 z-50 cursor-pointer transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <div className="relative w-16 h-16 rounded-full bg-black border border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(64,212,247,0.3)] hover:scale-110 transition-transform group">
             <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin-slow"></div>
             <Bot className="text-cyan-400 group-hover:text-white transition-colors" />
             <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
             
             {/* Unread Badge */}
             {unreadCount > 0 && (
                 <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black animate-bounce">
                     {unreadCount}
                 </div>
             )}
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400 font-bold tracking-widest whitespace-nowrap">GEN-IA</div>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-8 right-8 z-50 w-[350px] md:w-[400px] h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right shadow-2xl border border-cyan-500/30 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isVoiceMode ? 'bg-red-500/20' : 'bg-gradient-to-br from-cyan-500 to-purple-600'}`}>
                    {isVoiceMode ? <Activity className="text-red-400 animate-pulse" size={20} /> : <Bot size={20} className="text-white" />}
                </div>
                <div>
                    <h3 className="font-bold text-sm">GEN-IA</h3>
                    <p className={`text-[10px] font-mono flex items-center gap-1 ${isVoiceMode && isConnected ? 'text-red-400' : 'text-green-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isVoiceMode && isConnected ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></span>
                        {isVoiceMode ? (isConnected ? 'LIVE AUDIO' : 'CONNECTING...') : 'ONLINE'}
                    </p>
                </div>
            </div>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
                <X size={20} />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-[#050510]">
            
            {/* Standard Chat Mode */}
            {!isVoiceMode && (
                <div className="absolute inset-0 flex flex-col">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[80%] rounded-xl p-3 text-sm shadow-md ${msg.sender === 'user' ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30' : 'bg-white/5 text-gray-200 border border-white/10'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex gap-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Voice Mode Visualizer */}
            {isVoiceMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <div className="relative w-32 h-32 mb-8">
                        {/* Core Orb */}
                        <div className={`absolute inset-0 rounded-full bg-cyan-500/20 blur-xl transition-all duration-300 ${isSpeaking ? 'scale-150 opacity-80' : 'scale-100 opacity-40'}`}></div>
                        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-2 border border-purple-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                        
                        {/* Audio Waves */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-1 bg-cyan-400 rounded-full transition-all duration-75`}
                                    style={{ 
                                        height: isSpeaking ? `${Math.random() * 60 + 20}%` : '10%',
                                        opacity: isConnected ? 1 : 0.5
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-display font-bold text-white mb-2">
                        {isConnected ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Connecting Secure Line...'}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                        Gemini Native Audio Live
                    </p>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
                {!isVoiceMode ? (
                    <>
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type command..." 
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none font-mono"
                        />
                        <button 
                            onClick={toggleVoice}
                            className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
                            title="Activate Voice Mode"
                        >
                            <Mic size={18} />
                        </button>
                        <button 
                            onClick={handleSend}
                            className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 border border-cyan-500/50"
                        >
                            <Send size={18} />
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={toggleVoice}
                        className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center justify-center gap-2 font-bold transition-all"
                    >
                        <MicOff size={18} /> End Voice Session
                    </button>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Jarvis;
