import type { RankingEntry } from "../types/ranking";

type RankingCardProps = {
  title: string;
  items: RankingEntry[];
};

export default function RankingCard({ title, items }: RankingCardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>

      <div className="list-grid">
        {items.length === 0 ? (
          <div className="list-item">
            <strong>Nenhum voto ainda</strong>
            <span>0</span>
          </div>
        ) : (
          items.map((item) => (
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
  );
}