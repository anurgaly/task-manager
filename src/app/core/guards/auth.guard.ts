import { CanActivate, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { map, Observable, take } from 'rxjs';
import { UserInfoInterface } from '../../shared/interfaces/user-info.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  #store = inject(StoreService);
  #router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.#store.userInfo.pipe(
      take(1),
      map((userInfo: UserInfoInterface) => {
        if (userInfo.firstName && userInfo.lastName) {
          return true;
        } else {
          this.#router.navigate(['']);
          return false;
        }
      }),
    );
  }
}
