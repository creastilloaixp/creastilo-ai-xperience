
import React, { useRef } from 'react';
import { cn } from "../../lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ children, className }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Intensity of the tilt (higher divisor = less tilt)
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        card.style.setProperty('--x', `50%`);
        card.style.setProperty('--y', `50%`);
    };

    return (
        <div 
            className={cn(
                "relative overflow-hidden transition-all duration-200 ease-out transform-gpu group", 
                className
            )}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                // @ts-ignore
                '--x': '50%',
                '--y': '50%',
            }}
        >
            <div className="relative z-10 h-full">
                {children}
            </div>
            
            {/* Holographic/Neon Glow Effect following cursor */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.06), transparent 40%)`,
                    zIndex: 1
                }}
            />
             <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(300px circle at var(--x) var(--y), rgba(64, 212, 247, 0.15), transparent 60%)`,
                    zIndex: 0
                }}
            />
        </div>
    );
};

export default HolographicCard;
