import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * Piezas sueltas de Navidad (arbolito, regalos y guirnalda de luces).
 * Mismo criterio que las de Halloween: SVG puro, tamaño por CSS para que
 * acepte clamp() y no lo aplaste el flex en pantallas angostas.
 */

/** useId trae dos puntos, que rompen el `url(#...)` de los degradados SVG. */
const idLimpio = (raw: string) => raw.replace(/:/g, '');

interface PiezaProps {
  size?: number | string;
  delay?: number;
  style?: React.CSSProperties;
}

export const Arbolito: React.FC<PiezaProps> = ({ size = 110, delay = 0, style }) => {
  const uid = idLimpio(useId());

  // Bolitas de color repartidas por los tres pisos del pino
  const adornos = [
    { cx: 86, cy: 74, r: 4.6, c: '#E8453C' },
    { cx: 114, cy: 88, r: 4, c: '#F5C542' },
    { cx: 74, cy: 112, r: 4.8, c: '#4FA3E3' },
    { cx: 126, cy: 120, r: 4.4, c: '#E8453C' },
    { cx: 100, cy: 104, r: 4, c: '#F5C542' },
    { cx: 62, cy: 150, r: 5, c: '#F5C542' },
    { cx: 100, cy: 146, r: 4.6, c: '#E8453C' },
    { cx: 138, cy: 154, r: 4.8, c: '#4FA3E3' },
    { cx: 82, cy: 176, r: 4.4, c: '#4FA3E3' },
    { cx: 120, cy: 180, r: 4.6, c: '#E8453C' },
  ];

  return (
    <motion.svg
      viewBox="0 0 200 230"
      style={{ width: size, aspectRatio: '200 / 230', flexShrink: 0, overflow: 'visible', ...style }}
      animate={{ rotate: [0, 1.1, 0, -1.1, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ramas-${uid}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#4CA256" />
          <stop offset="55%" stopColor="#2F7A3C" />
          <stop offset="100%" stopColor="#1C5228" />
        </linearGradient>
        <radialGradient id={`estrella-${uid}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFFBE0" />
          <stop offset="55%" stopColor="#FFD84D" />
          <stop offset="100%" stopColor="#E8A317" />
        </radialGradient>
      </defs>

      {/* Tronco */}
      <rect x="90" y="190" width="20" height="30" rx="4" fill="#6B4423" />
      <rect x="78" y="214" width="44" height="9" rx="4" fill="#523318" />

      {/* Tres pisos de ramas */}
      <path d="M 100 36 L 136 100 L 64 100 Z" fill={`url(#ramas-${uid})`} />
      <path d="M 100 76 L 148 148 L 52 148 Z" fill={`url(#ramas-${uid})`} />
      <path d="M 100 120 L 160 196 L 40 196 Z" fill={`url(#ramas-${uid})`} />

      {/* Nieve posada en los bordes */}
      <path d="M 64 100 Q 82 94 100 100 Q 118 106 136 100 L 136 104 L 64 104 Z" fill="#F4FAFF" opacity="0.85" />
      <path d="M 52 148 Q 76 141 100 148 Q 124 155 148 148 L 148 152 L 52 152 Z" fill="#F4FAFF" opacity="0.85" />
      <path d="M 40 196 Q 70 188 100 196 Q 130 204 160 196 L 160 200 L 40 200 Z" fill="#F4FAFF" opacity="0.85" />

      {/* Adornos */}
      {adornos.map((a, i) => (
        <circle key={i} cx={a.cx} cy={a.cy} r={a.r} fill={a.c} opacity="0.95" />
      ))}

      {/* Estrella titilando en la punta */}
      <motion.path
        d="M 100 6 L 107 26 L 128 26 L 111 39 L 118 59 L 100 46 L 82 59 L 89 39 L 72 26 L 93 26 Z"
        fill={`url(#estrella-${uid})`}
        animate={{ opacity: [0.8, 1, 0.85, 1], scale: [1, 1.07, 0.98, 1.04] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{
          transformOrigin: '100px 32px',
          filter: 'drop-shadow(0 0 9px rgba(255, 216, 77, 0.9))',
        }}
      />
    </motion.svg>
  );
};

export const Regalo: React.FC<PiezaProps & { color?: 'rojo' | 'azul' | 'dorado' }> = ({
  size = 64,
  delay = 0,
  color = 'rojo',
  style,
}) => {
  const uid = idLimpio(useId());

  const paletas = {
    rojo: { caja: ['#E8554B', '#B32B22'], cinta: '#F7E7A1' },
    azul: { caja: ['#5AA7E8', '#2B6CA8'], cinta: '#F4FAFF' },
    dorado: { caja: ['#F2C14E', '#C98B16'], cinta: '#E8554B' },
  }[color];

  return (
    <motion.svg
      viewBox="0 0 120 110"
      style={{ width: size, aspectRatio: '120 / 110', flexShrink: 0, overflow: 'visible', ...style }}
      animate={{ y: [0, -2.5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`caja-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={paletas.caja[0]} />
          <stop offset="100%" stopColor={paletas.caja[1]} />
        </linearGradient>
      </defs>

      {/* Cuerpo y tapa */}
      <rect x="18" y="42" width="84" height="60" rx="5" fill={`url(#caja-${uid})`} />
      <rect x="10" y="30" width="100" height="20" rx="5" fill={`url(#caja-${uid})`} />
      <rect x="10" y="30" width="100" height="7" rx="3.5" fill="#ffffff" opacity="0.18" />

      {/* Cinta */}
      <rect x="53" y="30" width="14" height="72" fill={paletas.cinta} opacity="0.95" />
      <rect x="10" y="36" width="100" height="9" fill={paletas.cinta} opacity="0.95" />

      {/* Moño */}
      <path d="M 60 30 C 44 30 34 20 40 12 C 46 6 58 16 60 30 Z" fill={paletas.cinta} />
      <path d="M 60 30 C 76 30 86 20 80 12 C 74 6 62 16 60 30 Z" fill={paletas.cinta} />
      <circle cx="60" cy="29" r="6" fill={paletas.cinta} />
    </motion.svg>
  );
};

/**
 * Cortina de luces colgando del borde superior: hebras verticales con
 * bombillitos y, cada tantas, un colgante de pino iluminado.
 *
 * El reparto se calcula una sola vez al cargar el módulo con una semilla fija
 * (mulberry32): así es idéntico en cada visita y no llamamos Math.random()
 * durante el render, que es impuro y hace parpadear las posiciones.
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

const rndLuces = mulberry32(25122026);

const HEBRAS = Array.from({ length: 26 }, (_, i) => {
  const largo = 70 + rndLuces() * 190;
  return {
    id: i,
    left: (i + 0.5) * (100 / 26) + (rndLuces() - 0.5) * 1.6,
    largo,
    bombillos: Math.max(3, Math.round(largo / 34)),
    delay: rndLuces() * 2.6,
  };
});

/** Cada cuántas hebras cuelga un pino, y qué lleva dentro. */
const COLGANTES = [2, 6, 9, 13, 17, 21, 24].map((hebra, i) => ({
  hebra,
  adorno: (['estrella', 'pino', 'copo'] as const)[i % 3],
  delay: i * 0.45,
}));

/** El pino de neón: un trazo grueso y cálido, como los de la foto. */
const PinoColgante: React.FC<{ adorno: 'estrella' | 'pino' | 'copo'; delay: number }> = ({
  adorno,
  delay,
}) => (
  <motion.svg
    viewBox="0 0 120 150"
    style={{ width: 'clamp(44px, 8vw, 74px)', height: 'auto', overflow: 'visible' }}
    animate={{ opacity: [0.85, 1, 0.88, 1], rotate: [0, 1.4, 0, -1.4, 0] }}
    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay }}
    aria-hidden="true"
  >
    {/* Silueta del pino en tres pisos, trazada como un tubo de luz */}
    <path
      d="M 60 10 L 88 50 L 76 50 L 98 92 L 84 92 L 110 136 L 10 136 L 36 92 L 22 92 L 44 50 L 32 50 Z"
      fill="none"
      stroke="#FFF2D2"
      strokeWidth="9"
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{ filter: 'drop-shadow(0 0 8px rgba(255, 214, 140, 0.95))' }}
    />
    <path
      d="M 60 10 L 88 50 L 76 50 L 98 92 L 84 92 L 110 136 L 10 136 L 36 92 L 22 92 L 44 50 L 32 50 Z"
      fill="none"
      stroke="#FFFDF4"
      strokeWidth="3.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />

    {/* El adornito que va colgado dentro del pino */}
    <g style={{ filter: 'drop-shadow(0 0 6px rgba(255, 200, 110, 0.9))' }}>
      {adorno === 'estrella' && (
        <path
          d="M 60 78 L 65 92 L 80 92 L 68 101 L 73 115 L 60 106 L 47 115 L 52 101 L 40 92 L 55 92 Z"
          fill="#F7C544"
        />
      )}
      {adorno === 'pino' && (
        <>
          <path d="M 60 74 L 74 100 L 46 100 Z" fill="#4CA256" />
          <path d="M 60 88 L 78 116 L 42 116 Z" fill="#3C8A47" />
          <rect x="56" y="116" width="8" height="9" fill="#6B4423" />
        </>
      )}
      {adorno === 'copo' && (
        <g stroke="#BFE4FF" strokeWidth="3.5" strokeLinecap="round">
          <line x1="60" y1="76" x2="60" y2="116" />
          <line x1="43" y1="86" x2="77" y2="106" />
          <line x1="77" y1="86" x2="43" y2="106" />
        </g>
      )}
    </g>
  </motion.svg>
);

export const CortinaLuces: React.FC = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 'clamp(190px, 34vh, 330px)',
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    {/* El cable del que cuelga todo */}
    <div
      style={{
        position: 'absolute',
        top: '2px',
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, rgba(255,240,210,0.15), rgba(255,240,210,0.5), rgba(255,240,210,0.15))',
      }}
    />

    {HEBRAS.map((h) => {
      const colgante = COLGANTES.find((c) => c.hebra === h.id);

      return (
        <div
          key={h.id}
          style={{
            position: 'absolute',
            top: 0,
            left: `${h.left}%`,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* La hebra */}
          <div
            style={{
              width: '1px',
              height: `${h.largo}px`,
              background: 'linear-gradient(180deg, rgba(255,240,210,0.42), rgba(255,240,210,0.14))',
              position: 'relative',
            }}
          >
            {Array.from({ length: h.bombillos }, (_, b) => (
              <motion.span
                key={b}
                animate={{ opacity: [0.35, 1, 0.45, 0.95, 0.35] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: h.delay + b * 0.22,
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: `${((b + 1) / (h.bombillos + 1)) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '7px',
                  height: '7px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFEFC4',
                  boxShadow: '0 0 10px 2px rgba(255, 206, 122, 0.9)',
                }}
              />
            ))}
          </div>

          {colgante && <PinoColgante adorno={colgante.adorno} delay={colgante.delay} />}
        </div>
      );
    })}
  </div>
);
