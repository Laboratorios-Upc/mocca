/**
 * El viaje: sale de Lima el 14 de diciembre y vuelve el 30 de marzo.
 *
 * Igual que los eventos, todo va en ISO con offset explícito, así la cuenta
 * no depende de la zona horaria del dispositivo. El despegue y el aterrizaje
 * de Lima llevan -05:00; los del destino deben llevar SU propio offset
 * (por ejemplo '+01:00' para España), y la resta sale correcta sola.
 *
 * ⚠️ HORARIOS PROVISIONALES — cámbialos por los reales de tus vuelos.
 * Es lo único que hay que tocar: el resto se calcula a partir de acá.
 */
const IDA_DESPEGUE = '2026-12-14T08:00:00-05:00';
const IDA_ATERRIZAJE = '2026-12-14T18:00:00-05:00';
const VUELTA_DESPEGUE = '2027-03-30T06:00:00-05:00';
const VUELTA_ATERRIZAJE = '2027-03-30T16:00:00-05:00';

export interface Vuelo {
  despegue: Date;
  aterrizaje: Date;
}

export const VIAJE = {
  ida: { despegue: new Date(IDA_DESPEGUE), aterrizaje: new Date(IDA_ATERRIZAJE) } as Vuelo,
  vuelta: { despegue: new Date(VUELTA_DESPEGUE), aterrizaje: new Date(VUELTA_ATERRIZAJE) } as Vuelo,
};

/**
 * `previo`        : todavía no se va.
 * `volando-ida`   : en el aire, alejándose.
 * `lejos`         : la barra larga, la que de verdad importa.
 * `volando-vuelta`: en el aire, viniendo a Lima.
 * `en-casa`       : ya aterrizó.
 */
export type FaseViaje = 'previo' | 'volando-ida' | 'lejos' | 'volando-vuelta' | 'en-casa';

export interface EstadoViaje {
  fase: FaseViaje;
  /**
   * 0 a 1 SIEMPRE sobre la misma escala: todo el tiempo lejos, del despegue
   * de ida al aterrizaje en Lima. Nunca retrocede.
   *
   * Antes medía cada fase por separado y la barra pegaba un salto atrás al
   * empezar el vuelo de vuelta (del 99% al 0%), justo en el mejor momento.
   * Ahora el modo vuelo solo cambia el texto y el ritmo, no la escala.
   */
  progreso: number;
  /** Avance dentro del vuelo actual (0 a 1), solo mientras está en el aire. */
  progresoVuelo: number | null;
  /** Milisegundos que faltan para el final de la fase actual. */
  restanteMs: number;
  /** Días completos que faltan para volver a pisar Lima. */
  diasParaVolver: number;
}

const DIA_MS = 86_400_000;

const recorte = (n: number) => Math.min(1, Math.max(0, n));

/** Cuánto se ha avanzado entre dos instantes, de 0 a 1. */
function fraccion(desde: Date, hasta: Date, ahora: number): number {
  const total = hasta.getTime() - desde.getTime();
  if (total <= 0) return 1;
  return recorte((ahora - desde.getTime()) / total);
}

export function getEstadoViaje(ahora: number = Date.now()): EstadoViaje {
  const { ida, vuelta } = VIAJE;

  const diasParaVolver = Math.max(
    0,
    Math.ceil((vuelta.aterrizaje.getTime() - ahora) / DIA_MS)
  );

  // La escala única de la barra: desde que despega hasta que pisa Lima.
  const progreso = fraccion(ida.despegue, vuelta.aterrizaje, ahora);

  if (ahora < ida.despegue.getTime()) {
    return {
      fase: 'previo',
      progreso: 0,
      progresoVuelo: null,
      restanteMs: ida.despegue.getTime() - ahora,
      diasParaVolver,
    };
  }

  if (ahora < ida.aterrizaje.getTime()) {
    return {
      fase: 'volando-ida',
      progreso,
      progresoVuelo: fraccion(ida.despegue, ida.aterrizaje, ahora),
      restanteMs: ida.aterrizaje.getTime() - ahora,
      diasParaVolver,
    };
  }

  if (ahora < vuelta.despegue.getTime()) {
    return {
      fase: 'lejos',
      progreso,
      progresoVuelo: null,
      restanteMs: vuelta.aterrizaje.getTime() - ahora,
      diasParaVolver,
    };
  }

  if (ahora < vuelta.aterrizaje.getTime()) {
    return {
      fase: 'volando-vuelta',
      progreso,
      progresoVuelo: fraccion(vuelta.despegue, vuelta.aterrizaje, ahora),
      restanteMs: vuelta.aterrizaje.getTime() - ahora,
      diasParaVolver: 0,
    };
  }

  return {
    fase: 'en-casa',
    progreso: 1,
    progresoVuelo: null,
    restanteMs: 0,
    diasParaVolver: 0,
  };
}

/** "3 meses y 12 días", "6 h 20 min", "en 4 min"… según lo que quede. */
export function formatearRestante(ms: number): string {
  if (ms <= 0) return 'ya';

  const minutos = Math.floor(ms / 60_000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias >= 1) {
    const horasSueltas = horas % 24;
    if (dias >= 7) return `${dias} ${dias === 1 ? 'día' : 'días'}`;
    return `${dias} ${dias === 1 ? 'día' : 'días'}${horasSueltas ? ` y ${horasSueltas} h` : ''}`;
  }
  if (horas >= 1) {
    const minutosSueltos = minutos % 60;
    return `${horas} h${minutosSueltos ? ` ${minutosSueltos} min` : ''}`;
  }
  if (minutos >= 1) return `${minutos} min`;
  return 'menos de un minuto';
}
