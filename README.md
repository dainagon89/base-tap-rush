# Base Tap Rush

10秒間の反射神経ゲーム。動くターゲットをタップしてスコアを競い、ハイスコアはBaseメインネット上に永続的に記録されます。

**🎮 Play:** https://base-tap-rush-lilac.vercel.app
**📦 GitHub:** https://github.com/dainagon89/base-tap-rush

---

## 概要

Base Tap Rush は、Baseチェーン上で動くオンチェーンゲームです。プレイヤーは10秒間のセッション内でできるだけ多くターゲットをタップし、そのスコアをオンチェーンに送信します。ハイスコアとリーダーボードはすべてスマートコントラクトに記録され、誰でもBasescan経由で検証可能です。

すべてのスコア送信トランザクションには [ERC-8021 Builder Code](https://ercs.ethereum.org/) が付与されており、Baseエコシステム上でのビルダー活動として帰属(attribution)されます。

## 機能

- 10秒間のリアクションゲームプレイ
- スコアのオンチェーン記録(Base mainnet)
- オンチェーンリーダーボード(トップ10)
- ウォレットごとの自己ベストスコア取得
- ERC-8021 Builder Codeによるトランザクション帰属

## 技術スタック

- **フレームワーク:** Next.js 14–16 (App Router)
- **Web3ライブラリ:** wagmi, viem
- **スタイリング:** Tailwind CSS
- **スマートコントラクト:** Solidity (Remix IDEで開発)
- **デプロイ:** Vercel
- **チェーン:** Base Mainnet (Chain ID: 8453)

## デプロイ済みURL

| 項目 | URL |
| --- | --- |
| アプリ | https://base-tap-rush-lilac.vercel.app |
| GitHub | https://github.com/dainagon89/base-tap-rush |

## 環境変数の設定方法

Vercelの `Settings → Environment Variables` から以下を設定してください(実際に必要な変数は `.env.example` を参照し、プロジェクト構成に合わせて調整してください):

```bash
# .env.local (例)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x31503a2f1eEa2BCFA05e71754E82c6600C85FA69
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

設定後は Vercel の Deployments タブから **Redeploy** して反映してください。

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

## Builder Code (ERC-8021)

すべてのスコア送信トランザクションに ERC-8021 Builder Code サフィックスが付与され、Baseに対して本アプリのビルダー活動として帰属します。

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
