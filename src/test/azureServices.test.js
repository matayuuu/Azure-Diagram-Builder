import { describe, it, expect } from 'vitest';
import { azureServices, getCategories, getServiceById } from '../data/azureServices';

describe('azureServices', () => {
  it('should have more than 80 services', () => {
    expect(azureServices.length).toBeGreaterThanOrEqual(80);
  });

  it('every service should have required fields', () => {
    for (const svc of azureServices) {
      expect(svc).toHaveProperty('id');
      expect(svc).toHaveProperty('name');
      expect(svc).toHaveProperty('category');
      expect(svc).toHaveProperty('color');
      expect(typeof svc.id).toBe('string');
      expect(typeof svc.name).toBe('string');
      expect(svc.id.length).toBeGreaterThan(0);
      expect(svc.name.length).toBeGreaterThan(0);
    }
  });

  it('should have no duplicate IDs', () => {
    const ids = azureServices.map(s => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('should cover all expected categories', () => {
    const cats = new Set(azureServices.map(s => s.category));
    const expected = ['Compute', 'Networking', 'Storage', 'Database', 'AI + ML', 'Security', 'Integration', 'IoT', 'DevOps', 'Management', 'General'];
    for (const cat of expected) {
      expect(cats.has(cat)).toBe(true);
    }
  });

  it('colors should be valid hex codes', () => {
    for (const svc of azureServices) {
      expect(svc.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('getCategories', () => {
  it('should return an object with category keys', () => {
    const cats = getCategories();
    expect(typeof cats).toBe('object');
    expect(Object.keys(cats).length).toBeGreaterThan(0);
  });

  it('each category should contain arrays of services', () => {
    const cats = getCategories();
    for (const [key, services] of Object.entries(cats)) {
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      for (const svc of services) {
        expect(svc.category).toBe(key);
      }
    }
  });

  it('total services across categories should match azureServices length', () => {
    const cats = getCategories();
    const total = Object.values(cats).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(azureServices.length);
  });
});

describe('getServiceById', () => {
  it('should find known services', () => {
    expect(getServiceById('vm')).toBeDefined();
    expect(getServiceById('vm').name).toBe('Virtual Machine');

    expect(getServiceById('aks')).toBeDefined();
    expect(getServiceById('aks').name).toBe('AKS');

    expect(getServiceById('openai')).toBeDefined();
    expect(getServiceById('openai').name).toBe('OpenAI Service');
  });

  it('should find newly added services', () => {
    expect(getServiceById('iot-hub')).toBeDefined();
    expect(getServiceById('bastion')).toBeDefined();
    expect(getServiceById('sentinel')).toBeDefined();
    expect(getServiceById('synapse')).toBeDefined();
    expect(getServiceById('container-registry')).toBeDefined();
    expect(getServiceById('ai-search')).toBeDefined();
  });

  it('should return undefined for non-existent ID', () => {
    expect(getServiceById('not-a-service')).toBeUndefined();
    expect(getServiceById('')).toBeUndefined();
  });
});
