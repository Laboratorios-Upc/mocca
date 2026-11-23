import { createEventWindow } from './eventWindow';
import { VIAJE } from './viaje';

/**
 * El tracker del viaje aparece recién el 13 de diciembre, la víspera del
 * vuelo, y se queda hasta una semana después de aterrizar en Lima.
 * Antes de esa fecha no existe: ni botón ni rastro.
 *
 * Previsualización: ?viaje=preview | after | before
 */
const UNA_SEMANA_MS = 7 * 86_400_000;

export const viajeEvent = createEventWindow({
  start: '2026-12-13T00:00:00-05:00',
  end: new Date(VIAJE.vuelta.aterrizaje.getTime() + UNA_SEMANA_MS).toISOString(),
  previewParam: 'viaje',
});
