
import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Problema', href: '#problema' },
    { name: 'Plataforma', href: '#herramientas' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3 border-b border-white/10' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <Cpu className="w-8 h-8 text-cyan-400 relative z-10 transition-transform group-hover:scale-110 duration-500" />
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-wider text-white leading-none">CREASTILO</div>
              <div className="text-[9px] text-cyan-400 font-mono tracking-[0.25em] mt-1">AI XPERIENCE</div>
            </div>
          </div>

          {/* Desktop Nav - Capsule Style */}
          <div className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/5 shadow-lg">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-xs font-medium text-gray-300 hover:text-cyan-400 transition-colors font-mono uppercase tracking-wide relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
             <button 
                onClick={onOpenBooking}
                className="group relative px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(64,212,247,0.2)]"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="flex items-center gap-2 relative z-10">
                    <Calendar size={16} className="text-cyan-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-bold text-white">Agendar Demo</span>
                </div>
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-2xl bg-[#030014]/95 backdrop-blur-xl">
           {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 py-3 border-b border-white/5 font-mono uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <button 
                onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                }}
                className="w-full mt-2 px-6 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2"
            >
                <Calendar size={18} />
                Agendar Demo
             </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
