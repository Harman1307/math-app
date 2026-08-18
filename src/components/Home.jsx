import { useState } from 'react'
import useStore, { TOPICS, DIFFICULTIES } from '../store/useStore'
import ThemeDropdown from './ThemeDropdown'
import '../styles/components/home.css'

const QUESTION_COUNTS = [5, 10, 25, 50]
const TIMER_OPTIONS = [1, 3, 5, 10]

export default function Home() {
    const {
        currentTopic, setTopic,
        currentDifficulty, setDifficulty,
        sessionMode, setSessionMode,
        questionCount, setQuestionCount,
        timerDuration, setTimerDuration,
        setView
    } = useStore()

    return (
        <div className="home">
            <div className="home-topbar">
                <ThemeDropdown />
            </div>

            <div className="home-content fade-up">
                <div className="home-card">
                    <div className="config-block">
                        <label className="config-label">Topic</label>
                        <div className="pill-group">
                            {TOPICS.map(t => (
                                <button
                                    key={t}
                                    className={`pill-btn ${currentTopic === t ? 'active' : ''}`}
                                    onClick={() => setTopic(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="config-divider" />

                    <div className="config-block">
                        <label className="config-label">Difficulty</label>
                        <div className="pill-group">
                            {DIFFICULTIES.map(d => (
                                <button
                                    key={d}
                                    className={`pill-btn ${currentDifficulty === d ? 'active' : ''}`}
                                    onClick={() => setDifficulty(d)}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="config-divider" />

                    <div className="config-block">
                        <label className="config-label">Mode</label>
                        <div className="mode-tabs">
                            <button
                                className={`mode-tab ${sessionMode === 'questions' ? 'active' : ''}`}
                                onClick={() => setSessionMode('questions')}
                            >
                                Questions
                            </button>
                            <button
                                className={`mode-tab ${sessionMode === 'timed' ? 'active' : ''}`}
                                onClick={() => setSessionMode('timed')}
                            >
                                Timed
                            </button>
                        </div>

                        {sessionMode === 'questions' ? (
                            <div className="pill-group" style={{ marginTop: '1rem' }}>
                                {QUESTION_COUNTS.map(c => (
                                    <button
                                        key={c}
                                        className={`pill-btn ${questionCount === c ? 'active' : ''}`}
                                        onClick={() => setQuestionCount(c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="pill-group" style={{ marginTop: '1rem' }}>
                                {TIMER_OPTIONS.map(m => (
                                    <button
                                        key={m}
                                        className={`pill-btn ${timerDuration === m ? 'active' : ''}`}
                                        onClick={() => setTimerDuration(m)}
                                    >
                                        {m} min
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button className="start-btn" onClick={() => setView('quiz')}>
                    Begin Session
                </button>
            </div>
        </div>
    )
}
