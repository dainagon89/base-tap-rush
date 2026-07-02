# Base Tap Rush Skill

## Overview
This skill enables AI agents to interact with the Base Tap Rush game ecosystem on Base mainnet.
Query on-chain high scores, leaderboard data, and player statistics directly from the blockchain.

Base Tap Rush is a 10-second reflex game where players tap a moving target as many times as possible.
High scores are recorded permanently on-chain with Builder Code attribution (ERC-8021).

## Contract Info

| Field | Value |
|---|---|
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

## Builder Code (ERC-8021)

All score submission transactions include an ERC-8021 Builder Code suffix,
attributing each on-chain action to this application.

This enables Base to track real builder activity and distinguish genuine
user interactions from bot activity.

## Links

- **Game:** https://base-tap-rush-lilac.vercel.app
- **GitHub:** https://github.com/dainagon89/base-tap-rush
- **Builder:** `dainagon.eth` (`0x4128F1A04767F1856db4f1588F8250F9ED948D12`)
- **base.dev App ID:** `6a4224fb8bbb28b54e0b3384`
