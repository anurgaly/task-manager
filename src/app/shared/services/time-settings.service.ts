import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeSettingsService {
  #currentDate: string = this.getDailyFormat(new Date());
  private $selectedDate: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.#currentDate,
  );

  get currentDate(): string {
    return this.#currentDate;
  }

  get selectedDate(): Observable<string> {
    return this.$selectedDate.asObservable();
  }

  set changeSelectedDate(value: Date) {
    this.$selectedDate.next(this.getDailyFormat(value));
  }

  getDailyFormat(date: Date): string {
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы с 0, поэтому +1
    const year: number = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  getKeyByHour(selectedDate: string, hour: number): string {
    return `${selectedDate} ${hour}:00:00`;
  }
}
