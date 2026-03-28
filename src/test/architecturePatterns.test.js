import { describe, it, expect } from 'vitest';
import { architecturePatterns, calculateLayout } from '../data/architecturePatterns';
import { azureServices } from '../data/azureServices';

describe('architecturePatterns', () => {
  const patternKeys = Object.keys(architecturePatterns);

  it('should have 8 patterns', () => {
    expect(patternKeys.length).toBe(8);
  });

  it('every pattern should have required fields', () => {
    for (const key of patternKeys) {
      const p = architecturePatterns[key];
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('description');
      expect(p).toHaveProperty('tags');
      expect(p).toHaveProperty('wellArchitected');
      expect(p).toHaveProperty('nodes');
      expect(p).toHaveProperty('edges');
      expect(Array.isArray(p.tags)).toBe(true);
      expect(Array.isArray(p.nodes)).toBe(true);
      expect(Array.isArray(p.edges)).toBe(true);
    }
  });

  it('every node should reference a valid serviceId', () => {
    const serviceIds = new Set(azureServices.map(s => s.id));
    for (const key of patternKeys) {
      const p = architecturePatterns[key];
      for (const node of p.nodes) {
        expect(serviceIds.has(node.serviceId)).toBe(true);
      }
    }
  });

  it('every node should have a tier', () => {
    for (const key of patternKeys) {
      const p = architecturePatterns[key];
      for (const node of p.nodes) {
        expect(node).toHaveProperty('tier');
        expect(typeof node.tier).toBe('string');
      }
    }
  });

  it('edge indices should be within bounds of nodes array', () => {
    for (const key of patternKeys) {
      const p = architecturePatterns[key];
      for (const edge of p.edges) {
        expect(edge.from).toBeGreaterThanOrEqual(0);
        expect(edge.from).toBeLessThan(p.nodes.length);
        expect(edge.to).toBeGreaterThanOrEqual(0);
        expect(edge.to).toBeLessThan(p.nodes.length);
      }
    }
  });

  it('wellArchitected should have 5 pillars', () => {
    const pillars = ['reliability', 'security', 'costOptimization', 'operationalExcellence', 'performanceEfficiency'];
    for (const key of patternKeys) {
      const wa = architecturePatterns[key].wellArchitected;
      for (const pillar of pillars) {
        expect(wa).toHaveProperty(pillar);
        expect(typeof wa[pillar]).toBe('string');
      }
    }
  });
});

describe('calculateLayout', () => {
  it('should return positions for every node', () => {
    for (const key of Object.keys(architecturePatterns)) {
      const pattern = architecturePatterns[key];
      const positions = calculateLayout(pattern);
      expect(positions.length).toBe(pattern.nodes.length);
      for (let i = 0; i < pattern.nodes.length; i++) {
        expect(positions[i]).toHaveProperty('x');
        expect(positions[i]).toHaveProperty('y');
        expect(typeof positions[i].x).toBe('number');
        expect(typeof positions[i].y).toBe('number');
      }
    }
  });

  it('should produce a balanced grid (not a single column)', () => {
    // For patterns with 7+ nodes, there should be multiple columns
    const pattern = architecturePatterns['web-app-ha']; // 11 nodes
    const positions = calculateLayout(pattern);
    const xValues = new Set(positions.map(p => p.x));
    // With 11 nodes ≈ ceil(sqrt(16.5)) = 5 cols, should have multiple distinct X
    expect(xValues.size).toBeGreaterThan(2);
  });

  it('should produce a grid wider than tall for square-ish nodes count', () => {
    const pattern = architecturePatterns['data-pipeline']; // 8 nodes
    const positions = calculateLayout(pattern);
    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    // Width should be >= height for balanced layout
    expect(width).toBeGreaterThanOrEqual(height);
  });

  it('no two nodes should share the exact same position', () => {
    for (const key of Object.keys(architecturePatterns)) {
      const pattern = architecturePatterns[key];
      const positions = calculateLayout(pattern);
      const posStrings = positions.map(p => `${p.x},${p.y}`);
      const unique = new Set(posStrings);
      expect(unique.size).toBe(positions.length);
    }
  });
});
