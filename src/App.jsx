import { useEffect } from 'react'
import useStore from './store/useStore'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import './styles/global.css'

function App() {
    const currentView = useStore(state => state.currentView)
    const theme = useStore(state => state.theme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <div className="app">
            {currentView === 'home' && <Home />}
            {currentView === 'quiz' && <Quiz />}
            {currentView === 'results' && <Results />}
        </div>
    )
}

export default App
