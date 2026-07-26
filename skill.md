# Base Tap Rush Skill

## Overview

This skill enables AI agents to interact with the Base Tap Rush game ecosystem on Base mainnet.
Query on-chain high scores, leaderboard data, player statistics, and access the paid AI coaching
endpoint directly.

Base Tap Rush is a 10-second reflex game where players tap a moving target as many times as possible.
High scores are recorded permanently on-chain with Builder Code attribution (ERC-8021). After each
game, players can pay $0.001 USDC via x402 to receive AI coaching advice based on their score.

## Contract Info

| Field | Value |
| --- | --- |
| Contract Address | `0x31503a2f1eEa2BCFA05e71754E82c6600C85FA69` |
| Chain | Base Mainnet (Chain ID: 8453) |
| Basescan | https://basescan.org/address/0x31503a2f1eEa2BCFA05e71754E82c6600C85FA69 |

## On-Chain Features

### High Score Recording

Players submit their scores on-chain after each game session.
Each transaction includes a Builder Code suffix (ERC-8021) for attribution:
Builder Code: bc_l3jofats
Encoded: 0x62635f6c336a6f666174730b0080218021802180218021802180218021

### Leaderboard

Top 10 scores are stored on-chain and publicly readable.
Anyone can verify the leaderboard by reading the contract directly.

**Read functions:**

- `getTopScores()` → Returns top 10 scores with player addresses and timestamps
- `bestScore(address)` → Returns the personal best score for a given wallet
- `getLeaderboardLength()` → Returns the current number of entries on the leaderboard

## x402 AI Coaching Endpoint (Paid)

After a game session, agents or players can pay $0.001 USDC for AI-generated coaching advice
based on the tap score.

```
GET https://base-tap-rush-lilac.vercel.app/api/advice?score={score}
```

**Payment flow (x402, self-settled — no CDP facilitator dependency):**
1. Request without `X-PAYMENT` header → `402 Payment Required` with `paymentRequirements`
   (scheme: `exact`, network: `eip155:8453`, asset: USDC, amount: `1000` = $0.001).
2. Client signs an EIP-3009 `TransferWithAuthorization` typed-data message.
   **Important:** the EIP-712 domain name must be `"USD Coin"`, not `"USDC"` — the on-chain
   contract's actual `name()` return value differs from its BaseScan display label.
3. Client resubmits the same request with the base64-encoded payload in the `X-PAYMENT` header.
4. Server verifies the signature locally (no external facilitator), then settles on-chain via
   its own dedicated relayer wallet, appending the Builder Code suffix to calldata.
5. On success, returns the advice text plus the settlement `txHash`.

This is the same self-settlement pattern used by Base Shooter NFT, adopted after CDP's hosted
facilitator repeatedly failed on-chain verification for reasons believed to be related to
business/KYC requirements not completable by individual developers in some regions.

## Builder Code (ERC-8021)

All on-chain transactions this app facilitates (score submission, AI coaching payment) include
an ERC-8021 Builder Code suffix, attributing each on-chain action to this application.

This enables Base to track real builder activity and distinguish genuine
user interactions from bot activity.

| Field | Value |
| --- | --- |
| Builder Code | `bc_l3jofats` |
| Encoded | `0x62635f6c336a6f666174730b0080218021802180218021802180218021` |

## Links

- **Game:** https://base-tap-rush-lilac.vercel.app
- **GitHub:** https://github.com/dainagon89/base-tap-rush
- **Builder:** `dainagon.eth` (`0x4128F1A04767F1856db4f1588F8250F9ED948D12`)
- **base.dev App ID:** `6a4224fb8bbb28b54e0b3384`
