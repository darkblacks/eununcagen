import Layout from "../components/Layout";
import RankingCard from "../components/RankingCard";
import AdminPanel from "./AdminPanel";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
export default function RankingPage() {
const { appUser } = useAuth();
const { rankingJa, rankingNunca } = useGame();
return (
<Layout title="Ranking final" subtitle="Veja quem mais marcou Eu já e Eu
nunca.">
{appUser?.role === "admin" && <AdminPanel />}
<div className="ranking-grid">
<RankingCard title="Quem mais marcou Eu já" items={rankingJa} />
<RankingCard title="Quem mais marcou Eu nunca" items={rankingNunca} /
>
</div>
</Layout>
);
}
