import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LirioProps {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  colorScheme?: 'pink' | 'orange' | 'white' | 'crimson';
  delay?: number;
  windFactor?: number;
  onClick?: () => void;
}

export const Lirio: React.FC<LirioProps> = React.memo(({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  colorScheme = 'pink',
  delay = 0,
  windFactor = 1,
  onClick,
}) => {
  const animDuration = useMemo(() => 5.5 + Math.random() * 1.5, []);

  // Color profiles for realistic lily varieties
  const colors = {
    pink: {
      outerBase: '#FFF5F8',
      outerMid: '#FFB6C1',
      outerTip: '#FF69B4',
      throat: '#8B0045',
      dots: '#5B002C',
      stamen: '#D2691E',
      pollen: '#E65100',
    },
    orange: {
      outerBase: '#FFF8F0',
      outerMid: '#FFB366',
      outerTip: '#FF7F50',
      throat: '#8B2500',
      dots: '#4A1400',
      stamen: '#CD853F',
      pollen: '#FF4500',
    },
    white: {
      outerBase: '#FFFFFF',
      outerMid: '#F5F5EC',
      outerTip: '#E0E7DA',
      throat: '#6B8E23',
      dots: '#4B5320',
      stamen: '#D2B48C',
      pollen: '#D4AF37',
    },
    crimson: {
      outerBase: '#FFEBEB',
      outerMid: '#E63946',
      outerTip: '#9B111E',
      throat: '#4A000B',
      dots: '#2B0006',
      stamen: '#8B4513',
      pollen: '#FF8C00',
    },
  }[colorScheme];

  // Random seed for natural dots layout
  const dotsList = [
    { cx: -8, cy: -25, r: 1.2 },
    { cx: -15, cy: -35, r: 1.5 },
    { cx: 8, cy: -28, r: 1.1 },
    { cx: 14, cy: -38, r: 1.4 },
    { cx: -5, cy: -45, r: 1.0 },
    { cx: 6, cy: -48, r: 1.3 },
    { cx: -20, cy: -18, r: 1.2 },
    { cx: 22, cy: -20, r: 1.1 },
  ];

  return (
    <motion.g
      style={{ transformOrigin: '200px 420px', willChange: 'transform' }}
      animate={{
        rotate: [rotate, rotate + 2.5 * windFactor, rotate - 2 * windFactor, rotate],
        x: [x, x + 3 * windFactor, x - 2 * windFactor, x],
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
        {/* --- STEM & PARALLEL VEIN LEAVES --- */}
        <path
          d="M 200 240 Q 195 385 190 530"
          fill="none"
          stroke="#3B6E35"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 200 240 Q 195 385 190 530"
          fill="none"
          stroke="#5C9E52"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Leaf 1 - Left long narrow leaf */}
        <g transform="translate(195, 330) rotate(-45)">
          <path
            d="M 0 0 Q -40 -30 -110 -20 Q -40 -5 0 0 Z"
            fill="url(#lilyLeafGrad)"
            stroke="#2A5225"
            strokeWidth="1"
          />
          {/* Parallel venation */}
          <path d="M 0 0 Q -50 -18 -105 -20" fill="none" stroke="#68B05C" strokeWidth="1" />
          <path d="M 0 -2 Q -45 -24 -100 -21" fill="none" stroke="#48823E" strokeWidth="0.7" />
          <path d="M 0 2 Q -45 -12 -100 -18" fill="none" stroke="#48823E" strokeWidth="0.7" />
        </g>

        {/* Leaf 2 - Right long narrow leaf */}
        <g transform="translate(192, 370) rotate(40)">
          <path
            d="M 0 0 Q 40 -30 120 -25 Q 40 -5 0 0 Z"
            fill="url(#lilyLeafGrad)"
            stroke="#2A5225"
            strokeWidth="1"
          />
          <path d="M 0 0 Q 50 -18 115 -25" fill="none" stroke="#68B05C" strokeWidth="1" />
          <path d="M 0 -2 Q 45 -24 108 -26" fill="none" stroke="#48823E" strokeWidth="0.7" />
          <path d="M 0 2 Q 45 -12 108 -23" fill="none" stroke="#48823E" strokeWidth="0.7" />
        </g>

        {/* --- FLOWER HEAD CONTAINER --- */}
        <g transform="translate(200, 200)">
          <defs>
            {/* Tepal Gradient */}
            <radialGradient id={`lilyThroat_${colorScheme}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.throat} stopOpacity="0.9" />
              <stop offset="40%" stopColor={colors.outerMid} />
              <stop offset="85%" stopColor={colors.outerBase} />
              <stop offset="100%" stopColor={colors.outerTip} />
            </radialGradient>

            <linearGradient id={`tepalGrad_${colorScheme}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={colors.throat} />
              <stop offset="35%" stopColor={colors.outerMid} />
              <stop offset="80%" stopColor={colors.outerBase} />
              <stop offset="100%" stopColor={colors.outerTip} />
            </linearGradient>

            <linearGradient id="lilyLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E5A27" />
              <stop offset="50%" stopColor="#47823F" />
              <stop offset="100%" stopColor="#1E3F1A" />
            </linearGradient>
          </defs>

          {/* LAYER 1: THREE OUTER SEPALS (120 deg apart) */}
          {[0, 120, 240].map((angle, idx) => (
            <g key={`sepal-${idx}`} transform={`rotate(${angle})`}>
              {/* Outer Sepal Path with Backward Curved Tip */}
              <path
                d="M 0 0 C -22 -40 -35 -90 -12 -125 C -5 -135 0 -138 0 -135 C 0 -138 5 -135 12 -125 C 35 -90 22 -40 0 0 Z"
                fill={`url(#tepalGrad_${colorScheme})`}
                stroke={colors.outerMid}
                strokeWidth="1.2"
              />

              {/* Recurved Tip Detail */}
              <path
                d="M -12 -125 C -5 -135 0 -142 5 -135 C 2 -130 0 -125 -12 -125 Z"
                fill={colors.outerTip}
                opacity="0.8"
              />

              {/* Central Midrib / Radial Veins */}
              <path
                d="M 0 0 Q -2 -60 0 -130"
                fill="none"
                stroke={colors.throat}
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M 0 -20 Q -10 -60 -18 -100"
                fill="none"
                stroke={colors.outerMid}
                strokeWidth="0.8"
                opacity="0.4"
              />
              <path
                d="M 0 -20 Q 10 -60 18 -100"
                fill="none"
                stroke={colors.outerMid}
                strokeWidth="0.8"
                opacity="0.4"
              />

              {/* Tiger Lily Speckles/Dots near base */}
              {dotsList.map((dot, dIdx) => (
                <circle
                  key={`sepal-dot-${dIdx}`}
                  cx={dot.cx}
                  cy={dot.cy - 10}
                  r={dot.r}
                  fill={colors.dots}
                  opacity="0.85"
                />
              ))}
            </g>
          ))}

          {/* LAYER 2: THREE INNER PETALS (Offset by 60 deg) */}
          {[60, 180, 300].map((angle, idx) => (
            <g key={`petal-${idx}`} transform={`rotate(${angle})`}>
              {/* Inner Petal Path: Fuller, wider with wavy edges & curved tip */}
              <path
                d="M 0 0 C -30 -45 -42 -95 -15 -132 C -5 -142 0 -145 0 -140 C 0 -145 5 -142 15 -132 C 42 -95 30 -45 0 0 Z"
                fill={`url(#tepalGrad_${colorScheme})`}
                stroke={colors.outerMid}
                strokeWidth="1"
              />

              {/* Subtle wavy margin overlay */}
              <path
                d="M -30 -45 Q -36 -70 -26 -100 T -15 -132"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.8"
                opacity="0.5"
              />

              {/* Radial Veins */}
              <path
                d="M 0 0 Q 0 -70 0 -135"
                fill="none"
                stroke={colors.throat}
                strokeWidth="1.8"
                opacity="0.7"
              />
              <path
                d="M 0 -15 Q -14 -65 -22 -110"
                fill="none"
                stroke={colors.outerMid}
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M 0 -15 Q 14 -65 22 -110"
                fill="none"
                stroke={colors.outerMid}
                strokeWidth="0.8"
                opacity="0.5"
              />

              {/* Basal Speckles */}
              {dotsList.map((dot, dIdx) => (
                <circle
                  key={`petal-dot-${dIdx}`}
                  cx={dot.cx * 1.2}
                  cy={dot.cy - 5}
                  r={dot.r * 1.1}
                  fill={colors.dots}
                  opacity="0.9"
                />
              ))}
            </g>
          ))}

          {/* LAYER 3: THROAT & CENTER GLOW */}
          <circle cx="0" cy="0" r="24" fill={colors.throat} opacity="0.8" />
          <circle cx="0" cy="0" r="14" fill="#3D5A12" opacity="0.9" />

          {/* LAYER 4: PISTIL (Central thick style + 3-lobed stigma) */}
          <g>
            <path
              d="M 0 0 Q -4 -30 -6 -75"
              fill="none"
              stroke="#6B8E23"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 0 0 Q -4 -30 -6 -75"
              fill="none"
              stroke="#A2C523"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* 3-Lobed Stigma */}
            <g transform="translate(-6, -75)">
              <circle cx="-3" cy="-3" r="4.5" fill="#3D5A12" />
              <circle cx="3" cy="-3" r="4.5" fill="#3D5A12" />
              <circle cx="0" cy="3" r="4.5" fill="#3D5A12" />
              <circle cx="0" cy="0" r="2.5" fill="#8B9A27" />
            </g>
          </g>

          {/* LAYER 5: SIX STAMENS & POLLEN-COVERED ANTHERS */}
          {[15, 75, 135, 195, 255, 315].map((angle, sIdx) => {
            const rad = (angle * Math.PI) / 180;
            const length = 68 + (sIdx % 2) * 8;
            const endX = Math.sin(rad) * length;
            const endY = -Math.cos(rad) * length;
            const ctrlX = endX * 0.4 + (sIdx % 2 === 0 ? 8 : -8);
            const ctrlY = endY * 0.4;

            return (
              <g key={`stamen-${sIdx}`}>
                {/* Curved Filament */}
                <path
                  d={`M 0 0 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                  fill="none"
                  stroke="#E8F5E9"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0 0 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                  fill="none"
                  stroke={colors.stamen}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* Elongated T-shaped Anther with Pollen */}
                <g transform={`translate(${endX}, ${endY}) rotate(${angle + 80})`}>
                  {/* Anther body */}
                  <rect
                    x="-8"
                    y="-3"
                    width="16"
                    height="6"
                    rx="3"
                    fill={colors.pollen}
                    stroke="#5C2600"
                    strokeWidth="0.8"
                  />
                  {/* Pollen texture grains */}
                  <circle cx="-5" cy="0" r="1.5" fill="#FFD700" />
                  <circle cx="-1" cy="-1" r="1.2" fill="#FF8C00" />
                  <circle cx="3" cy="1" r="1.4" fill="#FFD700" />
                  <circle cx="5" cy="-1" r="1.2" fill="#FFA500" />
                </g>
              </g>
            );
          })}
        </g>
      </g>
    </motion.g>
  );
});

Lirio.displayName = 'Lirio';

