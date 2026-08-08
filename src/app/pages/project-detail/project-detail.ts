import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { getNextProject, getProjectBySlug } from '../../features/projects/projects.data';
import { BrandStamp } from '../../shared/ui/brand-stamp/brand-stamp';
import { CtaLink } from '../../shared/ui/cta-link/cta-link';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, CtaLink, BrandStamp],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly pageTitle = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((parameters) => parameters.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') },
  );

  protected readonly project = computed(() => getProjectBySlug(this.slug()));
  protected readonly nextProject = computed(() => {
    const project = this.project();

    return project ? getNextProject(project.slug) : undefined;
  });

  constructor() {
    this.document.body.classList.add('project-detail-active');
    this.destroyRef.onDestroy(() => this.document.body.classList.remove('project-detail-active'));

    effect(() => {
      const project = this.project();

      if (project) this.pageTitle.setTitle(`${project.title} | KamyCoding`);
    });
  }
}
