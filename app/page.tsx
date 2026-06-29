import { WalletBar } from '@/components/WalletBar';
import { Game } from '@/components/Game';
import { Leaderboard } from '@/components/Leaderboard';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-8 px-5 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-base-blue">
            on base
          </p>
          <h1 className="font-display text-2xl font-bold text-white">Base Tap Rush</h1>
        </div>
      </header>

      <WalletBar />

      <Game />

      <Leaderboard />

      <footer className="pb-6 text-center text-[11px] text-base-mist">
        スコアはオンチェーンに記録され、誰でも検証できます。
      </footer>
    </main>
  );
}
