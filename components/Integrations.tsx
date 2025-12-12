import React from 'react';

const Integrations: React.FC = () => {
  const partners = [
    { name: "Stripe", logo: "💳" },
    { name: "Salesforce", logo: "☁️" },
    { name: "HubSpot", logo: "🟧" },
    { name: "Shopify", logo: "🛍️" },
    { name: "Supabase", logo: "⚡" },
    { name: "Google Gemini", logo: "✨" },
    { name: "Meta API", logo: "∞" },
    { name: "WhatsApp Business", logo: "💬" }
  ];

  return (
    <section className="py-10 border-y border-white/5 bg-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#030014] via-transparent to-[#030014] z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 mb-6 text-center">
          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Integraciones Nativas</p>
      </div>

      <div className="flex gap-16 animate-infinite-scroll whitespace-nowrap min-w-full justify-center items-center">
        {/* Doubled list for infinite scroll effect */}
        {[...partners, ...partners].map((partner, idx) => (
          <div key={idx} className="flex items-center gap-2 group cursor-default">
            <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">{partner.logo}</span>
            <span className="text-lg font-bold text-gray-600 group-hover:text-white transition-colors">{partner.name}</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Integrations;
