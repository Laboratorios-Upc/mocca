import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartaPropuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Synthesized chime fallback
const playSynthesizedChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Melodic romantic chord (F4, A4, C5, E5, G5, C6) - dreamy bell tones
    const chordNotes = [349.23, 440.0, 523.25, 659.25, 783.99, 1046.5];

    chordNotes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + index * 0.11;
      const duration = 2.0;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.warn('Could not play romantic chime audio:', err);
  }
};

// Plays custom audio from /assets/audio/si.mp3 (or audio.mp3 / cancion.mp3), with automatic fallback
export const playRomanticChimeSound = () => {
  const audioCandidates = [
    '/assets/audio/si.mp3',
    '/assets/audio/audio.mp3',
    '/assets/audio/cancion.mp3',
  ];

  let audioPlayed = false;

  const tryPlay = (index: number) => {
    if (index >= audioCandidates.length) {
      if (!audioPlayed) playSynthesizedChime();
      return;
    }

    const audio = new Audio(audioCandidates[index]);
    audio.volume = 0.9;
    audio
      .play()
      .then(() => {
        audioPlayed = true;
      })
      .catch(() => {
        tryPlay(index + 1);
      });
  };

  tryPlay(0);
};

export const CartaPropuestaModal: React.FC<CartaPropuestaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [accepted, setAccepted] = useState<boolean>(false);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const arenaRef = useRef<HTMLDivElement>(null);

  // Escaping "No" button logic bounded strictly within container and excluded from "Sí" button area
  const handleNoHoverOrClick = () => {
    // Available arena width
    const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : 380;
    // Calculate strict maximum translation bounds so it NEVER leaves the card borders
    const maxRight = Math.max(20, Math.min(60, (arenaWidth - 280) / 2));
    const maxY = 34;

    // Safe displacement offsets relative to the No button's initial spot (to the right of Sí):
    // All coordinates stay safely away from the Sí button and within the paper margins
    const safeZones = [
      { x: maxRight, y: 0 },
      { x: maxRight * 0.8, y: -maxY },
      { x: maxRight * 0.8, y: maxY },
      { x: 0, y: -maxY },
      { x: 0, y: maxY },
      { x: -10, y: -maxY },
      { x: -10, y: maxY },
      { x: maxRight * 0.5, y: -maxY * 0.7 },
      { x: maxRight * 0.5, y: maxY * 0.7 },
    ];

    // If container is extra wide, also allow far-left jump (passing completely to the other side of Sí)
    if (arenaWidth > 420) {
      safeZones.push({ x: -210, y: 0 }, { x: -210, y: -maxY * 0.8 }, { x: -210, y: maxY * 0.8 });
    }

    // Filter out spots too close to current position to ensure distinct movement
    const validSpots = safeZones.filter(
      (spot) => Math.hypot(spot.x - noButtonPos.x, spot.y - noButtonPos.y) > 35
    );

    const candidates = validSpots.length > 0 ? validSpots : safeZones;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    setNoButtonPos({ x: chosen.x, y: chosen.y });
  };

  // Multiple confetti petal bursts on "Sí"
  const triggerGrandConfetti = () => {
    const scalar = 1.3;
    const petalShapes = confetti.shapeFromPath({
      path: 'M0 10 C0 0 10 0 10 10 C10 20 0 20 0 10 Z',
    });

    // Center burst
    confetti({
      shapes: [petalShapes, 'circle'],
      scalar,
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#FFB6C1', '#7CBDFF', '#FFF5F8', '#FFE066', '#ec4899'],
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#4ade80', '#f472b6', '#38bdf8', '#fbbf24'],
      });
    }, 250);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#4ade80', '#f472b6', '#38bdf8', '#fbbf24'],
      });
    }, 450);
  };

  const handleAccept = () => {
    setAccepted(true);
    playRomanticChimeSound();
    triggerGrandConfetti();
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => {
      setAccepted(false);
      setNoButtonPos({ x: 0, y: 0 });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      onClick={handleResetAndClose}
    >
      {/* Decorative ambient background flares */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '320px',
          height: '320px',
          backgroundColor: 'rgba(74, 222, 128, 0.2)',
          borderRadius: '9999px',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '25%',
          width: '320px',
          height: '320px',
          backgroundColor: 'rgba(244, 114, 182, 0.25)',
          borderRadius: '9999px',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Pop-up Paper Letter Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          /* Papel con el mismo color/gradiente del fondo */
          background: 'linear-gradient(135deg, #fff7ed 0%, #e0f2fe 50%, #ffe4e6 100%)',
          borderRadius: '24px',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.6)',
          padding: '28px 24px 28px 24px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxSizing: 'border-box',
          color: '#1e293b',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.15s',
          }}
          title="Cerrar carta"
        >
          <X size={18} />
        </button>

        {/* Vintage Postage Stamp / Heart in Corner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
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
              backgroundColor: 'rgba(240, 253, 244, 0.85)',
              border: '1px dashed #86efac',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Heart size={20} style={{ color: '#22c55e', fill: '#22c55e' }} />
          </span>
          <span
            style={{
              fontFamily: "'Caveat', cursive, sans-serif",
              fontSize: '20px',
              color: '#15803d',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            Para ti, con todo mi amor
          </span>
        </div>

        {/* Letter Text Content */}
        {!accepted ? (
          <>
            <div
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '23px',
                lineHeight: '1.4',
                color: '#1e293b',
                whiteSpace: 'pre-line',
                paddingRight: '6px',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#166534' }}>
                Marci 💚,
              </span>
              {'\n\n'}
              Te amo demasiado, cada día me levanto y pienso en lo feliz que me haces, me hace sentir
              muy afortunado saber que puedo compartir tanto contigo.
              {'\n\n'}
              Amo la forma en la que poco a poco te has vuelto en una de las personas más importantes
              para mí. Amo cada risa, cada experiencia, cada conversación que hemos tenido. Contigo he
              encontrado una compañera con quien puedo compartir mis días, alegrías, mis sonseras y los
              pequeños momentos en los que me siento vivo.
              {'\n\n'}
              Me encanta que después de todo, puedo ser yo mismo cuando estoy contigo, saber que eres un
              lugar seguro en mi vida y de todo corazón espero que cuando pienses en mi puedas sentirte
              de la misma forma y por ello, de la forma más egoísta, te pido lo siguiente:
              {'\n\n'}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#e11d48',
                  marginTop: '10px',
                  marginBottom: '10px',
                  textShadow: '0 2px 10px rgba(225, 29, 72, 0.15)',
                }}
              >
                ¿Puedo ser tu novio?
              </div>
            </div>

            {/* Interactive Proposal Buttons (Sí / No Escapista) */}
            <div
              ref={arenaRef}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                marginTop: '16px',
                minHeight: '85px',
                padding: '8px 12px',
                overflow: 'visible',
              }}
            >
              {/* SÍ Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#ffffff',
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  border: 'none',
                  boxShadow:
                    '0 10px 20px -5px rgba(22, 163, 74, 0.4), 0 4px 6px -2px rgba(22, 163, 74, 0.2)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
              >
                <Heart size={20} style={{ fill: '#ffffff' }} />
                <span>¡Sí! 💚</span>
              </motion.button>

              {/* NO Button (Escapes on hover/click strictly within paper bounds) */}
              <motion.button
                animate={{
                  x: noButtonPos.x,
                  y: noButtonPos.y,
                }}
                transition={{
                  type: 'spring' as const,
                  stiffness: 450,
                  damping: 22,
                }}
                onMouseEnter={handleNoHoverOrClick}
                onTouchStart={handleNoHoverOrClick}
                onClick={handleNoHoverOrClick}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#64748b',
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  zIndex: 5,
                  whiteSpace: 'nowrap',
                }}
                title="No"
              >
                <span>No 🏃‍♂️</span>
              </motion.button>
            </div>
          </>
        ) : (
          /* Accepted Celebration State */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '24px 12px',
                gap: '16px',
              }}
            >
              {/* Beating Heart Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1, 1.25, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(240, 253, 244, 0.9)',
                  border: '2px solid #86efac',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 25px rgba(34, 197, 94, 0.3)',
                }}
              >
                <Heart size={50} style={{ color: '#22c55e', fill: '#22c55e' }} />
              </motion.div>

              <div
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '40px',
                  fontWeight: 700,
                  color: '#15803d',
                  lineHeight: '1.2',
                }}
              >
                ¡Dijiste que sí mi CHORIPANCITA BELLA! 💚
              </div>

              <div
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '26px',
                  color: '#334155',
                  lineHeight: '1.4',
                  maxWidth: '420px',
                }}
              >
                Prometo hacerte la persona más feliz del mundo y cuidar de ti cada día.
                {'\n'}
                <span style={{ color: '#e11d48', fontWeight: 700, fontSize: '30px' }}>
                  ¡Te amo infinitamente, Marci! 💕
                </span>
              </div>

              {/* Sound replay & confetti replay button */}
              <button
                onClick={() => {
                  playRomanticChimeSound();
                  triggerGrandConfetti();
                }}
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #86efac',
                  color: '#16a34a',
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontSize: '20px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Sparkles size={16} />
                <span>Celebrar de nuevo</span>
                <Volume2 size={16} />
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
