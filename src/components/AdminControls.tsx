import { useGame } from "../context/GameContext";

export default function AdminControls() {
  const { roomState, startGame, nextQuestion, resetGame } = useGame();

  return (
    <div className="admin-controls-bar card">
      {roomState.status === "waiting" && (
        <button className="primary-btn admin-btn" onClick={startGame} type="button">
          Iniciar jogo
        </button>
      )}

      {roomState.status === "playing" && (
        <button className="primary-btn admin-btn" onClick={nextQuestion} type="button">
          Próxima pergunta
        </button>
      )}

      <button className="danger-btn admin-btn" onClick={resetGame} type="button">
        Finalizar / Resetar
      </button>
    </div>
  );
}