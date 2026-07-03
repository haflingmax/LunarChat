import * as fs from 'fs';
import * as path from 'path';

const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');

const scanRoots = [
  path.join(repoRoot, 'client', 'src'),
  path.join(repoRoot, 'packages', 'client', 'src'),
];

const htmlForPattern = /<(?:label|Label)\b[^>]*\bhtmlFor=["']([^"']+)["'][^>]*>/g;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectTsxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'tests') {
        continue;
      }
      files.push(...collectTsxFiles(fullPath));
      continue;
    }

    if (
      entry.name.endsWith('.tsx') &&
      !entry.name.includes('.spec.') &&
      !entry.name.includes('.test.')
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('label associations', () => {
  it('keeps literal htmlFor values backed by a rendered id prop', () => {
    const missingAssociations: string[] = [];

    for (const filePath of scanRoots.flatMap(collectTsxFiles)) {
      const source = fs.readFileSync(filePath, 'utf8');
      const labels = [...source.matchAll(htmlForPattern)].map((match) => match[1]);

      for (const htmlFor of new Set(labels)) {
        const idPattern = new RegExp(`\\b(?:id|selectId)=["']${escapeRegExp(htmlFor)}["']`);
        if (!idPattern.test(source)) {
          missingAssociations.push(`${path.relative(repoRoot, filePath)} -> ${htmlFor}`);
        }
      }
    }

    expect(missingAssociations).toEqual([]);
  });

  it('does not generate dynamic parameter labels for missing control ids', () => {
    const dynamicCombobox = fs.readFileSync(
      path.join(
        repoRoot,
        'client',
        'src',
        'components',
        'SidePanel',
        'Parameters',
        'DynamicCombobox.tsx',
      ),
      'utf8',
    );
    const dynamicSlider = fs.readFileSync(
      path.join(
        repoRoot,
        'client',
        'src',
        'components',
        'SidePanel',
        'Parameters',
        'DynamicSlider.tsx',
      ),
      'utf8',
    );

    expect(dynamicCombobox).toContain('selectId={`${settingKey}-dynamic-combobox`}');
    expect(dynamicSlider).not.toContain('htmlFor={`${settingKey}-dynamic-setting`}');
  });
});
