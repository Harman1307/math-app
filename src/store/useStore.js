import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const TOPICS = ['arithmetic', 'algebra', 'geometry', 'trigonometry']
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert']
export const THEMES = [
    'rose-pine',
    'catppuccin-mocha',
    'tokyo-night',
    'nord',
    'gruvbox',
    'ayu-mirage',
    'everforest',
    'solarized-light'
]

const useStore = create(
    persist(
        (set) => ({
            currentView: 'home',
            theme: 'rose-pine',

            currentTopic: 'arithmetic',
            currentDifficulty: 'medium',

            sessionMode: 'questions',
            questionCount: 10,
            timerDuration: 3,

            sessionStats: null,

            setView: (view) => set({ currentView: view }),
            setTopic: (topic) => set({ currentTopic: topic }),
            setDifficulty: (diff) => set({ currentDifficulty: diff }),
            setSessionMode: (mode) => set({ sessionMode: mode }),
            setQuestionCount: (count) => set({ questionCount: count }),
            setTimerDuration: (mins) => set({ timerDuration: mins }),
            setSessionStats: (stats) => set({ sessionStats: stats }),

            setTheme: (theme) => {
                document.documentElement.setAttribute('data-theme', theme)
                set({ theme })
            }
        }),
        {
            name: 'mathgame-storage',
            partialize: (state) => ({
                theme: state.theme,
                currentTopic: state.currentTopic,
                currentDifficulty: state.currentDifficulty,
                sessionMode: state.sessionMode,
                questionCount: state.questionCount,
                timerDuration: state.timerDuration
            })
        }
    )
)

export default useStore
