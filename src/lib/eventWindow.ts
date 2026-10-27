/**
 * Ventanas de eventos ancladas a una zona horaria fija (UTC-5, Lima).
 *
 * LA CLAVE: nunca preguntamos "¿qué día es hoy?" usando la zona horaria del
 * dispositivo. Escribimos el offset "-05:00" dentro del string ISO, así
 * `new Date('2026-10-31T00:00:00-05:00')` apunta siempre al mismo milisegundo
 * universal. Luego comparamos milisegundos contra `Date.now()`, que también es
 * universal: la cuenta queda inmune a la zona horaria del celular.
 */

/**
 * `before`: todavía no empieza → ni rastro del evento.
 * `live`:   estamos dentro de la ventana → el evento está encendido.
 * `after`:  ya pasó → queda un acceso discreto de recuerdo.
 */
export type EventPhase = 'before' | 'live' | 'after';

export interface EventWindow {
  readonly start: Date;
  readonly end: Date;
  /** Fase forzada desde la URL, o null si manda el reloj real. */
  getForcedPhase(search?: string): EventPhase | null;
  getPhase(now?: number): EventPhase;
  /** Milisegundos hasta el próximo cambio de fase, o null si ya no habrá más. */
  msUntilNextPhase(now?: number): number | null;
}

export interface EventWindowConfig {
  /** ISO con offset explícito, p. ej. '2026-10-31T00:00:00-05:00'. */
  start: string;
  end: string;
  /** Query param para previsualizar: ?<param>=preview | after | before */
  previewParam: string;
}

export function createEventWindow({ start, end, previewParam }: EventWindowConfig): EventWindow {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error(`Fechas inválidas para el evento "${previewParam}": ${start} → ${end}`);
  }

  const getForcedPhase = (search?: string): EventPhase | null => {
    const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
    if (!query) return null;

    const value = new URLSearchParams(query).get(previewParam);
    if (value === 'preview' || value === 'live') return 'live';
    if (value === 'after') return 'after';
    if (value === 'before') return 'before';
    return null;
  };

  const getPhase = (now: number = Date.now()): EventPhase => {
    const forced = getForcedPhase();
    if (forced) return forced;

    if (now < startDate.getTime()) return 'before';
    if (now < endDate.getTime()) return 'live';
    return 'after';
  };

  const msUntilNextPhase = (now: number = Date.now()): number | null => {
    if (getForcedPhase()) return null;

    if (now < startDate.getTime()) return startDate.getTime() - now;
    if (now < endDate.getTime()) return endDate.getTime() - now;
    return null;
  };

  return { start: startDate, end: endDate, getForcedPhase, getPhase, msUntilNextPhase };
}
