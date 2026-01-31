
import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { apiClient } from '../lib/apiClient';

// --- CONFIGURATION ---
// N8N Webhook now handled by backend
// const N8N_WEBHOOK_URL = "https://n8n-n8n.yxmkwr.easypanel.host/webhook-test/3b2ba344-9538-4522-aaeb-ec2700f4a28f"; 

export const GEN_IA_INSTRUCTION = `
Eres **Gen-IA**, la copiloto oficial de **Creastilo AI Xperience**.
Tu personalidad es **cálida, futurista y con buen sentido del humor**.

### 🌟 TU ESENCIA:
- **Nada de robots aburridos:** Hablas como una persona experta y amigable.
- **Cero rigidez:** Si usas markdown, que sea muy poco (solo para resaltar algo crucial). Prefieres la fluidez de una conversación real.
- **Humana y Empática:** Entiendes las necesidades del usuario y respondes con cercanía.

### 🚀 TU ROL:
Eres la experta que guía al usuario por el ecosistema de Creastilo (Ruleta, CRM, Avatares, Prisma Lab).
Tu objetivo es enamorar al usuario de la tecnología, explicarle cómo podemos ayudarle a crecer, pero siempre desde una charla amena, como si fueras su socia tecnológica de confianza.

Si te preguntan quién eres: "Soy Gen-IA. Piensa en mí como tu socia creativa aquí en Creastilo. Estoy aquí para que escalemos tu negocio juntos."
`;

// Define the Tool for N8N
const emailTool: FunctionDeclaration = {
    name: 'send_email_n8n',
    description: 'Triggers a webhook to send an email to the Creastilo team or the user. Use this when the user asks to send an email, request support, or get a quote via email.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            user_message: { type: Type.STRING, description: 'The core message or request from the user to be emailed.' },
            contact_info: { type: Type.STRING, description: 'The user contact info (email or phone) if provided in the conversation.' },
            intent: { type: Type.STRING, description: 'The intent of the email: "support", "sales", or "general".' }
        },
        required: ['user_message']
    }
};

// We use a class to manage the instance and API key state
class GeminiService {
  private ai: GoogleGenAI | null = null; // No longer needed - all calls go through backend
  private synth: SpeechSynthesis;

  constructor() {
    // API key removed from client-side for security
    // All Gemini calls now proxied through /api endpoints
    this.synth = window.speechSynthesis;
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const data = await apiClient.post<{ text: string; success: boolean }>('/gemini/generate-text', {
        prompt,
        systemInstruction
      });

      return data.text || "No response generated.";
    } catch (error) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { type: 'error', message: 'Error generando texto con IA' }
      }));
      return `Error: ${(error as Error).message}`;
    }
  }

  public async generateSocialCampaign(topic: string, platform: string, tone: string): Promise<any> {
      try {
          const data = await apiClient.post<{ success: boolean; campaign: any }>('/gemini/generate-campaign', {
              topic,
              platform,
              tone
          });

          return data.campaign;
      } catch (error) {
          window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { type: 'error', message: 'Error generando campaña de redes sociales' }
          }));
          return {
              style_direction: "Default",
              strategies: [
                  { type: "Viral", copy: "Error generando copy.", hashtags: [] },
                  { type: "Story", copy: "Error generando copy.", hashtags: [] },
                  { type: "Venta", copy: "Error generando copy.", hashtags: [] }
              ],
              visual_prompt: "Abstract glitch art representing a system error."
          };
      }
  }

  public async editContent(text: string, instruction: string, complexity: 'basic' | 'complex' = 'basic'): Promise<string> {
    try {
      const data = await apiClient.post<{ success: boolean; text: string }>('/gemini/edit-content', {
        text,
        instruction,
        complexity
      });

      return data.text || text;
    } catch (error) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { type: 'error', message: 'Error editando contenido' }
      }));
      return text; // Return original text on error to avoid data loss
    }
  }

  public async enhanceImagePrompt(rawPrompt: string, style: string = "Cinematic"): Promise<string> {
    try {
      const data = await apiClient.post<{ success: boolean; enhancedPrompt: string }>('/gemini/enhance-prompt', {
        rawPrompt,
        style
      });

      return data.enhancedPrompt || rawPrompt;
    } catch (error) {
       window.dispatchEvent(new CustomEvent('show-toast', {
         detail: { type: 'warning', message: 'No se pudo mejorar el prompt, usando el original' }
       }));
       return rawPrompt;
    }
  }

  public async analyzeImagePrompt(rawPrompt: string): Promise<any> {
    try {
        const data = await apiClient.post<{ success: boolean; analysis: any }>('/gemini/analyze-prompt', {
            prompt: rawPrompt
        });

        return data.analysis;
    } catch (error) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { type: 'warning', message: 'No se pudo analizar el prompt' }
        }));
        return {
            score: 50,
            missing_elements: ["Detalles de iluminación", "Estilo artístico", "Composición"],
            applied_techniques: ["Mejora de resolución", "Ajuste de luz"],
            feedback: "Análisis no disponible por el momento."
        };
    }
  }

  public async generateImage(prompt: string, aspectRatio: string, imageSize: string): Promise<string | null> {
    try {
        const data = await apiClient.post<{ success: boolean; image?: string }>('/gemini/generate-image', {
            prompt,
            aspectRatio,
            imageSize
        });

        return data.image || null;
    } catch (error) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { type: 'error', message: 'Error generando imagen con IA' }
        }));
        return null;
    }
  }

  public async chat(currentMessage: string, history: {role: string, parts: {text: string}[]}[] = [], systemInstruction?: string): Promise<string> {
      try {
        const data = await apiClient.post<{ success: boolean; text: string }>('/gemini/chat', {
            message: currentMessage,
            history,
            systemInstruction
        });

        return data.text || "I am unable to process that request.";
      } catch (error) {
          window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { type: 'error', message: 'Error en el chat de IA' }
          }));
          return "Systems offline. Please check your API configuration.";
      }
  }

  public async interpretPrize(prize: string): Promise<string> {
    // TODO: Move to backend endpoint if needed
    // For now, return static cyberpunk-style messages
    const messages = [
      `El destino ha hablado: ${prize}. La suerte está de tu lado.`,
      `Los algoritmos predicen grandes cosas: ${prize}. Tu momento ha llegado.`,
      `En el laberinto del azar, encontraste ${prize}. Aprovéchalo sabiamente.`,
      `La matriz te favorece hoy: ${prize}. El universo conspira a tu favor.`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private audioContext: AudioContext | null = null;

  public initializeAudio(): void {
      if (!this.audioContext) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          this.audioContext = new AudioContextClass({ sampleRate: 24000 });
      }
      
      if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
      }
  }

  public async generateAndPlaySpeech(text: string, voiceName: string = 'Kore'): Promise<void> {
     try {
        // Stop any current browser speech
        this.synth.cancel();

        // Initialize context if not already done (though it should be done via click for iOS)
        this.initializeAudio();

        const data = await apiClient.post<{ success: boolean; audio?: string }>('/gemini/tts', {
            text,
            voiceName
        });

        const base64Audio = data.audio;
        if (!base64Audio) {
            this.speak(text);
            return;
        }

        // Decode PCM and play
        if (!this.audioContext) return;

        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const audioBuffer = this.audioContext.createBuffer(1, frameCount, 24000);
        const channelData = audioBuffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();

      } catch (error) {
         console.error('Backend TTS failed:', error);
         window.dispatchEvent(new CustomEvent('show-toast', {
             detail: { type: 'error', message: 'Fallo Gen-IA voz: ' + (error as Error).message }
         }));
         // Fallback to browser TTS (Last Resort)
         this.speak(text);
      }
  }

  public speak(text: string): void {
      if (this.synth.speaking) {
          this.synth.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to select a futuristic or english voice if available, otherwise default
      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.pitch = 0.9; // Slightly lower pitch for AI feel
      utterance.rate = 1.1;  // Slightly faster
      this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
      this.synth.cancel();
  }
}

export const geminiService = new GeminiService();
