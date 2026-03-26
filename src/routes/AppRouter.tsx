import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import LoginPage from "../pages/LoginPage";
import WaitingPage from "../pages/WaitingPage";
import GamePage from "../pages/GamePage";
import RankingPage from "../pages/RankingPage";

export default function AppRouter() {
  const { user, loading } = useAuth();
  const { roomState } = useGame();

  if (loading) {
    return <div className="center-screen">Carregando...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (roomState.status === "waiting") {
    return <WaitingPage />;
  }

  if (roomState.status === "playing") {
    return <GamePage />;
  }

  return <RankingPage />;
}