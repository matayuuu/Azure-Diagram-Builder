import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { getCategories } from '../data/azureServices';

export default function Sidebar() {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const categories = useMemo(() => getCategories(), []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    const result = {};
    for (const [cat, services] of Object.entries(categories)) {
      const filtered = services.filter(s =>
        s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      );
      if (filtered.length > 0) result[cat] = filtered;
    }
    return result;
  }, [categories, search]);

  const toggleCategory = (cat) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const onDragStart = (event, service) => {
    event.dataTransfer.setData('application/azure-service', JSON.stringify(service));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Azure Services</h2>
        <div className="search-input-wrapper">
          <Search />
          <input
            className="search-input"
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="sidebar-content">
        {Object.entries(filteredCategories).map(([category, services]) => (
          <div className="category-group" key={category}>
            <div
              className={`category-header${collapsed[category] ? ' collapsed' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <ChevronDown />
              <span>{category}</span>
            </div>
            <div className={`category-items${collapsed[category] ? ' hidden' : ''}`}>
              {services.map(service => (
                <div
                  key={service.id}
                  className="service-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, service)}
                  title={service.name}
                >
                  <div className="service-item-icon">
                    <img src={`/icons/${service.id}.svg`} alt={service.name} width={32} height={32} />
                  </div>
                  <span className="service-item-label">{service.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(filteredCategories).length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No services found
          </div>
        )}
      </div>
    </div>
  );
}
