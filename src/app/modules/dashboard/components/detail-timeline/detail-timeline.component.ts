import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Events } from '../../../../shared/interfaces/event.interface';
import { StoreService } from '../../../../core/store/store.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimeSettingsService } from '../../../../shared/services/time-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { EventAddDialogComponent } from '../../../../shared/ui/event-add-dialog/event-add-dialog.component';
import { take } from 'rxjs';
import { FilterEventsService } from '../../../../shared/services/filter-events.service';

@Component({
  selector: 'app-detail-timeline',
  templateUrl: './detail-timeline.component.html',
  styleUrl: './detail-timeline.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailTimelineComponent implements OnInit {
  private timeSettingsService = inject(TimeSettingsService);
  private store = inject(StoreService);
  private destroy = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private filterEventsService = inject(FilterEventsService);

  private $selectedDate = this.timeSettingsService.selectedDate;

  selectedDate: string = '';

  allEvents!: Map<string, Events>;
  events!: Map<string, Events>;
  timeLine!: number[];

  constructor() {
    this.timeLine = this.store.timeLine;
  }

  ngOnInit(): void {
    this.$selectedDate
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((date) => {
        this.selectedDate = date;

        this.events = this.filterEventsService.filterEventsBySelectedDay(
          this.allEvents,
          this.selectedDate,
        );

        this.cdr.markForCheck();
      });

    this.store.allEvents
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((events) => {
        this.allEvents = events;

        this.events = this.filterEventsService.filterEventsBySelectedDay(
          this.allEvents,
          this.selectedDate,
        );

        this.cdr.markForCheck();
      });
  }

  drop(event: CdkDragDrop<number[]>) {
    const previousKey = this.timeSettingsService.getKeyByHour(
      this.selectedDate,
      event.previousIndex,
    );
    const currentKey = this.timeSettingsService.getKeyByHour(
      this.selectedDate,
      event.currentIndex,
    );

    this.store.moveEvent(previousKey, currentKey);
  }

  getEventByHour(time: number): Events | null {
    const key = this.timeSettingsService.getKeyByHour(this.selectedDate, time);
    return this.events?.get(key) ?? null;
  }

  removeEvent(time: number) {
    this.store.removeEvent(this.selectedDate, time);
  }

  editEvent(time: number) {
    const key = this.timeSettingsService.getKeyByHour(this.selectedDate, time);

    const dialogRef = this.dialog.open(EventAddDialogComponent, {
      data: {
        ...this.events.get(key),
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe();
  }
}
