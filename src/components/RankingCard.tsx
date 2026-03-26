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
        {items.map((item, index) => (
          <div key={item.uid} className="list-item">
            <strong>
              {index + 1}. {item.name}
            </strong>
            <span>{item.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}