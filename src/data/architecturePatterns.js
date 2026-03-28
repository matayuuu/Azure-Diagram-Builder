// Azure Well-Architected reference architecture patterns
// Based on: Azure Well-Architected Framework, Azure Architecture Center
// Each pattern defines nodes, edges, and layout for common Azure solutions

export const architecturePatterns = {
  'web-app-basic': {
    name: 'Basic Web Application',
    description: 'Simple web app with App Service, SQL Database, and CDN',
    tags: ['web', 'website', 'webapp', 'simple', 'basic', 'blog', 'cms', 'ホームページ', 'ウェブサイト'],
    wellArchitected: {
      reliability: 'Single region. Add Traffic Manager or Front Door for multi-region.',
      security: 'Entra ID for auth. Key Vault for secrets. HTTPS enforced.',
      costOptimization: 'App Service Basic/Standard tier. SQL DTU model for small workloads.',
      operationalExcellence: 'App Insights for monitoring. Deployment slots for zero-downtime.',
      performanceEfficiency: 'CDN for static assets. Redis Cache for session state.',
    },
    nodes: [
      { serviceId: 'internet', label: 'Users', tier: 'client' },
      { serviceId: 'front-door', label: 'Azure Front Door', tier: 'ingress' },
      { serviceId: 'app-service', label: 'App Service', tier: 'compute' },
      { serviceId: 'sql-database', label: 'SQL Database', tier: 'data' },
      { serviceId: 'blob-storage', label: 'Blob Storage', tier: 'storage' },
      { serviceId: 'key-vault', label: 'Key Vault', tier: 'security' },
      { serviceId: 'app-insights', label: 'Application Insights', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ],
  },

  'web-app-ha': {
    name: 'High Availability Web Application',
    description: 'Multi-region web app with failover, caching, and WAF',
    tags: ['ha', 'high availability', '高可用性', 'multi-region', 'マルチリージョン', 'failover', 'redundant'],
    wellArchitected: {
      reliability: 'Multi-region active-passive with Front Door routing. Auto-failover.',
      security: 'WAF on Front Door. Entra ID auth. Private endpoints for backend.',
      costOptimization: 'Use Traffic Manager for DNS failover (cheaper than Front Door if WAF not needed).',
      operationalExcellence: 'Deployment to both regions. Health probes for auto-failover.',
      performanceEfficiency: 'Redis Cache for session state. CDN for static content.',
    },
    nodes: [
      { serviceId: 'internet', label: 'Users', tier: 'client' },
      { serviceId: 'front-door', label: 'Azure Front Door + WAF', tier: 'ingress' },
      { serviceId: 'app-service', label: 'App Service (Primary)', tier: 'compute' },
      { serviceId: 'app-service', label: 'App Service (Secondary)', tier: 'compute' },
      { serviceId: 'redis-cache', label: 'Redis Cache', tier: 'cache' },
      { serviceId: 'sql-database', label: 'SQL Database (Primary)', tier: 'data' },
      { serviceId: 'sql-database', label: 'SQL Database (Geo-Replica)', tier: 'data' },
      { serviceId: 'blob-storage', label: 'Blob Storage (GRS)', tier: 'storage' },
      { serviceId: 'key-vault', label: 'Key Vault', tier: 'security' },
      { serviceId: 'monitor', label: 'Azure Monitor', tier: 'monitoring' },
      { serviceId: 'app-insights', label: 'Application Insights', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 6 },
      { from: 2, to: 7 },
      { from: 2, to: 8 },
      { from: 2, to: 10 },
      { from: 3, to: 10 },
      { from: 10, to: 9 },
    ],
  },

  'microservices': {
    name: 'Microservices on AKS',
    description: 'Container-based microservices with AKS, API Gateway, and service mesh',
    tags: ['microservice', 'マイクロサービス', 'kubernetes', 'k8s', 'container', 'コンテナ', 'aks', 'docker', 'api'],
    wellArchitected: {
      reliability: 'AKS with availability zones. Pod auto-scaling. Health probes.',
      security: 'Network policies. Managed identities. Private cluster. Entra workload identity.',
      costOptimization: 'Spot node pools for non-critical workloads. Cluster autoscaler.',
      operationalExcellence: 'GitOps with Flux/Argo. Prometheus + Grafana monitoring.',
      performanceEfficiency: 'Horizontal pod autoscaler. Ingress controller for routing.',
    },
    nodes: [
      { serviceId: 'internet', label: 'Clients', tier: 'client' },
      { serviceId: 'front-door', label: 'Azure Front Door', tier: 'ingress' },
      { serviceId: 'api-management', label: 'API Management', tier: 'gateway' },
      { serviceId: 'aks', label: 'AKS Cluster', tier: 'compute' },
      { serviceId: 'redis-cache', label: 'Redis Cache', tier: 'cache' },
      { serviceId: 'cosmos-db', label: 'Cosmos DB', tier: 'data' },
      { serviceId: 'service-bus', label: 'Service Bus', tier: 'messaging' },
      { serviceId: 'key-vault', label: 'Key Vault', tier: 'security' },
      { serviceId: 'active-directory', label: 'Entra ID', tier: 'security' },
      { serviceId: 'monitor', label: 'Azure Monitor', tier: 'monitoring' },
      { serviceId: 'log-analytics', label: 'Log Analytics', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
      { from: 3, to: 6 },
      { from: 3, to: 7 },
      { from: 2, to: 8 },
      { from: 3, to: 9 },
      { from: 9, to: 10 },
    ],
  },

  'serverless': {
    name: 'Serverless Event-Driven Architecture',
    description: 'Event-driven serverless with Functions, Event Grid, and Cosmos DB',
    tags: ['serverless', 'サーバーレス', 'function', 'event', 'イベント駆動', 'event-driven', 'lambda', 'trigger'],
    wellArchitected: {
      reliability: 'Functions with availability zones. Cosmos DB multi-region writes.',
      security: 'Managed identities. Function-level auth keys. Private endpoints.',
      costOptimization: 'Consumption plan for sporadic workloads. Premium for predictable load.',
      operationalExcellence: 'Durable Functions for orchestration. Distributed tracing.',
      performanceEfficiency: 'Premium plan for VNET integration. Event-driven auto-scaling.',
    },
    nodes: [
      { serviceId: 'internet', label: 'Event Sources', tier: 'client' },
      { serviceId: 'api-management', label: 'API Management', tier: 'gateway' },
      { serviceId: 'event-grid', label: 'Event Grid', tier: 'messaging' },
      { serviceId: 'functions', label: 'Azure Functions (API)', tier: 'compute' },
      { serviceId: 'functions', label: 'Azure Functions (Worker)', tier: 'compute' },
      { serviceId: 'service-bus', label: 'Service Bus', tier: 'messaging' },
      { serviceId: 'cosmos-db', label: 'Cosmos DB', tier: 'data' },
      { serviceId: 'blob-storage', label: 'Blob Storage', tier: 'storage' },
      { serviceId: 'key-vault', label: 'Key Vault', tier: 'security' },
      { serviceId: 'app-insights', label: 'Application Insights', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 3 },
      { from: 0, to: 2 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 5, to: 4 },
      { from: 3, to: 6 },
      { from: 4, to: 6 },
      { from: 4, to: 7 },
      { from: 3, to: 8 },
      { from: 3, to: 9 },
      { from: 4, to: 9 },
    ],
  },

  'data-pipeline': {
    name: 'Data Analytics Pipeline',
    description: 'Data ingestion, processing, and analytics with Event Hub and Synapse',
    tags: ['data', 'データ', 'analytics', '分析', 'etl', 'pipeline', 'パイプライン', 'bi', 'warehouse', 'lake', 'bigdata', 'ビッグデータ'],
    wellArchitected: {
      reliability: 'Event Hub with capture for replay. Geo-DR for Event Hub namespace.',
      security: 'Data classification. Column/row-level security in Synapse. Encryption at rest.',
      costOptimization: 'Serverless SQL pools for ad-hoc queries. Reserved capacity for predictable.',
      operationalExcellence: 'Data Factory for orchestration. Monitoring with Log Analytics.',
      performanceEfficiency: 'Partitioned Event Hub. Dedicated SQL pools for heavy analytics.',
    },
    nodes: [
      { serviceId: 'internet', label: 'Data Sources', tier: 'client' },
      { serviceId: 'event-hub', label: 'Event Hub', tier: 'ingestion' },
      { serviceId: 'stream-analytics', label: 'Stream Analytics', tier: 'compute' },
      { serviceId: 'blob-storage', label: 'Data Lake Storage', tier: 'storage' },
      { serviceId: 'synapse', label: 'Synapse Analytics', tier: 'data' },
      { serviceId: 'cosmos-db', label: 'Cosmos DB (Serving)', tier: 'data' },
      { serviceId: 'key-vault', label: 'Key Vault', tier: 'security' },
      { serviceId: 'monitor', label: 'Azure Monitor', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 2, to: 7 },
    ],
  },

  'ai-app': {
    name: 'AI/ML Application',
    description: 'AI-powered application with Azure OpenAI, Cognitive Search, and Cosmos DB',
    tags: ['ai', 'ml', '機械学習', 'openai', 'gpt', 'chatbot', 'チャットボット', 'rag', 'cognitive', 'search', '検索', 'llm'],
    wellArchitected: {
      reliability: 'OpenAI with retry/circuit-breaker. Multi-model fallback.',
      security: 'Content filtering. Managed identity for API access. Private endpoint.',
      costOptimization: 'Token usage monitoring. Prompt optimization. Model selection per use case.',
      operationalExcellence: 'Prompt versioning. A/B testing. Response logging for evaluation.',
      performanceEfficiency: 'Semantic caching with Redis. Embedding pre-computation.',
    },
    nodes: [
      { serviceId: 'internet', label: 'Users', tier: 'client' },
      { serviceId: 'front-door', label: 'Azure Front Door', tier: 'ingress' },
      { serviceId: 'app-service', label: 'Web App', tier: 'compute' },
      { serviceId: 'openai', label: 'Azure OpenAI', tier: 'ai' },
      { serviceId: 'ai-search', label: 'AI Search', tier: 'ai' },
      { serviceId: 'cosmos-db', label: 'Cosmos DB', tier: 'data' },
      { serviceId: 'blob-storage', label: 'Document Storage', tier: 'storage' },
      { serviceId: 'redis-cache', label: 'Semantic Cache', tier: 'cache' },
      { serviceId: 'key-vault', label: 'Key Vault', tier: 'security' },
      { serviceId: 'app-insights', label: 'Application Insights', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 4, to: 6 },
      { from: 2, to: 5 },
      { from: 2, to: 7 },
      { from: 7, to: 3 },
      { from: 2, to: 8 },
      { from: 2, to: 9 },
    ],
  },

  'iot': {
    name: 'IoT Solution',
    description: 'IoT data ingestion and processing with IoT Hub pattern using Event Hub',
    tags: ['iot', 'device', 'デバイス', 'sensor', 'センサー', 'telemetry', 'edge', 'スマート'],
    wellArchitected: {
      reliability: 'Event Hub partitioning for throughput. Cosmos DB multi-region.',
      security: 'Per-device SAS tokens. Device provisioning service. Network isolation.',
      costOptimization: 'Event Hub Basic tier for simple telemetry. Auto-inflate for bursts.',
      operationalExcellence: 'Device twin for configuration. OTA updates. Alerts on anomalies.',
      performanceEfficiency: 'Stream Analytics for real-time. Batch processing for historical.',
    },
    nodes: [
      { serviceId: 'internet', label: 'IoT Devices', tier: 'client' },
      { serviceId: 'iot-hub', label: 'IoT Hub', tier: 'ingestion' },
      { serviceId: 'stream-analytics', label: 'Stream Analytics', tier: 'compute' },
      { serviceId: 'cosmos-db', label: 'Cosmos DB (Hot)', tier: 'data' },
      { serviceId: 'blob-storage', label: 'Data Lake (Cold)', tier: 'storage' },
      { serviceId: 'machine-learning', label: 'ML (Anomaly)', tier: 'ai' },
      { serviceId: 'app-service', label: 'Dashboard App', tier: 'compute' },
      { serviceId: 'monitor', label: 'Azure Monitor', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 3 },
      { from: 6, to: 7 },
    ],
  },

  'hub-spoke': {
    name: 'Hub-Spoke Network Topology',
    description: 'Enterprise hub-spoke VNET architecture with centralized security',
    tags: ['network', 'ネットワーク', 'hub-spoke', 'ハブスポーク', 'vnet', 'enterprise', 'エンタープライズ', 'landing zone', 'firewall'],
    wellArchitected: {
      reliability: 'Zone-redundant firewall and gateway. Multiple spokes for isolation.',
      security: 'Centralized firewall inspection. NSG per subnet. Azure Bastion for admin.',
      costOptimization: 'Shared services in hub reduce duplication. VPN vs ExpressRoute analysis.',
      operationalExcellence: 'Azure Policy for governance. Network Watcher for diagnostics.',
      performanceEfficiency: 'ExpressRoute for low-latency hybrid. VNET peering for spoke-to-spoke.',
    },
    nodes: [
      { serviceId: 'internet', label: 'On-Premises', tier: 'client' },
      { serviceId: 'vnet', label: 'Hub VNET', tier: 'network' },
      { serviceId: 'firewall', label: 'Azure Firewall', tier: 'security' },
      { serviceId: 'vnet', label: 'Spoke VNET 1', tier: 'network' },
      { serviceId: 'vnet', label: 'Spoke VNET 2', tier: 'network' },
      { serviceId: 'app-service', label: 'Web Workload', tier: 'compute' },
      { serviceId: 'aks', label: 'AKS Workload', tier: 'compute' },
      { serviceId: 'active-directory', label: 'Entra ID', tier: 'security' },
      { serviceId: 'monitor', label: 'Azure Monitor', tier: 'monitoring' },
      { serviceId: 'log-analytics', label: 'Log Analytics', tier: 'monitoring' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 6 },
      { from: 1, to: 7 },
      { from: 1, to: 8 },
      { from: 8, to: 9 },
    ],
  },
};

// Layout positioning: balanced grid layout to auto-position nodes
const TIER_ORDER = ['client', 'ingress', 'gateway', 'network', 'compute', 'cache', 'ai', 'messaging', 'ingestion', 'data', 'storage', 'security', 'monitoring'];

export function calculateLayout(pattern) {
  const totalNodes = pattern.nodes.length;
  // Calculate optimal grid dimensions for a balanced rectangle
  const cols = Math.ceil(Math.sqrt(totalNodes * 1.5)); // slightly wider than tall
  const nodeWidth = 200;
  const nodeHeight = 160;

  // Sort nodes by tier order for logical grouping
  const indexed = pattern.nodes.map((node, i) => ({
    ...node,
    originalIndex: i,
    tierRank: TIER_ORDER.indexOf(node.tier || 'compute'),
  }));
  indexed.sort((a, b) => a.tierRank - b.tierRank);

  const positions = [];
  const totalWidth = cols * nodeWidth;

  indexed.forEach((node, sortedIdx) => {
    const row = Math.floor(sortedIdx / cols);
    const col = sortedIdx % cols;
    // Center the grid
    const nodesInRow = Math.min(cols, totalNodes - row * cols);
    const rowOffset = (totalWidth - nodesInRow * nodeWidth) / 2;

    positions[node.originalIndex] = {
      x: rowOffset + col * nodeWidth,
      y: row * nodeHeight,
    };
  });

  // Fallback for any unpositioned nodes
  pattern.nodes.forEach((_, i) => {
    if (!positions[i]) {
      positions[i] = { x: (i % cols) * nodeWidth, y: Math.floor(i / cols) * nodeHeight };
    }
  });

  return positions;
}
