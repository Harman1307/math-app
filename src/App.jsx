import useStore from './store/useStore'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'

function App() {
    const currentView = useStore(state => state.currentView)

    return (
        <div className="app">
            {currentView === 'home' && <Home />}
            {currentView === 'quiz' && <Quiz />}
            {currentView === 'results' && <Results />}
        </div>
    )
}

export default App
