import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Heart,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { PhotoItem } from '../data/photos';
import { INITIAL_PHOTOS } from '../data/photos';

interface PolaroidCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  photos?: PhotoItem[];
}

export const PolaroidCarousel: React.FC<PolaroidCarouselProps> = ({
  isOpen,
  onClose,
  photos = INITIAL_PHOTOS,
}) => {
  const [photoList, setPhotoList] = useState<PhotoItem[]>(photos);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setPhotoList(photos);
  }, [photos]);

  const totalPhotos = photoList.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Autoplay
  useEffect(() => {
    if (isPlaying && isOpen) {
      timerRef.current = window.setInterval(() => {
        nextSlide();
      }, 3800);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isOpen, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextSlide, prevSlide, onClose]);

  const activePhoto = photoList[currentIndex] || photoList[0];

  if (!isOpen) return null;

  // Slide animation variants for Polaroid cards
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
      rotate: dir > 0 ? 6 : -6,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: activePhoto.rotation || 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 },
        rotate: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.9,
      rotate: dir > 0 ? -6 : 6,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      onClick={onClose}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(244, 114, 182, 0.2)',
          borderRadius: '9999px',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          borderRadius: '9999px',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Modal Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isZoomed ? '500px' : '420px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Title & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#e11d48',
                letterSpacing: '0.02em',
              }}
            >
              <Heart style={{ width: '16px', height: '16px', fill: '#e11d48' }} />
              Recuerdos
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#ffe4e6',
                color: '#be123c',
                fontFamily: 'monospace',
              }}
            >
              {currentIndex + 1} / {totalPhotos}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Auto Play toggle */}
            <button
              onClick={() => setIsPlaying((prev) => !prev)}
              style={{
                padding: '5px 10px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isPlaying ? '#10b981' : '#f1f5f9',
                color: isPlaying ? '#ffffff' : '#475569',
                transition: 'all 0.2s',
              }}
              title={isPlaying ? 'Pausar' : 'Reproducción automática'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pausa' : 'Auto'}</span>
            </button>

            {/* Zoom toggle */}
            <button
              onClick={() => setIsZoomed((prev) => !prev)}
              style={{
                padding: '6px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={isZoomed ? 'Reducir' : 'Ampliar'}
            >
              {isZoomed ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                color: '#e11d48',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px',
              }}
              title="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Stage (3D Polaroid stack) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 0',
            minHeight: isZoomed ? '460px' : '400px',
          }}
        >
          {/* Prev Chevron */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '4px',
              zIndex: 30,
              padding: '10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#1e293b',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease',
            }}
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Active Polaroid Card with Framer Motion */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activePhoto.id + currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -100 || offset.x < -80) {
                  nextSlide();
                } else if (swipe > 100 || offset.x > 80) {
                  prevSlide();
                }
              }}
              style={{
                position: 'relative',
                zIndex: 20,
                width: isZoomed ? '340px' : '290px',
                cursor: 'grab',
              }}
            >
              {/* Washi Tape Accent */}
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-1.5deg)',
                  width: '100px',
                  height: '24px',
                  backgroundColor: 'rgba(255, 220, 230, 0.85)',
                  backdropFilter: 'blur(2px)',
                  borderLeft: '2px dashed rgba(244, 114, 182, 0.6)',
                  borderRight: '2px dashed rgba(244, 114, 182, 0.6)',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />

              {/* Classic Clean Polaroid White Card (Pure image in polaroid frame) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow:
                    '0 24px 48px -12px rgba(0, 0, 0, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.18)',
                  borderRadius: '4px',
                  /* Authentic clean Polaroid proportions: equal top & sides (14px), thicker bottom border (52px) */
                  padding: '14px 14px 52px 14px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxSizing: 'border-box',
                }}
              >
                {/* Photo image frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1.05',
                    backgroundColor: '#0f172a',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <img
                    src={activePhoto.url}
                    alt="Foto Polaroid"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      display: 'block',
                    }}
                    loading="eager"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next Chevron */}
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '4px',
              zIndex: 30,
              padding: '10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#1e293b',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease',
            }}
            aria-label="Siguiente"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Bottom Thumbnails Strip */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Autoplay Progress line */}
          {isPlaying && (
            <div
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(226, 232, 240, 0.8)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.8, ease: 'linear' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #f43f5e, #fb7185)',
                }}
              />
            </div>
          )}

          {/* Mini Polaroid Thumbnails */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              overflowX: 'auto',
              padding: '4px 0',
            }}
          >
            {photoList.map((photo, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={photo.id}
                  onClick={() => goToSlide(idx)}
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    width: '38px',
                    height: '46px',
                    padding: '2px 2px 8px 2px',
                    backgroundColor: '#ffffff',
                    border: isActive ? '2px solid #f43f5e' : '1px solid #cbd5e1',
                    borderRadius: '3px',
                    boxShadow: isActive
                      ? '0 4px 10px rgba(244, 63, 94, 0.4)'
                      : '0 2px 4px rgba(0, 0, 0, 0.08)',
                    transform: isActive ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  title={`Foto ${idx + 1}`}
                >
                  <img
                    src={photo.url}
                    alt={`Thumb ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '1px',
                      display: 'block',
                    }}
                  />
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#f43f5e',
                        borderRadius: '9999px',
                        border: '1px solid #ffffff',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
