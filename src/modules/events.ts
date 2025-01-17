import { Program } from './program';
import { EventsMap, Listener, ProgramEvents } from '../types';

export class EventsManager<
  P extends Program,
  Events extends Record<ProgramEvents, P> = Record<ProgramEvents, P>,
  TypedListener extends Listener<any> = Listener<Events[keyof Events]>
> {
  private events: EventsMap<Events> = new Map();

  constructor() {}

  on = <K extends keyof Events>(type: K, listener: TypedListener) => {
    const listeners = this.events.get(type);

    if (listeners) {
      listeners.push(listener);
    } else {
      this.events.set(type, [listener]);
    }
  };

  off = <K extends keyof Events>(type: K, listener?: TypedListener) => {
    const listeners = this.events.get(type);

    if (listeners) {
      if (listener) {
        listeners.splice(listeners.indexOf(listener) >>> 0, 1);
      } else {
        this.events.set(type, []);
      }
    }
  };

  emit = <K extends keyof Events>(type: K, data?: Events[K]) => {
    const listeners = this.events.get(type);

    if (listeners) {
      (listeners as Listener<typeof data>[]).forEach((l) => {
        l(data);
      });
    }
  };
}
