import React from 'react';
import { motion } from 'framer-motion';

/**
 * Los dos invitados de Halloween: Chandelure y Mimikyu.
 *
 * Los sprites son los archivos que ya están en public/assets/pokemon.
 * El de Chandelure es un webp animado (sus llamas titilan solas), así que acá
 * solo le agregamos el flotar y el resplandor; el de Mimikyu es estático y se
 * mueve con un balanceo tímido, que le va bien al personaje.
 */

interface SpriteProps {
  /** Ancho CSS: número de px o cualquier valor válido (p. ej. 'clamp(60px, 16vw, 112px)'). */
  size?: number | string;
  delay?: number;
  style?: React.CSSProperties;
}

export const Chandelure: React.FC<SpriteProps> = ({ size = 110, delay = 0, style }) => (
  <motion.div
    animate={{ y: [0, -14, 0, -8, 0], rotate: [0, 1.6, 0, -1.6, 0] }}
    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'relative', lineHeight: 0, ...style }}
  >
    {/* Resplandor azulado de sus llamas */}
    <motion.div
      animate={{ opacity: [0.45, 0.8, 0.5, 0.75, 0.45], scale: [1, 1.12, 0.96, 1.08, 1] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute',
        inset: '-28%',
        borderRadius: '9999px',
        background:
          'radial-gradient(circle, rgba(126, 150, 255, 0.55) 0%, rgba(150, 110, 230, 0.26) 46%, rgba(0,0,0,0) 72%)',
        filter: 'blur(14px)',
        pointerEvents: 'none',
      }}
    />
    <img
      src="/assets/pokemon/chandelure.webp"
      alt="Chandelure"
      style={{
        position: 'relative',
        width: size,
        height: 'auto',
        display: 'block',
        filter: 'drop-shadow(0 0 10px rgba(130, 150, 255, 0.75))',
      }}
    />
  </motion.div>
);

export const Mimikyu: React.FC<SpriteProps> = ({ size = 92, delay = 0, style }) => (
  <motion.div
    /* Balanceo tímido, como si asomara despacito */
    animate={{ rotate: [0, -3.5, 0, 3, 0], y: [0, -4, 0, -2, 0] }}
    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'relative', lineHeight: 0, transformOrigin: 'bottom center', ...style }}
  >
    <img
      src="/assets/pokemon/mimikyu.webp"
      alt="Mimikyu"
      style={{
        width: size,
        height: 'auto',
        display: 'block',
        filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45))',
      }}
    />
  </motion.div>
);
