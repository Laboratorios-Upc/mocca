import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lirio } from './Lirio';
import { Hortensia } from './Hortensia';
import { Alcatraz } from './Alcatraz';
import { PapelTornasol } from './PapelTornasol';
import { ListonCeleste } from './ListonCeleste';

export interface FlowerInfo {
  id: string;
  name: string;
  scientificName: string;
  type: 'Lirio' | 'Hortensia' | 'Alcatraz';
  description: string;
  details: string[];
}

interface BuquetProps {
  windSpeed?: number;
  bloomingFlowerId?: string | null;
  flowerColors?: Record<string, string>;
  onSelectFlower?: (flower: FlowerInfo) => void;
  mousePos?: { x: number; y: number };
  onResetDefaultLayer?: () => void;
  resetTrigger?: number;
}

// Botanical data for interaction
const FLOWER_DATA_MAP: Record<string, FlowerInfo> = {
  lirio1: {
    id: 'lirio1',
    name: 'Lirio Tigre Rosado',
    scientificName: 'Lilium lancifolium / Oriental',
    type: 'Lirio',
    description: 'Flor en forma de estrella de 6 tépalos con puntas curvadas hacia atrás y pecas oscuras en la base.',
    details: [
      '6 tépalos (3 pétalos + 3 sépalos)',
      '6 estambres largos con anteras de polen',
      'Pistilo central grueso con estigma trilobulado',
      'Hojas angostas con nervadura paralela',
    ],
  },
  lirio2: {
    id: 'lirio2',
    name: 'Lirio Naranja Silvestre',
    scientificName: 'Lilium bulbiferum',
    type: 'Lirio',
    description: 'Variedad de color naranja intenso con degradado cálido hacia el centro de la flor.',
    details: [
      'Coloración cálida degradeé',
      'Líneas radiales de venación en los tépalos',
      'Filamentos curvados y antera polinizada',
    ],
  },
  lirio3: {
    id: 'lirio3',
    name: 'Lirio Blanco Marfil',
    scientificName: 'Lilium candidum',
    type: 'Lirio',
    description: 'Lirio blanco puro de gran elegancia y centro verdoso.',
    details: [
      'Tépalos blancos con garganta verde lima',
      'Polen dorado brillante',
      'Tallo erecto con follaje paralelo',
    ],
  },
  hortensia1: {
    id: 'hortensia1',
    name: 'Hortensia Azul Celadón',
    scientificName: 'Hydrangea macrophylla',
    type: 'Hortensia',
    description: 'Racimo esférico compuesto por decenas de florecillas de 4 pétalos.',
    details: [
      'Cúpula densa de florecillas diminutas',
      'Variación de color azul por pH ácido del suelo',
      'Hojas anchas ovaladas con bordes dentados',
    ],
  },
  hortensia2: {
    id: 'hortensia2',
    name: 'Hortensia Violeta Profundo',
    scientificName: 'Hydrangea macrophylla var. Purpurea',
    type: 'Hortensia',
    description: 'Racimo abovedado con tonos morados y violetas de gran profundidad.',
    details: [
      'Repetición de flores diminutas en varias capas',
      'Gradiente natural entre morado y lavanda',
      'Textura abovedada de papel celofán',
    ],
  },
  hortensia3: {
    id: 'hortensia3',
    name: 'Hortensia Rosa Pastel',
    scientificName: 'Hydrangea macrophylla Rosea',
    type: 'Hortensia',
    description: 'Hortensia de tono rosado por suelo alcalino, aportando calidez y volumen base al buquet.',
    details: [
      'Tono suave rosado y salmón',
      'Follaje denso de soporte',
    ],
  },
  alcatraz1: {
    id: 'alcatraz1',
    name: 'Alcatraz Blanco Clásico',
    scientificName: 'Zantedeschia aethiopica',
    type: 'Alcatraz',
    description: 'Espata única en forma de embudo que envuelve un espádice central amarillo.',
    details: [
      'Espata blanca suave curvada en el borde',
      'Espádice central amarillo en forma de vara',
      'Superficie lisa y satinada sin pétalos separados',
      'Hojas grandes en forma de flecha o corazón',
    ],
  },
  alcatraz2: {
    id: 'alcatraz2',
    name: 'Alcatraz Marfil',
    scientificName: 'Zantedeschia rehmannii',
    type: 'Alcatraz',
    description: 'Alcatraz de tallo esbelto y postura vertical destacada en el frente.',
    details: [
      'Forma elegante con pliegue frontal',
      'Espádice cargado de polen dorado',
    ],
  },
};

export const Buquet: React.FC<BuquetProps> = React.memo(
  ({
    windSpeed = 1,
    bloomingFlowerId = null,
    flowerColors = {},
    onSelectFlower,
    mousePos = { x: 0, y: 0 },
    onResetDefaultLayer,
    resetTrigger = 0,
  }: BuquetProps) => {
    const flowerDataMap = FLOWER_DATA_MAP;
    const [activeFrontFlowerId, setActiveFrontFlowerId] = useState<string | null>(null);

    // Reset active front flower when resetTrigger changes
    useEffect(() => {
      setActiveFrontFlowerId(null);
    }, [resetTrigger]);

    // Parallax tilt angles from mouse position
    const tiltX = mousePos.y * -8;
    const tiltY = mousePos.x * 12;

    const handleFlowerClick = (e: React.MouseEvent, flower: FlowerInfo) => {
      e.stopPropagation();
      setActiveFrontFlowerId(flower.id);
      onSelectFlower?.(flower);
    };

    const handleBackgroundClick = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setActiveFrontFlowerId(null);
      onResetDefaultLayer?.();
    };

    const currentFrontId = bloomingFlowerId || activeFrontFlowerId;

    // Individual flower renderer
    const renderFlowerById = (id: string) => {
      const isBlooming = bloomingFlowerId === id;
      const isFront = currentFrontId === id;
      const scaleBonus = isBlooming ? 0.18 : isFront ? 0.12 : 0;

      switch (id) {
        case 'hortensia1':
          return (
            <Hortensia
              key="hortensia1"
              x={-60}
              y={-10}
              scale={0.9 + scaleBonus}
              rotate={-18}
              colorPalette={(flowerColors['hortensia1'] as any) || 'blue'}
              delay={0.1}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.hortensia1)}
            />
          );
        case 'hortensia2':
          return (
            <Hortensia
              key="hortensia2"
              x={65}
              y={-5}
              scale={0.88 + scaleBonus}
              rotate={20}
              colorPalette={(flowerColors['hortensia2'] as any) || 'purple'}
              delay={0.5}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.hortensia2)}
            />
          );
        case 'hortensia3':
          return (
            <Hortensia
              key="hortensia3"
              x={0}
              y={-40}
              scale={0.82 + scaleBonus}
              rotate={-5}
              colorPalette={(flowerColors['hortensia3'] as any) || 'pink'}
              delay={0.9}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.hortensia3)}
            />
          );
        case 'alcatraz1':
          return (
            <Alcatraz
              key="alcatraz1"
              x={-35}
              y={-75}
              scale={0.88 + scaleBonus}
              rotate={-12}
              variant={(flowerColors['alcatraz1'] as any) || 'white'}
              delay={0.2}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.alcatraz1)}
            />
          );
        case 'alcatraz2':
          return (
            <Alcatraz
              key="alcatraz2"
              x={35}
              y={-65}
              scale={0.85 + scaleBonus}
              rotate={14}
              variant={(flowerColors['alcatraz2'] as any) || 'ivory'}
              delay={0.6}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.alcatraz2)}
            />
          );
        case 'lirio1':
          return (
            <Lirio
              key="lirio1"
              x={-75}
              y={-115}
              scale={0.85 + scaleBonus}
              rotate={-24}
              colorScheme={(flowerColors['lirio1'] as any) || 'pink'}
              delay={0.3}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.lirio1)}
            />
          );
        case 'lirio2':
          return (
            <Lirio
              key="lirio2"
              x={80}
              y={-110}
              scale={0.83 + scaleBonus}
              rotate={22}
              colorScheme={(flowerColors['lirio2'] as any) || 'orange'}
              delay={0.7}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.lirio2)}
            />
          );
        case 'lirio3':
          return (
            <Lirio
              key="lirio3"
              x={0}
              y={-165}
              scale={0.88 + scaleBonus}
              rotate={-2}
              colorScheme={(flowerColors['lirio3'] as any) || 'white'}
              delay={1.1}
              windFactor={windSpeed}
              onClick={(e?: any) => handleFlowerClick(e, flowerDataMap.lirio3)}
            />
          );
        default:
          return null;
      }
    };

    // Filter default layers (if a flower is actively brought to the front, exclude it from base layer)
    const baseHydrangeas = ['hortensia1', 'hortensia2', 'hortensia3'].filter(
      (id) => id !== currentFrontId
    );
    const middleCallaLilies = ['alcatraz1', 'alcatraz2'].filter(
      (id) => id !== currentFrontId
    );
    const defaultOuterLilies = ['lirio1', 'lirio2', 'lirio3'].filter(
      (id) => id !== currentFrontId
    );

    return (
      <motion.div
        className="relative bouquet-viewport-container flex items-center justify-center cursor-pointer"
        style={{ perspective: 1000 }}
        onClick={handleBackgroundClick}
      >
        {/* GLOBAL BOUQUET SWAY & REACTIVE TILT CONTAINER */}
        <motion.svg
          viewBox="0 0 400 570"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full overflow-visible drop-shadow-2xl select-none"
          style={{ willChange: 'transform' }}
          animate={{
            rotate: [0 + tiltY * 0.2, 1.8 * windSpeed + tiltY * 0.2, -1.5 * windSpeed + tiltY * 0.2, 0 + tiltY * 0.2],
            x: [0 + mousePos.x * 15, 4 * windSpeed + mousePos.x * 15, -3 * windSpeed + mousePos.x * 15, 0 + mousePos.x * 15],
            y: [0 + mousePos.y * 10, -2 * windSpeed + mousePos.y * 10, 2 * windSpeed + mousePos.y * 10, 0 + mousePos.y * 10],
            rotateX: tiltX,
            rotateY: tiltY,
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Transparent SVG backdrop catch-all for clicking outside flowers */}
          <rect x="-100" y="-100" width="600" height="750" fill="transparent" onClick={handleBackgroundClick} />

          {/* --- LAYER 1: VISIBLE PROTRUDING STEM BUNDLE BELOW WRAPPING PAPER --- */}
          <g id="layer-visible-bottom-stems">
            {/* Leftmost stem */}
            <path d="M 165 440 Q 160 485 158 528" fill="none" stroke="#1E3F1A" strokeWidth="8" strokeLinecap="round" />
            <path d="M 165 440 Q 160 485 158 528" fill="none" stroke="#35682D" strokeWidth="3" strokeLinecap="round" />

            {/* Outer left stem */}
            <path d="M 176 440 Q 172 490 170 535" fill="none" stroke="#254E20" strokeWidth="10" strokeLinecap="round" />
            <path d="M 176 440 Q 172 490 170 535" fill="none" stroke="#48823E" strokeWidth="4" strokeLinecap="round" />

            {/* Center thick stem */}
            <path d="M 195 440 Q 198 495 200 542" fill="none" stroke="#1B5E20" strokeWidth="12" strokeLinecap="round" />
            <path d="M 195 440 Q 198 495 200 542" fill="none" stroke="#66BB6A" strokeWidth="5" strokeLinecap="round" />

            {/* Outer right stem */}
            <path d="M 215 440 Q 220 490 224 536" fill="none" stroke="#254E20" strokeWidth="9" strokeLinecap="round" />
            <path d="M 215 440 Q 220 490 224 536" fill="none" stroke="#47823F" strokeWidth="4" strokeLinecap="round" />

            {/* Rightmost stem */}
            <path d="M 228 440 Q 235 485 240 526" fill="none" stroke="#1E3F1A" strokeWidth="8" strokeLinecap="round" />
            <path d="M 228 440 Q 235 485 240 526" fill="none" stroke="#35682D" strokeWidth="3" strokeLinecap="round" />

            {/* Stem cut-ends for botanical realism */}
            <ellipse cx="158" cy="528" rx="4" ry="2" fill="#81C784" />
            <ellipse cx="170" cy="535" rx="5" ry="2.5" fill="#A5D6A7" />
            <ellipse cx="200" cy="542" rx="6" ry="3" fill="#C8E6C9" />
            <ellipse cx="224" cy="536" rx="4.5" ry="2.2" fill="#A5D6A7" />
            <ellipse cx="240" cy="526" rx="4" ry="2" fill="#81C784" />
          </g>

          {/* --- LAYER 2: BASE HYDRANGEAS (BACKGROUND VOLUME) --- */}
          <g id="layer-back-hydrangeas">
            {baseHydrangeas.map(renderFlowerById)}
          </g>

          {/* --- LAYER 3: CALLA LILIES (MIDDLE FOCAL LAYER) --- */}
          <g id="layer-middle-calla-lilies">
            {middleCallaLilies.map(renderFlowerById)}
          </g>

          {/* --- LAYER 4: BASE LILIES --- */}
          <g id="layer-base-lilies">
            {defaultOuterLilies.map(renderFlowerById)}
          </g>

          {/* --- LAYER 5: IRIDESCENT WRAPPING PAPER (FORRO TORNASOL EN LA CAPA MÁS ARRIBA POR DEFECTO) --- */}
          <g id="layer-wrapping-paper">
            <PapelTornasol x={0} y={0} scale={1} mousePos={mousePos} />
          </g>

          {/* --- LAYER 6: SKY BLUE SATIN RIBBON --- */}
          <g id="layer-ribbon">
            <ListonCeleste x={0} y={0} scale={1} windSpeed={windSpeed} />
          </g>

          {/* --- LAYER 7: CLICKED ACTIVE FLOWER (SOBRESALE DEL FORRO TORNASOL AL HACER CLIC) --- */}
          {currentFrontId && (
            <g id="layer-dynamic-active-front">
              {renderFlowerById(currentFrontId)}
            </g>
          )}
        </motion.svg>
      </motion.div>
    );
  }
);

Buquet.displayName = 'Buquet';
