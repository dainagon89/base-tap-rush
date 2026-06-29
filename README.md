# Base Tap Rush

10秒間のタップチャレンジ。ゲーム終了後、ウォレットを接続してハイスコアを
**Base**チェーン上のコントラクトに記録できます。リーダーボードは
オンチェーンデータから読み込まれ、誰でも検証可能です。

- フロントエンド: Next.js 14 (App Router) + wagmi v2 + viem + Tailwind CSS
- コントラクト: Solidity（`contracts/HighScoreBoard.sol`）
- 対応ウォレット: ブラウザ拡張ウォレット（MetaMaskなど）, Coinbase Wallet

---

## 1. 事前準備

- Node.js 18以上
- ブラウザ拡張ウォレット（[MetaMask](https://metamask.io/)など）
- テストする場合: Base Sepolia用のテストネットETH
  （[Base公式の faucet 一覧](https://docs.base.org/base-chain/network-information/network-faucets)から取得できます）

---

## 2. コントラクトをデプロイする

最も簡単な方法は [Remix IDE](https://remix.ethereum.org) を使う方法です。

1. Remixを開き、新規ファイル `HighScoreBoard.sol` を作成し、
   `contracts/HighScoreBoard.sol` の内容をコピーして貼り付けます。
2. 左メニューの **Solidity Compiler** タブで、コンパイラバージョンを
   `0.8.24` 以上に設定し、**Compile** します。
3. 左メニューの **Deploy & Run Transactions** タブを開きます。
4. **Environment** を `Injected Provider - MetaMask` に設定します
   （MetaMask側でネットワークを **Base Sepolia** に切り替えておいてください。
   Base SepoliaがMetaMaskに登録されていない場合は
   [chainlist.org](https://chainlist.org/?search=base+sepolia) から追加できます）。
5. **Deploy** をクリックし、MetaMaskでトランザクションを承認します。
6. デプロイ完了後に表示される**コントラクトアドレス**をコピーしておきます。

本番でBaseメインネットにデプロイする場合は、手順4のネットワークを
**Base** に変更するだけです（メインネットETHが必要になります）。

Foundry / Hardhatを使い慣れている場合は、もちろんそちらでも構いません。
コントラクトに外部依存はないため、そのままデプロイできます。

---

## 3. フロントエンドをローカルで動かす

```bash
cd base-tap-rush
npm install
cp .env.example .env.local
```

`.env.local` を編集し、デプロイしたコントラクトアドレスを設定します:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xあなたのコントラクトアドレス
NEXT_PUBLIC_CHAIN_ID=84532
```

開発サーバーを起動:

```bash
npm run dev
```

`http://localhost:3000` を開いて確認してください。

---

## 4. Vercelにデプロイする

1. このプロジェクトをGitHubリポジトリにpushします。
2. [vercel.com](https://vercel.com) で **New Project** → 該当リポジトリを選択。
3. **Environment Variables** に以下を追加:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID`
4. **Deploy** をクリックすれば完了です。Framework Presetは自動でNext.jsが検出されます。

---

## ディレクトリ構成

```
base-tap-rush/
├── contracts/
│   └── HighScoreBoard.sol   # オンチェーン・ハイスコアコントラクト
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx        # wagmi / react-query プロバイダー
│   └── globals.css
├── components/
│   ├── Game.tsx              # ゲーム本体・スコア送信
│   ├── Leaderboard.tsx        # オンチェーン・リーダーボード表示
│   └── WalletBar.tsx          # ウォレット接続UI
├── lib/
│   ├── wagmiConfig.ts          # チェーン・コネクタ設定
│   └── contract.ts             # コントラクトアドレス・ABI
└── .env.example
```

## カスタマイズのヒント

- ゲーム時間や難易度: `components/Game.tsx` の `GAME_SECONDS` /
  `TARGET_SIZE_PCT` を変更してください。
- リーダーボードの最大件数: `contracts/HighScoreBoard.sol` の
  `MAX_LEADERBOARD_SIZE`（再デプロイが必要です）。
- WalletConnect対応など他のウォレットを増やしたい場合は
  `lib/wagmiConfig.ts` の `connectors` 配列に追加してください。
