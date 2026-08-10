import { routes } from './app.routes';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { NotFound } from './pages/not-found/not-found';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';

describe('application routes', () => {
  it('keeps both legal routes and the wildcard route unchanged', () => {
    expect(routes.find((route) => route.path === 'legal-notice')?.component).toBe(LegalNotice);
    expect(routes.find((route) => route.path === 'privacy-policy')?.component).toBe(PrivacyPolicy);
    expect(routes.find((route) => route.path === '**')?.component).toBe(NotFound);
  });
});
