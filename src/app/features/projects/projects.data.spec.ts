import { HOMEPAGE_PROJECTS, getNextProject, getProjectBySlug } from './projects.data';

describe('project data helpers', () => {
  it('looks up every supported project slug', () => {
    expect(getProjectBySlug('heldio')?.title).toBe('Heldio');
    expect(getProjectBySlug('join')?.title).toBe('Join');
    expect(getProjectBySlug('sogand-personal-website')?.title).toBe('Portfolio Website');
    expect(getProjectBySlug('el-pollo-loco')?.title).toBe('El Pollo Loco');
  });

  it('provides complete detail copy and duration for every project', () => {
    for (const slug of ['heldio', 'join', 'sogand-personal-website', 'el-pollo-loco']) {
      const project = getProjectBySlug(slug);

      expect(project?.descriptionKey).toMatch(/^projects\.items\./);
      expect(project?.implementationDetailsKey).toMatch(/^projects\.items\./);
      expect(project?.durationKey).toMatch(/^projects\.items\./);
      expect(project?.technologies.every((technology) => technology.icon)).toBe(true);
    }
  });

  it('provides exactly four homepage projects in the intended order', () => {
    expect(HOMEPAGE_PROJECTS.map((project) => project.title)).toEqual([
      'Heldio',
      'Join',
      'Portfolio Website',
      'El Pollo Loco',
    ]);
    expect(HOMEPAGE_PROJECTS[0].variant).toBe('featured');
  });

  it('returns undefined for an unsupported slug', () => {
    expect(getProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('describes the production Join stack and links without Firebase', () => {
    const join = getProjectBySlug('join');

    expect(join?.technologies.map((technology) => technology.label)).toEqual([
      'Angular',
      'TypeScript',
      'SCSS',
      'Supabase',
      'PostgreSQL',
      'RxJS',
      'Angular CDK',
    ]);
    expect(join?.githubUrl).toBe('https://github.com/kamycoding/join-kanban');
    expect(join?.liveUrl).toBe('https://join.kamycoding.com');
  });

  it('preserves the El Pollo Loco stack and production links', () => {
    const project = getProjectBySlug('el-pollo-loco');

    expect(project?.technologies.map((technology) => technology.label)).toEqual([
      'JavaScript',
      'HTML',
      'CSS',
    ]);
    expect(project?.githubUrl).toBe('https://github.com/kamycoding/El-Pollo-Loco');
    expect(project?.liveUrl).toBe('https://elpolloloco.kamycoding.com');
  });

  it('uses the accepted representative Heldio stack without inventing external URLs', () => {
    const project = getProjectBySlug('heldio');

    expect(project?.technologies.map((technology) => technology.label)).toEqual([
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'NestJS',
      'PostgreSQL',
    ]);
    expect(project?.technologiesLabelKey).toBe('projects.currentStack');
    expect(project?.githubUrl).toBeUndefined();
    expect(project?.liveUrl).toBe('https://heldio.app/');
  });

  it('uses the verified Sogand stack and live URL without a public repository', () => {
    const project = getProjectBySlug('sogand-personal-website');

    expect(project?.technologies.map((technology) => technology.label)).toEqual([
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
    ]);
    expect(project?.githubUrl).toBeUndefined();
    expect(project?.liveUrl).toBe('https://www.sogandasari.com/');
  });

  it('provides an Iconify name and no local icon source for every homepage technology', () => {
    const technologies = HOMEPAGE_PROJECTS.flatMap((project) => project.technologies);

    expect(technologies).toHaveLength(21);
    expect(
      technologies.every((technology) => /^(devicon|logos):[\w-]+$/.test(technology.icon)),
    ).toBe(true);
    expect(technologies.every((technology) => !('iconSrc' in technology))).toBe(true);
  });

  it('uses the approved Iconify mapping for every technology', () => {
    const iconByLabel = Object.fromEntries(
      HOMEPAGE_PROJECTS.flatMap((project) => project.technologies).map((technology) => [
        technology.label,
        technology.icon,
      ]),
    );

    expect(iconByLabel).toEqual({
      Angular: 'devicon:angular',
      'Angular CDK': 'devicon:angular',
      CSS: 'devicon:css3',
      'Framer Motion': 'logos:framer',
      HTML: 'devicon:html5',
      JavaScript: 'devicon:javascript',
      NestJS: 'devicon:nestjs',
      'Next.js': 'devicon:nextjs',
      PostgreSQL: 'devicon:postgresql',
      React: 'devicon:react',
      RxJS: 'devicon:rxjs',
      SCSS: 'devicon:sass',
      Supabase: 'devicon:supabase',
      'Tailwind CSS': 'devicon:tailwindcss',
      TypeScript: 'devicon:typescript',
    });
  });

  it('keeps the approved technology count for each homepage project', () => {
    expect(getProjectBySlug('heldio')?.technologies).toHaveLength(6);
    expect(getProjectBySlug('join')?.technologies).toHaveLength(7);
    expect(getProjectBySlug('sogand-personal-website')?.technologies).toHaveLength(5);
    expect(getProjectBySlug('el-pollo-loco')?.technologies).toHaveLength(3);
  });

  it('keeps next-project navigation in the intended cyclic order', () => {
    expect(getNextProject('heldio').slug).toBe('join');
    expect(getNextProject('join').slug).toBe('sogand-personal-website');
    expect(getNextProject('sogand-personal-website').slug).toBe('el-pollo-loco');
    expect(getNextProject('el-pollo-loco').slug).toBe('heldio');
  });
});
