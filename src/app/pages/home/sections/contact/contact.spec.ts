import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../../../testing/i18n-testing';
import { Contact } from './contact';

describe('Contact', () => {
  let fixture: ComponentFixture<Contact>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ...provideTestTranslateService(),
      ],
    }).compileComponents();

    await setTestLanguage(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(Contact);
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('shows validation only after blur and keeps Send disabled while invalid', () => {
    const name = getControl<HTMLInputElement>('#contact-name');
    const submit = getControl<HTMLButtonElement>('.contact-form__submit');

    setValue(name, 'A');
    expect(fixture.nativeElement.textContent).not.toContain('Oops!');
    expect(submit.disabled).toBe(true);

    name.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Oops! It seems your name is missing.');
  });

  it('keeps an invalid value separate from its placeholder and validation message', () => {
    const message = getControl<HTMLTextAreaElement>('#contact-message');

    setValue(message, 'hey');
    message.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(message.value).toBe('hey');
    expect(message.placeholder).toContain('Hello Kamyar');
    expect(message.getAttribute('aria-describedby')).toBe('contact-message-error');
    expect(getControl<HTMLElement>('#contact-message-error').textContent).toContain(
      'What do you need to develop?',
    );
  });

  it('provides browser autofill and mobile-keyboard metadata', () => {
    const name = getControl<HTMLInputElement>('#contact-name');
    const email = getControl<HTMLInputElement>('#contact-email');

    expect(name.getAttribute('autocomplete')).toBe('name');
    expect(name.getAttribute('autocapitalize')).toBe('words');
    expect(email.getAttribute('autocomplete')).toBe('email');
    expect(email.getAttribute('inputmode')).toBe('email');
    expect(email.getAttribute('spellcheck')).toBe('false');
  });

  it('enables Send only when every field and privacy consent are valid', () => {
    fillValidTextFields();
    const submit = getControl<HTMLButtonElement>('.contact-form__submit');
    const privacy = getControl<HTMLInputElement>('#contact-privacy');

    expect(submit.disabled).toBe(true);

    privacy.click();
    fixture.detectChanges();

    expect(submit.disabled).toBe(false);
  });

  it('submits once and resets only after a confirmed success', () => {
    fillValidForm();
    submitForm();

    const requests = httpTesting.match('/api/contact');
    expect(requests).toHaveLength(1);
    expect(requests[0].request.body).toEqual({
      name: 'Kamyar Visitor',
      email: 'visitor@example.com',
      message: 'I would like to discuss a new Angular project.',
      privacyAccepted: true,
      company: '',
    });

    submitForm();
    expect(httpTesting.match('/api/contact')).toHaveLength(0);

    requests[0].flush({ success: true });
    fixture.detectChanges();

    expect(getControl<HTMLInputElement>('#contact-name').value).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Thank you! Your message has been sent.');
  });

  it('preserves form values when the server rejects the submission', () => {
    fillValidForm();
    submitForm();

    httpTesting
      .expectOne('/api/contact')
      .flush({ message: 'Please try again later.' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(getControl<HTMLInputElement>('#contact-name').value).toBe('Kamyar Visitor');
    expect(fixture.nativeElement.textContent).toContain(
      'Your message could not be sent. Please try again in a moment.',
    );
  });

  function fillValidTextFields(): void {
    setValue(getControl<HTMLInputElement>('#contact-name'), 'Kamyar Visitor');
    setValue(getControl<HTMLInputElement>('#contact-email'), 'visitor@example.com');
    setValue(
      getControl<HTMLTextAreaElement>('#contact-message'),
      'I would like to discuss a new Angular project.',
    );
  }

  function fillValidForm(): void {
    fillValidTextFields();
    getControl<HTMLInputElement>('#contact-privacy').click();
    fixture.detectChanges();
  }

  function submitForm(): void {
    getControl<HTMLFormElement>('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  function setValue(control: HTMLInputElement | HTMLTextAreaElement, value: string): void {
    control.value = value;
    control.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function getControl<T extends Element>(selector: string): T {
    const control = fixture.nativeElement.querySelector(selector) as T | null;
    expect(control).not.toBeNull();
    return control as T;
  }
});
