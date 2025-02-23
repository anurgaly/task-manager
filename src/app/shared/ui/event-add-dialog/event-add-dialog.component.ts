import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { EventForm, Events } from '../../interfaces/event.interface';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerModule,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { DialogRef } from '@angular/cdk/dialog';
import { StoreService } from '../../../core/store/store.service';
import { TimeSettingsService } from '../../services/time-settings.service';
import { FieldErrorMessagesService } from '../../services/field-error-messages.service';

@Component({
  selector: 'app-event-add-dialog',

  templateUrl: './event-add-dialog.component.html',
  styleUrl: './event-add-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatInput,
    MatButton,
    MatDialogClose,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatTimepickerInput,
    MatTimepicker,
    MatTimepickerToggle,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class EventAddDialogComponent {
  form!: FormGroup<EventForm>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Events,
    private fb: FormBuilder,
    private dialogRef: DialogRef,
    private store: StoreService,
    private timeSettings: TimeSettingsService,
    private fieldErrorMessagesService: FieldErrorMessagesService,
  ) {
    this.initForm();
  }

  getErrorMessage(error: ValidationErrors | null): string {
    if (!error) {
      return '';
    }

    return this.fieldErrorMessagesService.getErrorMessage(error);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    const newEvent: Events = {
      hour: formData.hour?.getHours() ?? 0,
      date: this.timeSettings.getDailyFormat(
        new Date(formData.date ?? new Date()),
      ),
      event: {
        title: formData.title ?? '',
        description: formData.description ?? '',
        id: this.data.event?.id ?? null,
      },
    };

    if (!newEvent.event?.id) {
      //create new event
      this.store.addNewEvent(newEvent);
    } else {
      //edit event
      this.store.editEvent(newEvent, this.data.date, this.data.hour);
    }

    this.dialogRef.close(this.form.value);
  }

  private initForm() {
    this.form = this.fb.group({
      hour: this.fb.control(
        (() => {
          const date = this.data.date ? new Date(this.data.date) : new Date();
          date.setHours(this.data.hour ?? 0, 0, 0, 0);
          return date;
        })(),
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: this.fb.control(
        this.data.date ? new Date(this.data.date) : new Date(),
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: this.fb.control(this.data.event?.title ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      }),
      description: this.fb.control(this.data.event?.description ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      }),
    });
  }
}
