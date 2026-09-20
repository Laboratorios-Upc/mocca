import { useEffect, useState } from 'react';
import {
  SPRING_EVENT_END,
  SPRING_EVENT_START,
  getSpringEventPhase,
  msUntilNextPhase,
  type SpringEventPhase,
} from '../lib/springEvent';

/** Tope de setTimeout en JS (~24.8 días). Más allá, el timer se desborda. */
const MAX_TIMEOUT = 2_147_483_647;

/** Red de seguridad: si el timer se pierde (pestaña dormida), revisamos igual. */
const SAFETY_INTERVAL = 30_000;

export interface SpringEventState {
  phase: SpringEventPhase;
  isLive: boolean;
  startsAt: Date;
  endsAt: Date;
}

/**
 * Observa el reloj y avisa cuando entra (y cuando sale) el 21 de septiembre
 * en UTC-5. Si ella deja la página abierta desde el día 20, el ramo aparece
 * solo al dar la medianoche: no hace falta recargar.
 */
export function useSpringEvent(): SpringEventState {
  const [phase, setPhase] = useState<SpringEventPhase>(() => getSpringEventPhase());

  useEffect(() => {
    let timeoutId: number | undefined;

    const sync = () => {
      setPhase(getSpringEventPhase());
      schedule();
    };

    const schedule = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);

      const remaining = msUntilNextPhase();
      if (remaining === null) return;

      // +50ms de colchón para caer del lado correcto de la comparación.
      timeoutId = window.setTimeout(sync, Math.min(remaining + 50, MAX_TIMEOUT));
    };

    // Si el dispositivo se durmió, los timers no son de fiar: al volver, revisamos.
    const handleWake = () => {
      if (document.visibilityState === 'visible') sync();
    };

    schedule();
    const intervalId = window.setInterval(() => setPhase(getSpringEventPhase()), SAFETY_INTERVAL);
    document.addEventListener('visibilitychange', handleWake);
    window.addEventListener('focus', handleWake);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleWake);
      window.removeEventListener('focus', handleWake);
    };
  }, []);

  return {
    phase,
    isLive: phase === 'live',
    startsAt: SPRING_EVENT_START,
    endsAt: SPRING_EVENT_END,
  };
}
