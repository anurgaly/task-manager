import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EventAddDialogComponent } from '../../../../shared/ui/event-add-dialog/event-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { TimeSettingsService } from '../../../../shared/services/time-settings.service';
import { StoreService } from '../../../../core/store/store.service';

@Component({
  selector: 'app-header-line',
  templateUrl: './header-line.component.html',
  styleUrl: './header-line.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderLineComponent {
  timeSettingsService = inject(TimeSettingsService);
  $userInfo = inject(StoreService).userInfo;

  #dialog = inject(MatDialog);

  createNewEvent(selectedDate: string) {
    const dialogRef = this.#dialog.open(EventAddDialogComponent, {
      data: {
        hour: new Date().getHours(),
        date: selectedDate,
        event: {},
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe();
  }

  changeSelectedDate(selectedDate: string, day: number) {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + day);

    this.timeSettingsService.changeSelectedDate = date;
  }

  setTodayDate() {
    this.timeSettingsService.changeSelectedDate = new Date(
      this.timeSettingsService.currentDate,
    );
  }
}
