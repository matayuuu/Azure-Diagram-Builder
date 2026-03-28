import { describe, it, expect } from 'vitest';
import {
  analyzeRequirements,
  mergeRequirements,
  getFollowUpQuestions,
  selectPattern,
  generateDiagramFromPattern,
  parseEditCommand,
  findServiceByText,
  buildWellArchitectedSummary,
} from '../engine/conversationEngine';
import { architecturePatterns } from '../data/architecturePatterns';

describe('analyzeRequirements', () => {
  it('should detect web workload type', () => {
    expect(analyzeRequirements('Webアプリを作りたい').workloadType).toBe('web');
    expect(analyzeRequirements('I need a website').workloadType).toBe('web');
    expect(analyzeRequirements('ホームページを構築').workloadType).toBe('web');
    expect(analyzeRequirements('ブログサイトを作りたい').workloadType).toBe('web');
  });

  it('should detect api/microservices workload type', () => {
    expect(analyzeRequirements('マイクロサービスを構築したい').workloadType).toBe('api');
    expect(analyzeRequirements('REST API backend').workloadType).toBe('api');
  });

  it('should detect AI workload type', () => {
    expect(analyzeRequirements('RAGチャットボットを構築').workloadType).toBe('ai');
    expect(analyzeRequirements('OpenAI GPT app').workloadType).toBe('ai');
    expect(analyzeRequirements('生成AIアプリ').workloadType).toBe('ai');
  });

  it('should detect IoT workload type', () => {
    expect(analyzeRequirements('IoTデバイスからデータ収集').workloadType).toBe('iot');
    expect(analyzeRequirements('センサーデータの処理').workloadType).toBe('iot');
  });

  it('should detect data workload type', () => {
    expect(analyzeRequirements('データ分析パイプライン').workloadType).toBe('data');
    expect(analyzeRequirements('ETL pipeline with BI').workloadType).toBe('data');
    expect(analyzeRequirements('ビッグデータ分析').workloadType).toBe('data');
  });

  it('should detect serverless workload type', () => {
    expect(analyzeRequirements('サーバーレスアーキテクチャ').workloadType).toBe('serverless');
    expect(analyzeRequirements('event driven functions').workloadType).toBe('serverless');
  });

  it('should detect network workload type', () => {
    expect(analyzeRequirements('ハブスポークネットワーク').workloadType).toBe('network');
    expect(analyzeRequirements('hub spoke vnet design').workloadType).toBe('network');
  });

  it('should detect container workload type', () => {
    expect(analyzeRequirements('Kubernetesでコンテナ').workloadType).toBe('containers');
    expect(analyzeRequirements('Docker + AKS').workloadType).toBe('containers');
  });

  it('should detect enterprise scale', () => {
    expect(analyzeRequirements('エンタープライズ向け大規模').scale).toBe('enterprise');
    expect(analyzeRequirements('production mission critical').scale).toBe('enterprise');
  });

  it('should detect basic scale', () => {
    expect(analyzeRequirements('シンプルな小規模システム').scale).toBe('basic');
    expect(analyzeRequirements('PoC prototype').scale).toBe('basic');
  });

  it('should detect multi-region availability', () => {
    expect(analyzeRequirements('マルチリージョンで高可用性').availability).toBe('multi-region');
    expect(analyzeRequirements('disaster recovery needed').availability).toBe('multi-region');
  });

  it('should detect messaging requirement', () => {
    expect(analyzeRequirements('メッセージキューを使いたい').hasMessaging).toBe('yes');
    expect(analyzeRequirements('非同期処理が必要').hasMessaging).toBe('yes');
  });

  it('should return empty object for unrelated text', () => {
    const result = analyzeRequirements('こんにちは');
    expect(Object.keys(result).length).toBe(0);
  });
});

describe('mergeRequirements', () => {
  it('should merge two requirement objects', () => {
    const a = { workloadType: 'web' };
    const b = { scale: 'enterprise' };
    expect(mergeRequirements(a, b)).toEqual({ workloadType: 'web', scale: 'enterprise' });
  });

  it('incoming should override existing', () => {
    const a = { workloadType: 'web', scale: 'basic' };
    const b = { scale: 'enterprise' };
    expect(mergeRequirements(a, b)).toEqual({ workloadType: 'web', scale: 'enterprise' });
  });

  it('should handle empty objects', () => {
    expect(mergeRequirements({}, {})).toEqual({});
    expect(mergeRequirements({ a: 1 }, {})).toEqual({ a: 1 });
  });
});

describe('getFollowUpQuestions', () => {
  it('should ask workloadType when missing', () => {
    const q = getFollowUpQuestions({});
    const found = q.find(q => q.key === 'workloadType');
    expect(found).toBeDefined();
    expect(found.options.length).toBeGreaterThan(0);
  });

  it('should ask scale when missing', () => {
    const q = getFollowUpQuestions({ workloadType: 'web' });
    const found = q.find(q => q.key === 'scale');
    expect(found).toBeDefined();
  });

  it('should ask availability only for enterprise scale', () => {
    const noAvail = getFollowUpQuestions({ workloadType: 'web', scale: 'basic' });
    expect(noAvail.find(q => q.key === 'availability')).toBeUndefined();

    const withAvail = getFollowUpQuestions({ workloadType: 'web', scale: 'enterprise' });
    expect(withAvail.find(q => q.key === 'availability')).toBeDefined();
  });

  it('should return no questions when all filled', () => {
    const q = getFollowUpQuestions({ workloadType: 'web', scale: 'basic', availability: 'single-region' });
    expect(q.length).toBe(0);
  });
});

describe('selectPattern', () => {
  it('should select web-app-basic for simple web', () => {
    const { key } = selectPattern({ workloadType: 'web', scale: 'basic' });
    expect(key).toBe('web-app-basic');
  });

  it('should select web-app-ha for enterprise web', () => {
    const { key } = selectPattern({ workloadType: 'web', scale: 'enterprise' });
    expect(key).toBe('web-app-ha');
  });

  it('should select web-app-ha for multi-region web', () => {
    const { key } = selectPattern({ workloadType: 'web', availability: 'multi-region' });
    expect(key).toBe('web-app-ha');
  });

  it('should select microservices for api type', () => {
    const { key } = selectPattern({ workloadType: 'api' });
    expect(key).toBe('microservices');
  });

  it('should select microservices for containers type', () => {
    const { key } = selectPattern({ workloadType: 'containers' });
    expect(key).toBe('microservices');
  });

  it('should select correct pattern for each type', () => {
    expect(selectPattern({ workloadType: 'serverless' }).key).toBe('serverless');
    expect(selectPattern({ workloadType: 'data' }).key).toBe('data-pipeline');
    expect(selectPattern({ workloadType: 'ai' }).key).toBe('ai-app');
    expect(selectPattern({ workloadType: 'iot' }).key).toBe('iot');
    expect(selectPattern({ workloadType: 'network' }).key).toBe('hub-spoke');
  });

  it('should default to web-app-basic for unknown type', () => {
    const { key } = selectPattern({ workloadType: 'unknown' });
    expect(key).toBe('web-app-basic');
  });

  it('should return the actual pattern object', () => {
    const { pattern } = selectPattern({ workloadType: 'ai' });
    expect(pattern).toBe(architecturePatterns['ai-app']);
    expect(pattern.name).toBe('AI/ML Application');
  });
});

describe('generateDiagramFromPattern', () => {
  it('should generate nodes and edges from pattern', () => {
    const pattern = architecturePatterns['web-app-basic'];
    const { nodes, edges } = generateDiagramFromPattern(pattern);

    expect(nodes.length).toBe(pattern.nodes.length);
    expect(edges.length).toBe(pattern.edges.length);
  });

  it('generated nodes should have proper structure', () => {
    const pattern = architecturePatterns['microservices'];
    const { nodes } = generateDiagramFromPattern(pattern);

    for (const node of nodes) {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('type', 'azureNode');
      expect(node).toHaveProperty('position');
      expect(node.position).toHaveProperty('x');
      expect(node.position).toHaveProperty('y');
      expect(node).toHaveProperty('data');
      expect(node.data).toHaveProperty('serviceId');
      expect(node.data).toHaveProperty('label');
    }
  });

  it('generated edges should reference valid node IDs', () => {
    const pattern = architecturePatterns['serverless'];
    const { nodes, edges } = generateDiagramFromPattern(pattern);
    const nodeIds = new Set(nodes.map(n => n.id));

    for (const edge of edges) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
      expect(edge.type).toBe('smoothstep');
    }
  });

  it('node IDs should be unique', () => {
    const pattern = architecturePatterns['web-app-ha'];
    const { nodes } = generateDiagramFromPattern(pattern);
    const ids = nodes.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should work for all patterns', () => {
    for (const key of Object.keys(architecturePatterns)) {
      const result = generateDiagramFromPattern(architecturePatterns[key]);
      expect(result.nodes.length).toBeGreaterThan(0);
      expect(result.edges.length).toBeGreaterThan(0);
    }
  });
});

describe('parseEditCommand', () => {
  it('should detect add commands in Japanese', () => {
    const result = parseEditCommand('Redis Cacheを追加して');
    expect(result).not.toBeNull();
    expect(result.action).toBe('add');
  });

  it('should detect add commands in English', () => {
    const result = parseEditCommand('Add a Load Balancer');
    expect(result).not.toBeNull();
    expect(result.action).toBe('add');
  });

  it('should detect various add phrases', () => {
    const phrases = ['入れて', 'つけて', '増やして', '足して', '加えて', '配置して', '設置して'];
    for (const phrase of phrases) {
      const result = parseEditCommand(`App Serviceを${phrase}`);
      expect(result).not.toBeNull();
      expect(result.action).toBe('add');
    }
  });

  it('should detect remove commands in Japanese', () => {
    const result = parseEditCommand('Firewallを削除して');
    expect(result).not.toBeNull();
    expect(result.action).toBe('remove');
  });

  it('should detect remove commands in English', () => {
    const result = parseEditCommand('Remove the Redis Cache');
    expect(result).not.toBeNull();
    expect(result.action).toBe('remove');
  });

  it('should detect various remove phrases', () => {
    const phrases = ['外して', '除いて', '取って', '不要', '消して', 'いらない'];
    for (const phrase of phrases) {
      const result = parseEditCommand(`Load Balancerを${phrase}`);
      expect(result).not.toBeNull();
      expect(result.action).toBe('remove');
    }
  });

  it('should detect replace commands', () => {
    const result = parseEditCommand('SQL Databaseを変更して');
    expect(result).not.toBeNull();
    expect(result.action).toBe('replace');
  });

  it('should return null for non-edit messages', () => {
    expect(parseEditCommand('こんにちは')).toBeNull();
    expect(parseEditCommand('構成図を見せてください')).toBeNull();
  });

  it('should match services in text', () => {
    const result = parseEditCommand('Redis Cacheを追加して');
    expect(result.services.length).toBeGreaterThan(0);
    expect(result.services[0].id).toBe('redis-cache');
  });
});

describe('findServiceByText', () => {
  it('should find by exact service name', () => {
    expect(findServiceByText('Virtual Machine').id).toBe('vm');
    expect(findServiceByText('App Service').id).toBe('app-service');
    expect(findServiceByText('Cosmos DB').id).toBe('cosmos-db');
  });

  it('should find by Japanese keywords', () => {
    expect(findServiceByText('仮想マシンを追加').id).toBe('vm');
    expect(findServiceByText('ファイアウォール').id).toBe('firewall');
    expect(findServiceByText('ロードバランサー').id).toBe('load-balancer');
    expect(findServiceByText('キャッシュを追加').id).toBe('redis-cache');
  });

  it('should find by abbreviations', () => {
    expect(findServiceByText('AKSクラスター').id).toBe('aks');
    expect(findServiceByText('APIMを追加').id).toBe('api-management');
    expect(findServiceByText('ACR registry').id).toBe('container-registry');
  });

  it('should find newly added services', () => {
    expect(findServiceByText('IoT Hub').id).toBe('iot-hub');
    expect(findServiceByText('Bastion').id).toBe('bastion');
    expect(findServiceByText('Sentinel').id).toBe('sentinel');
    expect(findServiceByText('Data Factory').id).toBe('data-factory');
    expect(findServiceByText('AI Search').id).toBe('ai-search');
    expect(findServiceByText('Stream Analytics').id).toBe('stream-analytics');
  });

  it('should find by service ID', () => {
    expect(findServiceByText('vm').id).toBe('vm');
    expect(findServiceByText('cosmos-db').id).toBe('cosmos-db');
  });

  it('should return null for unknown text', () => {
    expect(findServiceByText('xyz不明なサービス123')).toBeNull();
  });
});

describe('buildWellArchitectedSummary', () => {
  it('should return summary string for pattern with wellArchitected', () => {
    const pattern = architecturePatterns['web-app-basic'];
    const summary = buildWellArchitectedSummary(pattern);
    expect(typeof summary).toBe('string');
    expect(summary).toContain('セキュリティ');
    expect(summary).toContain('信頼性');
    expect(summary).toContain('コスト最適化');
    expect(summary).toContain('運用エクセレンス');
    expect(summary).toContain('パフォーマンス');
  });

  it('should return empty string if no wellArchitected', () => {
    const summary = buildWellArchitectedSummary({});
    expect(summary).toBe('');
  });
});
