import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Necesito conocimientos de programación?",
      answer: "No. Nuestra plataforma 'Neural Architect' y las herramientas como la Ruleta están diseñadas para ser No-Code. Sin embargo, ofrecemos acceso a API para equipos de desarrollo avanzados."
    },
    {
      question: "¿Cómo se integra con mi CRM actual?",
      answer: "Disponemos de conectores nativos para Salesforce, HubSpot y Zoho. Para sistemas a medida, utilizamos webhooks seguros que inyectan los leads en tiempo real."
    },
    {
      question: "¿La IA Generativa es segura para mi marca?",
      answer: "Absolutamente. Utilizamos modelos 'Enterprise-Grade' (Gemini Pro) con capas de seguridad que impiden alucinaciones o contenido inapropiado. Tu data no se usa para re-entrenar modelos públicos."
    },
    {
      question: "¿Qué pasa si supero el límite de leads de mi plan?",
      answer: "El sistema nunca deja de captar. Simplemente recibirás una notificación al llegar al 90% para escalar tu plan o adquirir un paquete de 'Burst Capacity' para eventos puntuales."
    },
    {
      question: "¿Ofrecen soporte para la implementación?",
      answer: "Sí. Los planes Business y Neural Architect incluyen un Ingeniero de Soluciones dedicado que te acompañará en la configuración y puesta en marcha."
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#050510] relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <span className="text-sm font-mono text-purple-400">// KNOWLEDGE BASE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Preguntas <span className="gradient-text">Frecuentes</span>
            </h2>
            <p className="text-gray-400">Todo lo que necesitas saber antes de escalar.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl transition-all duration-300 ${openIndex === idx ? 'bg-white/5 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-transparent border-white/10 hover:border-white/20'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${openIndex === idx ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
                        <HelpCircle size={20} />
                    </div>
                    <span className={`font-bold text-lg ${openIndex === idx ? 'text-white' : 'text-gray-300'}`}>
                        {faq.question}
                    </span>
                </div>
                {openIndex === idx ? <ChevronUp className="text-purple-400" /> : <ChevronDown className="text-gray-500" />}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 pl-20 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
