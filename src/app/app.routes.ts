import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserAuthComponent } from './pages/user-auth/user-auth.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => UserAuthComponent,
    pathMatch: 'full',
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
