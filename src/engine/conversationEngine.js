// Conversation engine for Azure architecture diagram generation
// Analyzes user requirements, asks clarifying questions, selects patterns, and supports follow-up edits.

import { architecturePatterns, calculateLayout } from '../data/architecturePatterns';
import { azureServices } from '../data/azureServices';

// ─── Requirement categories we need to assess ───
const REQUIREMENT_KEYS = [
  'workloadType',    // web, api, data, iot, ai, etc.
  'scale',           // basic, medium, enterprise
  'availability',    // single-region, multi-region
  'security',        // basic, enhanced
  'hasDatabase',     // yes, no, unspecified
  'hasMessaging',    // yes, no, unspecified
  'hasAI',           // yes, no, unspecified
];

// ─── Keyword → requirement mapping ───
const KEYWORD_MAP = {
  workloadType: {
    'web|website|webapp|ウェブ|ホームページ|サイト|cms|blog|ブログ|spa|react|フロントエンド|frontend': 'web',
    'api|rest|graphql|マイクロサービス|microservice|backend|バックエンド': 'api',
    'iot|device|sensor|デバイス|センサー|テレメトリ|telemetry|edge|スマート': 'iot',
    'data|analytics|分析|etl|pipeline|bi|warehouse|lake|ビッグデータ|bigdata|データ': 'data',
    'ai|ml|openai|gpt|chatbot|チャットボット|cognitive|rag|llm|機械学習|生成ai': 'ai',
    'serverless|サーバーレス|function|event.*driven|イベント駆動': 'serverless',
    'network|ネットワーク|hub.*spoke|ハブ.*スポーク|vnet|landing.*zone|firewall': 'network',
    'container|コンテナ|kubernetes|k8s|docker|aks': 'containers',
  },
  scale: {
    'enterprise|エンタープライズ|大規模|large|production|プロダクション|mission.*critical': 'enterprise',
    'medium|中規模|standard|スタンダード': 'medium',
    'basic|ベーシック|simple|シンプル|小規模|small|poc|プロトタイプ|prototype|dev|開発': 'basic',
  },
  availability: {
    'multi.*region|マルチリージョン|geo.*redundant|dr|disaster.*recovery|ha|high.*avail|高可用': 'multi-region',
    'single.*region|シングルリージョン|1.*region|1リージョン': 'single-region',
  },
  hasAI: {
    'ai|ml|openai|gpt|cognitive|rag|llm|機械学習|生成ai|chatbot|チャットボット|search|検索': 'yes',
  },
  hasDatabase: {
    'db|database|データベース|sql|cosmos|redis|mysql|postgres|mongo|storage|ストレージ': 'yes',
  },
  hasMessaging: {
    'queue|キュー|message|メッセージ|event|イベント|pub.*sub|async|非同期|bus': 'yes',
  },
};

// ─── Analyze text to extract requirements ───
export function analyzeRequirements(text) {
  const lower = text.toLowerCase();
  const reqs = {};

  for (const [key, patterns] of Object.entries(KEYWORD_MAP)) {
    for (const [regex, value] of Object.entries(patterns)) {
      if (new RegExp(regex, 'i').test(lower)) {
        reqs[key] = value;
        break;
      }
    }
  }

  return reqs;
}

// ─── Merge accumulated requirements ───
export function mergeRequirements(existing, incoming) {
  return { ...existing, ...incoming };
}

// ─── Determine which questions to ask ───
export function getFollowUpQuestions(reqs) {
  const questions = [];

  if (!reqs.workloadType) {
    questions.push({
      key: 'workloadType',
      text: 'どのようなワークロードですか？例：Webアプリケーション、API/マイクロサービス、データ分析パイプライン、IoTソリューション、AI/MLアプリケーション',
      options: [
        { label: 'Webアプリ', value: 'web' },
        { label: 'API/マイクロサービス', value: 'api' },
        { label: 'サーバーレス', value: 'serverless' },
        { label: 'データ分析', value: 'data' },
        { label: 'AI/ML', value: 'ai' },
        { label: 'IoT', value: 'iot' },
        { label: 'ネットワーク設計', value: 'network' },
      ],
    });
  }

  if (!reqs.scale) {
    questions.push({
      key: 'scale',
      text: '想定される規模を教えてください。',
      options: [
        { label: '小規模 / PoC', value: 'basic' },
        { label: '中規模 / Standard', value: 'medium' },
        { label: 'エンタープライズ', value: 'enterprise' },
      ],
    });
  }

  if (!reqs.availability && reqs.scale === 'enterprise') {
    questions.push({
      key: 'availability',
      text: '可用性の要件はありますか？',
      options: [
        { label: 'シングルリージョン', value: 'single-region' },
        { label: 'マルチリージョン (DR)', value: 'multi-region' },
      ],
    });
  }

  return questions;
}

// ─── Pattern selection based on requirements ───
export function selectPattern(reqs) {
  const type = reqs.workloadType || 'web';
  const scale = reqs.scale || 'basic';
  const availability = reqs.availability || 'single-region';

  // Map to pattern key
  const mapping = {
    'web': scale === 'enterprise' || availability === 'multi-region' ? 'web-app-ha' : 'web-app-basic',
    'api': 'microservices',
    'containers': 'microservices',
    'serverless': 'serverless',
    'data': 'data-pipeline',
    'ai': 'ai-app',
    'iot': 'iot',
    'network': 'hub-spoke',
  };

  const patternKey = mapping[type] || 'web-app-basic';
  return { key: patternKey, pattern: architecturePatterns[patternKey] };
}

// ─── Generate nodes and edges from pattern for progressive rendering ───
let nodeIdBase = 1000;
export function generateDiagramFromPattern(pattern) {
  const positions = calculateLayout(pattern);
  const idMap = {};
  const nodes = [];
  const edges = [];

  pattern.nodes.forEach((nodeDef, i) => {
    const id = `ai_node_${++nodeIdBase}_${Date.now()}`;
    idMap[i] = id;
    nodes.push({
      id,
      type: 'azureNode',
      position: positions[i],
      data: {
        serviceId: nodeDef.serviceId,
        label: nodeDef.label,
        description: '',
      },
    });
  });

  pattern.edges.forEach(edgeDef => {
    const sourceId = idMap[edgeDef.from];
    const targetId = idMap[edgeDef.to];
    if (sourceId && targetId) {
      edges.push({
        id: `ai_edge_${sourceId}_${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'smoothstep',
      });
    }
  });

  return { nodes, edges };
}

// ─── Follow-up edit commands ───
const EDIT_COMMANDS = {
  add: /(?:追加|add|入れて|つけて|増やして|足して|加えて|置いて|配置|設置)/i,
  remove: /(?:削除|remove|外して|除いて|取って|不要|消して|なくして|やめて|いらない)/i,
  replace: /(?:変更|replace|変えて|差し替え|切り替え|代わりに|交換|入れ替え)/i,
};

export function parseEditCommand(text) {
  const lower = text.toLowerCase();

  // Try to find service references
  const matchedServices = azureServices.filter(s =>
    lower.includes(s.id) || lower.includes(s.name.toLowerCase())
  );

  // Detect add command
  if (EDIT_COMMANDS.add.test(lower)) {
    return {
      action: 'add',
      services: matchedServices,
      rawText: text,
    };
  }

  // Detect remove command
  if (EDIT_COMMANDS.remove.test(lower)) {
    return {
      action: 'remove',
      services: matchedServices,
      rawText: text,
    };
  }

  // Detect replace command
  if (EDIT_COMMANDS.replace.test(lower)) {
    return {
      action: 'replace',
      services: matchedServices,
      rawText: text,
    };
  }

  return null;
}

// ─── Service name matching (fuzzy) ───
export function findServiceByText(text) {
  const lower = text.toLowerCase();
  // Exact match
  let match = azureServices.find(s => lower.includes(s.id) || lower.includes(s.name.toLowerCase()));
  if (match) return match;

  // Fuzzy keyword matching
  const keywords = {
    'vm': 'vm', 'virtual machine': 'vm', '仮想マシン': 'vm',
    'vm scale set': 'vm-scale-sets', 'vmss': 'vm-scale-sets', 'スケールセット': 'vm-scale-sets',
    'web app': 'app-service', 'app service': 'app-service', 'ウェブアプリ': 'app-service',
    'function': 'functions', 'ファンクション': 'functions', '関数': 'functions',
    'kubernetes': 'aks', 'k8s': 'aks',
    'container instance': 'container-instances', 'コンテナインスタンス': 'container-instances',
    'container registry': 'container-registry', 'acr': 'container-registry', 'コンテナレジストリ': 'container-registry',
    'spring': 'spring-apps', 'spring apps': 'spring-apps',
    'service fabric': 'service-fabric',
    'vnet': 'vnet', '仮想ネットワーク': 'vnet',
    'subnet': 'subnet', 'サブネット': 'subnet',
    'ロードバランサー': 'load-balancer', 'lb': 'load-balancer', 'load balancer': 'load-balancer',
    'app gateway': 'app-gateway', 'application gateway': 'app-gateway', 'アプリケーションゲートウェイ': 'app-gateway',
    'cdn': 'cdn', 'front door': 'front-door', 'フロントドア': 'front-door',
    'firewall': 'firewall', 'ファイアウォール': 'firewall',
    'traffic manager': 'traffic-manager', 'トラフィックマネージャー': 'traffic-manager',
    'vpn': 'vpn-gateway', 'vpn gateway': 'vpn-gateway',
    'expressroute': 'expressroute', 'express route': 'expressroute',
    'nat gateway': 'nat-gateway', 'nat': 'nat-gateway',
    'bastion': 'bastion', '踏み台': 'bastion',
    'nsg': 'nsg', 'network security group': 'nsg', 'セキュリティグループ': 'nsg',
    'ddos': 'ddos-protection',
    'waf': 'waf', 'web application firewall': 'waf',
    'private link': 'private-link', 'プライベートリンク': 'private-link', 'private endpoint': 'private-link',
    'virtual wan': 'virtual-wan',
    'public ip': 'public-ip', 'パブリックip': 'public-ip',
    'storage': 'storage-account', 'ストレージ': 'storage-account',
    'blob': 'blob-storage',
    'sql': 'sql-database', 'データベース': 'sql-database', 'database': 'sql-database',
    'sql managed instance': 'sql-managed-instance', 'マネージドインスタンス': 'sql-managed-instance',
    'cosmos': 'cosmos-db', 'nosql': 'cosmos-db',
    'redis': 'redis-cache', 'cache': 'redis-cache', 'キャッシュ': 'redis-cache',
    'mysql': 'mysql',
    'postgres': 'postgresql',
    'mariadb': 'mariadb',
    'synapse': 'synapse', 'data warehouse': 'synapse',
    'data explorer': 'data-explorer', 'kusto': 'data-explorer',
    'data factory': 'data-factory', 'adf': 'data-factory',
    'openai': 'openai', 'gpt': 'openai',
    'cognitive': 'cognitive-services', 'ai search': 'ai-search', '検索': 'ai-search',
    'ai studio': 'ai-studio',
    'computer vision': 'computer-vision', '画像認識': 'computer-vision',
    'speech': 'speech-services', '音声': 'speech-services',
    'content safety': 'content-safety',
    'form recognizer': 'form-recognizer', 'document intelligence': 'form-recognizer',
    'anomaly detector': 'anomaly-detector', '異常検知': 'anomaly-detector',
    'translator': 'translator', '翻訳': 'translator',
    'ml': 'machine-learning', '機械学習': 'machine-learning',
    'bot': 'bot-service', 'ボット': 'bot-service',
    'key vault': 'key-vault', 'シークレット': 'key-vault', 'secret': 'key-vault',
    'entra': 'active-directory', 'ad': 'active-directory', '認証': 'active-directory',
    'managed identity': 'managed-identity', 'マネージドid': 'managed-identity',
    'defender': 'security-center', 'defender for cloud': 'defender-cloud',
    'sentinel': 'sentinel', 'siem': 'sentinel',
    'api management': 'api-management', 'apim': 'api-management',
    'service bus': 'service-bus', 'サービスバス': 'service-bus',
    'event hub': 'event-hub', 'イベントハブ': 'event-hub',
    'logic app': 'logic-apps', 'ロジックアプリ': 'logic-apps',
    'event grid': 'event-grid', 'イベントグリッド': 'event-grid',
    'app configuration': 'app-configuration', 'アプリ構成': 'app-configuration',
    'notification hub': 'notification-hub', 'プッシュ通知': 'notification-hub',
    'iot hub': 'iot-hub', 'iot central': 'iot-central', 'iot edge': 'iot-edge',
    'digital twin': 'digital-twins', 'デジタルツイン': 'digital-twins',
    'stream analytics': 'stream-analytics', 'ストリーム': 'stream-analytics',
    'maps': 'maps', '地図': 'maps',
    'devops': 'devops',
    'monitor': 'monitor', 'モニター': 'monitor', '監視': 'monitor',
    'app insights': 'app-insights', 'application insights': 'app-insights',
    'log analytics': 'log-analytics',
    'advisor': 'advisor', 'アドバイザー': 'advisor',
    'automation': 'automation', 'オートメーション': 'automation',
    'policy': 'policy', 'ポリシー': 'policy',
    'arc': 'arc', 'azure arc': 'arc',
    'cost management': 'cost-management', 'コスト': 'cost-management',
    'resource group': 'resource-group', 'リソースグループ': 'resource-group',
  };

  for (const [keyword, serviceId] of Object.entries(keywords)) {
    if (lower.includes(keyword)) {
      return azureServices.find(s => s.id === serviceId);
    }
  }

  return null;
}

// ─── Build Well-Architected summary message ───
export function buildWellArchitectedSummary(pattern) {
  const wa = pattern.wellArchitected;
  if (!wa) return '';

  return [
    `\n📐 **Well-Architected Framework のポイント:**`,
    `🔒 **セキュリティ**: ${wa.security}`,
    `🛡️ **信頼性**: ${wa.reliability}`,
    `💰 **コスト最適化**: ${wa.costOptimization}`,
    `⚙️ **運用エクセレンス**: ${wa.operationalExcellence}`,
    `🚀 **パフォーマンス**: ${wa.performanceEfficiency}`,
  ].join('\n');
}
