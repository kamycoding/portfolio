import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getProjectBySlug } from '../../features/projects/projects.data';

export const projectDetailGuard: CanActivateFn = (route) => {
  const project = getProjectBySlug(route.paramMap.get('slug'));

  return project ? true : inject(Router).createUrlTree(['/not-found']);
};
