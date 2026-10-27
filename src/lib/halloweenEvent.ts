import { createEventWindow } from './eventWindow';

/**
 * Evento de Halloween — encendido desde hoy hasta el 1 de noviembre, en UTC-5,
 * para poder jugar con él toda la semana y que se apague solo después.
 * Previsualización: ?halloween=preview | after | before
 */
export const halloweenEvent = createEventWindow({
  start: '2026-10-27T00:00:00-05:00',
  end: '2026-11-01T00:00:00-05:00',
  previewParam: 'halloween',
});

export const HALLOWEEN_EVENT_START = halloweenEvent.start;
export const HALLOWEEN_EVENT_END = halloweenEvent.end;
