import { useGame } from "../context/GameContext";

export default function AdminControls() {
  const { startGame, nextQuestion, resetGame, finishRoundNow, roomState } = useGame();

  return (
    <div className="admin-controls card">
      {roomState.status === "waiting" && (
        <button className="primary-btn" onClick={startGame}>
          Iniciar
        </button>
      )}

      {roomState.status === "playing" && (
        <>
          <button className="secondary-btn" onClick={finishRoundNow}>
            Encerrar pergunta
          </button>
          <button className="primary-btn" onClick={nextQuestion}>
            Próxima pergunta
          </button>
        </>
      )}

      <button className="danger-btn" onClick={resetGame}>
        Resetar jogo
      </button>
    </div>
  );
}