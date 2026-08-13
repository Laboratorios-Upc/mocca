import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Buquet } from './components/Buquet';
import type { FlowerInfo } from './components/Buquet';
import { PollenParticles } from './components/PollenParticles';
import { PetalCascadeOverlay } from './components/PetalCascadeOverlay';

export function App() {
  const [bloomingFlowerId, setBloomingFlowerId] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  // Direct flower click interaction (bloom bounce + petal burst without popups)
  const handleSelectFlower = (flower: FlowerInfo) => {
    setBloomingFlowerId(flower.id);
    triggerPetalShower();
    setTimeout(() => {
      setBloomingFlowerId(null);
    }, 1500);
  };

  // Reset to default base position (flowers inside paper wrap) when clicking background
  const handleBackgroundClick = () => {
    setBloomingFlowerId(null);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fff7ed 0%, #e0f2fe 50%, #ffe4e6 100%)',
      }}
      className="relative w-full h-full min-h-[100dvh] flex items-center justify-center p-0 duration-1000 overflow-hidden select-none cursor-pointer"
      onClick={handleBackgroundClick}
    >
      {/* Full-Screen Hydrangea Petal Curtain Cascade on Page Load */}
      <PetalCascadeOverlay />

      {/* Background Ambient Glow Orbs reacting to mouse/touch movement */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-gradient-to-tr from-pink-300/30 via-sky-300/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none transition-transform duration-300"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * 35}px), calc(-50% + ${mousePos.y * 35}px))`,
        }}
      />

      {/* Floating Pollen Particles Overlay */}
      <PollenParticles />

      {/* Main Interactive Bouquet Canvas - Centered Full Screen */}
      <main
        className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden"
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
    </div>
  );
}

export default App;
