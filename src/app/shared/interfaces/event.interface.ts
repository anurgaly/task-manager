import { FormControl } from '@angular/forms';

export type Event = {
  title: string;
  description: string;
  id: number | null;
};

export type Events = {
  hour: number;
  date: string;
  event: Event | null;
};

export type EventForm = {
  hour: FormControl<Date>;
  date: FormControl<Date>;
  title: FormControl<string>;
  description: FormControl<string>;
};
