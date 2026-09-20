/**
 * Evento de Primavera — 21 de septiembre, anclado a UTC-5 (Lima).
 *
 * LA CLAVE: nunca preguntamos "¿qué día es hoy aquí?" usando la zona horaria
 * del dispositivo. Construimos el instante exacto escribiendo el offset fijo
 * "-05:00" dentro del string ISO. `new Date('2026-09-21T00:00:00-05:00')`
 * apunta siempre al mismo milisegundo universal (05:00 UTC), sin importar si
 * el celular está en Lima, Madrid o con la zona horaria mal configurada.
 *
 * Después solo comparamos milisegundos contra milisegundos: `Date.now()`
 * devuelve tiempo universal, así que la comparación es inmune a zonas horarias.
 */

/** 21 de septiembre, 00:00:00 en UTC-5 — el primer minuto de la primavera. */
export const SPRING_EVENT_START = new Date('2026-09-21T00:00:00-05:00');

/** 22 de septiembre, 00:00:00 en UTC-5 — se acaba el día, queda el recuerdo. */
export const SPRING_EVENT_END = new Date('2026-09-22T00:00:00-05:00');

/**
 * `before`: todavía no es 21 → nada visible, ni rastro del regalo.
 * `live`:   es 21 en UTC-5 → el ramo se abre solo y el botón dorado está ahí.
 * `after`:  ya pasó el 21 → queda un acceso discreto para releer la tarjetita.
 */
export type SpringEventPhase = 'before' | 'live' | 'after';

/** Query param para probar el evento sin esperar: ?primavera=preview */
const PREVIEW_PARAM = 'primavera';

/**
 * Permite forzar una fase desde la URL mientras desarrollas:
 *   ?primavera=preview  → ver el evento como el 21
 *   ?primavera=after    → ver el estado de recuerdo
 *   ?primavera=before   → ver la página como el día 20
 * Sin el parámetro, manda el reloj real.
 */
export function getForcedPhase(search?: string): SpringEventPhase | null {
  const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  if (!query) return null;

  const value = new URLSearchParams(query).get(PREVIEW_PARAM);
  if (value === 'preview' || value === 'live') return 'live';
  if (value === 'after') return 'after';
  if (value === 'before') return 'before';
  return null;
}

/** En qué fase del evento estamos en este instante. */
export function getSpringEventPhase(now: number = Date.now()): SpringEventPhase {
  const forced = getForcedPhase();
  if (forced) return forced;

  if (now < SPRING_EVENT_START.getTime()) return 'before';
  if (now < SPRING_EVENT_END.getTime()) return 'live';
  return 'after';
}

/**
 * Milisegundos que faltan para el próximo cambio de fase, o `null` si ya no
 * habrá más cambios (el evento terminó). Sirve para programar el timer exacto
 * que destapa el ramo a las 00:00:00 sin que ella tenga que recargar la página.
 */
export function msUntilNextPhase(now: number = Date.now()): number | null {
  if (getForcedPhase()) return null;

  if (now < SPRING_EVENT_START.getTime()) return SPRING_EVENT_START.getTime() - now;
  if (now < SPRING_EVENT_END.getTime()) return SPRING_EVENT_END.getTime() - now;
  return null;
}
