import german from '../../../../public/i18n/de.json';
import english from '../../../../public/i18n/en.json';

describe('translation resources', () => {
  it('keeps English and German leaf-key structures in sync', () => {
    expect(collectLeafPaths(german)).toEqual(collectLeafPaths(english));
  });
});

function collectLeafPaths(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value)
    .flatMap(([key, nestedValue]) =>
      collectLeafPaths(nestedValue, prefix ? `${prefix}.${key}` : key),
    )
    .sort();
}
