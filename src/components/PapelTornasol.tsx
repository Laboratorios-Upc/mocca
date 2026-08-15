import React from 'react';

interface PapelTornasolProps {
  x?: number;
  y?: number;
  scale?: number;
  mousePos?: { x: number; y: number };
}

export const PapelTornasol: React.FC<PapelTornasolProps> = React.memo(({
  x = 0,
  y = 0,
  scale = 1,
  mousePos = { x: 0, y: 0 },
}) => {
  // Calculate dynamic angle and focal spots for realistic holographic light response
  const angleDeg = Math.atan2(mousePos.y, mousePos.x) * (180 / Math.PI) + 45;
  const flareCx = 50 + mousePos.x * 25;
  const flareCy = 45 + mousePos.y * 25;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        {/* Layer 1: Base Pastel Sky-Blue / Mint Linear Gradient */}
        <linearGradient
          id="holoBaseSky"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform={`rotate(${angleDeg}, 200, 350)`}
        >
          <stop offset="0%" stopColor="#BCEEFF" />
          <stop offset="35%" stopColor="#C1F4E8" />
          <stop offset="70%" stopColor="#B2E7FE" />
          <stop offset="100%" stopColor="#CDEBFF" />
        </linearGradient>

        {/* Layer 2: Soft Pastel Pink & Pale Yellow Marble Swirl (Tracks cursor) */}
        <radialGradient
          id="holoSwirlPinkYellow"
          cx={`${flareCx}%`}
          cy={`${flareCy}%`}
          r="75%"
        >
          <stop offset="0%" stopColor="#FFC6E5" stopOpacity="0.82" />
          <stop offset="35%" stopColor="#FFF3B0" stopOpacity="0.7" />
          <stop offset="68%" stopColor="#BAF4E4" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#BCEEFF" stopOpacity="0" />
        </radialGradient>

        {/* Layer 3: Opposite Corner Periwinkle & Rose Accent Swirl */}
        <radialGradient
          id="holoSwirlLavenderRose"
          cx={`${100 - flareCx}%`}
          cy={`${100 - flareCy}%`}
          r="70%"
        >
          <stop offset="0%" stopColor="#E2C6FF" stopOpacity="0.7" />
          <stop offset="45%" stopColor="#F8C8DC" stopOpacity="0.5" />
          <stop offset="85%" stopColor="#BCEEFF" stopOpacity="0" />
        </radialGradient>

        {/* Layer 4: Specular Satin Metallic Sheen */}
        <linearGradient
          id="holoSatinSheen"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform={`rotate(${angleDeg - 25}, 200, 350)`}
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="58%" stopColor="#EBF8FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* --- BACK LAYER OF WRAPPING PAPER --- */}
      <g>
        {/* Rear flare left fold */}
        <path
          d="M 200 350 L 50 180 L 110 440 Z"
          fill="url(#holoBaseSky)"
          opacity="0.9"
        />
        <path
          d="M 200 350 L 50 180 L 110 440 Z"
          fill="url(#holoSwirlPinkYellow)"
          opacity="0.85"
        />
        {/* Rear flare right fold */}
        <path
          d="M 200 350 L 350 180 L 290 440 Z"
          fill="url(#holoBaseSky)"
          opacity="0.9"
        />
        <path
          d="M 200 350 L 350 180 L 290 440 Z"
          fill="url(#holoSwirlLavenderRose)"
          opacity="0.85"
        />
      </g>

      {/* --- MAIN FRONT CELLOPHANE CONE WRAP --- */}
      <g>
        {/* 1. Base Sky Blue / Mint Layer */}
        <path
          d="M 120 220 Q 200 240 280 220 L 245 470 Q 200 485 155 470 Z"
          fill="url(#holoBaseSky)"
          filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.15))"
        />

        {/* 2. Overlapping diagonal paper folds */}
        <path
          d="M 115 220 C 140 270 170 360 200 478 C 175 472 155 470 155 470 Z"
          fill="url(#holoBaseSky)"
          opacity="0.9"
        />
        <path
          d="M 285 220 C 260 270 230 360 200 478 C 225 472 245 470 245 470 Z"
          fill="url(#holoBaseSky)"
          opacity="0.95"
        />

        {/* 3. Pastel Pink & Yellow Organic Holographic Swirls */}
        <path
          d="M 120 220 Q 200 240 280 220 L 245 470 Q 200 485 155 470 Z"
          fill="url(#holoSwirlPinkYellow)"
        />
        <path
          d="M 120 220 Q 200 240 280 220 L 245 470 Q 200 485 155 470 Z"
          fill="url(#holoSwirlLavenderRose)"
        />

        {/* 4. CREASE & ARRUGA DARK PATH OVERLAYS */}
        <g opacity="0.3" stroke="#2D3748" strokeLinecap="round" fill="none">
          {/* Fold lines around stem waist */}
          <path d="M 125 240 Q 200 280 275 240" strokeWidth="2.5" />
          <path d="M 135 280 Q 200 320 265 280" strokeWidth="2" />
          <path d="M 145 330 Q 200 365 255 330" strokeWidth="1.8" />
          <path d="M 155 390 Q 200 415 245 390" strokeWidth="1.5" />

          {/* Diagonal crease lines */}
          <path d="M 120 220 L 195 440" strokeWidth="2" />
          <path d="M 280 220 L 205 440" strokeWidth="2" />
          <path d="M 160 250 L 180 340" strokeWidth="1.2" />
          <path d="M 240 250 L 220 340" strokeWidth="1.2" />
        </g>

        {/* 5. SPECULAR GLARE REFLECTION OVERLAY */}
        <path
          d="M 120 220 Q 200 240 280 220 L 245 470 Q 200 485 155 470 Z"
          fill="url(#holoSatinSheen)"
          opacity="0.85"
        />
      </g>
    </g>
  );
});

PapelTornasol.displayName = 'PapelTornasol';
