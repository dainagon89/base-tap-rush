'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, highScoreBoardAbi } from '@/lib/contract';

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function Leaderboard() {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: highScoreBoardAbi,
    functionName: 'getTopScores',
    query: { refetchInterval: 15_000 },
  });

  const scores = data ? [...data] : [];

  return (
    <div className="rounded-2xl border border-base-line bg-base-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-base-mist">
          オンチェーン・リーダーボード
        </h2>
        <button
          onClick={() => refetch()}
          className="focus-ring text-xs text-base-mist underline hover:text-white"
        >
          更新
        </button>
      </div>

      {isLoading && <p className="text-sm text-base-mist">読み込み中…</p>}

      {!isLoading && scores.length === 0 && (
        <p className="text-sm text-base-mist">まだ記録がありません。最初の記録者になろう。</p>
      )}

      <ol className="space-y-2">
        {scores
          .sort((a, b) => Number(b.score) - Number(a.score))
          .map((entry, i) => (
            <li
              key={`${entry.player}-${i}`}
              className="flex items-center justify-between rounded-lg bg-base-ink px-3 py-2 font-mono text-sm"
            >
              <span className="text-base-mist">
                {String(i + 1).padStart(2, '0')}　{truncateAddress(entry.player)}
              </span>
              <span className="text-white">{entry.score.toString()}</span>
            </li>
          ))}
      </ol>
    </div>
  );
}
