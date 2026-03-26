import Layout from "../components/Layout";
import AdminPanel from "./AdminPanel";
import QuestionCard from "../components/QuestionCard";
import VoteButtons from "../components/VoteButtons";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
export default function GamePage() {
const { appUser } = useAuth();
const { roomState } = useGame();
return (
<Layout title="Rodada em andamento" subtitle="Vote antes do tempo
acabar.">
{appUser?.role === "admin" && <AdminPanel />}
<QuestionCard
category={roomState.currentQuestionCategory}
question={roomState.currentQuestionText}
timeLeft={roomState.timeLeft}
/>
<VoteButtons />
</Layout>
);
}
