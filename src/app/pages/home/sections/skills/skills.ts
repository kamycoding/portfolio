import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import type { SkillItem } from './skills.model';

@Component({
  selector: 'app-skills',
  imports: [TranslatePipe],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  protected readonly isPeelCardOpen = signal(false);

  protected readonly skillItems = [
    {
      id: 'javascript',
      label: 'JavaScript',
      iconSrc: '/assets/skills/icons/Js.svg',
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      iconSrc: '/assets/skills/icons/Ts.svg',
    },
    {
      id: 'css',
      label: 'CSS',
      iconSrc: '/assets/skills/icons/CSS.svg',
    },
    {
      id: 'tailwind-css',
      label: 'Tailwind CSS',
      iconSrc: '/assets/skills/icons/Tailwind.svg',
    },
    {
      id: 'figma',
      label: 'Figma',
      iconSrc: '/assets/skills/icons/Figma.svg',
    },
    {
      id: 'angular',
      label: 'Angular',
      iconSrc: '/assets/skills/icons/Angular.svg',
    },
    {
      id: 'react',
      label: 'React',
      iconSrc: '/assets/skills/icons/React.svg',
    },
    {
      id: 'vuejs',
      label: 'Vue.js',
      iconSrc: '/assets/skills/icons/Vue.Js.svg',
    },
    {
      id: 'nextjs',
      label: 'Next.js',
      iconSrc: '/assets/skills/icons/Next.svg',
    },
    {
      id: 'nodejs',
      label: 'Node.js',
      iconSrc: '/assets/skills/icons/Node.svg',
    },
    {
      id: 'rest-api',
      label: 'REST API',
      iconSrc: '/assets/skills/icons/Rest-Api.svg',
    },
    {
      id: 'supabase',
      label: 'Supabase',
      iconSrc: '/assets/skills/icons/Supabase.svg',
    },
    {
      id: 'firebase',
      label: 'Firebase',
      iconSrc: '/assets/skills/icons/Firebase.svg',
    },
    {
      id: 'git',
      label: 'Git',
      iconSrc: '/assets/skills/icons/Git.svg',
    },
    {
      id: 'linux',
      label: 'Linux',
      iconSrc: '/assets/skills/icons/Linux.svg',
    },
  ] as const satisfies readonly SkillItem[];

  protected togglePeelCard(): void {
    this.isPeelCardOpen.update((isOpen) => !isOpen);
  }
}
