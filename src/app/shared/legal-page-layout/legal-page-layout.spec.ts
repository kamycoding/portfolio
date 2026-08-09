import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { provideTestTranslateService, setTestLanguage } from '../../testing/i18n-testing';
import { LegalPageLayout } from './legal-page-layout';

@Component({
  imports: [LegalPageLayout],
  template: `
    <app-legal-page-layout title="Test Legal Page">
      <p data-testid="projected-content">Projected legal content</p>
    </app-legal-page-layout>
  `,
})
class TestHost {}

describe('LegalPageLayout', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideRouter([]), ...provideTestTranslateService()],
    }).compileComponents();

    await setTestLanguage(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('renders its signal-based title input', () => {
    const heading = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement | null;

    expect(heading?.textContent).toBe('Test Legal Page');
  });

  it('renders projected legal content', () => {
    const projectedContent = fixture.nativeElement.querySelector(
      '[data-testid="projected-content"]',
    ) as HTMLParagraphElement | null;

    expect(projectedContent?.textContent).toBe('Projected legal content');
  });
});
