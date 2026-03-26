import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import ReactECharts from "echarts-for-react";

export default function RankingPage() {
  const { appUser } = useAuth();
  const { ranking, totalEuJa, totalEuNunca, resetGame } = useGame();

  const orderedRanking = [...ranking].sort((a, b) => {
    if (b.totalEuJa !== a.totalEuJa) return b.totalEuJa - a.totalEuJa;
    return a.totalEuNunca - b.totalEuNunca;
  });

  const chartOption = {
    animation: true,
    grid: {
      left: 90,
      right: 40,
      top: 20,
      bottom: 20,
    },
    xAxis: {
      type: "value",
      axisLabel: { color: "#5e7790" },
      splitLine: {
        lineStyle: {
          color: "rgba(53, 80, 107, 0.12)",
        },
      },
    },
    yAxis: {
      type: "category",
      data: ["Eu já", "Eu nunca"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#35506b",
        fontWeight: 700,
        fontSize: 15,
      },
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: totalEuJa,
            itemStyle: {
              color: "#22c55e",
              borderRadius: [0, 18, 18, 0],
            },
          },
          {
            value: totalEuNunca,
            itemStyle: {
              color: "#ef4444",
              borderRadius: [0, 18, 18, 0],
            },
          },
        ],
        barWidth: 36,
        label: {
          show: true,
          position: "right",
          color: "#132d57",
          fontWeight: 800,
          fontSize: 14,
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
  };

  return (
    <Layout title="" subtitle="">
      <div className="card ranking-summary-card">
        <div className="ranking-summary-header">
          <h2>Resumo geral</h2>
          <p>Comparativo total das respostas da rodada</p>
        </div>

        <div className="ranking-kpis">
          <div className="ranking-kpi green">
            <span>Total Eu Já</span>
            <strong>{totalEuJa}</strong>
          </div>

          <div className="ranking-kpi red">
            <span>Total Eu Nunca</span>
            <strong>{totalEuNunca}</strong>
          </div>
        </div>

        <div className="ranking-chart-title">Distribuição das respostas</div>

        <div className="ranking-chart-box">
          <ReactECharts option={chartOption} style={{ height: 260 }} />
        </div>
      </div>

      <div className="card ranking-list-card">
        <div className="ranking-summary-header">
          <h2>Ranking por participante</h2>
          <p>Ordenado por quem mais marcou Eu já</p>
        </div>

        <div className="ranking-table">
          {orderedRanking.length === 0 ? (
            <div className="ranking-empty-state">
              Nenhuma resposta registrada
            </div>
          ) : (
            orderedRanking.map((item, index) => (
              <div key={item.uid} className="ranking-row">
                <div className="ranking-left">
                  <div className="ranking-position">{index + 1}º</div>

                  <div className="ranking-user-block">
                    <strong>{item.name}</strong>
                  </div>
                </div>

                <div className="ranking-right">
                  <span className="ranking-badge green">
                    {item.totalEuJa} voto{item.totalEuJa === 1 ? "" : "s"} eu já
                  </span>

                  <span className="ranking-badge red">
                    {item.totalEuNunca} voto{item.totalEuNunca === 1 ? "" : "s"} eu nunca
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {appUser?.role === "admin" && (
        <div className="card admin-reset-card">
          <button className="danger-btn admin-btn" onClick={resetGame} type="button">
            Finalizar e limpar respostas
          </button>
        </div>
      )}
    </Layout>
  );
}