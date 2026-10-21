# 🚀 クイックスタートガイド

## 最速でアプリを起動する手順

### 1. 依存関係のインストール（初回のみ）
```bash
cd shared-calendar
npm install
```

### 2. Firebase プロジェクトの作成（5分）

1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：shared-calendar）
4. Googleアナリティクスは任意（スキップ可能）

### 3. Authentication の設定（2分）

1. 左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 「Google」を選択して有効化
5. プロジェクトのサポートメールを設定
6. 「保存」をクリック

### 4. Firestore Database の作成（2分）

1. 左メニューから「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. 「テストモードで開始」を選択（開発時）
4. ロケーション（asia-northeast1 推奨）を選択
5. 「有効にする」をクリック
6. 「ルール」タブで以下を設定:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.creatorId;
    }
  }
}
```

### 5. Firebase 設定の取得（1分）

1. 左メニューのプロジェクト設定（⚙️アイコン）をクリック
2. 下にスクロールして「マイアプリ」セクションを表示
3. 「</>」（ウェブ）アイコンをクリック
4. アプリのニックネームを入力（例：shared-calendar-web）
5. 「アプリを登録」をクリック
6. 表示された `firebaseConfig` の値をコピー

### 6. 環境変数の設定（1分）

```bash
# .env.local ファイルを作成
cp .env.local.example .env.local

# エディタで .env.local を開いて、Firebase設定を貼り付け
# 各値を firebaseConfig からコピー
```

例:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shared-calendar-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shared-calendar-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shared-calendar-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

#### Discord 通知の設定（任意）

1. Discord の通知先チャンネルで「チャンネルの編集」→「連携サービス」→「ウェブフック」を開く
2. ウェブフックを作成し、ウェブフックURLをコピー
3. Firebase コンソールの「プロジェクトの設定」→「サービス アカウント」で秘密鍵 JSON を生成
4. `.env.local` に以下を追加し、サービスアカウント JSON 全体を1行で貼り付け

```env
DISCORD_WEBHOOK_URL=<DiscordのウェブフックURL>
FIREBASE_SERVICE_ACCOUNT_KEY=<サービスアカウントJSON全体>
```

`FIREBASE_SERVICE_ACCOUNT_KEY` は秘密情報です。`NEXT_PUBLIC_` を付けず、Gitに登録しないでください。Vercelなどへデプロイする場合も、同じ変数をサーバー環境変数として登録してください。設定後、開発サーバーを再起動します。

予定の作成・編集・参加承諾・削除がDiscordに通知されます。

### 7. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

### 8. ログインして使ってみる！

1. 「Googleでログイン」をクリック
2. Googleアカウントを選択
3. カレンダーで「予定を追加」をクリック
4. 予定を作成して確認！

---

## 📝 チェックリスト

- [ ] Node.js がインストールされている（node -v で確認）
- [ ] npm install を実行した
- [ ] Firebase プロジェクトを作成した
- [ ] Google Authentication を有効化した
- [ ] Firestore Database を作成した
- [ ] Firestore ルールを設定した
- [ ] Firebase 設定を .env.local にコピーした
- [ ] npm run dev でサーバーを起動した
- [ ] ログインが成功した

---

## ⚠️ よくあるエラーと解決方法

### エラー: "Firebase: Error (auth/configuration-not-found)"
→ .env.local ファイルが正しく設定されていません。ファイル名とパスを確認してください。

### エラー: "Missing or insufficient permissions"
→ Firestore のルールが設定されていません。上記の手順4を確認してください。

### エラー: 画像が表示されない
→ next.config.js の設定を確認してください（既に設定済みです）。

### その他のエラー
→ README.md のトラブルシューティングセクションを参照してください。

---

## 🎉 完了！

おめでとうございます！共有カレンダーアプリが動作しています。

次のステップ:
- 他のGoogleアカウントでもログインして、予定を共有してみましょう
- デプロイ: Vercel にデプロイして本番環境で使用できます
