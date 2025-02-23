import { Injectable } from '@angular/core';
import { Events } from '../interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class FilterEventsService {
  filterEventsBySelectedDay(
    allEvents: Map<string, Events>,
    selectedDay: string,
  ): Map<string, Events> {
    if (!(allEvents?.size && selectedDay)) {
      return new Map<string, Events>();
    }

    return new Map(
      [...allEvents].filter(([key, _]) => key.includes(selectedDay)),
    );
  }
}
