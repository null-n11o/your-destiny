# your-destiny

生年月日から天中殺の6分類を求め、算命学を使って自分の価値観や人との関わりを考えるサイト。全体像、縁、強み、仕事、恋愛・仕事の相性、今後3年間の過ごし方を、5〜10分で読める本文で表示する。

生年月日の計算はブラウザ内で完結する。入力を送信・保存する機能はない。

## ローカルで確認する

Node.js 22以上を使う。実装は次の作業ツリーの直下にある。

```bash
cd /Users/nakanokentaro/02_dev/your-destiny
npm ci
npm test
npm run build
npm run dev -- --host 127.0.0.1
```

開発サーバーが表示するローカルURLをブラウザで開く。通常は `http://127.0.0.1:5173/`。使用中なら別のポートになる。

年・月・日を入力し、目次から各章へ移動する。「今後3年間」に3年分のカードがあり、「入れ直す」で入力と結果が消えることを確認する。空欄や存在しない日付では入力エラーを表示する。

`npm test` は計算・本文・画面・非送信のテスト、`npm run build` は型検査と静的ファイルの生成を行う。ビルド成果物は `dist/` に出力する。

## 設計と作業規約

要求の初版は `docs/input/04-requirements-v1.md`。承認済みの追加範囲は [自己分析・相性・3年間の設計](docs/superpowers/specs/2026-10-16-relationships-outlook-design.md)、実装手順は [追加実装計画](docs/superpowers/plans/2026-10-16-self-analysis-expansion.md) に記載した。

ハーネスはSuperpowers。作業規約は [AGENTS.md](AGENTS.md)。配置、友人へのURL共有、mainへのマージは、それぞれ明示の依頼がある時に行う。

GitHubは [null-n11o/your-destiny](https://github.com/null-n11o/your-destiny)。公開範囲はprivate。

Cloudflareの公開URLと自動デプロイの設定は [配置手順](docs/operations/cloudflare-pages.md) に記載した。
