// Azure service definitions with inline SVG icon components
// Each service has: id, name, category, and a color for the icon

export const azureServices = [
  // Compute
  { id: 'vm', name: 'Virtual Machine', category: 'Compute', color: '#0078D4' },
  { id: 'vm-scale-sets', name: 'VM Scale Sets', category: 'Compute', color: '#0078D4' },
  { id: 'app-service', name: 'App Service', category: 'Compute', color: '#0078D4' },
  { id: 'functions', name: 'Functions', category: 'Compute', color: '#F5A623' },
  { id: 'aks', name: 'AKS', category: 'Compute', color: '#326CE5' },
  { id: 'container-instances', name: 'Container Instances', category: 'Compute', color: '#0078D4' },
  { id: 'container-registry', name: 'Container Registry', category: 'Compute', color: '#0078D4' },
  { id: 'batch', name: 'Batch', category: 'Compute', color: '#0078D4' },
  { id: 'spring-apps', name: 'Spring Apps', category: 'Compute', color: '#6DB33F' },
  { id: 'service-fabric', name: 'Service Fabric', category: 'Compute', color: '#0078D4' },

  // Networking
  { id: 'vnet', name: 'Virtual Network', category: 'Networking', color: '#3B82F6' },
  { id: 'subnet', name: 'Subnet', category: 'Networking', color: '#3B82F6' },
  { id: 'load-balancer', name: 'Load Balancer', category: 'Networking', color: '#6D3A9C' },
  { id: 'app-gateway', name: 'App Gateway', category: 'Networking', color: '#6D3A9C' },
  { id: 'dns', name: 'DNS Zone', category: 'Networking', color: '#3B82F6' },
  { id: 'front-door', name: 'Front Door', category: 'Networking', color: '#0078D4' },
  { id: 'firewall', name: 'Firewall', category: 'Networking', color: '#E74C3C' },
  { id: 'traffic-manager', name: 'Traffic Manager', category: 'Networking', color: '#0078D4' },
  { id: 'cdn', name: 'CDN', category: 'Networking', color: '#0078D4' },
  { id: 'vpn-gateway', name: 'VPN Gateway', category: 'Networking', color: '#3B82F6' },
  { id: 'expressroute', name: 'ExpressRoute', category: 'Networking', color: '#3B82F6' },
  { id: 'nat-gateway', name: 'NAT Gateway', category: 'Networking', color: '#3B82F6' },
  { id: 'bastion', name: 'Bastion', category: 'Networking', color: '#0078D4' },
  { id: 'nsg', name: 'NSG', category: 'Networking', color: '#3B82F6' },
  { id: 'ddos-protection', name: 'DDoS Protection', category: 'Networking', color: '#3B82F6' },
  { id: 'waf', name: 'WAF', category: 'Networking', color: '#E74C3C' },
  { id: 'private-link', name: 'Private Link', category: 'Networking', color: '#3B82F6' },
  { id: 'virtual-wan', name: 'Virtual WAN', category: 'Networking', color: '#3B82F6' },
  { id: 'public-ip', name: 'Public IP', category: 'Networking', color: '#3B82F6' },

  // Storage
  { id: 'storage-account', name: 'Storage Account', category: 'Storage', color: '#0078D4' },
  { id: 'blob-storage', name: 'Blob Storage', category: 'Storage', color: '#0078D4' },
  { id: 'disk', name: 'Managed Disk', category: 'Storage', color: '#0078D4' },
  { id: 'file-storage', name: 'File Storage', category: 'Storage', color: '#0078D4' },

  // Database
  { id: 'sql-database', name: 'SQL Database', category: 'Database', color: '#0078D4' },
  { id: 'sql-managed-instance', name: 'SQL Managed Instance', category: 'Database', color: '#0078D4' },
  { id: 'cosmos-db', name: 'Cosmos DB', category: 'Database', color: '#0078D4' },
  { id: 'redis-cache', name: 'Redis Cache', category: 'Database', color: '#D82C20' },
  { id: 'mysql', name: 'MySQL', category: 'Database', color: '#0078D4' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', color: '#0078D4' },
  { id: 'mariadb', name: 'MariaDB', category: 'Database', color: '#0078D4' },
  { id: 'synapse', name: 'Synapse Analytics', category: 'Database', color: '#0078D4' },
  { id: 'data-explorer', name: 'Data Explorer', category: 'Database', color: '#0078D4' },
  { id: 'data-factory', name: 'Data Factory', category: 'Database', color: '#0078D4' },

  // AI + ML
  { id: 'cognitive-services', name: 'Cognitive Services', category: 'AI + ML', color: '#0078D4' },
  { id: 'machine-learning', name: 'Machine Learning', category: 'AI + ML', color: '#0078D4' },
  { id: 'openai', name: 'OpenAI Service', category: 'AI + ML', color: '#10A37F' },
  { id: 'bot-service', name: 'Bot Service', category: 'AI + ML', color: '#0078D4' },
  { id: 'ai-search', name: 'AI Search', category: 'AI + ML', color: '#0078D4' },
  { id: 'ai-studio', name: 'AI Studio', category: 'AI + ML', color: '#0078D4' },
  { id: 'computer-vision', name: 'Computer Vision', category: 'AI + ML', color: '#0078D4' },
  { id: 'speech-services', name: 'Speech Services', category: 'AI + ML', color: '#0078D4' },
  { id: 'content-safety', name: 'Content Safety', category: 'AI + ML', color: '#0078D4' },
  { id: 'form-recognizer', name: 'Form Recognizer', category: 'AI + ML', color: '#0078D4' },
  { id: 'anomaly-detector', name: 'Anomaly Detector', category: 'AI + ML', color: '#0078D4' },
  { id: 'translator', name: 'Translator', category: 'AI + ML', color: '#0078D4' },

  // Security
  { id: 'key-vault', name: 'Key Vault', category: 'Security', color: '#F5A623' },
  { id: 'active-directory', name: 'Entra ID', category: 'Security', color: '#0078D4' },
  { id: 'managed-identity', name: 'Managed Identity', category: 'Security', color: '#0078D4' },
  { id: 'security-center', name: 'Defender', category: 'Security', color: '#0078D4' },
  { id: 'defender-cloud', name: 'Defender for Cloud', category: 'Security', color: '#0078D4' },
  { id: 'sentinel', name: 'Sentinel', category: 'Security', color: '#0078D4' },

  // Integration
  { id: 'api-management', name: 'API Management', category: 'Integration', color: '#6D3A9C' },
  { id: 'service-bus', name: 'Service Bus', category: 'Integration', color: '#C4A000' },
  { id: 'event-hub', name: 'Event Hub', category: 'Integration', color: '#0078D4' },
  { id: 'logic-apps', name: 'Logic Apps', category: 'Integration', color: '#0078D4' },
  { id: 'event-grid', name: 'Event Grid', category: 'Integration', color: '#0078D4' },
  { id: 'app-configuration', name: 'App Configuration', category: 'Integration', color: '#0078D4' },
  { id: 'notification-hub', name: 'Notification Hub', category: 'Integration', color: '#0078D4' },

  // IoT
  { id: 'iot-hub', name: 'IoT Hub', category: 'IoT', color: '#0078D4' },
  { id: 'iot-central', name: 'IoT Central', category: 'IoT', color: '#0078D4' },
  { id: 'iot-edge', name: 'IoT Edge', category: 'IoT', color: '#0078D4' },
  { id: 'digital-twins', name: 'Digital Twins', category: 'IoT', color: '#0078D4' },
  { id: 'stream-analytics', name: 'Stream Analytics', category: 'IoT', color: '#0078D4' },
  { id: 'maps', name: 'Azure Maps', category: 'IoT', color: '#0078D4' },

  // DevOps & Monitoring
  { id: 'devops', name: 'DevOps', category: 'DevOps', color: '#0078D4' },
  { id: 'monitor', name: 'Monitor', category: 'DevOps', color: '#0078D4' },
  { id: 'app-insights', name: 'App Insights', category: 'DevOps', color: '#6D3A9C' },
  { id: 'log-analytics', name: 'Log Analytics', category: 'DevOps', color: '#0078D4' },
  { id: 'advisor', name: 'Advisor', category: 'DevOps', color: '#0078D4' },
  { id: 'automation', name: 'Automation', category: 'DevOps', color: '#0078D4' },

  // Management
  { id: 'policy', name: 'Policy', category: 'Management', color: '#0078D4' },
  { id: 'arc', name: 'Azure Arc', category: 'Management', color: '#0078D4' },
  { id: 'cost-management', name: 'Cost Management', category: 'Management', color: '#0078D4' },

  // General
  { id: 'resource-group', name: 'Resource Group', category: 'General', color: '#7F8C8D' },
  { id: 'subscription', name: 'Subscription', category: 'General', color: '#F5A623' },
  { id: 'user', name: 'User', category: 'General', color: '#0078D4' },
  { id: 'internet', name: 'Internet', category: 'General', color: '#27AE60' },
];

export function getCategories() {
  const cats = {};
  for (const svc of azureServices) {
    if (!cats[svc.category]) cats[svc.category] = [];
    cats[svc.category].push(svc);
  }
  return cats;
}

export function getServiceById(id) {
  return azureServices.find(s => s.id === id);
}
