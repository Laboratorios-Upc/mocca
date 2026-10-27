import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Camera, Sparkles, Heart, Sun, Ghost } from 'lucide-react';
import { Buquet } from './components/Buquet';
import type { FlowerInfo } from './components/Buquet';
import { PollenParticles } from './components/PollenParticles';
import { PetalCascadeOverlay } from './components/PetalCascadeOverlay';
import { PolaroidCarousel } from './components/PolaroidCarousel';
import { CartaPropuestaModal } from './components/CartaPropuestaModal';
import { MusicPlayerWidget } from './components/MusicPlayerWidget';
import { RamoPrimaveraModal } from './components/RamoPrimaveraModal';
import { EscenaHalloweenModal } from './components/EscenaHalloweenModal';
import { HalloweenAmbience } from './components/HalloweenAmbience';
import { useEventWindow } from './hooks/useEventWindow';
import { springEvent } from './lib/springEvent';
import { halloweenEvent } from './lib/halloweenEvent';
import { usePhotos } from './hooks/usePhotos';

/** Marcas de que cada evento ya se abrió solo una vez, para no repetirlo en cada recarga. */
const SPRING_AUTO_OPEN_KEY = 'mocca:primavera-2026:auto-abierto';
const HALLOWEEN_AUTO_OPEN_KEY = 'mocca:halloween-2026:auto-abierto';

/** Fondo de la página según el evento encendido. */
const FONDO_NORMAL = 'linear-gradient(135deg, #fff7ed 0%, #e0f2fe 50%, #ffe4e6 100%)';
const FONDO_HALLOWEEN = 'linear-gradient(170deg, #150B24 0%, #2A1436 42%, #4A1E12 78%, #6B2A0E 100%)';

export function App() {
  const [bloomingFlowerId, setBloomingFlowerId] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCarouselOpen, setIsCarouselOpen] = useState<boolean>(false);
  const [isCartaOpen, setIsCartaOpen] = useState<boolean>(false);
  const [isRamoPrimaveraOpen, setIsRamoPrimaveraOpen] = useState<boolean>(false);

  const [isHalloweenOpen, setIsHalloweenOpen] = useState<boolean>(false);

  // Eventos por fecha, anclados a UTC-5 (no a la zona horaria del dispositivo)
  const { phase: springPhase } = useEventWindow(springEvent);
  const { phase: halloweenPhase } = useEventWindow(halloweenEvent);
  const esHalloween = halloweenPhase === 'live';

  // Fotos reales del bucket de Supabase (antes el contador mostraba un fijo)
  const { photos, status: photosStatus } = usePhotos();

  // Al entrar el 21 el ramo se despliega solo, una única vez.
  useEffect(() => {
    if (springPhase !== 'live') return;

    let alreadyOpened = false;
    try {
      alreadyOpened = window.localStorage.getItem(SPRING_AUTO_OPEN_KEY) === '1';
    } catch {
      // Modo privado / storage bloqueado: mejor mostrarlo que perdérselo.
    }
    if (alreadyOpened) return;

    const timerId = window.setTimeout(() => {
      setIsRamoPrimaveraOpen(true);
      try {
        window.localStorage.setItem(SPRING_AUTO_OPEN_KEY, '1');
      } catch {
        // Sin storage: se volverá a abrir en la próxima visita. No es grave.
      }
    }, 900);

    return () => window.clearTimeout(timerId);
  }, [springPhase]);

  // Lo mismo para Halloween: se despliega solo una vez por navegador.
  useEffect(() => {
    if (halloweenPhase !== 'live') return;

    let alreadyOpened = false;
    try {
      alreadyOpened = window.localStorage.getItem(HALLOWEEN_AUTO_OPEN_KEY) === '1';
    } catch {
      // Modo privado / storage bloqueado: mejor mostrarlo que perdérselo.
    }
    if (alreadyOpened) return;

    const timerId = window.setTimeout(() => {
      setIsHalloweenOpen(true);
      try {
        window.localStorage.setItem(HALLOWEEN_AUTO_OPEN_KEY, '1');
      } catch {
        // Sin storage: se volverá a abrir en la próxima visita. No es grave.
      }
    }, 900);

    return () => window.clearTimeout(timerId);
  }, [halloweenPhase]);

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
        background: esHalloween ? FONDO_HALLOWEEN : FONDO_NORMAL,
        transition: 'background 1.2s ease',
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
          background: esHalloween
            ? 'radial-gradient(circle, rgba(242,119,10,0.3) 0%, rgba(123,63,160,0.22) 50%, rgba(255,177,60,0.12) 100%)'
            : 'radial-gradient(circle, rgba(244,114,182,0.25) 0%, rgba(56,189,248,0.2) 50%, rgba(254,240,138,0.15) 100%)',
          borderRadius: '9999px',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          transform: `translate(calc(-50% + ${mousePos.x * 35}px), calc(-50% + ${mousePos.y * 35}px))`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Partículas del ambiente: polen normalmente, brasas en Halloween */}
      {esHalloween ? <HalloweenAmbience /> : <PollenParticles />}

      {/* --- TOP FLOATING BUTTONS BAR (FOTOS, PÉTALOS, CARTA) --- */}
      <div
        style={{
          position: 'fixed',
          top: '18px',
          /* Centrado con left/right + margin auto, NO con left:50%+translateX:
             con left:50% el navegador solo le ofrece media pantalla de ancho,
             así que la barra envolvía en 4 filas mucho antes de hacer falta. */
          left: 0,
          right: 0,
          marginInline: 'auto',
          width: 'fit-content',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          // Con varios eventos encendidos, en celular ya no cabe en una línea
          maxWidth: 'calc(100vw - 20px)',
          rowGap: '6px',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: esHalloween ? 'rgba(32, 18, 44, 0.88)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '9999px',
          boxShadow: esHalloween
            ? '0 12px 30px -4px rgba(0, 0, 0, 0.55), 0 0 22px -6px rgba(242, 119, 10, 0.45)'
            : '0 12px 30px -4px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
          border: esHalloween
            ? '1px solid rgba(242, 119, 10, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.9)',
          transition: 'background-color 0.8s ease, border-color 0.8s ease',
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
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '24px',
              height: '18px',
              padding: '0 7px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.28)',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            {photosStatus === 'ready' ? (
              /* El número real aparece con un fundido, sin saltar de golpe */
              <motion.span
                key={photos.length}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {photos.length}
              </motion.span>
            ) : (
              /* Mientras cuenta las fotos: tres puntitos latiendo */
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.18,
                    }}
                    style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '9999px',
                      backgroundColor: '#ffffff',
                    }}
                  />
                ))}
              </span>
            )}
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

        {/* Botón del evento de primavera: dorado el 21, discreto como recuerdo después */}
        {springPhase !== 'before' && (
          <button
            id="btn-ramo-primavera"
            onClick={(e) => {
              e.stopPropagation();
              setIsRamoPrimaveraOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: springPhase === 'live' ? '8px 14px' : '8px 12px',
              borderRadius: '9999px',
              background:
                springPhase === 'live'
                  ? 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)'
                  : 'rgba(255, 251, 235, 0.95)',
              color: springPhase === 'live' ? '#4A2B00' : '#B45309',
              fontSize: '13px',
              fontWeight: 700,
              border: springPhase === 'live' ? 'none' : '1px solid #FDE68A',
              boxShadow:
                springPhase === 'live'
                  ? '0 4px 14px rgba(245, 158, 11, 0.45)'
                  : '0 2px 6px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={
              springPhase === 'live'
                ? 'Flores amarillas de primavera 🌼'
                : 'Recuerdo del 21 de septiembre'
            }
          >
            <Sun size={15} style={{ color: springPhase === 'live' ? '#4A2B00' : '#EAB308' }} />
            {/* Ya pasado el 21, queda solo el ícono: un recuerdo discreto que
                además libera espacio en la barra cuando hay varios eventos. */}
            {springPhase === 'live' && <span>Primavera</span>}
          </button>
        )}

        {/* Botón de Halloween: naranja encendido mientras dura, discreto después */}
        {halloweenPhase !== 'before' && (
          <button
            id="btn-escena-halloween"
            onClick={(e) => {
              e.stopPropagation();
              setIsHalloweenOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: esHalloween ? '8px 14px' : '8px 12px',
              borderRadius: '9999px',
              background: esHalloween
                ? 'linear-gradient(135deg, #F2770A 0%, #B83A05 100%)'
                : 'rgba(40, 24, 54, 0.9)',
              color: esHalloween ? '#FFF3DD' : '#FFB13C',
              fontSize: '13px',
              fontWeight: 700,
              border: esHalloween ? 'none' : '1px solid rgba(242, 119, 10, 0.45)',
              boxShadow: esHalloween
                ? '0 4px 16px rgba(242, 119, 10, 0.55)'
                : '0 2px 6px rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={esHalloween ? 'Escena de Halloween 🎃' : 'Recuerdo de Halloween'}
          >
            <Ghost size={15} />
            {esHalloween && <span>Jabolin</span>}
          </button>
        )}
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
        photos={photos}
        isLoading={photosStatus === 'loading'}
      />

      {/* Carta Pop-up Modal con Propuesta */}
      <CartaPropuestaModal
        isOpen={isCartaOpen}
        onClose={() => setIsCartaOpen(false)}
      />

      {/* Escena de Halloween — del 27 de oct al 1 de nov (UTC-5) */}
      <EscenaHalloweenModal
        isOpen={isHalloweenOpen}
        onClose={() => setIsHalloweenOpen(false)}
        isMemory={halloweenPhase === 'after'}
      />

      {/* Ramo de flores amarillas — solo el 21 de septiembre (UTC-5) */}
      <RamoPrimaveraModal
        isOpen={isRamoPrimaveraOpen}
        onClose={() => setIsRamoPrimaveraOpen(false)}
        isMemory={springPhase === 'after'}
      />

      {/* Floating Background Music Widget (Esquina inferior derecha - apagado por defecto) */}
      <MusicPlayerWidget src="/assets/audio/pista.mp3" />
    </div>
  );
}

export default App;
