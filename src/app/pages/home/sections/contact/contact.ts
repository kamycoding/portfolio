import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { take } from 'rxjs';

import type {
  ContactRequest,
  ContactSubmissionState,
} from '../../../../features/contact/contact.model';
import { ContactService } from '../../../../features/contact/contact.service';
import { BrandStamp } from '../../../../shared/ui/brand-stamp/brand-stamp';

const trimmedMinLength = (minimumLength: number): ValidatorFn => {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value.trim();

    return value.length >= minimumLength
      ? null
      : { trimmedMinLength: { minimumLength, actualLength: value.length } };
  };
};

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, BrandStamp, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  @ViewChild('formElement') private formElement?: ElementRef<HTMLFormElement>;
  @ViewChild('messageTextarea') private messageTextarea?: ElementRef<HTMLTextAreaElement>;

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);

  protected readonly submissionState = signal<ContactSubmissionState>('idle');
  protected readonly submitAttempted = signal(false);
  protected readonly responseMessage = signal('');

  protected readonly contactForm = this.formBuilder.group({
    name: ['', [Validators.required, trimmedMinLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, trimmedMinLength(10), Validators.maxLength(2000)]],
    privacyAccepted: [false, Validators.requiredTrue],
    company: [''],
  });

  protected hasVisibleError(
    controlName: 'name' | 'email' | 'message' | 'privacyAccepted',
  ): boolean {
    const control = this.contactForm.controls[controlName];

    return control.invalid && (control.touched || this.submitAttempted());
  }

  protected nameError(): string {
    const errors = this.contactForm.controls.name.errors;

    if (errors?.['required'] || errors?.['trimmedMinLength']) {
      return 'contact.fields.name.required';
    }

    return errors?.['maxlength'] ? 'contact.fields.name.maxlength' : '';
  }

  protected emailError(): string {
    const errors = this.contactForm.controls.email.errors;

    if (errors?.['required']) {
      return 'contact.fields.email.required';
    }

    return errors?.['email'] ? 'contact.fields.email.invalid' : 'contact.fields.email.maxlength';
  }

  protected messageError(): string {
    const errors = this.contactForm.controls.message.errors;

    if (errors?.['required'] || errors?.['trimmedMinLength']) {
      return 'contact.fields.message.required';
    }

    return errors?.['maxlength'] ? 'contact.fields.message.maxlength' : '';
  }

  protected growMessage(event: Event): void {
    const textarea = event.currentTarget as HTMLTextAreaElement;

    if (!textarea.value) {
      this.resetMessageHeight(textarea);
      return;
    }

    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  protected submit(): void {
    if (this.submissionState() === 'submitting') {
      return;
    }

    this.submitAttempted.set(true);
    this.normalizeFormValues();

    if (this.contactForm.invalid) {
      this.submissionState.set('invalid');
      this.contactForm.markAllAsTouched();
      this.focusFirstInvalidControl();
      return;
    }

    const rawValue = this.contactForm.getRawValue();
    const request: ContactRequest = {
      name: rawValue.name,
      email: rawValue.email,
      message: rawValue.message,
      privacyAccepted: rawValue.privacyAccepted,
      company: rawValue.company,
    };

    this.submissionState.set('submitting');
    this.responseMessage.set('contact.status.sending');

    this.contactService
      .submit(request)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.handleSubmissionError();
            return;
          }

          this.submissionState.set('success');
          this.responseMessage.set('contact.status.success');
          this.contactForm.reset();
          this.resetMessageHeight();
          this.submitAttempted.set(false);
        },
        error: () => this.handleSubmissionError(),
      });
  }

  private normalizeFormValues(): void {
    const { name, email, message } = this.contactForm.getRawValue();
    this.contactForm.patchValue(
      {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
      { emitEvent: false },
    );
    this.contactForm.updateValueAndValidity({ emitEvent: false });
  }

  private focusFirstInvalidControl(): void {
    queueMicrotask(() => {
      const invalidControl = this.formElement?.nativeElement.querySelector<HTMLElement>(
        'input.ng-invalid, textarea.ng-invalid',
      );
      invalidControl?.focus();
    });
  }

  private resetMessageHeight(textarea = this.messageTextarea?.nativeElement): void {
    textarea?.style.removeProperty('height');
  }

  private handleSubmissionError(): void {
    this.submissionState.set('server-error');
    this.responseMessage.set('contact.status.error');
  }
}
