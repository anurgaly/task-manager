import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeTransform',
  standalone: true,
})
export class TimeTransformPipe implements PipeTransform {
  transform(value: number): string {
    return `${value.toString()}:00`;
  }
}
