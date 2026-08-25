import { useState, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { generateQuestions } from '../generators'
import GeometryVisual from './GeometryVisual'
import ThemeDropdown from './ThemeDropdown'
import '../styles/components/quiz.css'

function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
}

const BATCH_SIZE = 20

export default function Quiz() {
    const {
        currentTopic, currentDifficulty,
        sessionMode, questionCount, timerDuration,
        setView, setSessionStats
    } = useStore()

    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [isCorrect, setIsCorrect] = useState(null)
    const [shakingIndex, setShakingIndex] = useState(null)
    const [firstTryCorrect, setFirstTryCorrect] = useState(true)
    const [userAnswers, setUserAnswers] = useState([])
    const [time, setTime] = useState(sessionMode === 'timed' ? timerDuration * 60 : 0)
    const [answeredThisQuestion, setAnsweredThisQuestion] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        const initial = generateQuestions(currentTopic, currentDifficulty, BATCH_SIZE)
        setQuestions(initial)
    }, [])

    useEffect(() => {
        if (sessionMode === 'timed') {
            timerRef.current = setInterval(() => {
                setTime(t => {
                    if (t <= 1) {
                        clearInterval(timerRef.current)
                        finishSession()
                        return 0
                    }
                    return t - 1
                })
            }, 1000)
        } else {
            timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [])

    const finishSession = (finalAnswers = userAnswers) => {
        clearInterval(timerRef.current)
        setSessionStats({
            answers: finalAnswers,
            time: sessionMode === 'timed' ? timerDuration * 60 : time,
            topic: currentTopic,
            difficulty: currentDifficulty,
            mode: sessionMode
        })
        setView('results')
    }

    // Keeps question pool full for timed mode
    useEffect(() => {
        if (sessionMode === 'timed' && questions.length - currentIndex < 5) {
            const more = generateQuestions(currentTopic, currentDifficulty, BATCH_SIZE)
            setQuestions(prev => [...prev, ...more])
        }
    }, [currentIndex])

    if (questions.length === 0) return <div className="loading">Preparing session...</div>

    const currentQuestion = questions[currentIndex]
    const progressPercent = sessionMode === 'questions'
        ? (currentIndex / questionCount) * 100
        : ((timerDuration * 60 - time) / (timerDuration * 60)) * 100

    const handleSelect = (index) => {
        if (isCorrect) return

        setSelectedAnswer(index)
        const correct = index === currentQuestion.correctAnswer

        if (correct) {
            setIsCorrect(true)

            const newAnswer = {
                question: currentQuestion,
                selected: index,
                isCorrect: firstTryCorrect
            }

            // Build the updated array locally so we can pass it directly
            const updatedAnswers = [...userAnswers, newAnswer]
            setUserAnswers(updatedAnswers)

            if (sessionMode === 'questions' && currentIndex + 1 >= questionCount) {
                setTimeout(() => finishSession(updatedAnswers), 600)
            }
        } else {
            setFirstTryCorrect(false)
            setShakingIndex(index)
            setTimeout(() => {
                setShakingIndex(null)
                setSelectedAnswer(null)
            }, 500)
        }
    }

    const handleNext = () => {
        setCurrentIndex(i => i + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setFirstTryCorrect(true)
        setAnsweredThisQuestion(false)
    }

    const getOptionClass = (index) => {
        const classes = ['option-card']

        if (shakingIndex === index) {
            classes.push('shake')
            classes.push('incorrect')
            return classes.join(' ')
        }

        if (isCorrect && index === currentQuestion.correctAnswer) {
            classes.push('correct')
            return classes.join(' ')
        }

        if (selectedAnswer === index && !isCorrect) classes.push('selected')

        return classes.join(' ')
    }

    return (
        <div className="quiz">
            <div className="quiz-topbar">
                <div className="quiz-meta">
                    {sessionMode === 'timed' ? (
                        <span className={`timer-pill mono ${time <= 30 ? 'urgent' : ''}`}>
                            {formatTime(time)}
                        </span>
                    ) : (
                        <span className="counter-pill mono">
                            {currentIndex + 1} / {questionCount}
                        </span>
                    )}
                    {sessionMode === 'questions' && (
                        <span className="timer-dim mono">{formatTime(time)}</span>
                    )}
                    {sessionMode === 'timed' && (
                        <span className="counter-pill">
                            {userAnswers.length} answered
                        </span>
                    )}
                </div>
                <ThemeDropdown />
            </div>

            <div className="progress-track">
                <div
                    className="progress-thumb"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <main className="quiz-body fade-up" key={currentIndex}>
                <p className="question-text">{currentQuestion.question}</p>
                <GeometryVisual visualData={currentQuestion.visual} />

                <div className="options-grid">
                    {currentQuestion.options.map((opt, i) => (
                        <button
                            key={i}
                            className={getOptionClass(i)}
                            onClick={() => handleSelect(i)}
                            disabled={isCorrect && i !== currentQuestion.correctAnswer}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </main>

            {isCorrect && (
                <div className="quiz-footer fade-in">
                    <div className="feedback-bar correct-feedback">
                        <span>{firstTryCorrect ? 'Correct!' : 'Got it!'}</span>
                        <button className="next-btn" onClick={handleNext}>
                            {sessionMode === 'questions' && currentIndex + 1 >= questionCount ? 'Finish' : 'Next →'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
