# your-destiny

算命学を活用した自己分析サイト。生年月日の暦日から日柱と天中殺を求め、価値観・人との縁・強みとつまずき・仕事の環境・恋愛と仕事の相性・今後3年間をスマホで読む。相性は本人だけの入力から相手の特徴を示し、年別は日干と年の干支による目安とする。有料商品と二人の生年月日による比較は対象外。

## 読む順序

- 要求の正本: `/Users/nakanokentaro/01_kcp/workspace/product/ideas/2026-10-15-算命学toC/04-requirements-v1.md`
- 入力資料の写し: `docs/input/04-requirements-v1.md`。会社側を更新したときは写しも合わせる。写しは入力資料である。設計の完了は設計書の確認で判断する。
- 設計書: `docs/superpowers/specs/2026-10-16-your-destiny-design.md`。
- 初回実装計画: `docs/superpowers/plans/2026-10-16-your-destiny.md`。
- 承認済み追加設計: `docs/superpowers/specs/2026-10-16-relationships-outlook-design.md`。短文・5ブロック・相性と年運の対象外指定は、この追加設計で変更した。
- 追加実装計画: `docs/superpowers/plans/2026-10-16-self-analysis-expansion.md`。

## 開発ハーネス

選択中のハーネスは `.cursor/rules/coding-harness.mdc` を正本とする。2026-10-16にSuperpowersを選択した。切り替えは `/dev-harness` で行い、Cursor規則、Claude設定、この節を揃える。

作業開始時は次のコマンドで入口を解決する。`<実行ホスト>` は `cursor`、`claude`、`codex`、`opencode`、`gemini` から現在のホストを指定する。

```bash
python3 /Users/nakanokentaro/01_kcp/tools/scripts/harness_sync.py resolve superpowers --host <実行ホスト>
```

返された SKILL.md を全文読み、依頼に合う子スキルも同じ resolver で解決する。ハーネス本体をこのリポジトリへコピーしない。pstack と gstack を同時に既定にしない。

文書の種類、保存先、作成順序、レビュー、承認は Superpowers に従う。2026-10-16にユーザーが自己分析の追加設計と本文密度を確認し、実装を依頼した。新しい範囲の追加時は設計と実装計画を確認する。

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
- 課金、アカウント、二人の生年月日による相性比較、専門家表示を足さない。2026-10-16に承認された本人の結果で読む相性と、3年間の年別の目安は追加設計に従う。
- 配信、友人へのURL共有、有料のドメインは明示承認があるまで行わない。
- 秘密値をGitへ入れない。
- 日本語は `/Users/nakanokentaro/01_kcp/rules/writing.md` に従う。
- 実装は設計書と実装計画の確認後に始める。

## 開発フロー

要求の写し、ハーネス選択、設計書、設計書の確認、実装計画、実装計画の確認、実装と検証の順で進める。

開発タスクの正本はLinear。Issueは設計書ができた時点で作る。

origin は `https://github.com/null-n11o/your-destiny.git`。公開範囲は private。最初の内容は `main` に置く。その後の変更は `main` から短命ブランチを切り、PR を作る。マージは明示の依頼があるときだけ行う。
