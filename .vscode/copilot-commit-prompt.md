# GitHub Copilot - コミットメッセージ生成用プロンプト

このファイルは、GitHub CopilotがGitコミットメッセージを生成する際に自動参照される設定ファイルです。

## 自動参照されるルールファイル

以下のファイルの内容を必ず参考にしてコミットメッセージを生成してください：

1. **`.github/instructions/commit.instructions.md`** - コミットメッセージの生成ルール（Conventional Commits準拠）
2. **`.github/instructions/global.instructions.md`** - プロジェクト全体のルールとBEM命名規則
3. **`.github/instructions/css.instructions.md`** - CSS/Sassのコーディングルール
4. **`.github/instructions/figma.instructions.md`** - Figma連携時のルール
5. **`.github/instructions/img.instructions.md`** - 画像ファイルの命名規則

## GitHub Copilot使用時の指示

コミットメッセージを生成する際は：

1. **必ず上記のルールファイルを参照する**
2. **Conventional Commitsフォーマットに厳密に従う**
3. **変更内容を解析してtype(scope): subjectの形式で生成**
4. **日本語でbodyに詳細を箇条書きで記述**
5. **デザイン値の直書き、BEM命名規則、レスポンシブ対応の遵守状況を明記**

## 例

```
feat(header): PCファーストのレイアウト実装

- index.htmlにヒーローセクションを追加
- sass/page/_index.scssに基本レイアウトと@include mq(sp)を追加
- 変数はsass/global/_variables.scssを使用
```

このプロンプトにより、常に一貫性のあるコミットメッセージが生成されます。