import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface HortensiaProps {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  colorPalette?: 'blue' | 'purple' | 'pink' | 'cyan';
  delay?: number;
  windFactor?: number;
  onClick?: () => void;
}

interface FloretData {
  id: number;
  cx: number;
  cy: number;
  scale: number;
  rot: number;
  color: string;
  borderColor: string;
  centerColor: string;
  shadow: boolean;
}

export const Hortensia: React.FC<HortensiaProps> = React.memo(({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  colorPalette = 'blue',
  delay = 0,
  windFactor = 1,
  onClick,
}) => {
  const animDuration = useMemo(() => 4.8 + Math.random() * 1.2, []);

  // Generate procedural cluster of florets with pH color variations
  const florets = useMemo<FloretData[]>(() => {
    const list: FloretData[] = [];
    let idCounter = 0;

    const paletteMap = {
      blue: [
        { fill: '#4A90E2', border: '#2B6CB0', center: '#BEE3F8' },
        { fill: '#63B3ED', border: '#3182CE', center: '#EBF8FF' },
        { fill: '#7F9CF5', border: '#5A67D8', center: '#E0E7FF' },
        { fill: '#90CDF4', border: '#4299E1', center: '#FFFFFF' },
        { fill: '#4C51BF', border: '#3C366B', center: '#C3DAFE' },
        { fill: '#A3BFFA', border: '#667EEA', center: '#EBF4FF' },
      ],
      purple: [
        { fill: '#9F7AEA', border: '#6B46C1', center: '#E9D8FD' },
        { fill: '#B794F4', border: '#805AD5', center: '#F3E8FF' },
        { fill: '#D6BCFA', border: '#9F7AEA', center: '#FFFFFF' },
        { fill: '#805AD5', border: '#553C9A', center: '#E9D8FD' },
        { fill: '#702459', border: '#4A154B', center: '#FED7E2' },
        { fill: '#C53030', border: '#9B2C2C', center: '#FEB2B2' },
      ],
      pink: [
        { fill: '#F687B3', border: '#D53F8C', center: '#FFF5F5' },
        { fill: '#FBB6CE', border: '#E9D8FD', center: '#FFFFFF' },
        { fill: '#ED64A6', border: '#B83280', center: '#FED7E2' },
        { fill: '#F6AD55', border: '#DD6B20', center: '#FEEBC8' },
        { fill: '#B83280', border: '#702459', center: '#FBB6CE' },
      ],
      cyan: [
        { fill: '#38B2AC', border: '#2C7A7B', center: '#E6FFFA' },
        { fill: '#4FD1C5', border: '#319795', center: '#FFFFFF' },
        { fill: '#81E6D9', border: '#38B2AC', center: '#E6FFFA' },
        { fill: '#63B3ED', border: '#3182CE', center: '#EBF8FF' },
        { fill: '#2B6CB0', border: '#2C5282', center: '#BEE3F8' },
      ],
    }[colorPalette];

    // Multi-ring distribution for dense domed cluster (~55 florets)
    const rings = [
      { radius: 0, count: 1, scaleRange: [1.1, 1.25] },
      { radius: 22, count: 6, scaleRange: [1.0, 1.15] },
      { radius: 45, count: 12, scaleRange: [0.95, 1.1] },
      { radius: 68, count: 18, scaleRange: [0.85, 1.0] },
      { radius: 88, count: 22, scaleRange: [0.75, 0.9] },
    ];

    rings.forEach((ring) => {
      for (let i = 0; i < ring.count; i++) {
        const baseAngle = (i / ring.count) * 2 * Math.PI + (ring.radius * 0.1);
        const jitterRadius = (Math.random() - 0.5) * 8;
        const jitterAngle = (Math.random() - 0.5) * 0.2;
        const r = ring.radius + jitterRadius;
        const a = baseAngle + jitterAngle;

        const cx = Math.cos(a) * r;
        const cy = Math.sin(a) * r * 0.85;

        const floretScale = ring.scaleRange[0] + Math.random() * (ring.scaleRange[1] - ring.scaleRange[0]);
        const rot = Math.random() * 90;

        const colIndex = Math.floor(Math.random() * paletteMap.length);
        const col = paletteMap[colIndex];

        list.push({
          id: idCounter++,
          cx,
          cy,
          scale: floretScale,
          rot,
          color: col.fill,
          borderColor: col.border,
          centerColor: col.center,
          shadow: ring.radius > 30,
        });
      }
    });

    return list;
  }, [colorPalette]);

  return (
    <motion.g
      style={{ transformOrigin: '200px 380px', willChange: 'transform' }}
      animate={{
        rotate: [rotate, rotate - 2 * windFactor, rotate + 1.8 * windFactor, rotate],
        y: [y, y - 2 * windFactor, y + 1 * windFactor, y],
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
        {/* --- MAIN STEM & SERRATED LEAVES --- */}
        <path
          d="M 200 240 Q 198 385 195 528"
          fill="none"
          stroke="#2D5A27"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M 200 240 Q 198 385 195 528"
          fill="none"
          stroke="#47823F"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Serrated Leaf Left */}
        <g transform="translate(195, 310) rotate(-35)">
          <path
            d="M 0 0 C -30 -15 -70 -25 -105 0 C -120 15 -125 35 -100 50 C -60 65 -25 35 0 0 Z"
            fill="url(#hydrangeaLeafGrad)"
            stroke="#1E3F1A"
            strokeWidth="1.5"
          />
          <path
            d="M 0 0 Q -25 -22 -55 -22 Q -85 -18 -105 0"
            fill="none"
            stroke="#152D12"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <path d="M 0 0 Q -50 15 -110 20" fill="none" stroke="#68B05C" strokeWidth="2.5" />
          <path d="M -30 6 Q -45 -10 -65 -15" fill="none" stroke="#48823E" strokeWidth="1" />
          <path d="M -50 11 Q -68 -5 -88 -8" fill="none" stroke="#48823E" strokeWidth="1" />
          <path d="M -25 7 Q -40 25 -60 35" fill="none" stroke="#48823E" strokeWidth="1" />
          <path d="M -55 12 Q -72 32 -90 40" fill="none" stroke="#48823E" strokeWidth="1" />
        </g>

        {/* Serrated Leaf Right */}
        <g transform="translate(197, 345) rotate(35)">
          <path
            d="M 0 0 C 30 -15 70 -25 105 0 C 120 15 125 35 100 50 C 60 65 25 35 0 0 Z"
            fill="url(#hydrangeaLeafGrad)"
            stroke="#1E3F1A"
            strokeWidth="1.5"
          />
          <path d="M 0 0 Q 50 15 110 20" fill="none" stroke="#68B05C" strokeWidth="2.5" />
          <path d="M 30 6 Q 45 -10 65 -15" fill="none" stroke="#48823E" strokeWidth="1" />
          <path d="M 50 11 Q 68 -5 88 -8" fill="none" stroke="#48823E" strokeWidth="1" />
          <path d="M 25 7 Q 40 25 60 35" fill="none" stroke="#48823E" strokeWidth="1" />
          <path d="M 55 12 Q 72 32 90 40" fill="none" stroke="#48823E" strokeWidth="1" />
        </g>

        {/* --- SPHERICAL CLUSTER CONTAINER --- */}
        <g transform="translate(200, 180)">
          <defs>
            <linearGradient id="hydrangeaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3F1A" />
              <stop offset="60%" stopColor="#35682D" />
              <stop offset="100%" stopColor="#0F240D" />
            </linearGradient>

            <radialGradient id="clusterShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Underneath shadow sphere for 3D depth */}
          <ellipse cx="0" cy="15" rx="90" ry="75" fill="url(#clusterShadow)" />

          {/* --- RENDER INDIVIDUAL 4-PETAL FLORETS --- */}
          {florets.map((f) => (
            <g
              key={f.id}
              transform={`translate(${f.cx}, ${f.cy}) rotate(${f.rot}) scale(${f.scale})`}
            >
              {/* Individual 4 Petals arranged in cross */}
              {[0, 90, 180, 270].map((angle, pIdx) => (
                <g key={`p-${pIdx}`} transform={`rotate(${angle})`}>
                  <path
                    d="M 0 0 Q -7 -10 -11 -18 C -9 -22 -3 -24 0 -22 C 3 -24 9 -22 11 -18 Q 7 -10 0 0 Z"
                    fill={f.color}
                    stroke={f.borderColor}
                    strokeWidth="0.6"
                  />
                  <path
                    d="M 0 0 L 0 -18"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                </g>
              ))}

              {/* Tiny central pistil / stamen eye */}
              <circle cx="0" cy="0" r="3" fill={f.centerColor} stroke={f.borderColor} strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1" fill="#2B6CB0" opacity="0.7" />
            </g>
          ))}
        </g>
      </g>
    </motion.g>
  );
});

Hortensia.displayName = 'Hortensia';

