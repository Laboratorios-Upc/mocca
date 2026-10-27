import React from 'react';
import { motion } from 'framer-motion';
import { Calabaza, Vela } from './HalloweenPiezas';
import { Chandelure, Mimikyu } from './PokemonHalloween';

/**
 * Generador pseudoaleatorio con semilla fija (mulberry32).
 *
 * Así el reparto de brasas y murciélagos se calcula una sola vez al cargar el
 * módulo, es idéntico en cada visita, y no llamamos Math.random() durante el
 * render (que es impuro y hace parpadear las posiciones).
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

const rnd = mulberry32(31102026);

const TONOS_BRASA = ['#FFB13C', '#FF7A18', '#FFD36B', '#E8540C'];

const BRASAS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: rnd() * 100,
  size: 2 + rnd() * 4,
  duration: 7 + rnd() * 7,
  delay: rnd() * 9,
  drift: (rnd() - 0.5) * 70,
  tono: TONOS_BRASA[Math.floor(rnd() * TONOS_BRASA.length)],
}));

const MURCIELAGOS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  top: 8 + rnd() * 38,
  duration: 13 + rnd() * 10,
  delay: i * 3.4 + rnd() * 3,
  scale: 0.55 + rnd() * 0.6,
}));

/**
 * El ambiente de Halloween que envuelve toda la app mientras el evento está
 * encendido: brasas subiendo, murciélagos cruzando, y calabazas y velas
 * apoyadas en el borde inferior.
 *
 * Todo va detrás del contenido y sin capturar clics (`pointerEvents: none`),
 * para no estorbar al ramo ni a los botones.
 */

export const HalloweenAmbience: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}
    >
      {/* Luna llena con su halo */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          right: '11%',
          width: '110px',
          height: '110px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle at 36% 32%, #FFF6D8 0%, #FFE9A8 52%, #E8C977 100%)',
          boxShadow: '0 0 70px 26px rgba(255, 214, 120, 0.3)',
        }}
      >
        {/* Cráteres */}
        <div style={{ position: 'absolute', top: '26%', left: '24%', width: '19px', height: '19px', borderRadius: '9999px', backgroundColor: 'rgba(200, 168, 96, 0.34)' }} />
        <div style={{ position: 'absolute', top: '52%', left: '56%', width: '26px', height: '26px', borderRadius: '9999px', backgroundColor: 'rgba(200, 168, 96, 0.28)' }} />
        <div style={{ position: 'absolute', top: '66%', left: '28%', width: '13px', height: '13px', borderRadius: '9999px', backgroundColor: 'rgba(200, 168, 96, 0.3)' }} />
      </div>

      {/* Brasas subiendo desde abajo */}
      {BRASAS.map((b) => (
        <motion.span
          key={b.id}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ opacity: [0, 0.95, 0.7, 0], y: ['0vh', '-88vh'], x: [0, b.drift] }}
          transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: '9999px',
            backgroundColor: b.tono,
            boxShadow: `0 0 ${b.size * 3}px ${b.tono}`,
          }}
        />
      ))}

      {/* Murciélagos cruzando la pantalla */}
      {MURCIELAGOS.map((m) => (
        <motion.div
          key={m.id}
          initial={{ x: '-12vw' }}
          animate={{ x: '112vw', y: [0, -22, 14, -16, 0] }}
          transition={{
            x: { duration: m.duration, repeat: Infinity, delay: m.delay, ease: 'linear' },
            y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ position: 'absolute', top: `${m.top}%`, left: 0, scale: m.scale }}
        >
          <motion.svg
            width="46"
            height="22"
            viewBox="0 0 46 22"
            animate={{ scaleY: [1, 0.58, 1] }}
            transition={{ duration: 0.52, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'block', opacity: 0.82 }}
          >
            <path
              d="M 23 16 C 20 10 17 7 12 8 C 8 9 5 6 1 3 C 4 9 3 13 6 15 C 10 17 14 14 17 18 C 19 20 21 20 23 16 Z
                 M 23 16 C 26 10 29 7 34 8 C 38 9 41 6 45 3 C 42 9 43 13 40 15 C 36 17 32 14 29 18 C 27 20 25 20 23 16 Z"
              fill="#1B1224"
            />
            <path d="M 23 7 C 21 11 21 14 23 17 C 25 14 25 11 23 7 Z" fill="#241830" />
          </motion.svg>
        </motion.div>
      ))}

      {/* Chandelure flotando a la izquierda, lejos de la luna y de la barra */}
      <div style={{ position: 'absolute', top: '17%', left: 'clamp(6px, 6vw, 76px)' }}>
        <Chandelure size="clamp(62px, 15vw, 116px)" delay={0.4} />
      </div>

      {/* Repisa inferior: calabazas y velas apoyadas en el borde.
          Se queda en la mitad izquierda a propósito: abajo a la derecha vive el
          widget de música y, si no, le cae una calabaza encima. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: 'min(100%, 560px)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'clamp(2px, 1.8vw, 20px)',
          paddingLeft: 'clamp(4px, 3vw, 46px)',
          boxSizing: 'border-box',
        }}
      >
        <Calabaza size="clamp(56px, 17vw, 96px)" cara="sonrisa" delay={0} style={{ marginBottom: '-5px' }} />
        <Vela height="clamp(54px, 16vw, 92px)" delay={0.6} derretida={0.3} style={{ marginBottom: '-2px' }} />
        {/* Mimikyu disimulando entre las calabazas, que es justo lo suyo */}
        <Mimikyu size="clamp(46px, 13vw, 86px)" delay={0.9} style={{ marginBottom: '-3px' }} />
        <Calabaza size="clamp(36px, 10vw, 58px)" cara="dormida" delay={1.1} style={{ marginBottom: '-4px' }} />
        <Vela height="clamp(46px, 13vw, 76px)" delay={1.4} derretida={0.55} style={{ marginBottom: '-2px' }} />
        <Calabaza size="clamp(64px, 19vw, 112px)" cara="colmillos" delay={0.3} style={{ marginBottom: '-6px' }} />
      </div>

      {/* Viñeta oscura en los bordes, para que la luz de las velas resalte */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 58%, rgba(0,0,0,0) 38%, rgba(10, 4, 20, 0.5) 100%)',
        }}
      />
    </div>
  );
};
