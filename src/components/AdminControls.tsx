import { useGame } from "../context/GameContext";
export default function AdminControls() {
const { startGame, goToWaiting, resetGame, finishRoundNow } = useGame();
return (
<div className="admin-controls card">
<button className="primary-btn" onClick={startGame}>Iniciar</button>
<button className="secondary-btn" onClick={finishRoundNow}>Encerrar
pergunta</button>
<button className="secondary-btn" onClick={goToWaiting}>Voltar para
espera</button>
<button className="danger-btn" onClick={resetGame}>Resetar jogo</
button>
</div>
);
}