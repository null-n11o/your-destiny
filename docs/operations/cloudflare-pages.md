# Cloudflare Pagesへの配置

2026-10-16にユーザーが配置とGit連携による自動デプロイを承認した。

| 項目 | 設定 |
|---|---|
| Cloudflareプロジェクト | `your-destiny` |
| 公開URL | https://your-destiny-a1d.pages.dev/ |
| GitHub | `null-n11o/your-destiny` |
| 本番ブランチ | `codex/your-destiny-design` |
| Framework preset | None |
| Build command | `npm test && npm run build` |
| Build output directory | `dist` |
| Root directory | リポジトリ直下 |
| 環境変数 | `NODE_VERSION=22` |

Cloudflare PagesのGitHub連携を使う。本番ブランチへpushすると、Cloudflareが依存関係をインストールし、テストとビルドを実行して公開URLを更新する。テストに失敗した変更は公開しない。Cloudflareの認証情報をリポジトリやGitHub Actionsへ追加する必要はない。

ビルド履歴と設定は [Cloudflare Dashboard](https://dash.cloudflare.com/d9f4d1410432513ce961fa500fda9bf9/pages/view/your-destiny) で確認する。

現在は実装ブランチを本番に指定している。将来mainへマージした場合は、別途Cloudflareの本番ブランチを切り替える。mainへのマージは今回の操作には含めない。

静的ファイルだけを配信し、生年月日の計算は端末内で行う。`public/_headers`の`X-Robots-Tag: noindex`とHTMLの`noindex`を維持する。独自ドメイン、アクセス解析、Pages Functions、Workersの処理は追加しない。
