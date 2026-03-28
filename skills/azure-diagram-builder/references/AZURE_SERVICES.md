# Azure Services Reference

本プロジェクトで対応している Azure サービス一覧 (41種)。
各サービスは `serviceId` で識別され、`public/icons/{serviceId}.svg` にアイコンが配置されている。

## Compute (6)
| serviceId | 名前 | 用途 |
|---|---|---|
| vm | Virtual Machine | IaaS 仮想マシン |
| app-service | App Service | PaaS Web/API ホスティング |
| functions | Functions | サーバーレスコンピューティング |
| aks | AKS | Kubernetes コンテナオーケストレーション |
| container-instances | Container Instances | サーバーレスコンテナ |
| batch | Batch | 大規模並列バッチ処理 |

## Networking (6)
| serviceId | 名前 | 用途 |
|---|---|---|
| vnet | Virtual Network | 仮想ネットワーク |
| load-balancer | Load Balancer | L4 負荷分散 |
| app-gateway | App Gateway | L7 負荷分散 + WAF |
| dns | DNS Zone | DNS ホスティング |
| front-door | Front Door | グローバル LB + CDN + WAF |
| firewall | Firewall | ネットワークファイアウォール |

## Storage (4)
| serviceId | 名前 | 用途 |
|---|---|---|
| storage-account | Storage Account | 汎用ストレージ |
| blob-storage | Blob Storage | オブジェクトストレージ |
| disk | Managed Disk | VM ディスク |
| file-storage | File Storage | ファイル共有 (SMB/NFS) |

## Database (5)
| serviceId | 名前 | 用途 |
|---|---|---|
| sql-database | SQL Database | リレーショナルDB (SQL Server) |
| cosmos-db | Cosmos DB | グローバル分散 NoSQL |
| redis-cache | Redis Cache | インメモリキャッシュ |
| mysql | MySQL | MySQL マネージドDB |
| postgresql | PostgreSQL | PostgreSQL マネージドDB |

## AI + ML (4)
| serviceId | 名前 | 用途 |
|---|---|---|
| cognitive-services | Cognitive Services | AI Search / Vision / Language |
| machine-learning | Machine Learning | ML プラットフォーム |
| openai | OpenAI Service | GPT / Embeddings / DALL-E |
| bot-service | Bot Service | チャットボットフレームワーク |

## Security (3)
| serviceId | 名前 | 用途 |
|---|---|---|
| key-vault | Key Vault | シークレット / 鍵 / 証明書管理 |
| active-directory | Entra ID | ID・アクセス管理 |
| security-center | Defender | セキュリティ態勢管理 |

## Integration (5)
| serviceId | 名前 | 用途 |
|---|---|---|
| api-management | API Management | API ゲートウェイ |
| service-bus | Service Bus | エンタープライズメッセージング |
| event-hub | Event Hub | 大規模イベントストリーミング |
| logic-apps | Logic Apps | ワークフロー自動化 |
| event-grid | Event Grid | イベントルーティング |

## DevOps (4)
| serviceId | 名前 | 用途 |
|---|---|---|
| devops | Azure DevOps | CI/CD パイプライン |
| monitor | Azure Monitor | メトリクス / アラート |
| app-insights | Application Insights | APM / 分散トレーシング |
| log-analytics | Log Analytics | ログ集約 / KQL クエリ |

## General (4)
| serviceId | 名前 | 用途 |
|---|---|---|
| resource-group | Resource Group | リソースグループ |
| subscription | Subscription | サブスクリプション |
| internet | Internet / Users | 外部クライアント |
| custom | Custom Service | カスタムサービス |
