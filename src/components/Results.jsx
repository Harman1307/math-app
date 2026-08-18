import useStore from '../store/useStore'
import ThemeDropdown from './ThemeDropdown'
import '../styles/components/results.css'

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

export default function Results() {
    const setView = useStore(state => state.setView)
    const stats = useStore(state => state.sessionStats)

    if (!stats) return null

    const correct = stats.answers.filter(a => a.isCorrect).length
    const total = stats.answers.length
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    return (
        <div className="results">
            <div className="results-topbar">
                <ThemeDropdown />
            </div>

            <div className="results-content fade-up">
                <h2 className="results-title">Session Complete</h2>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-value">{accuracy}%</span>
                        <span className="stat-label">Accuracy</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value mono">{formatTime(stats.time)}</span>
                        <span className="stat-label">Time</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{correct}/{total}</span>
                        <span className="stat-label">Correct</span>
                    </div>
                </div>

                {total > 0 && (
                    <div className="review-section">
                        <h3 className="review-heading">Review</h3>
                        <div className="review-list">
                            {stats.answers.map((item, i) => (
                                <div
                                    key={i}
                                    className={`review-card ${item.isCorrect ? 'is-correct' : 'is-wrong'}`}
                                >
                                    <div className="review-top">
                                        <span className="review-num">Q{i + 1}</span>
                                        <span className="review-badge">
                                            {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        </span>
                                    </div>
                                    <p className="review-question">{item.question.question}</p>
                                    <div className="review-answers">
                                        <div className={`review-answer ${item.isCorrect ? 'text-correct' : 'text-wrong'}`}>
                                            <span className="answer-label">Your answer</span>
                                            <span className="answer-value">
                                                {item.question.options[item.selected]}
                                            </span>
                                        </div>
                                        {!item.isCorrect && (
                                            <div className="review-answer text-correct">
                                                <span className="answer-label">Correct answer</span>
                                                <span className="answer-value">
                                                    {item.question.options[item.question.correctAnswer]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button className="start-btn" onClick={() => setView('home')}>
                    New Session
                </button>
            </div>
        </div>
    )
}
