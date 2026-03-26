import { useGame } from "../context/GameContext";

export default function AdminControls() {
  const { roomState, startGame, nextQuestion, finishRoundNow, resetGame } = useGame();

  return (
    <div className="card" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {roomState.status === "waiting" && (
        <button className="primary-btn" onClick={startGame}>
          Iniciar jogo
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
        Resetar tudo
      </button>
    </div>
  );
}