import useStore from '../store/useStore'
import { TOPICS } from '../store/useStore'
import '../styles/components/home.css'

function Home() {
    const user = useStore(state => state.user)
    const topics = useStore(state => state.topics)
    const currentTopic = useStore(state => state.currentTopic)
    const currentDifficulty = useStore(state => state.currentDifficulty)
    const setTopic = useStore(state => state.setTopic)
    const setDifficulty = useStore(state => state.setDifficulty)
    const setView = useStore(state => state.setView)

    const handleStart = () => {
        if (!currentTopic) return
        setView('quiz')
    }

    const difficulties = ['easy', 'medium', 'hard', 'expert']

    return (
        <div className="home">
            <div className="header">
                <h1>Math Game</h1>
                <div className="user-info">
                    <div className="level">Level {user.overallLevel}</div>
                    <div className="xp">{user.totalXP} XP</div>
                </div>
            </div>

            <div className="selection">
                <div className="section">
                    <h2>Choose Topic</h2>
                    <div className="topic-grid">
                        {TOPICS.map(topic => (
                            <button
                                key={topic}
                                className={currentTopic === topic ? 'active' : ''}
                                onClick={() => setTopic(topic)}
                            >
                                <div className="topic-name">{topic}</div>
                                <div className="topic-stats">
                                    Level {topics[topic].level}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h2>Choose Difficulty</h2>
                    <div className="difficulty-buttons">
                        {difficulties.map(diff => (
                            <button
                                key={diff}
                                className={currentDifficulty === diff ? 'active' : ''}
                                onClick={() => setDifficulty(diff)}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="start-button"
                    onClick={handleStart}
                    disabled={!currentTopic}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    )
}

export default Home
