# 共有カレンダーアプリケーション

Next.js + Firebase で構築された、チームで予定を共有できるカレンダーアプリケーションです。

## 主な機能

- 🔐 **Firebase Google認証**: Googleアカウントで簡単ログイン
- 📅 **週間カレンダービュー**: 24時間表示の見やすいカレンダー
- ➕ **予定の作成**: タイトル、日時、時間数、説明を設定可能
- 👥 **参加者管理**: 予定の作成者と承諾した参加者を視覚的に表示
- ✅ **承諾機能**: 他のユーザーの予定を承諾できる
- 🔄 **リアルタイム同期**: Firestoreによる自動更新
- 📱 **レスポンシブデザイン**: モバイルからデスクトップまで対応

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Firebase (Authentication, Firestore)
- **日付処理**: date-fns

## セットアップ手順

### 1. 前提条件

- Node.js 18以上
- npm または yarn
- Firebaseアカウント

### 2. リポジトリのクローンと依存関係のインストール

```bash
# 依存関係のインストール
npm install
```

### 3. Firebase プロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. **Authentication** を設定:
   - Authentication → Sign-in method → Google を有効化
4. **Firestore Database** を作成:
   - Firestore Database → データベースを作成
   - テストモードまたは本番モードで開始
5. プロジェクト設定から Firebase 設定を取得

### 4. Firestore セキュリティルールの設定

Firestore Database → ルール タブで以下のルールを設定:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // 認証済みユーザーは全てのイベントを読み取り可能
      allow read: if request.auth != null;
      
      // 認証済みユーザーはイベントを作成可能
      allow create: if request.auth != null;
      
      // 認証済みユーザーはイベントを更新可能（承諾機能のため）
      allow update: if request.auth != null;
      
      // イベント作成者のみ削除可能
      allow delete: if request.auth != null && 
                      request.auth.uid == resource.data.creatorId;
    }
  }
}
```

### 5. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

`.env.local` ファイルを編集して、Firebase設定を入力:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

### ログイン
1. トップページで「Googleでログイン」ボタンをクリック
2. Googleアカウントを選択してログイン

### 予定の作成
1. 「予定を追加」ボタンをクリック、または カレンダーのセルをクリック
2. タイトル、日付、時間、時間数を入力
3. 「作成」ボタンをクリック

### 予定の閲覧
- カレンダー上の予定をクリックすると詳細が表示されます
- 作成者と承諾した参加者のアイコンが表示されます

### 予定の承諾
1. 他のユーザーが作成した予定をクリック
2. 「承諾する」ボタンをクリック
3. あなたのアイコンが参加者リストに追加されます

### 予定の削除
- 自分が作成した予定の詳細画面で「削除」ボタンをクリック

## デプロイ

### Vercel へのデプロイ

1. [Vercel](https://vercel.com) にプロジェクトをインポート
2. 環境変数を設定（.env.local の内容）
3. デプロイ

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── calendar/          # カレンダーページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ（ログイン）
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── AddEventModal.tsx
│   ├── CalendarGrid.tsx
│   ├── CalendarNavigation.tsx
│   ├── CalendarPage.tsx
│   ├── EventDetailModal.tsx
│   ├── Header.tsx
│   └── LoginPage.tsx
├── contexts/              # React Context
│   └── AuthContext.tsx    # 認証コンテキスト
├── lib/                   # ユーティリティ
│   └── firebase.ts        # Firebase初期化
└── types/                 # TypeScript型定義
    └── index.ts
```

## トラブルシューティング

### Firebase エラー
- Firebase設定が正しいか確認してください
- Firestore ルールが設定されているか確認してください
- Authentication で Google ログインが有効になっているか確認してください

### 画像が表示されない
- `next.config.js` で `lh3.googleusercontent.com` がドメインリストに含まれているか確認してください

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。
