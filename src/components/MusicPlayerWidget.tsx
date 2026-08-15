import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Disc } from 'lucide-react';

interface MusicPlayerWidgetProps {
  src?: string;
}

export const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = ({
  src = '/assets/audio/pista.mp3',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element (OFF by default)
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback blocked or failed:', err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Expanded Mini Info Pop-up (on hover or when active) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minWidth: '170px',
            }}
          >
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isPlaying ? '#16a34a' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Music size={13} />
                {isPlaying ? 'Reproduciendo 🎵' : 'Música en pausa'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: '#94a3b8',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: '#f1f5f9',
                }}
              >
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Volume slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              {volume === 0 ? (
                <VolumeX size={13} style={{ color: '#94a3b8' }} />
              ) : (
                <Volume2 size={13} style={{ color: '#64748b' }} />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '4px',
                  cursor: 'pointer',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        id="btn-music-toggle"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={togglePlay}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '9999px',
          backgroundColor: isPlaying ? 'rgba(240, 253, 244, 0.92)' : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isPlaying ? '1px solid #86efac' : '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: isPlaying
            ? '0 8px 24px -4px rgba(34, 197, 94, 0.35), 0 2px 6px rgba(0, 0, 0, 0.05)'
            : '0 8px 20px -4px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
          color: isPlaying ? '#15803d' : '#64748b',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
        }}
        title={isPlaying ? 'Pausar música' : 'Reproducir música de fondo'}
      >
        {/* Animated Vinyl Disc or Music Icon */}
        <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Disc size={20} style={{ color: '#22c55e' }} />
            </motion.div>
          ) : (
            <VolumeX size={18} style={{ color: '#94a3b8' }} />
          )}
        </div>

        {/* Text and animated Equalizer bars */}
        <span>{isPlaying ? 'Música' : 'Música'}</span>

        {isPlaying ? (
          /* Animated Equalizer Wave Bars */
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
            <motion.span
              animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '2.5px', backgroundColor: '#22c55e', borderRadius: '2px' }}
            />
            <motion.span
              animate={{ height: ['10px', '4px', '14px', '8px', '10px'] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              style={{ width: '2.5px', backgroundColor: '#22c55e', borderRadius: '2px' }}
            />
            <motion.span
              animate={{ height: ['6px', '12px', '4px', '14px', '6px'] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              style={{ width: '2.5px', backgroundColor: '#22c55e', borderRadius: '2px' }}
            />
          </div>
        ) : (
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '9999px',
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              fontWeight: 600,
            }}
          >
            OFF
          </span>
        )}
      </motion.button>
    </div>
  );
};
