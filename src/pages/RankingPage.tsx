import Layout from "../components/Layout";
import { useGame } from "../context/GameContext";
import ReactECharts from "echarts-for-react";

export default function RankingPage() {
  const { ranking, totalEuJa, totalEuNunca } = useGame();

  const option = {
    tooltip: { trigger: "item" },
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
        barWidth: "40%",
      },
    ],
  };

  return (
    <Layout title="Ranking" subtitle="Resultado final da rodada.">
      <div className="card">
        <h3>Resumo dos votos</h3>
        <p>Total Eu Já: {totalEuJa}</p>
        <p>Total Eu Nunca: {totalEuNunca}</p>
        <ReactECharts option={option} style={{ height: 320 }} />
      </div>

      <div className="card">
        <h3>Ranking por participante</h3>

        <div className="list-grid">
          {ranking.map((item) => (
            <div key={item.uid} className="list-item">
              <div>
                <strong>{item.name}</strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>{item.totalEuJa} votos eu já</div>
                <div>{item.totalEuNunca} votos eu nunca</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}