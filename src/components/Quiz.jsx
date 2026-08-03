import { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { generateQuestions } from '../generators'
import '../styles/components/quiz.css'

function Quiz() {
    const currentTopic = useStore(state => state.currentTopic)
    const currentDifficulty = useStore(state => state.currentDifficulty)
    const setView = useStore(state => state.setView)
    const addXP = useStore(state => state.addXP)
    const recordAnswer = useStore(state => state.recordAnswer)
    
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [userAnswers, setUserAnswers] = useState([])
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        const generated = generateQuestions(currentTopic, currentDifficulty, 5)
        setQuestions(generated)
    }, [])

    if (questions.length === 0) {
        return <div className="quiz loading">Generating questions...</div>
    }

    const currentQuestion = questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === questions.length - 1

    const handleSelectAnswer = (index) => {
        if (isSubmitted) return
        setSelectedAnswer(index)
    }

    const handleNext = () => {
        if (selectedAnswer === null) return

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer
        const newUserAnswers = [...userAnswers, { 
            questionId: currentQuestion.id,
            selected: selectedAnswer,
            correct: isCorrect
        }]
        setUserAnswers(newUserAnswers)

        recordAnswer(currentTopic, isCorrect)
        if (isCorrect) {
            addXP(currentTopic, currentDifficulty)
        }

        if (isLastQuestion) {
            setIsSubmitted(true)
            setTimeout(() => {
                setView('results')
            }, 500)
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedAnswer(null)
        }
    }

    return (
        <div className="quiz">
            <div className="quiz-header">
                <div className="progress">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="topic-info">
                    {currentTopic} - {currentDifficulty}
                </div>
            </div>

            <div className="question-container">
                <h2 className="question">{currentQuestion.question}</h2>
                
                <div className="options">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                            onClick={() => handleSelectAnswer(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="quiz-footer">
                <button 
                    className="next-button"
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                >
                    {isLastQuestion ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    )
}

export default Quiz
