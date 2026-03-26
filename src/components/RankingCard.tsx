import type { RankingEntry } from "../types/ranking";

type RankingCardProps = {
  entry: RankingEntry;
};

export default function RankingCard({ entry }: RankingCardProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">
          {entry.position ? `#${entry.position}` : "Participante"}
        </span>
        <span className="text-sm font-semibold text-emerald-400">
          {entry.score} pts
        </span>
      </div>

      <h3 className="mt-2 text-lg font-bold text-white">{entry.name}</h3>
    </div>
  );
}