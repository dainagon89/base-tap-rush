'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, highScoreBoardAbi } from '@/lib/contract';
import { TARGET_CHAIN_ID } from '@/lib/wagmiConfig';
import { AdviceButton } from '@/components/AdviceButton';

const GAME_SECONDS = 10;
const TARGET_SIZE_PCT = 14;

type GameState = 'idle' | 'playing' | 'ended';

function randomPosition() {
  const max = 100 - TARGET_SIZE_PCT;
  return {
    top: Math.random() * max,
    left: Math.random() * max,
  };
}

export function Game() {
  const { address, isConnected, chainId } = useAccount();

  const [state, setState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [position, setPosition] = useState(randomPosition());
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [easHash, setEasHash] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: hash, writeContract, isPending: isSubmitting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: bestScore, refetch: refetchBest } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: highScoreBoardAbi,
    functionName: 'bestScore',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setPosition(randomPosition());
    setSubmittedScore(null);
    setEasHash(null);
    setState('playing');
  }, []);

  useEffect(() => {
    if (state !== 'playing') return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setState('ended');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (isConfirmed && address && submittedScore !== null) {
      refetchBest();
      // EASアテステーションをAPIルート経由で発行
      fetch('/eas-attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerAddress: address, score: submittedScore }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.hash) setEasHash(data.hash);
        })
        .catch((err) => console.error('EAS attest error:', err));
    }
  }, [isConfirmed, address, submittedScore, refetchBest]);

  const onTap = () => {
    if (state !== 'playing') return;
    setScore((s) => s + 1);
    setPosition(randomPosition());
  };

  const onSubmit = () => {
    setSubmittedScore(score);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: highScoreBoardAbi,
      functionName: 'submitScore',
      args: [BigInt(score)],
      dataSuffix: BUILDER_CODE_SUFFIX,
    });
  };

  const canSubmit =
  state === 'ended' &&
  isConnected &&
  chainId === TARGET_CHAIN_ID &&
  score > 0 &&
  submittedScore === null;

    
  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-base-line bg-gradient-to-b from-base-panel to-base-ink">
        <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-4 font-mono text-sm">
          <span className="text-base-mist">
            SCORE <span className="text-white">{score.toString().padStart(2, '0')}</span>
          </span>
          <span className="text-base-mist">
            TIME <span className="text-white">{timeLeft.toString().padStart(2, '0')}</span>
          </span>
        </div>

        {state === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <p className="max-w-xs text-sm text-base-mist">
              10秒間でできるだけ多くターゲットをタップしよう。
            </p>
            <button
              onClick={startGame}
              className="focus-ring rounded-full bg-base-blue px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              スタート
            </button>
          </div>
        )}

        {state === 'playing' && (
          <button
            aria-label="ターゲット"
            onClick={onTap}
            style={{ top: `${position.top}%`, left: `${position.left}%`, width: `${TARGET_SIZE_PCT}%` }}
            className="focus-ring absolute aspect-square rounded-2xl bg-base-blue shadow-[0_0_30px_rgba(0,82,255,0.5)] transition-[top,left] duration-150 ease-out hover:scale-105 active:scale-95"
          />
        )}

        {state === 'ended' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <p className="font-mono text-4xl font-semibold text-white">{score}</p>
            <p className="text-sm text-base-mist">タップ数</p>

            {!isConnected && (
              <p className="max-w-xs text-xs text-base-mist">
                スコアをチェーンに記録するにはウォレットを接続してください。
              </p>
            )}

            {canSubmit && (
              <button
                onClick={onSubmit}
                disabled={isSubmitting || isConfirming}
                className="focus-ring rounded-full bg-base-blue px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {isSubmitting || isConfirming ? '送信中…' : 'Baseに記録する'}
              </button>
            )}

            {submittedScore !== null && (
              <p className="text-xs">
                {isConfirming && <span className="text-base-mist">トランザクション確認中…</span>}
                {isConfirmed && (
                  <span className="text-emerald-400">
                    チェーンに記録されました ✓
                    {easHash && (
                      <a
                        href={`https://base.easscan.org/attestation/view/${easHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 underline"
                      >
                        EAS証明書を見る
                      </a>
                    )}
                  </span>
                )}
                {writeError && <span className="text-red-400">送信に失敗しました</span>}
              </p>
            )}

            <AdviceButton score={score} />

            <button
              onClick={startGame}
              className="focus-ring text-xs text-base-mist underline hover:text-white"
            >
              もう一度プレイ
            </button>
          </div>
        )}
      </div>

      {isConnected && bestScore !== undefined && (
        <p className="text-center font-mono text-xs text-base-mist">
          あなたの自己ベスト: <span className="text-white">{bestScore.toString()}</span>
        </p>
      )}
    </div>
  );
}
