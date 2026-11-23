import React from 'react';
import { motion } from 'framer-motion';
import { Arbolito, Regalo, CortinaLuces } from './NavidadPiezas';

/**
 * El ambiente de Navidad que envuelve toda la app: nieve cayendo, una
 * guirnalda de luces colgada arriba y los arbolitos con regalos abajo.
 *
 * Todo va detrás del contenido y sin capturar clics (`pointerEvents: none`),
 * igual que el de Halloween.
 */

/**
 * Generador pseudoaleatorio con semilla fija (mulberry32): el reparto de la
 * nieve se calcula una sola vez al cargar el módulo, es idéntico en cada
 * visita, y no llamamos Math.random() durante el render.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(24122026);

const COPOS = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  left: rnd() * 100,
  size: 3 + rnd() * 6,
  duration: 9 + rnd() * 10,
  delay: rnd() * 12,
  deriva: (rnd() - 0.5) * 120,
  opacidad: 0.45 + rnd() * 0.5,
}));

export const NavidadAmbience: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}
    >
      {/* Resplandor frío de luna sobre la nieve */}
      <div
        style={{
          position: 'absolute',
          top: '-14%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '46vh',
          background:
            'radial-gradient(ellipse, rgba(170, 214, 255, 0.2) 0%, rgba(120, 170, 230, 0.07) 55%, rgba(0,0,0,0) 76%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Cortina de luces colgando del borde superior */}
      <CortinaLuces />

      {/* Nieve cayendo */}
      {COPOS.map((c) => (
        <motion.span
          key={c.id}
          initial={{ opacity: 0, y: '-8vh', x: 0 }}
          animate={{
            opacity: [0, c.opacidad, c.opacidad, 0],
            y: ['-8vh', '104vh'],
            x: [0, c.deriva, 0],
          }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${c.left}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            borderRadius: '9999px',
            backgroundColor: '#F4FAFF',
            boxShadow: '0 0 6px rgba(220, 240, 255, 0.85)',
          }}
        />
      ))}

      {/* Nieve acumulada en el borde inferior */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'clamp(26px, 5vh, 46px)',
          background: 'linear-gradient(180deg, rgba(244,250,255,0) 0%, rgba(244,250,255,0.9) 72%)',
          borderTopLeftRadius: '50% 90%',
          borderTopRightRadius: '50% 90%',
        }}
      />

      {/* El árbol, abajo a la izquierda. Los regalos van anclados a su base
          en posición absoluta (no en fila): así el conjunto mide siempre lo
          que mide el árbol y nunca se estira hacia la esquina de la derecha,
          donde vive el widget de música. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          paddingLeft: 'clamp(2px, 2vw, 40px)',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ position: 'relative', lineHeight: 0 }}>
          <Arbolito size="clamp(176px, 50vw, 272px)" delay={0} style={{ marginBottom: '-10px' }} />

          <div
            style={{
              position: 'absolute',
              left: '36%',
              bottom: '-4px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
            }}
          >
            <Regalo size="clamp(34px, 9.5vw, 58px)" color="rojo" delay={0.5} />
            <Regalo size="clamp(27px, 7.5vw, 46px)" color="dorado" delay={1.1} />
            <Regalo size="clamp(30px, 8.5vw, 52px)" color="azul" delay={0.2} />
          </div>
        </div>
      </div>

      {/* Viñeta suave en los bordes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 42%, rgba(6, 14, 30, 0.42) 100%)',
        }}
      />
    </div>
  );
};
