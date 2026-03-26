import Layout from "../components/Layout";
import RankingCard from "../components/RankingCard";
import { useGame } from "../context/GameContext";

export default function RankingPage() {
  const { ranking } = useGame();

  const rankingEuJa = [...ranking].sort((a, b) => b.totalEuJa - a.totalEuJa);
  const rankingEuNunca = [...ranking].sort(
    (a, b) => b.totalEuNunca - a.totalEuNunca
  );

  return (
    <Layout title="Ranking" subtitle="Resultado final da rodada.">
      <div className="ranking-grid">
        <RankingCard title="Quem mais respondeu Eu Já" items={rankingEuJa} />
        <RankingCard title="Quem mais respondeu Eu Nunca" items={rankingEuNunca} />
      </div>
    </Layout>
  );
}