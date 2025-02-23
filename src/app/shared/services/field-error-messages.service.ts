import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FieldErrorMessagesService {
  getErrorMessage(errors: Record<string, any>): string {
    if (!errors) return '';
    if (errors['required']) return 'This field is required.';
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength} characters.`;
    if (errors['maxlength'])
      return `Maximum length is ${errors['maxlength'].requiredLength} characters.`;
    return 'Invalid input';
  }
}
