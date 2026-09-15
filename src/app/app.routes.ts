import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { projectDetailGuard } from './pages/project-detail/project-detail.guard';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'KamyCoding',
  },
  {
    path: 'legal-notice',
    component: LegalNotice,
    data: { titleKey: 'pageTitles.legalNotice' },
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicy,
    data: { titleKey: 'pageTitles.privacyPolicy' },
  },
  {
    path: 'projects/:slug',
    component: ProjectDetail,
    canActivate: [projectDetailGuard],
  },
  {
    path: '**',
    component: NotFound,
    data: { titleKey: 'pageTitles.notFound' },
  },
];
