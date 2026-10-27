import { useEffect, useState } from 'react';
import type { EventPhase, EventWindow } from '../lib/eventWindow';

/** Tope de setTimeout en JS (~24.8 días). Más allá, el timer se desborda. */
const MAX_TIMEOUT = 2_147_483_647;

/** Red de seguridad: si el timer se pierde (pestaña dormida), revisamos igual. */
const SAFETY_INTERVAL = 30_000;

export interface EventWindowState {
  phase: EventPhase;
  isLive: boolean;
  startsAt: Date;
  endsAt: Date;
}

/**
 * Vigila el reloj y avisa cuando entra (y cuando sale) una ventana de evento.
 * Si la página queda abierta, el cambio ocurre solo al dar la hora exacta:
 * no hace falta recargar.
 */
export function useEventWindow(ventana: EventWindow): EventWindowState {
  const [phase, setPhase] = useState<EventPhase>(() => ventana.getPhase());

  useEffect(() => {
    let timeoutId: number | undefined;

    const sync = () => {
      setPhase(ventana.getPhase());
      schedule();
    };

    const schedule = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);

      const remaining = ventana.msUntilNextPhase();
      if (remaining === null) return;

      // +50ms de colchón para caer del lado correcto de la comparación.
      timeoutId = window.setTimeout(sync, Math.min(remaining + 50, MAX_TIMEOUT));
    };

    // Si el dispositivo se durmió, los timers no son de fiar: al volver, revisamos.
    const handleWake = () => {
      if (document.visibilityState === 'visible') sync();
    };

    // La fase inicial ya viene del useState de arriba; acá solo programamos
    // los cambios futuros (el setState directo acá dispararía un render extra).
    schedule();
    const intervalId = window.setInterval(() => setPhase(ventana.getPhase()), SAFETY_INTERVAL);
    document.addEventListener('visibilitychange', handleWake);
    window.addEventListener('focus', handleWake);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleWake);
      window.removeEventListener('focus', handleWake);
    };
  }, [ventana]);

  return {
    phase,
    isLive: phase === 'live',
    startsAt: ventana.start,
    endsAt: ventana.end,
  };
}
