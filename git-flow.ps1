param(
  [string]$SubBranch = "sub",   # 作業ブランチ名（必要なら変更）
  [string]$MainBranch = "main", # メインブランチ名
  [string]$Remote = "origin"    # リモート名
)

# ➀ subブランチにアクセス
git checkout $SubBranch

# ② 変更をステージング（必要に応じて対象を調整）
git add .

# ここで一時停止し、別ターミナルや Cursor でコミットメッセージを生成して git commit する
Read-Host | Out-Null

# ➄ mainブランチに切り替え
git checkout $MainBranch

# ➅ sub を main にマージ
git merge $SubBranch

# main をリモートにプッシュ
git push $Remote $MainBranch

# ➆ mainブランチを GitHub にプルリクエスト（gh CLI 使用）
gh pr create `
  --base $MainBranch `
  --head $SubBranch `
  --title "merge sub into main" `
  --body "PR created by git-flow script."

# ⑧ subブランチに戻る
git checkout $SubBranch