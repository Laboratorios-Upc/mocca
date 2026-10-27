import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Ghost } from 'lucide-react';
import { Calabaza, Vela } from './HalloweenPiezas';
import { Chandelure, Mimikyu } from './PokemonHalloween';

interface EscenaHalloweenModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** En modo recuerdo (después del 1 de nov) el tono es más nostálgico. */
  isMemory?: boolean;
}

/** Lluvia de hojas y chispas naranjas al abrir la escena. */
const triggerHalloweenConfetti = () => {
  const murcielago = confetti.shapeFromPath({
    path: 'M12 8 C10 5 8 3 5 4 C3 4 2 3 0 1 C1 4 1 6 3 7 C5 8 7 7 9 9 C10 10 11 10 12 8 Z',
  });
  const tonos = ['#F2770A', '#FFB13C', '#7B3FA0', '#2B1836', '#FFD36B'];

  confetti({
    shapes: [murcielago, 'circle'],
    scalar: 1.25,
    particleCount: 70,
    spread: 100,
    origin: { y: 0.55 },
    colors: tonos,
  });

  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: tonos });
  }, 220);

  setTimeout(() => {
    confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: tonos });
  }, 400);
};

export const EscenaHalloweenModal: React.FC<EscenaHalloweenModalProps> = ({
  isOpen,
  onClose,
  isMemory = false,
}) => {
  useEffect(() => {
    if (isOpen) triggerHalloweenConfetti();
  }, [isOpen]);

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
            backgroundColor: 'rgba(8, 4, 16, 0.82)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
          onClick={onClose}
        >
          {/* Resplandor naranja de fondo, como fogata */}
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '560px',
              height: '560px',
              background:
                'radial-gradient(circle, rgba(242, 119, 10, 0.34) 0%, rgba(123, 63, 160, 0.18) 55%, rgba(0,0,0,0) 76%)',
              borderRadius: '9999px',
              filter: 'blur(52px)',
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
              background: 'linear-gradient(165deg, #241634 0%, #1A0F28 45%, #2E1512 100%)',
              borderRadius: '26px',
              boxShadow:
                '0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(242, 119, 10, 0.3), inset 0 0 60px rgba(242, 119, 10, 0.1)',
              padding: '26px 22px 30px',
              boxSizing: 'border-box',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(60, 34, 20, 0.85)',
                border: '1px solid rgba(242, 119, 10, 0.5)',
                color: '#FFB13C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
              }}
              title="Cerrar"
            >
              <X size={18} />
            </button>

            {/* Encabezado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(242, 119, 10, 0.16)',
                  border: '1px dashed rgba(255, 177, 60, 0.6)',
                }}
              >
                <Ghost size={20} style={{ color: '#FFB13C' }} />
              </span>
              <span
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '21px',
                  fontWeight: 700,
                  color: '#FFB13C',
                  letterSpacing: '0.02em',
                }}
              >
                {isMemory ? 'Aquel Halloween juntos' : 'Feliz Halloween, Marci'}
              </span>
            </div>

            {/* La escena: calabazas y velas sobre la mesa */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 'clamp(2px, 2vw, 14px)',
                marginTop: '2px',
                marginBottom: '6px',
                /* Aire arriba para que Chandelure flote sin pisar las calabazas */
                paddingTop: 'clamp(26px, 8vw, 44px)',
              }}
            >
              {/* Chandelure flotando sobre la mesa, alumbrando la escena */}
              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '-6px', right: '7%', zIndex: 3 }}
              >
                <Chandelure size="clamp(54px, 16vw, 96px)" delay={0.3} />
              </motion.div>

              {/* Charco de luz sobre la mesa */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '86%',
                  height: '54px',
                  background:
                    'radial-gradient(ellipse, rgba(255, 170, 50, 0.4) 0%, rgba(255, 150, 40, 0.12) 55%, rgba(0,0,0,0) 78%)',
                  filter: 'blur(10px)',
                  pointerEvents: 'none',
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <Vela height="clamp(58px, 17vw, 96px)" delay={0.7} derretida={0.45} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Calabaza size="clamp(44px, 13vw, 78px)" cara="dormida" delay={0.9} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.55, y: 26 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <Calabaza size="clamp(84px, 25vw, 140px)" cara="sonrisa" delay={0} />
              </motion.div>

              {/* Mimikyu asomando entre las calabazas, haciéndose el disimulado */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ zIndex: 2 }}
              >
                <Mimikyu size="clamp(46px, 14vw, 82px)" delay={0.5} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Calabaza size="clamp(50px, 15vw, 86px)" cara="colmillos" delay={0.5} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Vela height="clamp(66px, 19vw, 112px)" delay={0.2} derretida={0.15} />
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
