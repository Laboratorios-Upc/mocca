import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane } from 'lucide-react';
import { TrackerViaje } from './TrackerViaje';
import { VIAJE } from '../lib/viaje';

interface TrackerViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fecha = (d: Date) =>
  d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

const hora = (d: Date) =>
  d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

export const TrackerViajeModal: React.FC<TrackerViajeModalProps> = ({ isOpen, onClose }) => {
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
            backgroundColor: 'rgba(6, 14, 30, 0.8)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
          onClick={onClose}
        >
          {/* Resplandor frío de fondo */}
          <div
            style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '520px',
              height: '520px',
              background:
                'radial-gradient(circle, rgba(120, 190, 255, 0.3) 0%, rgba(76, 194, 102, 0.14) 55%, rgba(0,0,0,0) 76%)',
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
              maxWidth: '460px',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: 'linear-gradient(165deg, #0E2039 0%, #123049 48%, #14402F 100%)',
              borderRadius: '26px',
              boxShadow:
                '0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(150, 210, 255, 0.22), inset 0 0 60px rgba(120, 190, 255, 0.07)',
              padding: '26px 22px 28px',
              boxSizing: 'border-box',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(24, 44, 68, 0.9)',
                border: '1px solid rgba(150, 210, 255, 0.4)',
                color: '#9ED0FF',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(120, 190, 255, 0.14)',
                  border: '1px dashed rgba(158, 208, 255, 0.55)',
                }}
              >
                <Plane size={19} style={{ color: '#9ED0FF' }} />
              </span>
              <span
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '23px',
                  fontWeight: 700,
                  color: '#9ED0FF',
                }}
              >
                El viaje
              </span>
            </div>

            {/* La barra */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TrackerViaje oscuro />
            </div>

            {/* Los dos vuelos, en claro */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '18px',
              }}
            >
              {[
                { rotulo: 'Se va', v: VIAJE.ida.despegue, giro: -38 },
                { rotulo: 'Vuelve', v: VIAJE.vuelta.aterrizaje, giro: 38 },
              ].map(({ rotulo, v, giro }) => (
                <div
                  key={rotulo}
                  style={{
                    flex: 1,
                    padding: '12px 10px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(150, 210, 255, 0.16)',
                    textAlign: 'center',
                  }}
                >
                  <Plane
                    size={15}
                    style={{
                      color: '#9ED0FF',
                      transform: `rotate(${giro}deg)`,
                      marginBottom: '5px',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(158, 208, 255, 0.75)',
                    }}
                  >
                    {rotulo}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.92)',
                      marginTop: '3px',
                      lineHeight: 1.3,
                    }}
                  >
                    {fecha(v)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                    {hora(v)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
