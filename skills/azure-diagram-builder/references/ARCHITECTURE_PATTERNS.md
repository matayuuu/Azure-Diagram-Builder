# Azure Architecture Reference Patterns

本スキルが使用する8つのリファレンスアーキテクチャパターンの詳細。

## 1. Basic Web Application (`web-app-basic`)

**説明:** App Service, SQL Database, Front Door を使ったシンプルな Web アプリ構成

**構成ノード:**
| サービス | ティア | 役割 |
|---|---|---|
| Users | client | エンドユーザー |
| Azure Front Door | ingress | CDN / WAF / ルーティング |
| App Service | compute | Web アプリホスティング |
| SQL Database | data | リレーショナルデータ |
| Blob Storage | storage | 静的アセット |
| Key Vault | security | シークレット管理 |
| Application Insights | monitoring | APM / ログ |

**Well-Architected:**
- **Reliability:** Single region. Traffic Manager/Front Door でマルチリージョン対応可能
- **Security:** Entra ID 認証, Key Vault, HTTPS 強制
- **Cost:** App Service Basic/Standard, SQL DTU モデル
- **Operations:** App Insights 監視, デプロイスロットでゼロダウンタイム
- **Performance:** CDN で静的アセット配信, Redis Cache でセッション状態

---

## 2. High Availability Web Application (`web-app-ha`)

**説明:** マルチリージョン Web アプリ、フェイルオーバー、WAF 搭載

**構成ノード:**
| サービス | ティア | 役割 |
|---|---|---|
| Users | client | エンドユーザー |
| Front Door + WAF | ingress | グローバルLB + WAF |
| App Service (Primary) | compute | プライマリリージョン |
| App Service (Secondary) | compute | セカンダリリージョン |
| Redis Cache | cache | セッション状態 |
| SQL Database (Primary) | data | プライマリDB |
| SQL Database (Geo-Replica) | data | 地理レプリカ |
| Blob Storage (GRS) | storage | 地理冗長ストレージ |
| Key Vault | security | シークレット管理 |
| Azure Monitor | monitoring | メトリクス監視 |
| Application Insights | monitoring | APM |

**Well-Architected:**
- **Reliability:** マルチリージョン Active-Passive, Front Door ルーティング, 自動フェイルオーバー
- **Security:** Front Door WAF, Entra ID 認証, バックエンド Private Endpoint
- **Cost:** WAF 不要なら Traffic Manager でDNSフェイルオーバー (低コスト)
- **Operations:** 両リージョンへのデプロイ, ヘルスプローブ自動フェイルオーバー
- **Performance:** Redis Cache セッション状態, CDN 静的コンテンツ配信

---

## 3. Microservices on AKS (`microservices`)

**説明:** AKS ベースのコンテナマイクロサービス、API Gateway 搭載

**構成ノード:**
| サービス | ティア | 役割 |
|---|---|---|
| Clients | client | API クライアント |
| Front Door | ingress | グローバルLB |
| API Management | gateway | API ゲートウェイ |
| AKS Cluster | compute | Kubernetes オーケストレーション |
| Redis Cache | cache | 分散キャッシュ |
| Cosmos DB | data | NoSQL データストア |
| Service Bus | messaging | 非同期メッセージング |
| Key Vault | security | シークレット管理 |
| Entra ID | security | ID プラットフォーム |
| Azure Monitor | monitoring | メトリクス |
| Log Analytics | monitoring | ログ集約 |

**Well-Architected:**
- **Reliability:** AKS Availability Zone, Pod Auto-scaling, Health Probe
- **Security:** ネットワークポリシー, マネージドID, プライベートクラスター, Entra Workload Identity
- **Cost:** Spot Node Pool (非クリティカル), クラスターオートスケーラー
- **Operations:** GitOps (Flux/Argo), Prometheus + Grafana
- **Performance:** HPA, Ingress Controller

---

## 4. Serverless Event-Driven (`serverless`)

**説明:** Functions, Event Grid, Cosmos DB を使ったイベント駆動サーバーレス

**構成ノード:** API Management, Event Grid, Azure Functions (API/Worker), Service Bus, Cosmos DB, Blob Storage, Key Vault, App Insights

**Well-Architected:**
- **Reliability:** Functions AZ 対応, Cosmos DB マルチリージョン書き込み
- **Security:** マネージドID, Function レベル認証キー, Private Endpoint
- **Cost:** Consumption プラン (散発的), Premium プラン (予測可能)
- **Operations:** Durable Functions オーケストレーション, 分散トレーシング
- **Performance:** Premium プラン VNET 統合, イベント駆動自動スケーリング

---

## 5. Data Analytics Pipeline (`data-pipeline`)

**説明:** Event Hub, Stream Processing, Synapse Analytics によるデータ分析パイプライン

**構成ノード:** Event Hub, Stream Processing (Functions), Data Lake Storage, Synapse Analytics, Cosmos DB (Serving), Key Vault, Azure Monitor

**Well-Architected:**
- **Reliability:** Event Hub キャプチャでリプレイ, Geo-DR
- **Security:** データ分類, Synapse 行/列レベルセキュリティ, 保管時暗号化
- **Cost:** サーバーレス SQL プール (アドホック), 予約容量 (予測可能)
- **Operations:** Data Factory オーケストレーション, Log Analytics 監視
- **Performance:** Event Hub パーティション, 専用 SQL プール

---

## 6. AI/ML Application (`ai-app`)

**説明:** Azure OpenAI, AI Search, Cosmos DB を使った RAG アプリケーション

**構成ノード:** Front Door, Web App, Azure OpenAI, AI Search, Cosmos DB, Document Storage, Semantic Cache (Redis), Key Vault, App Insights

**Well-Architected:**
- **Reliability:** OpenAI リトライ/サーキットブレーカー, マルチモデルフォールバック
- **Security:** コンテンツフィルタリング, マネージドID API アクセス, Private Endpoint
- **Cost:** トークン使用量監視, プロンプト最適化, ユースケース別モデル選択
- **Operations:** プロンプトバージョニング, A/Bテスト, レスポンスログ評価
- **Performance:** Redis セマンティックキャッシュ, 埋め込み事前計算

---

## 7. IoT Solution (`iot`)

**説明:** Event Hub, Stream Processing, Cosmos DB による IoT データ収集・処理

**構成ノード:** IoT Devices, Event Hub, Stream Processing (Functions), Cosmos DB (Hot), Data Lake (Cold), ML (Anomaly), Dashboard App, Azure Monitor

**Well-Architected:**
- **Reliability:** Event Hub パーティションでスループット確保, Cosmos DB マルチリージョン
- **Security:** デバイス毎 SAS トークン, DPS, ネットワーク分離
- **Cost:** Event Hub Basic ティア (シンプルテレメトリ), Auto-inflate (バースト)
- **Operations:** Device Twin 設定管理, OTA 更新, 異常アラート
- **Performance:** Stream Analytics リアルタイム, バッチ処理 (履歴)

---

## 8. Hub-Spoke Network Topology (`hub-spoke`)

**説明:** エンタープライズ Hub-Spoke VNET アーキテクチャ、集中セキュリティ

**構成ノード:** On-Premises, Hub VNET, Azure Firewall, Spoke VNET 1/2, Web Workload, AKS Workload, Entra ID, Azure Monitor, Log Analytics

**Well-Architected:**
- **Reliability:** ゾーン冗長ファイアウォール/ゲートウェイ, スポーク分離
- **Security:** 集中ファイアウォール検査, サブネット毎 NSG, Azure Bastion
- **Cost:** ハブ共有サービスで重複削減, VPN vs ExpressRoute 分析
- **Operations:** Azure Policy ガバナンス, Network Watcher 診断
- **Performance:** ExpressRoute 低遅延ハイブリッド, VNET ピアリング
