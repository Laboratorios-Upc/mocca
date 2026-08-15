import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Camera, Sparkles, Heart } from 'lucide-react';
import { Buquet } from './components/Buquet';
import type { FlowerInfo } from './components/Buquet';
import { PollenParticles } from './components/PollenParticles';
import { PetalCascadeOverlay } from './components/PetalCascadeOverlay';
import { PolaroidCarousel } from './components/PolaroidCarousel';
import { CartaPropuestaModal } from './components/CartaPropuestaModal';
import { MusicPlayerWidget } from './components/MusicPlayerWidget';
import { INITIAL_PHOTOS } from './data/photos';

export function App() {
  const [bloomingFlowerId, setBloomingFlowerId] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCarouselOpen, setIsCarouselOpen] = useState<boolean>(false);
  const [isCartaOpen, setIsCartaOpen] = useState<boolean>(false);

  // Global mouse / touch movement tracking with requestAnimationFrame throttling
  useEffect(() => {
    let animationFrameId: number | null = null;
    let latestX = 0;
    let latestY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      latestX = (clientX / window.innerWidth) * 2 - 1;
      latestY = (clientY / window.innerHeight) * 2 - 1;

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          setMousePos((prev) => {
            if (Math.abs(prev.x - latestX) > 0.005 || Math.abs(prev.y - latestY) > 0.005) {
              return { x: latestX, y: latestY };
            }
            return prev;
          });
          animationFrameId = null;
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // Confetti petal burst function on flower click
  const triggerPetalShower = () => {
    const scalar = 1.2;
    const petalShapes = confetti.shapeFromPath({
      path: 'M0 10 C0 0 10 0 10 10 C10 20 0 20 0 10 Z',
    });

    confetti({
      shapes: [petalShapes, 'circle'],
      scalar,
      particleCount: 45,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FFB6C1', '#7CBDFF', '#FFF5F8', '#FFE066', '#E7C6FF'],
    });
  };

  // Direct flower click interaction
  const handleSelectFlower = (flower: FlowerInfo) => {
    setBloomingFlowerId(flower.id);
    triggerPetalShower();
    setTimeout(() => {
      setBloomingFlowerId(null);
    }, 1500);
  };

  // Reset to default base position when clicking background
  const handleBackgroundClick = () => {
    setBloomingFlowerId(null);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        userSelect: 'none',
        background: 'linear-gradient(135deg, #fff7ed 0%, #e0f2fe 50%, #ffe4e6 100%)',
      }}
      onClick={handleBackgroundClick}
    >
      {/* Full-Screen Hydrangea Petal Curtain Cascade on Page Load */}
      <PetalCascadeOverlay />

      {/* Background Ambient Glow Orbs reacting to mouse/touch movement */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '550px',
          height: '550px',
          background:
            'radial-gradient(circle, rgba(244,114,182,0.25) 0%, rgba(56,189,248,0.2) 50%, rgba(254,240,138,0.15) 100%)',
          borderRadius: '9999px',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          transform: `translate(calc(-50% + ${mousePos.x * 35}px), calc(-50% + ${mousePos.y * 35}px))`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Floating Pollen Particles Overlay */}
      <PollenParticles />

      {/* --- TOP FLOATING BUTTONS BAR (FOTOS, PÉTALOS, CARTA) --- */}
      <div
        style={{
          position: 'fixed',
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Photo Album Button (Polaroid Carousel) */}
        <button
          id="btn-fotos-polaroid"
          onClick={() => setIsCarouselOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.35)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Ver fotos"
        >
          <Camera size={16} />
          <span>Fotos</span>
          <span
            style={{
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.28)',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            {INITIAL_PHOTOS.length}
          </span>
        </button>

        {/* Petal confetti trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerPetalShower();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            color: '#f59e0b',
            border: '1px solid #fef3c7',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
          }}
          title="Lluvia de Pétalos"
        >
          <Sparkles size={16} />
        </button>

        {/* Carta Pop-up Button (al costado derecho del botón de confeti) */}
        <button
          id="btn-carta-propuesta"
          onClick={() => setIsCartaOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '9999px',
            backgroundColor: '#f0fdf4',
            color: '#15803d',
            fontSize: '13px',
            fontWeight: 700,
            border: '1px solid #bbf7d0',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.18)',
            cursor: 'pointer',
            transition: 'transform 0.15s, background-color 0.15s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Carta para Marci 💚"
        >
          <Heart size={15} style={{ fill: '#22c55e', color: '#22c55e' }} />
          <span>Carta</span>
        </button>
      </div>

      {/* Main Interactive Bouquet Canvas - Centered Full Screen */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        onClick={handleBackgroundClick}
      >
        <Buquet
          windSpeed={1.0}
          bloomingFlowerId={bloomingFlowerId}
          onSelectFlower={handleSelectFlower}
          mousePos={mousePos}
          resetTrigger={resetTrigger}
        />
      </main>

      {/* Polaroid Photos Carousel Modal */}
      <PolaroidCarousel
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
      />

      {/* Carta Pop-up Modal con Propuesta */}
      <CartaPropuestaModal
        isOpen={isCartaOpen}
        onClose={() => setIsCartaOpen(false)}
      />

      {/* Floating Background Music Widget (Esquina inferior derecha - apagado por defecto) */}
      <MusicPlayerWidget src="/assets/audio/pista.mp3" />
    </div>
  );
}

export default App;
