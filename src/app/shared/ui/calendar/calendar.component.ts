import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCard } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { TimeSettingsService } from '../../services/time-settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MatCalendar, MatDatepickerModule, MatCard, MatNativeDateModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  selectedDate: Date = new Date();

  private timeSettingsService = inject(TimeSettingsService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.timeSettingsService.selectedDate
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date: string) => {
        if (date) {
          this.selectedDate = new Date(date);
          this.cdr.markForCheck();
        }
      });
  }

  selectedDateChanged(date: Date | null) {
    if (date) {
      this.timeSettingsService.changeSelectedDate = date;
    }
  }
}
