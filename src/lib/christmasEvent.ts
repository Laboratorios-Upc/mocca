import { createEventWindow } from './eventWindow';

/**
 * Tema navideño — encendido desde ya hasta el 27 de diciembre (UTC-5).
 * Del 27 en adelante entra lo de Año Nuevo, que va aparte.
 * Previsualización: ?navidad=preview | after | before
 */
export const christmasEvent = createEventWindow({
  start: '2026-11-23T00:00:00-05:00',
  end: '2026-12-27T00:00:00-05:00',
  previewParam: 'navidad',
});

export const CHRISTMAS_EVENT_START = christmasEvent.start;
export const CHRISTMAS_EVENT_END = christmasEvent.end;
