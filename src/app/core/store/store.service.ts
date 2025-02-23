import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Events } from '../../shared/interfaces/event.interface';
import { TimeSettingsService } from '../../shared/services/time-settings.service';
import { UserInfoInterface } from '../../shared/interfaces/user-info.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private timeSettingsService = inject(TimeSettingsService);

  private $allEvents: BehaviorSubject<Map<string, Events>> =
    new BehaviorSubject(new Map<string, Events>());

  private $userInfo: BehaviorSubject<UserInfoInterface> =
    new BehaviorSubject<UserInfoInterface>({
      firstName: '',
      lastName: '',
    });

  readonly timeLine: number[] = Array.from({ length: 24 }, (_, i) => i);

  get userInfo() {
    return this.$userInfo.asObservable();
  }

  set changeUserInfo(data: UserInfoInterface) {
    this.$userInfo.next({ ...data });
  }

  get allEvents(): Observable<Map<string, Events>> {
    return this.$allEvents.asObservable();
  }

  moveEvent(previousKey: string, currentKey: string) {
    const allEvents = this.$allEvents.value;

    if (!allEvents.get(previousKey)) {
      return;
    }

    const eventByCurrentKey: Events | undefined = allEvents.get(currentKey);

    const eventByPreviousKey: Events | undefined = allEvents.get(previousKey);

    //move to target time and set time
    allEvents.set(currentKey, {
      ...eventByPreviousKey,
      hour: new Date(currentKey).getHours(),
    } as Events);

    if (!eventByCurrentKey) {
      allEvents.delete(previousKey);
    } else {
      //move to previous time and set time
      allEvents.set(previousKey, {
        ...eventByCurrentKey,
        hour: new Date(previousKey).getHours(),
      } as Events);
    }

    this.$allEvents.next(allEvents);
  }

  addNewEvent(data: Events) {
    if (!data.event) {
      return;
    }

    const key = this.timeSettingsService.getKeyByHour(data.date, data.hour);

    const allEvents = this.$allEvents.value;

    data.event.id = new Date().getTime();

    this.$allEvents.next(allEvents.set(key, data));
  }

  editEvent(data: Events, previousDate: string, previousHour: number) {
    if (!data.event) {
      return;
    }

    const previousKey = this.timeSettingsService.getKeyByHour(
      previousDate,
      previousHour,
    );
    const key = this.timeSettingsService.getKeyByHour(data.date, data.hour);

    const allEvents = this.$allEvents.value;

    allEvents.set(key, data);

    //removing previous event if date or time was changed
    if (key !== previousKey) {
      allEvents.delete(previousKey);
    }

    this.$allEvents.next(allEvents);
  }

  removeEvent(selectedDate: string, time: number) {
    const key = this.timeSettingsService.getKeyByHour(selectedDate, time);

    const allEvents = this.$allEvents.value;

    if (!allEvents.has(key)) return;

    allEvents.delete(key);
    this.$allEvents.next(allEvents);
  }
}
