import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'azure-diagram-builder-diagrams';

export function useDiagramStorage() {
  const [savedDiagrams, setSavedDiagrams] = useState([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) setSavedDiagrams(JSON.parse(data));
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveDiagram = useCallback((name, nodes, edges) => {
    const diagram = {
      id: crypto.randomUUID(),
      name,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedDiagrams(prev => {
      const updated = [diagram, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return diagram;
  }, []);

  const updateDiagram = useCallback((id, name, nodes, edges) => {
    setSavedDiagrams(prev => {
      const updated = prev.map(d =>
        d.id === id
          ? { ...d, name, nodes, edges, updatedAt: new Date().toISOString() }
          : d
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteDiagram = useCallback((id) => {
    setSavedDiagrams(prev => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getDiagram = useCallback((id) => {
    return savedDiagrams.find(d => d.id === id);
  }, [savedDiagrams]);

  return { savedDiagrams, saveDiagram, updateDiagram, deleteDiagram, getDiagram };
}
