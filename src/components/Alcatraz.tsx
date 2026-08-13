import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AlcatrazProps {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  variant?: 'white' | 'ivory' | 'blush' | 'golden' | 'crimson';
  delay?: number;
  windFactor?: number;
  onClick?: () => void;
}

export const Alcatraz: React.FC<AlcatrazProps> = React.memo(({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  variant = 'white',
  delay = 0,
  windFactor = 1,
  onClick,
}) => {
  const animDuration = useMemo(() => 6.0 + Math.random() * 1.5, []);

  // Color configuration for realistic spathe
  const colorMap = {
    white: {
      outer: '#FFFFFF',
      innerShadow: '#E2E8F0',
      backSpathe: '#EDF2F7',
      rimHighlight: '#F7FAFC',
      baseGreen: '#81C784',
      spadixBase: '#F6E05E',
      spadixTip: '#ECC94B',
    },
    ivory: {
      outer: '#FFFFF0',
      innerShadow: '#EFE6D5',
      backSpathe: '#F7EECE',
      rimHighlight: '#FFFFFA',
      baseGreen: '#90C695',
      spadixBase: '#D69E2E',
      spadixTip: '#B7791F',
    },
    blush: {
      outer: '#FFF5F5',
      innerShadow: '#FED7D7',
      backSpathe: '#FEB2B2',
      rimHighlight: '#FFFFFF',
      baseGreen: '#81C784',
      spadixBase: '#ED8936',
      spadixTip: '#DD6B20',
    },
    golden: {
      outer: '#FFF9C4',
      innerShadow: '#FBC02D',
      backSpathe: '#FDD835',
      rimHighlight: '#FFFDE7',
      baseGreen: '#81C784',
      spadixBase: '#E65100',
      spadixTip: '#FF8F00',
    },
    crimson: {
      outer: '#F8BBD0',
      innerShadow: '#C2185B',
      backSpathe: '#880E4F',
      rimHighlight: '#FF80AB',
      baseGreen: '#81C784',
      spadixBase: '#FFD54F',
      spadixTip: '#FFB300',
    },
  }[variant] || {
    outer: '#FFFFFF',
    innerShadow: '#E2E8F0',
    backSpathe: '#EDF2F7',
    rimHighlight: '#F7FAFC',
    baseGreen: '#81C784',
    spadixBase: '#F6E05E',
    spadixTip: '#ECC94B',
  };

  return (
    <motion.g
      style={{ transformOrigin: '200px 400px', willChange: 'transform' }}
      animate={{
        rotate: [rotate, rotate + 1.6 * windFactor, rotate - 1.8 * windFactor, rotate],
        x: [x, x - 2 * windFactor, x + 2 * windFactor, x],
      }}
      transition={{
        duration: animDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
      className="cursor-pointer group"
      onClick={onClick}
    >
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {/* --- SMOOTH CURVED THICK STEM --- */}
        <path
          d="M 200 240 Q 202 385 198 535"
          fill="none"
          stroke="#388E3C"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 200 240 Q 202 385 198 535"
          fill="none"
          stroke="#66BB6A"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* --- LARGE ARROWHEAD / HEART-SHAPED LEAF --- */}
        <g transform="translate(196, 360) rotate(-25)">
          <path
            d="M 0 0 C -40 -30 -90 -40 -115 -10 C -130 10 -120 40 -85 55 C -50 70 -20 40 0 0 Z"
            fill="url(#callaLeafGrad)"
            stroke="#1B5E20"
            strokeWidth="1.5"
          />
          {/* Characteristic central leaf vein & spreading arcs */}
          <path d="M 0 0 Q -60 10 -115 -10" fill="none" stroke="#81C784" strokeWidth="2.5" />
          <path d="M -30 2 Q -45 -18 -75 -25" fill="none" stroke="#4CAF50" strokeWidth="1" />
          <path d="M -60 5 Q -75 -12 -98 -16" fill="none" stroke="#4CAF50" strokeWidth="1" />
          <path d="M -35 3 Q -50 25 -75 42" fill="none" stroke="#4CAF50" strokeWidth="1" />
        </g>

        {/* --- CALLA LILY FLOWER HEAD --- */}
        <g transform="translate(200, 160)">
          <defs>
            {/* Spathe Shading Gradient */}
            <linearGradient id={`spatheGrad_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorMap.rimHighlight} />
              <stop offset="35%" stopColor={colorMap.outer} />
              <stop offset="75%" stopColor={colorMap.innerShadow} />
              <stop offset="100%" stopColor={colorMap.baseGreen} />
            </linearGradient>

            <linearGradient id={`backSpatheGrad_${variant}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={colorMap.baseGreen} />
              <stop offset="40%" stopColor={colorMap.backSpathe} />
              <stop offset="100%" stopColor={colorMap.innerShadow} />
            </linearGradient>

            <linearGradient id="spadixGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#D69E2E" />
              <stop offset="60%" stopColor={colorMap.spadixBase} />
              <stop offset="100%" stopColor={colorMap.spadixTip} />
            </linearGradient>

            <linearGradient id="callaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B5E20" />
              <stop offset="60%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#0D3B10" />
            </linearGradient>
          </defs>

          {/* 1. BACK INSIDE OF THE FUNNEL SPATHE */}
          <path
            d="M -30 20 Q -42 -40 -25 -100 Q 0 -130 20 -135 C 38 -125 45 -80 32 20 Z"
            fill={`url(#backSpatheGrad_${variant})`}
            stroke="#CBD5E0"
            strokeWidth="0.8"
          />

          {/* 2. CENTRAL YELLOW FINGER-LIKE SPADIX */}
          <g>
            {/* Main Spadix Rod */}
            <path
              d="M 0 35 Q 2 -20 -3 -85"
              fill="none"
              stroke="url(#spadixGrad)"
              strokeWidth="13"
              strokeLinecap="round"
            />
            {/* Highlight line for 3D roundness */}
            <path
              d="M -2 35 Q 0 -20 -5 -85"
              fill="none"
              stroke="#FEFCBF"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Granular texture dots on Spadix */}
            {[-70, -50, -30, -10, 10, 25].map((yPos, tIdx) => (
              <g key={`t-${tIdx}`} transform={`translate(0, ${yPos})`}>
                <circle cx="-3" cy="0" r="1.2" fill="#B7791F" opacity="0.7" />
                <circle cx="2" cy="-2" r="1.0" fill="#FEFCBF" opacity="0.9" />
                <circle cx="1" cy="3" r="1.1" fill="#D69E2E" opacity="0.8" />
              </g>
            ))}
          </g>

          {/* 3. FRONT WRAPPING SPATHE */}
          <path
            d="M -38 75 C -45 30 -42 -20 -28 -70 C -18 -105 0 -142 32 -138 C 45 -136 48 -115 35 -90 C 20 -60 18 -20 30 75 Q 0 95 -38 75 Z"
            fill={`url(#spatheGrad_${variant})`}
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />

          {/* 4. ELEGANT OUTWARD ROLL FLANGE EDGE */}
          <path
            d="M 32 -138 C 50 -125 58 -95 35 -90 C 18 -60 -10 -40 -35 -15"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M 32 -138 C 50 -125 58 -95 35 -90"
            fill="none"
            stroke={colorMap.innerShadow}
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Base green neck merge */}
          <path
            d="M -32 60 Q 0 90 30 60 L 15 100 Q 0 110 -15 100 Z"
            fill="url(#callaLeafGrad)"
            opacity="0.9"
          />
        </g>
      </g>
    </motion.g>
  );
});

Alcatraz.displayName = 'Alcatraz';

