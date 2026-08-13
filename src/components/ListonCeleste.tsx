import React from 'react';
import { motion } from 'framer-motion';

interface ListonCelesteProps {
  x?: number;
  y?: number;
  scale?: number;
  windSpeed?: number;
}

export const ListonCeleste: React.FC<ListonCelesteProps> = React.memo(({
  x = 0,
  y = 0,
  scale = 1,
  windSpeed = 1,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        {/* Sky blue ribbon satin gradient */}
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="30%" stopColor="#7CBDFF" />
          <stop offset="60%" stopColor="#5CA0F2" />
          <stop offset="100%" stopColor="#3182CE" />
        </linearGradient>

        {/* Satin sheen reflection band gradient */}
        <linearGradient id="satinSheenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#EBF8FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Shadow under knot */}
        <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* --- CENTRAL KNOT (NUDO DEL BUQUET) --- */}
      <g filter="url(#ribbonShadow)" transform="translate(200, 360)">
        {/* Ribbon Loop Left */}
        <path
          d="M 0 0 C -25 -25 -55 -20 -60 0 C -65 20 -35 25 0 0 Z"
          fill="url(#ribbonGrad)"
          stroke="#2B6CB0"
          strokeWidth="1"
        />
        {/* Ribbon Loop Right */}
        <path
          d="M 0 0 C 25 -25 55 -20 60 0 C 65 20 35 25 0 0 Z"
          fill="url(#ribbonGrad)"
          stroke="#2B6CB0"
          strokeWidth="1"
        />
        {/* Central Knot Core */}
        <rect
          x="-14"
          y="-12"
          width="28"
          height="24"
          rx="8"
          fill="#4A90E2"
          stroke="#2B6CB0"
          strokeWidth="1.5"
        />
        <rect x="-8" y="-10" width="16" height="20" rx="5" fill="#7CBDFF" opacity="0.8" />
      </g>

      {/* --- UNDULATING RIBBON TAIL 1 (LEFT TAIL) --- */}
      <motion.g
        style={{ transformOrigin: '190px 365px', willChange: 'transform' }}
        animate={{
          rotate: [0, 8 * windSpeed, -5 * windSpeed, 12 * windSpeed, 0],
          skewX: [0, -4 * windSpeed, 3 * windSpeed, 0],
        }}
        transition={{
          duration: (3.2 / windSpeed),
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Tail 1 Path (Undulating Sine Curve) */}
        <path
          d="M 190 365 Q 160 410 185 460 T 150 560 L 175 565 Q 210 470 180 415 Z"
          fill="url(#ribbonGrad)"
          stroke="#2B6CB0"
          strokeWidth="1"
          filter="url(#ribbonShadow)"
        />
        {/* Moving Satin Sheen Highlight Line */}
        <motion.path
          d="M 190 365 Q 160 410 185 460 T 150 560"
          fill="none"
          stroke="url(#satinSheenGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{
            strokeDasharray: ['10 40', '40 10', '10 40'],
            strokeDashoffset: [0, -100, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {/* V-cut notch at bottom tip */}
        <path d="M 150 560 L 162.5 548 L 175 565 Z" fill="#2B6CB0" opacity="0.2" />
      </motion.g>

      {/* --- UNDULATING RIBBON TAIL 2 (RIGHT TAIL) --- */}
      <motion.g
        style={{ transformOrigin: '210px 365px', willChange: 'transform' }}
        animate={{
          rotate: [0, -10 * windSpeed, 7 * windSpeed, -14 * windSpeed, 0],
          skewX: [0, 5 * windSpeed, -4 * windSpeed, 0],
        }}
        transition={{
          duration: (3.8 / windSpeed),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
      >
        {/* Tail 2 Path (Undulating Sine Curve) */}
        <path
          d="M 210 365 Q 240 420 215 470 T 255 575 L 230 580 Q 190 480 220 425 Z"
          fill="url(#ribbonGrad)"
          stroke="#2B6CB0"
          strokeWidth="1"
          filter="url(#ribbonShadow)"
        />
        {/* Moving Satin Sheen Highlight Line */}
        <motion.path
          d="M 210 365 Q 240 420 215 470 T 255 575"
          fill="none"
          stroke="url(#satinSheenGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{
            strokeDasharray: ['15 45', '45 15', '15 45'],
            strokeDashoffset: [0, 100, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <path d="M 255 575 L 242.5 560 L 230 580 Z" fill="#2B6CB0" opacity="0.2" />
      </motion.g>
    </g>
  );
});

ListonCeleste.displayName = 'ListonCeleste';

