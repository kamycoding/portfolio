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
    title: 'Kamycoding',
  },
  {
    path: 'legal-notice',
    component: LegalNotice,
    title: 'Legal Notice Kamycoding',
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicy,
    title: 'Privacy Policy Kamycoding',
  },
  {
    path: 'projects/:slug',
    component: ProjectDetail,
    canActivate: [projectDetailGuard],
    title: 'Project - Kamycoding',
  },
  {
    path: '**',
    component: NotFound,
    title: 'Not Found - Kamycoding',
  },
];
