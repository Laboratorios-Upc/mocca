import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PetalItem {
  id: number;
  xPercent: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotateEnd: number;
  swayX: number;
  type: 'floret' | 'singlePetal';
}

const HYDRANGEA_COLORS = [
  '#63B3ED', // Soft sky blue
  '#4A90E2', // Deep blue
  '#9F7AEA', // Purple
  '#B794F4', // Lavender
  '#F687B3', // Pastel pink
  '#81E6D9', // Soft cyan
  '#EBF8FF', // Ice white
  '#D6BCFA', // Light violet
];

export const PetalCascadeOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Generate dense curtain of falling hydrangea petals (~70 petals across full width)
  const petals = useMemo<PetalItem[]>(() => {
    const list: PetalItem[] = [];
    for (let i = 0; i < 75; i++) {
      list.push({
        id: i,
        xPercent: (i / 75) * 100 + (Math.random() - 0.5) * 4,
        size: 16 + Math.random() * 24,
        color: HYDRANGEA_COLORS[Math.floor(Math.random() * HYDRANGEA_COLORS.length)],
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.2,
        rotateEnd: Math.random() * 360 - 180,
        swayX: (Math.random() - 0.5) * 60,
        type: Math.random() > 0.4 ? 'floret' : 'singlePetal',
      });
    }
    return list;
  }, []);

  useEffect(() => {
    // Unmount curtain after cascade animation finishes (~3.2 seconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="petal-curtain-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex flex-col"
        >
          {/* Top Soft Gradient Mist Backdrop that descends & dissolves */}
          <motion.div
            initial={{ y: '0%', opacity: 0.85 }}
            animate={{ y: '120%', opacity: 0 }}
            transition={{ duration: 2.8, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 bg-gradient-to-b from-sky-200/80 via-purple-100/50 to-transparent pointer-events-none"
          />

          {/* Render 75 Falling Hydrangea Petals & Florets */}
          {petals.map((p) => (
            <motion.div
              key={p.id}
              className="absolute top-0 pointer-events-none"
              style={{ left: `${p.xPercent}%` }}
              initial={{
                y: '-10vh',
                x: 0,
                opacity: 0.95,
                rotate: 0,
                scale: 0.8,
              }}
              animate={{
                y: '115vh',
                x: [0, p.swayX, -p.swayX * 0.5, p.swayX * 0.3],
                opacity: [0, 0.95, 0.9, 0],
                rotate: p.rotateEnd,
                scale: [0.8, 1.1, 1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {p.type === 'floret' ? (
                /* 4-Petal Hydrangea Floret SVG */
                <svg
                  width={p.size}
                  height={p.size}
                  viewBox="0 0 40 40"
                  className="drop-shadow-md"
                >
                  <g transform="translate(20, 20)">
                    {[0, 90, 180, 270].map((angle, idx) => (
                      <path
                        key={idx}
                        d="M 0 0 Q -5 -8 -8 -14 C -6 -17 -2 -18 0 -17 C 2 -18 6 -17 8 -14 Q 5 -8 0 0 Z"
                        fill={p.color}
                        stroke="#FFFFFF"
                        strokeWidth="0.6"
                        transform={`rotate(${angle})`}
                        opacity="0.9"
                      />
                    ))}
                    <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" opacity="0.9" />
                  </g>
                </svg>
              ) : (
                /* Individual Hydrangea Petal SVG */
                <svg
                  width={p.size * 0.85}
                  height={p.size * 1.1}
                  viewBox="0 0 30 40"
                  className="drop-shadow-sm"
                >
                  <path
                    d="M 15 0 C 0 10 0 28 15 40 C 30 28 30 10 15 0 Z"
                    fill={p.color}
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                    opacity="0.88"
                  />
                </svg>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
