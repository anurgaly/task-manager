import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DetailTimelineComponent } from './components/detail-timeline/detail-timeline.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderLineComponent } from './components/header-line/header-line.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TimeTransformPipe } from '../../shared/pipes/time-transform.pipe';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CalendarComponent } from '../../shared/ui/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    SideBarComponent,
    DetailTimelineComponent,
    HeaderLineComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CdkDropList,
    TimeTransformPipe,
    FormsModule,
    CdkDrag,
    NgIf,
    MatIconButton,
    MatIcon,
    MatButton,
    AsyncPipe,
    DatePipe,
    CalendarComponent,
  ],
})
export class DashboardModule {}
