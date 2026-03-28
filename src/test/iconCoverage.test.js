import { describe, it, expect } from 'vitest';
import { azureServices } from '../data/azureServices';
import { readdirSync } from 'fs';
import { resolve } from 'path';

describe('icon coverage', () => {
  const iconDir = resolve(__dirname, '../../public/icons');
  const iconFiles = readdirSync(iconDir).filter(f => f.endsWith('.svg'));
  const iconIds = new Set(iconFiles.map(f => f.replace('.svg', '')));

  it('every service should have a corresponding icon file', () => {
    const missing = [];
    for (const svc of azureServices) {
      if (!iconIds.has(svc.id)) {
        missing.push(svc.id);
      }
    }
    expect(missing).toEqual([]);
  });

  it('icon directory should contain SVG files', () => {
    expect(iconFiles.length).toBeGreaterThan(40);
  });
});
