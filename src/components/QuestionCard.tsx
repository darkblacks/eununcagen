interface QuestionCardProps {
  category: string;
  question: string;
  timeLeft: number;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionCard({
  category,
  question,
  timeLeft,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  const dots = Array.from({ length: totalQuestions });

  return (
    <div className="card question-card-v2">
      <div className="question-topbar">
        <span className="question-counter">
          QUESTÃO {currentIndex} DE {totalQuestions}
        </span>

        <div className="question-dots">
          {dots.map((_, index) => (
            <span
              key={index}
              className={`dot ${index < currentIndex ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="question-center">
        <h2>"{question}"</h2>
      </div>

      <div className="question-timer-row">
        <span className="question-category">{category}</span>
        <span className="question-timer">{timeLeft}s</span>
      </div>
    </div>
  );
}