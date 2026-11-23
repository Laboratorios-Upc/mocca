import { useEffect, useState } from 'react';
import { getEstadoViaje, type EstadoViaje } from '../lib/viaje';

/**
 * Sigue el estado del viaje en vivo.
 *
 * El refresco se ajusta a la fase: en pleno vuelo late cada segundo (ahí sí
 * importan los minutos), y el resto del tiempo cada medio minuto, que de
 * sobra para una barra que avanza un 1% al día.
 */
export function useViaje(): EstadoViaje {
  const [estado, setEstado] = useState<EstadoViaje>(() => getEstadoViaje());

  useEffect(() => {
    const enVuelo = estado.fase === 'volando-ida' || estado.fase === 'volando-vuelta';
    const cada = enVuelo ? 1_000 : 30_000;

    const id = window.setInterval(() => setEstado(getEstadoViaje()), cada);

    // Si el dispositivo se durmió, al volver recalculamos de inmediato.
    const alDespertar = () => {
      if (document.visibilityState === 'visible') setEstado(getEstadoViaje());
    };
    document.addEventListener('visibilitychange', alDespertar);
    window.addEventListener('focus', alDespertar);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', alDespertar);
      window.removeEventListener('focus', alDespertar);
    };
  }, [estado.fase]);

  return estado;
}
