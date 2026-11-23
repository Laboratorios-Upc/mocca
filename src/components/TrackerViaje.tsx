import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Heart, Home } from 'lucide-react';
import { useViaje } from '../hooks/useViaje';
import { formatearRestante, VIAJE } from '../lib/viaje';

interface TrackerViajeProps {
  /** Hay un tema oscuro encendido (navidad, halloween): cambia los colores. */
  oscuro?: boolean;
}

/** Qué dice la barra en cada momento del viaje. */
function copia(fase: string, restanteMs: number, dias: number) {
  switch (fase) {
    case 'previo':
      return {
        titulo: `Faltan ${formatearRestante(restanteMs)} para el viaje`,
        pie: 'y después, la cuenta para volver',
        icono: 'avion' as const,
      };
    case 'volando-ida':
      return {
        titulo: `En el aire · aterriza en ${formatearRestante(restanteMs)}`,
        pie: 'buen vuelo',
        icono: 'avion' as const,
      };
    case 'lejos':
      return {
        titulo: `Faltan ${dias} ${dias === 1 ? 'día' : 'días'} para volver a verte`,
        pie: 'la barra se llena sola, cada día un poquito',
        icono: 'corazon' as const,
      };
    case 'volando-vuelta':
      return {
        titulo: `Ya viene · llega a Lima en ${formatearRestante(restanteMs)}`,
        pie: 'casi casi',
        icono: 'avion' as const,
      };
    default:
      return { titulo: 'Ya está en Lima', pie: 'misión cumplida', icono: 'casa' as const };
  }
}

export const TrackerViaje: React.FC<TrackerViajeProps> = ({ oscuro = false }) => {
  const { fase, progreso, restanteMs, diasParaVolver } = useViaje();
  const { titulo, pie, icono } = copia(fase, restanteMs, diasParaVolver);

  const enVuelo = fase === 'volando-ida' || fase === 'volando-vuelta';
  const pct = Math.round(progreso * 100);

  const Icono = icono === 'avion' ? Plane : icono === 'corazon' ? Heart : Home;

  const colorTexto = oscuro ? 'rgba(255, 246, 232, 0.95)' : '#334155';
  const colorPie = oscuro ? 'rgba(255, 246, 232, 0.6)' : '#94a3b8';

  return (
    <div
      style={{
        width: 'min(92vw, 400px)',
        padding: '10px 14px 11px',
        borderRadius: '16px',
        backgroundColor: oscuro ? 'rgba(18, 26, 44, 0.86)' : 'rgba(255, 255, 255, 0.86)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: oscuro ? '1px solid rgba(190, 220, 255, 0.28)' : '1px solid rgba(255,255,255,0.9)',
        boxShadow: oscuro
          ? '0 10px 26px -8px rgba(0,0,0,0.6)'
          : '0 10px 26px -8px rgba(0,0,0,0.16)',
        boxSizing: 'border-box',
        transition: 'background-color 0.8s ease, border-color 0.8s ease',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Título + porcentaje */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
        <Icono
          size={14}
          style={{
            color: oscuro ? '#9ED0FF' : '#0ea5e9',
            fill: icono === 'corazon' ? (oscuro ? '#9ED0FF' : '#0ea5e9') : 'none',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            flex: 1,
            fontSize: '12.5px',
            fontWeight: 700,
            color: colorTexto,
            lineHeight: 1.25,
          }}
        >
          {titulo}
        </span>
        {/* Antes de salir el porcentaje engaña: mediría la cuenta hacia el
            viaje, no el viaje. Mejor callarlo hasta que despegue. */}
        {fase !== 'previo' && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: oscuro ? '#9ED0FF' : '#0284c7',
              flexShrink: 0,
            }}
          >
            {pct}%
          </span>
        )}
      </div>

      {/* La barra */}
      <div
        style={{
          position: 'relative',
          height: '9px',
          borderRadius: '9999px',
          backgroundColor: oscuro ? 'rgba(255,255,255,0.14)' : 'rgba(15, 23, 42, 0.09)',
          overflow: 'visible',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progreso * 100}%` }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            borderRadius: '9999px',
            background: enVuelo
              ? 'linear-gradient(90deg, #38BDF8 0%, #7DD3FC 100%)'
              : 'linear-gradient(90deg, #F472B6 0%, #FBBF24 55%, #4ADE80 100%)',
          }}
        />

        {/* El avioncito / corazón viajando sobre la barra */}
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${progreso * 100}%` }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '9999px',
            backgroundColor: oscuro ? '#132033' : '#ffffff',
            border: `2px solid ${oscuro ? '#9ED0FF' : '#0ea5e9'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
        >
          <Icono
            size={10}
            style={{
              color: oscuro ? '#9ED0FF' : '#0ea5e9',
              fill: icono === 'corazon' ? (oscuro ? '#9ED0FF' : '#0ea5e9') : 'none',
            }}
          />
        </motion.div>
      </div>

      {/* Extremos: de dónde a dónde */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '7px',
          fontSize: '10px',
          color: colorPie,
          fontWeight: 600,
        }}
      >
        <span>{VIAJE.ida.despegue.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</span>
        <span style={{ fontStyle: 'italic', fontWeight: 500 }}>{pie}</span>
        <span>{VIAJE.vuelta.aterrizaje.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</span>
      </div>
    </div>
  );
};
