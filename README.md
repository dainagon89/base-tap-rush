# Base Tap Rush

10秒間の反射神経ゲーム。動くターゲットをタップしてスコアを競い、ハイスコアはBaseメインネット上に永続的に記録されます。ゲーム終了後は、x402マイクロペイメントで**AIコーチのアドバイス**を受け取ることもできます。

**🎮 Play:** https://base-tap-rush-lilac.vercel.app
**📦 GitHub:** https://github.com/dainagon89/base-tap-rush

---

## 概要

Base Tap Rush は、Baseチェーン上で動くオンチェーンゲームです。プレイヤーは10秒間のセッション内でできるだけ多くターゲットをタップし、そのスコアをオンチェーンに送信します。ハイスコアとリーダーボードはすべてスマートコントラクトに記録され、誰でもBasescan経由で検証可能です。

ゲーム終了後は、$0.001 USDCのx402マイクロペイメントでAIコーチからスコアに応じたアドバイスを受け取れます。決済はCDP facilitatorを介さず、自前のverify/settle実装(EIP-3009 `transferWithAuthorization`)で完結しています。

すべてのオンチェーン操作(スコア送信・AIコーチ決済)には [ERC-8021 Builder Code](https://ercs.ethereum.org/) が付与されており、Baseエコシステム上でのビルダー活動として帰属(attribution)されます。

## 機能

- 10秒間のリアクションゲームプレイ
- スコアのオンチェーン記録(Base mainnet)
- オンチェーンリーダーボード(トップ10)
- ウォレットごとの自己ベストスコア取得
- **x402 AIコーチのアドバイス**($0.001 USDC、自前decision実装)
- ERC-8021 Builder Codeによるトランザクション帰属

## 技術スタック

- **フレームワーク:** Next.js 14–16 (App Router)
- **Web3ライブラリ:** wagmi, viem
- **スタイリング:** Tailwind CSS
- **スマートコントラクト:** Solidity (Remix IDEで開発)
- **決済:** x402(自前のverify/settle、CDP facilitator不使用)
- **デプロイ:** Vercel
- **チェーン:** Base Mainnet (Chain ID: 8453)

## デプロイ済みURL

| 項目 | URL |
| --- | --- |
| アプリ | https://base-tap-rush-lilac.vercel.app |
| GitHub | https://github.com/dainagon89/base-tap-rush |

## 環境変数の設定方法

Vercelの `Settings → Environment Variables` から以下を設定してください:

```bash
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x31503a2f1eEa2BCFA05e71754E82c6600C85FA69
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_ADVICE_RECIPIENT=your_payout_wallet_address   # AIコーチ決済の収益受取先
RELAYER_PRIVATE_KEY=your_relayer_wallet_private_key        # x402決済のリレー実行用(Base Shooter NFTと共有)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

設定後は Vercel の Deployments タブから **Redeploy** して反映してください。

> ⚠️ `RELAYER_PRIVATE_KEY` はガス代を含むオンチェーン決済を行う秘密鍵です。絶対にリポジトリにコミットせず、Vercelの環境変数としてのみ管理してください。

> ⚠️ `BigInt` リテラルを使用するため、`tsconfig.json` の `target` は `ES2020` 以上である必要があります。

> ⚠️ `wagmi` の `coinbaseWallet` コネクタが間接的に `@coinbase/cdp-sdk` を読み込むため、実際に使わなくても `@x402/core` / `@x402/evm` / `@x402/svm` を `package.json` に含めておく必要があります(でないとビルドが失敗します)。

## コントラクト情報

| 項目 | 値 |
| --- | --- |
| コントラクトアドレス | `0x31503a2f1eEa2BCFA05e71754E82c6600C85FA69` |
| チェーン | Base Mainnet (Chain ID: 8453) |
| Basescan | https://basescan.org/address/0x31503a2f1eEa2BCFA05e71754E82c6600C85FA69 |

### 主な読み取り関数

- `getTopScores()` — トップ10のスコア・プレイヤーアドレス・タイムスタンプを取得
- `bestScore(address)` — 指定ウォレットの自己ベストスコアを取得
- `getLeaderboardLength()` — リーダーボードの登録件数を取得

## x402 AIコーチのアドバイス

ゲーム終了後、$0.001 USDCの支払いでタップ数に応じたAIコーチのアドバイスを受け取れます。決済はCDP facilitatorを使わず、サーバー側で直接EIP-3009署名を検証し、専用のリレーウォレットがオンチェーン決済を実行する自前実装です(Base Shooter NFTと同じ方式)。

```
GET https://base-tap-rush-lilac.vercel.app/api/advice?score={score}
```

| 項目 | 値 |
| --- | --- |
| 決済方式 | EIP-3009 TransferWithAuthorization(自前のverify/settle) |
| Asset | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`(USDC on Base) |
| 金額 | 1000(= $0.001 USDC、6 decimals) |
| EIP-712 domain name | `USD Coin`(BaseScan表示名の`USDC`とは異なるので注意) |

## Builder Code (ERC-8021)

スコア送信・AIコーチ決済、すべてのオンチェーン操作にBuilder Codeサフィックスが付与されます。

| 項目 | 値 |
| --- | --- |
| Builder Code | `bc_l3jofats` |
| Encoded | `0x62635f6c336a6f666174730b0080218021802180218021802180218021` |

## その他

| 項目 | 値 |
| --- | --- |
| Builder (ENS) | `dainagon.eth` |
| Builder (Address) | `0x4128F1A04767F1856db4f1588F8250F9ED948D12` |
| base.dev App ID | `6a4224fb8bbb28b54e0b3384` |

---

Built with ❤️ on [Base](https://base.org)
