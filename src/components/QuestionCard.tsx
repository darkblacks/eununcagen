interface QuestionCardProps {
category: string;
question: string;
timeLeft: number;
}
export default function QuestionCard({ category, question, timeLeft }:
QuestionCardProps) {
return (
<div className="card question-card">
<div className="question-meta">
<span>{category}</span>
<span>{timeLeft}s</span>
</div>
<h2>{question}</h2>
</div>
);
}
