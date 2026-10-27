import { createEventWindow } from './eventWindow';

/**
 * Evento de Primavera — el 21 de septiembre completo, en UTC-5.
 * Previsualización: ?primavera=preview | after | before
 */
export const springEvent = createEventWindow({
  start: '2026-09-21T00:00:00-05:00',
  end: '2026-09-22T00:00:00-05:00',
  previewParam: 'primavera',
});

export const SPRING_EVENT_START = springEvent.start;
export const SPRING_EVENT_END = springEvent.end;
