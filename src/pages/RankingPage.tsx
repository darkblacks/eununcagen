import Layout from "../components/Layout";
import RankingCard from "../components/RankingCard";
import { useGame } from "../context/GameContext";

export default function RankingPage() {
  const { rankingJa, rankingNunca } = useGame();

  return (
    <Layout
      title="Ranking"
      subtitle="Veja quem mais marcou em cada categoria."
    >
      <div className="ranking-grid">
        <RankingCard title="Quem mais respondeu Eu Já" items={rankingJa} />
        <RankingCard title="Quem mais respondeu Eu Nunca" items={rankingNunca} />
      </div>
    </Layout>
  );
}