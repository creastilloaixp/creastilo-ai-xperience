import React from 'react';
import { Twitter, Linkedin, Instagram, Github, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-white/10 bg-[#020205] relative z-10 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="font-display font-bold text-2xl tracking-wider mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                CREASTILO
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Plataforma de experiencias digitales impulsada por Inteligencia Artificial Generativa. Convertimos tráfico en activos de negocio.
            </p>
            <div className="flex gap-4">
                <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-pink-400 transition-colors"><Instagram size={18} /></a>
                <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Producto</h4>
            <ul className="space-y-4 text-gray-400">
                <li><a href="#herramientas" className="hover:text-cyan-400 transition-colors">Ruleta Gamificada</a></li>
                <li><a href="#herramientas" className="hover:text-cyan-400 transition-colors">CRM Inteligente</a></li>
                <li><a href="#herramientas" className="hover:text-cyan-400 transition-colors">Prisma Lab</a></li>
                <li><a href="#precios" className="hover:text-cyan-400 transition-colors">Precios</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Compañía</h4>
            <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Mantente Actualizado</h4>
            <p className="text-gray-400 mb-4 text-xs">Recibe las últimas tendencias en IA y Marketing Digital.</p>
            <div className="flex gap-2">
                <input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full text-white focus:border-cyan-500 outline-none"
                />
                <button className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 font-bold">
                    <ArrowRight size={18} />
                </button>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-green-400 font-mono">Sistemas Operativos</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 font-mono text-xs">
                &copy; 2025 Creastilo AI Xperience. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-xs text-gray-500 font-mono">
                <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                <a href="#" className="hover:text-white transition-colors">Términos</a>
                <a href="#" className="hover:text-white transition-colors">Seguridad</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
