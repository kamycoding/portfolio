import { getNextProject, getProjectBySlug } from './projects.data';

describe('project data helpers', () => {
  it('looks up every supported project slug', () => {
    expect(getProjectBySlug('join')?.title).toBe('Join');
    expect(getProjectBySlug('el-pollo-loco')?.title).toBe('El Pollo Loco');
    expect(getProjectBySlug('dabubble')?.title).toBe('DABubble');
  });

  it('provides complete detail copy, duration, and technologies for every project', () => {
    for (const slug of ['join', 'el-pollo-loco', 'dabubble']) {
      const project = getProjectBySlug(slug);

      expect(project?.descriptionKey).toMatch(/^projects\.items\./);
      expect(project?.implementationDetailsKey).toMatch(/^projects\.items\./);
      expect(project?.durationKey).toMatch(/^projects\.items\./);
      expect(project?.technologies.length).toBeGreaterThan(0);
      expect(project?.technologies.every((technology) => technology.iconSrc)).toBe(true);
    }
  });

  it('returns undefined for an unsupported slug', () => {
    expect(getProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('keeps next-project navigation in the intended cyclic order', () => {
    expect(getNextProject('join').slug).toBe('el-pollo-loco');
    expect(getNextProject('el-pollo-loco').slug).toBe('dabubble');
    expect(getNextProject('dabubble').slug).toBe('join');
  });
});
