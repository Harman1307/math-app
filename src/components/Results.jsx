import useStore from '../store/useStore'
import '../styles/components/results.css'

function Results() {
    const setView = useStore(state => state.setView)
    const topics = useStore(state => state.topics)
    const currentTopic = useStore(state => state.currentTopic)

    const topicData = topics[currentTopic]

    const handleGoHome = () => {
        setView('home')
    }

    return (
        <div className="results">
            <h1>Quiz Complete!</h1>

            <div className="stats">
                <div className="stat">
                    <div className="stat-label">Topic Level</div>
                    <div className="stat-value">{topicData.level}</div>
                </div>
                <div className="stat">
                    <div className="stat-label">Topic XP</div>
                    <div className="stat-value">{topicData.xp}</div>
                </div>
                <div className="stat">
                    <div className="stat-label">Accuracy</div>
                    <div className="stat-value">
                        {topicData.questionsAnswered > 0
                            ? Math.round((topicData.questionsCorrect / topicData.questionsAnswered) * 100)
                            : 0}%
                    </div>
                </div>
            </div>

            <button className="home-button" onClick={handleGoHome}>
                Back to Home
            </button>
        </div>
    )
}

export default Results
