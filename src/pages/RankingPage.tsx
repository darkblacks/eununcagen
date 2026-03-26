import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import ReactECharts from "echarts-for-react";

export default function RankingPage() {
  const { appUser } = useAuth();
  const { ranking, totalEuJa, totalEuNunca, resetGame } = useGame();

  const chartOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Eu Já", "Eu Nunca"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        data: [totalEuJa, totalEuNunca],
      },
    ],
  };

  return (
    <Layout title="Ranking" subtitle="Resultado final do jogo.">
      <div className="card">
        <h3>Resumo geral</h3>
        <p>Total Eu Já: {totalEuJa}</p>
        <p>Total Eu Nunca: {totalEuNunca}</p>
        <ReactECharts option={chartOption} style={{ height: 320 }} />
      </div>

      <div className="card">
        <h3>Ranking por participante</h3>

        <div className="list-grid">
          {ranking.length === 0 ? (
            <div className="list-item">
              <strong>Nenhuma resposta registrada</strong>
              <span>0</span>
            </div>
          ) : (
            ranking.map((item) => (
              <div key={item.uid} className="list-item">
                <div>
                  <strong>{item.name}</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>{item.totalEuJa} votos eu já</div>
                  <div>{item.totalEuNunca} votos eu nunca</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {appUser?.role === "admin" && (
        <div className="card">
          <button className="danger-btn" onClick={resetGame}>
            Finalizar e limpar respostas
          </button>
        </div>
      )}
    </Layout>
  );
}