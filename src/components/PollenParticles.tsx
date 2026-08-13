import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  xOffset: number;
}

export const PollenParticles: React.FC = React.memo(() => {
  const particles = useMemo<Particle[]>(() => {
    const colors = ['#FFD700', '#FFB6C1', '#A0E7E5', '#FFF5F8', '#E65100'];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      xOffset: (Math.random() - 0.5) * 80,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: ['0px', '-180px', '-360px'],
            x: ['0px', `${p.xOffset}px`, '0px'],
            opacity: [0, 0.85, 0],
            scale: [0.8, 1.4, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

PollenParticles.displayName = 'PollenParticles';

