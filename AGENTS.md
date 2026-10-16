# your-destiny

友人向けの天中殺試作。生年月日の暦日から日柱の旬を求め、6種類の一つと短い定型文をスマホのブラウザで見せる。有料商品、相性、時期の天中殺は対象外。

## 読む順序

- 要求の正本: `/Users/nakanokentaro/01_kcp/workspace/product/ideas/2026-10-15-算命学toC/04-requirements-v1.md`
- 入力資料の写し: `docs/input/04-requirements-v1.md`。会社側を更新したときは写しも合わせる。写しは入力資料である。設計の完了は設計書の確認で判断する。
- 設計書: `docs/superpowers/specs/2026-10-16-your-destiny-design.md`。
- 実装計画: `docs/superpowers/plans/2026-10-16-your-destiny.md`。

## 開発ハーネス

選択中のハーネスは `.cursor/rules/coding-harness.mdc` を正本とする。2026-10-16にSuperpowersを選択した。切り替えは `/dev-harness` で行い、Cursor規則、Claude設定、この節を揃える。

作業開始時は次のコマンドで入口を解決する。`<実行ホスト>` は `cursor`、`claude`、`codex`、`opencode`、`gemini` から現在のホストを指定する。

```bash
python3 /Users/nakanokentaro/01_kcp/tools/scripts/harness_sync.py resolve superpowers --host <実行ホスト>
```

返された SKILL.md を全文読み、依頼に合う子スキルも同じ resolver で解決する。ハーネス本体をこのリポジトリへコピーしない。pstack と gstack を同時に既定にしない。

文書の種類、保存先、作成順序、レビュー、承認は Superpowers に従う。現在地は実装計画のレビュー待ちである。実装計画の確認前に製品コードを書かない。

## Commands

Node.js 22 以上。

- `npm test`：Vitest
- `npm run dev`：ローカル表示
- `npm run build`：dist へ静的ファイルを出す

文書の確認は `git diff --check`。Cloudflare への配置は、その操作の明示承認があるまで行わない。

## Architecture

設計の正本は `docs/superpowers/specs/2026-10-16-your-destiny-design.md` である。配信先は Cloudflare Pages の Free。方式は Vite と TypeScript。成果物は静的ファイル。UI は React を使わず、同じページの DOM を書き換える。生年月日の判定はページ取得後に端末内で終え、生年月日をサーバーや外部AIへ送らない。独自ドメインの購入は承認していない。

## Working rules

- 同一作業ツリーの書き込み担当は1人。
- 要件定義v1の範囲を超えて、課金、アカウント、相性、時期の天中殺、専門家表示を足さない。
- 配信、友人へのURL共有、有料のドメインは明示承認があるまで行わない。
- 秘密値をGitへ入れない。
- 日本語は `/Users/nakanokentaro/01_kcp/rules/writing.md` に従う。
- 実装は設計書と実装計画の確認後に始める。

## 開発フロー

要求の写し、ハーネス選択、設計書、設計書の確認、実装計画、実装計画の確認、実装と検証の順で進める。

開発タスクの正本はLinear。Issueは設計書ができた時点で作る。

origin は `https://github.com/null-n11o/your-destiny.git`。公開範囲は private。最初の内容は `main` に置く。その後の変更は `main` から短命ブランチを切り、PR を作る。マージは明示の依頼があるときだけ行う。
