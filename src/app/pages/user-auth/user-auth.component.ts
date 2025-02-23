import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoInterface } from '../../shared/interfaces/user-info.interface';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldErrorMessagesService } from '../../shared/services/field-error-messages.service';
import { StoreService } from '../../core/store/store.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatError,
    MatLabel,
    MatFormField,
    MatInput,
  ],
})
export class UserAuthComponent {
  fieldErrorMessagesService: FieldErrorMessagesService = inject(
    FieldErrorMessagesService,
  );
  #route: Router = inject(Router);
  #fb: FormBuilder = inject(FormBuilder);
  #storeService = inject(StoreService);

  form: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
  }>;

  constructor() {
    this.form = this.#fb.group({
      firstName: this.#fb.control('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ],
      }),
      lastName: this.#fb.control('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ],
      }),
    });
  }

  getErrorMessage(error: ValidationErrors | null): string {
    if (!error) {
      return '';
    }

    return this.fieldErrorMessagesService.getErrorMessage(error);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.#storeService.changeUserInfo = this.form.value as UserInfoInterface;

    this.#route.navigate(['calendar']);
  }
}
