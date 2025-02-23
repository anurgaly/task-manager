import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoreService } from '../../../../core/store/store.service';
import { FilterEventsService } from '../../../../shared/services/filter-events.service';
import { TimeSettingsService } from '../../../../shared/services/time-settings.service';
import { Events } from '../../../../shared/interfaces/event.interface';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent {
  protected filterEventsService = inject(FilterEventsService);
  protected $allEvents = inject(StoreService).allEvents;
  protected $selectedDate = inject(TimeSettingsService).selectedDate;

  getNumberOfEvents(
    allEvents: Map<string, Events>,
    selectedDate: string,
  ): number {
    return this.filterEventsService.filterEventsBySelectedDay(
      allEvents,
      selectedDate,
    ).size;
  }
}
