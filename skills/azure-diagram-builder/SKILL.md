---
name: azure-diagram-builder
description: "Azure構成図を自然言語から生成するスキル。Azure Well-Architected Framework のベストプラクティスに従い、ワークロード要件に応じた最適なリファレンスアーキテクチャを選択・可視化する。USE FOR: Azure構成図の作成、Azureアーキテクチャ設計支援、クラウドインフラ構成の可視化、Well-Architected 準拠のレビュー、サービス構成の提案。Triggers on: Azure構成図を作って、Webアプリのアーキテクチャを設計して、マイクロサービスの構成図が欲しい、IoTソリューションの構成を提案して、この構成は Well-Architected に準拠している？などのリクエスト。DO NOT USE FOR: AWS/GCP専用の設計、Azure以外のクラウド構成図、一般的なフローチャート作成。"
metadata:
  author: azure-diagram-builder
  version: "1.0"
---

# Azure Diagram Builder Skill

自然言語の要件記述から、Azure Well-Architected Framework に準拠した構成図を生成する。

## ワークフロー

ユーザーが Azure 構成図を求めた場合、以下のステップで処理する:

### Step 1: 要件の分析

ユーザーの入力から以下を抽出する:

| 要件カテゴリ | 値の例 | 抽出キーワード |
|---|---|---|
| workloadType | web, api, serverless, data, ai, iot, network, containers | Web/サイト/API/マイクロサービス/サーバーレス/データ分析/AI/IoT/ネットワーク |
| scale | basic, medium, enterprise | 小規模/PoC/中規模/エンタープライズ/大規模 |
| availability | single-region, multi-region | シングルリージョン/マルチリージョン/DR/高可用性 |
| hasDatabase | yes/no | DB/SQL/Cosmos/Redis |
| hasMessaging | yes/no | キュー/メッセージ/イベント/非同期 |
| hasAI | yes/no | AI/ML/OpenAI/GPT/RAG |

### Step 2: 不足情報の質問

最低限 `workloadType` が不明な場合は質問する。`scale` がない場合も確認する。
エンタープライズ規模の場合はさらに `availability` を確認する。

### Step 3: パターン選択

要件に基づき、以下の8つのリファレンスアーキテクチャから最適なものを選択する。
詳細は `references/ARCHITECTURE_PATTERNS.md` を参照。

| パターンキー | 名前 | 適用条件 |
|---|---|---|
| web-app-basic | Basic Web Application | web + basic/medium |
| web-app-ha | High Availability Web App | web + enterprise or multi-region |
| microservices | Microservices on AKS | api or containers |
| serverless | Serverless Event-Driven | serverless |
| data-pipeline | Data Analytics Pipeline | data |
| ai-app | AI/ML Application | ai |
| iot | IoT Solution | iot |
| hub-spoke | Hub-Spoke Network | network |

### Step 4: 構成図の生成

選択パターンに基づき、ノード（Azureサービス）とエッジ（接続）を生成する。
ノードはティア（client → ingress → gateway → compute → data → ...）に基づき自動レイアウトされる。

### Step 5: Well-Architected サマリの提示

生成した構成に対し、5つの柱ごとの推奨事項を提示する:

1. **信頼性 (Reliability)** — 冗長構成、フェイルオーバー、ヘルスプローブ
2. **セキュリティ (Security)** — ID管理(Entra ID)、暗号化、ネットワーク分離
3. **コスト最適化 (Cost Optimization)** — 適切なサイズ選定、予約インスタンス、ティア推奨
4. **運用エクセレンス (Operational Excellence)** — 監視、CI/CD、デプロイ戦略
5. **パフォーマンス効率 (Performance Efficiency)** — キャッシュ、オートスケール、CDN

### Step 6: フォローアップ編集

生成後、会話形式で構成を変更できる:

- 追加: 「Redis Cacheを追加して」「WAFを入れて」
- 削除: 「Firewallを外して」「Load Balancerを削除」
- 新規: 新しい要件を伝えれば新しい構成図を生成

## 対応 Azure サービス (41種)

`references/AZURE_SERVICES.md` に全サービス一覧を掲載。
カテゴリ: Compute(6), Networking(6), Storage(4), Database(5), AI+ML(4), Security(3), Integration(5), DevOps(4), General(4)

## プロジェクト構造

```
src/
├── components/
│   ├── ChatPanel.jsx           # AIチャットUI
│   ├── AzureNode.jsx           # React Flow カスタムノード
│   ├── Sidebar.jsx             # サービスパレット (ドラッグ&ドロップ)
│   └── PropertiesPanel.jsx     # ノードプロパティ編集
├── data/
│   ├── azureServices.js        # 41種の Azure サービス定義
│   └── architecturePatterns.js # 8つのリファレンスアーキテクチャ
├── engine/
│   └── conversationEngine.js   # NLP要件分析・パターン選択・編集パース
├── hooks/
│   ├── useDiagramStorage.js    # LocalStorage 永続化
│   └── useToast.js             # トースト通知
└── App.jsx                     # メインアプリ (React Flow キャンバス)
```

## 新しいパターンの追加方法

1. `src/data/architecturePatterns.js` にパターンエントリを追加
2. 必須フィールド: `name`, `description`, `tags`(日英), `wellArchitected`(5柱), `nodes`(`serviceId`, `label`, `tier`), `edges`(`from`/`to` インデックス)
3. `src/engine/conversationEngine.js` の `selectPattern()` にマッピングを追加
4. 参照する `serviceId` が `azureServices.js` に存在し、`public/icons/` にSVGアイコンがあることを確認
