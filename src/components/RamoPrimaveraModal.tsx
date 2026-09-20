import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Sun } from 'lucide-react';
import { Lirio } from './Lirio';
import { PapelTornasol } from './PapelTornasol';
import { ListonCeleste } from './ListonCeleste';

interface RamoPrimaveraModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** En modo recuerdo (después del 21) el tono es más nostálgico. */
  isMemory?: boolean;
}

/** Lluvia de pétalos amarillos al abrir el ramo. */
const triggerGoldenConfetti = () => {
  const petal = confetti.shapeFromPath({
    path: 'M0 10 C0 0 10 0 10 10 C10 20 0 20 0 10 Z',
  });
  const golds = ['#FFD84D', '#F5A623', '#FFF3B0', '#FDE68A', '#E6B422'];

  confetti({
    shapes: [petal, 'circle'],
    scalar: 1.2,
    particleCount: 70,
    spread: 95,
    origin: { y: 0.55 },
    colors: golds,
  });

  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: golds });
  }, 220);

  setTimeout(() => {
    confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: golds });
  }, 400);
};

/** Capullos todavía cerrados, como los de la acuarela de referencia. */
const CapulloLirio: React.FC<{
  x: number;
  y: number;
  rotate: number;
  scale: number;
  /** Tallo propio que baja desde el capullo hasta el atado del ramo. */
  stem: string;
  delay: number;
}> = ({ x, y, rotate, scale, stem, delay }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    style={{ transformOrigin: `${x}px ${y}px` }}
  >
    <path d={stem} fill="none" stroke="#3B6E35" strokeWidth="7" strokeLinecap="round" />
    <path d={stem} fill="none" stroke="#5C9E52" strokeWidth="2.5" strokeLinecap="round" />

    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
      {/* Cuerpo del capullo */}
      <path
        d="M 0 2 C -16 -16 -18 -50 0 -74 C 18 -50 16 -16 0 2 Z"
        fill="url(#ramoCapulloGrad)"
        stroke="#A98A1E"
        strokeWidth="1.3"
      />
      {/* Costuras de los tépalos aún cerrados */}
      <path
        d="M 0 0 C -7 -22 -7 -50 0 -71"
        fill="none"
        stroke="#DFA520"
        strokeWidth="1.1"
        opacity="0.7"
      />
      <path
        d="M 0 0 C 7 -22 7 -50 0 -71"
        fill="none"
        stroke="#DFA520"
        strokeWidth="1.1"
        opacity="0.7"
      />
      {/* Sépalos verdes abrazando la base */}
      <path d="M 0 4 C -12 -4 -14 -20 -7 -27 C -3 -16 -1 -6 0 4 Z" fill="#5C9E52" opacity="0.92" />
      <path d="M 0 4 C 12 -4 14 -20 7 -27 C 3 -16 1 -6 0 4 Z" fill="#4A8541" opacity="0.92" />
    </g>
  </motion.g>
);

/**
 * Los capullos van en los bordes del ramo, donde no los tapan los lirios
 * abiertos: dos asomando arriba a los lados y uno chiquito abajo a la derecha.
 */
const YELLOW_BUDS = [
  { id: 'capullo-1', x: 40, y: 70, rotate: -44, scale: 1, stem: 'M 40 70 Q 116 258 180 430', delay: 1.0 },
  { id: 'capullo-2', x: 368, y: 50, rotate: 40, scale: 0.95, stem: 'M 368 50 Q 292 256 216 430', delay: 1.15 },
  { id: 'capullo-3', x: 332, y: 248, rotate: 30, scale: 0.7, stem: 'M 332 248 Q 276 342 210 432', delay: 1.3 },
];

/** Los 5 lirios amarillos del ramo, en las mismas posiciones del buquet original. */
const YELLOW_LILIES = [
  { id: 'primavera-1', x: -68, y: -114, scale: 0.8, rotate: -24, delay: 0.3 },
  { id: 'primavera-2', x: 72, y: -110, scale: 0.78, rotate: 22, delay: 0.7 },
  { id: 'primavera-3', x: 0, y: -160, scale: 0.84, rotate: -2, delay: 1.1 },
  { id: 'primavera-4', x: -38, y: -58, scale: 0.71, rotate: -13, delay: 0.5 },
  { id: 'primavera-5', x: 44, y: -52, scale: 0.7, rotate: 15, delay: 0.9 },
];

export const RamoPrimaveraModal: React.FC<RamoPrimaveraModalProps> = ({
  isOpen,
  onClose,
  isMemory = false,
}) => {
  // Pétalos dorados cada vez que se abre el ramo
  useEffect(() => {
    if (isOpen) triggerGoldenConfetti();
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(28, 25, 23, 0.7)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
          onClick={onClose}
        >
          {/* Resplandor dorado de fondo, como sol de primera hora */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              height: '520px',
              background:
                'radial-gradient(circle, rgba(255, 216, 77, 0.35) 0%, rgba(245, 166, 35, 0.15) 55%, rgba(0,0,0,0) 75%)',
              borderRadius: '9999px',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: 'linear-gradient(160deg, #FFFCF0 0%, #FEF6E0 48%, #FFF1F2 100%)',
              borderRadius: '26px',
              boxShadow:
                '0 25px 60px -12px rgba(120, 80, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.85), inset 0 0 40px rgba(255, 248, 220, 0.7)',
              padding: '26px 22px 30px',
              boxSizing: 'border-box',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(253, 230, 138, 0.9)',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                zIndex: 20,
              }}
              title="Cerrar"
            >
              <X size={18} />
            </button>

            {/* Encabezado */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(254, 249, 195, 0.9)',
                  border: '1px dashed #FCD34D',
                }}
              >
                <Sun size={20} style={{ color: '#EAB308' }} />
              </span>
              <span
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '21px',
                  fontWeight: 700,
                  color: '#B45309',
                  letterSpacing: '0.02em',
                }}
              >
                {isMemory
                  ? '21 de septiembre — el primer día de primavera'
                  : 'Feliz primer día de primavera'}
              </span>
            </div>

            {/* El ramo de flores amarillas */}
            <motion.svg
              /* El viewBox se extiende arriba (-100) para que los pétalos del
                 lirio central no tapen el título, y a los lados (-30 / +460)
                 para que los capullos asomen fuera del grupo de flores. */
              viewBox="-30 -100 460 700"
              preserveAspectRatio="xMidYMid meet"
              style={{
                width: '100%',
                height: 'clamp(280px, 42vh, 380px)',
                marginTop: '4px',
                overflow: 'hidden',
                userSelect: 'none',
                filter: 'drop-shadow(0 18px 24px rgba(146, 64, 14, 0.22))',
              }}
              animate={{ rotate: [0, 1.6, -1.3, 0], y: [0, -3, 3, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <defs>
                {/* Degradado del capullo: verde en la base, oro al centro, punta suave */}
                {/* Más verde y más pálido que los pétalos abiertos: si no, el
                    capullo se confunde con un pétalo y desaparece en el ramo. */}
                <linearGradient id="ramoCapulloGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#8FB03C" />
                  <stop offset="32%" stopColor="#CFCB4A" />
                  <stop offset="72%" stopColor="#F2DC7A" />
                  <stop offset="100%" stopColor="#FCF3C4" />
                </linearGradient>
              </defs>

              {/* Tallos que asoman bajo el papel */}
              <g>
                <path d="M 176 440 Q 172 490 170 535" fill="none" stroke="#254E20" strokeWidth="10" strokeLinecap="round" />
                <path d="M 176 440 Q 172 490 170 535" fill="none" stroke="#48823E" strokeWidth="4" strokeLinecap="round" />
                <path d="M 195 440 Q 198 495 200 542" fill="none" stroke="#1B5E20" strokeWidth="12" strokeLinecap="round" />
                <path d="M 195 440 Q 198 495 200 542" fill="none" stroke="#66BB6A" strokeWidth="5" strokeLinecap="round" />
                <path d="M 215 440 Q 220 490 224 536" fill="none" stroke="#254E20" strokeWidth="9" strokeLinecap="round" />
                <path d="M 215 440 Q 220 490 224 536" fill="none" stroke="#47823F" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="170" cy="535" rx="5" ry="2.5" fill="#A5D6A7" />
                <ellipse cx="200" cy="542" rx="6" ry="3" fill="#C8E6C9" />
                <ellipse cx="224" cy="536" rx="4.5" ry="2.2" fill="#A5D6A7" />
              </g>

              {/* Los lirios amarillos, floreciendo uno por uno */}
              {YELLOW_LILIES.map((lily, index) => (
                <motion.g
                  key={lily.id}
                  initial={{ opacity: 0, scale: 0.55 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.25 + index * 0.16,
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: '200px 440px' }}
                >
                  <Lirio
                    x={lily.x}
                    y={lily.y}
                    scale={lily.scale}
                    rotate={lily.rotate}
                    colorScheme="yellow"
                    delay={lily.delay}
                    windFactor={0.9}
                  />
                </motion.g>
              ))}

              {/* Capullos al frente, asomando por los bordes del ramo */}
              {YELLOW_BUDS.map((bud) => (
                <CapulloLirio key={bud.id} {...bud} />
              ))}

              {/* Envoltura y listón */}
              <g>
                <PapelTornasol x={0} y={0} scale={1} />
              </g>
              <g>
                <ListonCeleste x={0} y={0} scale={1} windSpeed={0.9} />
              </g>
            </motion.svg>

            {/* La tarjetita */}
            <motion.div
              initial={{ opacity: 0, y: 22, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -1.6 }}
              transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                margin: '4px auto 0',
                maxWidth: '400px',
                padding: '22px 24px 18px',
                background: 'linear-gradient(145deg, #FFFDF7 0%, #FDF6E3 100%)',
                borderRadius: '10px',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                boxShadow:
                  '0 14px 28px -10px rgba(120, 80, 0, 0.35), inset 0 0 22px rgba(253, 230, 138, 0.35)',
              }}
            >
              {/* Grapa / cinta washi de la tarjetita */}
              <div
                style={{
                  position: 'absolute',
                  top: '-9px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-3deg)',
                  width: '78px',
                  height: '18px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(253, 224, 71, 0.55)',
                  border: '1px dashed rgba(202, 138, 4, 0.45)',
                }}
              />

              <p
                style={{
                  margin: 0,
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '27px',
                  lineHeight: 1.35,
                  color: '#422006',
                  textAlign: 'center',
                }}
              >
                «las primeras flores del día, ojalá encontrar flores amarillas»
              </p>

              <p
                style={{
                  margin: '14px 0 0',
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#B45309',
                  textAlign: 'right',
                }}
              >
                — tu flaco
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
