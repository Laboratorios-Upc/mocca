import React, { useId } from 'react';
import { motion } from 'framer-motion';

/** useId trae dos puntos, que rompen el `url(#...)` de los degradados SVG. */
const idLimpio = (raw: string) => raw.replace(/:/g, '');

/**
 * Piezas sueltas de Halloween (calabazas y velas) que comparten el ambiente de
 * la página y la escena del modal, para que todo se vea del mismo mundo.
 *
 * Todas son SVG: pesan nada, escalan sin pixelarse y la luz puede titilar.
 */

interface CalabazaProps {
  /** Ancho CSS: número de px o cualquier valor válido (p. ej. 'clamp(48px, 14vw, 96px)'). */
  size?: number | string;
  /** Desfase para que no titilen todas al mismo tiempo. */
  delay?: number;
  /** Cara tallada. 'dormida' es la calabacita tierna. */
  cara?: 'sonrisa' | 'colmillos' | 'dormida';
  className?: string;
  style?: React.CSSProperties;
}

const CARAS: Record<NonNullable<CalabazaProps['cara']>, React.ReactNode> = {
  sonrisa: (
    <>
      <path d="M 66 86 L 84 86 L 75 68 Z" />
      <path d="M 116 86 L 134 86 L 125 68 Z" />
      <path d="M 62 112 Q 100 150 138 112 Q 128 120 120 112 Q 110 122 100 112 Q 90 122 80 112 Q 72 120 62 112 Z" />
    </>
  ),
  colmillos: (
    <>
      <path d="M 62 90 L 88 82 L 70 66 Z" />
      <path d="M 138 90 L 112 82 L 130 66 Z" />
      <path d="M 60 110 L 140 110 L 132 134 L 124 114 L 114 132 L 104 112 L 94 132 L 84 114 L 70 134 Z" />
    </>
  ),
  dormida: (
    <>
      <path d="M 62 86 Q 75 74 88 86 Q 75 80 62 86 Z" />
      <path d="M 112 86 Q 125 74 138 86 Q 125 80 112 86 Z" />
      <path d="M 80 112 Q 100 134 120 112 Q 100 124 80 112 Z" />
    </>
  ),
};

export const Calabaza: React.FC<CalabazaProps> = ({
  size = 120,
  delay = 0,
  cara = 'sonrisa',
  className,
  style,
}) => {
  // Ids únicos: si no, varias calabazas en la misma página se pisan los degradados.
  const uid = idLimpio(useId());

  return (
    <svg
      viewBox="0 0 200 190"
      className={className}
      /* El tamaño va por CSS (no por los atributos width/height) para que
         acepte clamp() y no lo aplaste el flex en pantallas angostas. */
      style={{ width: size, aspectRatio: '200 / 190', flexShrink: 0, overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`pulpa-${uid}`} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#FFA733" />
          <stop offset="48%" stopColor="#F2770A" />
          <stop offset="100%" stopColor="#A83E05" />
        </radialGradient>
        <radialGradient id={`gajo-${uid}`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#FFB84D" />
          <stop offset="100%" stopColor="#D15A06" />
        </radialGradient>
        {/* La luz de la vela que sale por la cara tallada */}
        <radialGradient id={`luz-${uid}`} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#FFF4C2" />
          <stop offset="55%" stopColor="#FFC93C" />
          <stop offset="100%" stopColor="#FF8A1F" />
        </radialGradient>
      </defs>

      {/* Rabito */}
      <path
        d="M 96 44 C 92 28 88 18 80 10 C 92 10 102 18 104 32 C 110 22 120 18 128 20 C 118 26 112 36 110 48 Z"
        fill="#4E7A2A"
        stroke="#3A5C1F"
        strokeWidth="2"
      />

      {/* Cuerpo: gajos laterales primero, centro encima */}
      <ellipse cx="62" cy="116" rx="40" ry="62" fill={`url(#gajo-${uid})`} />
      <ellipse cx="138" cy="116" rx="40" ry="62" fill={`url(#gajo-${uid})`} />
      <ellipse cx="100" cy="114" rx="62" ry="66" fill={`url(#pulpa-${uid})`} />

      {/* Costillas */}
      <path d="M 74 60 Q 62 114 74 168" fill="none" stroke="#B4480A" strokeWidth="2.5" opacity="0.55" />
      <path d="M 126 60 Q 138 114 126 168" fill="none" stroke="#B4480A" strokeWidth="2.5" opacity="0.55" />
      <path d="M 100 50 Q 96 114 100 178" fill="none" stroke="#B4480A" strokeWidth="2" opacity="0.35" />

      {/* Brillo */}
      <ellipse cx="74" cy="82" rx="18" ry="26" fill="#FFD9A0" opacity="0.28" transform="rotate(-18 74 82)" />

      {/* Cara tallada, titilando como si tuviera una vela adentro */}
      <motion.g
        fill={`url(#luz-${uid})`}
        animate={{ opacity: [0.82, 1, 0.88, 1, 0.84] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ filter: 'drop-shadow(0 0 10px rgba(255, 170, 40, 0.95))' }}
      >
        {CARAS[cara]}
      </motion.g>
    </svg>
  );
};

interface VelaProps {
  /** Alto CSS: número de px o cualquier valor válido (p. ej. 'clamp(56px, 16vw, 96px)'). */
  height?: number | string;
  delay?: number;
  /** Cera derretida: 0 es nueva, 1 es casi consumida. */
  derretida?: number;
  style?: React.CSSProperties;
}

export const Vela: React.FC<VelaProps> = ({ height = 110, delay = 0, derretida = 0, style }) => {
  const uid = idLimpio(useId());
  const cuerpoAlto = 92 - derretida * 42;
  const topeY = 150 - cuerpoAlto;

  return (
    <svg
      viewBox="0 0 60 160"
      style={{ height, aspectRatio: '60 / 160', flexShrink: 0, overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cera-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C58A52" />
          <stop offset="30%" stopColor="#F5E0C0" />
          <stop offset="70%" stopColor="#E8CBA4" />
          <stop offset="100%" stopColor="#B07A45" />
        </linearGradient>
        <radialGradient id={`llama-${uid}`} cx="50%" cy="72%" r="60%">
          <stop offset="0%" stopColor="#FFFBE8" />
          <stop offset="35%" stopColor="#FFD84D" />
          <stop offset="75%" stopColor="#FF8A1F" />
          <stop offset="100%" stopColor="#E0520A" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Halo cálido alrededor */}
      <motion.ellipse
        cx="30"
        cy={topeY - 10}
        rx="34"
        ry="30"
        fill="#FFB43C"
        opacity="0.18"
        animate={{ opacity: [0.12, 0.24, 0.14, 0.22], scale: [1, 1.08, 0.97, 1.05] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ transformOrigin: `30px ${topeY - 10}px`, filter: 'blur(9px)' }}
      />

      {/* Cuerpo de cera */}
      <rect x="14" y={topeY} width="32" height={cuerpoAlto} rx="5" fill={`url(#cera-${uid})`} />
      {/* Chorretones */}
      <path
        d={`M 18 ${topeY + 6} q 3 ${cuerpoAlto * 0.28} 0 ${cuerpoAlto * 0.44}`}
        stroke="#FFF2DC"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d={`M 41 ${topeY + 10} q -3 ${cuerpoAlto * 0.2} 0 ${cuerpoAlto * 0.3}`}
        stroke="#FFF2DC"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* Borde superior derretido */}
      <ellipse cx="30" cy={topeY} rx="16" ry="4.5" fill="#FFF6E4" />

      {/* Pabilo */}
      <path
        d={`M 30 ${topeY} q 1.5 -5 0 -9`}
        stroke="#3A2A1A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Llama titilando */}
      <motion.path
        d={`M 30 ${topeY - 9} C 22 ${topeY - 18} 23 ${topeY - 30} 30 ${topeY - 40} C 37 ${topeY - 30} 38 ${topeY - 18} 30 ${topeY - 9} Z`}
        fill={`url(#llama-${uid})`}
        animate={{
          scaleY: [1, 1.14, 0.93, 1.08, 1],
          scaleX: [1, 0.93, 1.06, 0.96, 1],
          x: [0, 0.8, -0.7, 0.4, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{
          transformOrigin: `30px ${topeY - 9}px`,
          filter: 'drop-shadow(0 0 7px rgba(255, 170, 40, 0.9))',
        }}
      />
    </svg>
  );
};
