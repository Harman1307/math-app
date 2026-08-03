import { create } from 'zustand'

const TOPICS = [
    'arithmetic',
    'algebra',
    'geometry',
    'trigonometry',
    'statistics',
    'probability',
    'calculus',
    'linearAlgebra'
]

const XP_REWARDS = {
    easy: 10,
    medium: 30,
    hard: 75,
    expert: 150
}

const XP_PER_LEVEL = 1000

function calculateLevel(xp) {
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

function buildInitialTopics() {
    const topics = {}
    TOPICS.forEach(topic => {
        topics[topic] = {
            xp: 0,
            level: 1,
            questionsAnswered: 0,
            questionsCorrect: 0,
            lastDifficulty: 'easy'
        }
    })
    return topics
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem('mathgame')
        if (!data) return null
        return JSON.parse(data)
    } catch {
        return null
    }
}

function saveToStorage(state) {
    try {
        const data = {
            user: state.user,
            topics: state.topics,
            achievements: state.achievements,
            settings: state.settings,
            streaks: state.streaks
        }
        localStorage.setItem('mathgame', JSON.stringify(data))
    } catch {
        console.error('Failed to save to localStorage')
    }
}

const saved = loadFromStorage()

const initialState = saved || {
    user: {
        totalXP: 0,
        overallLevel: 1,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    },
    topics: buildInitialTopics(),
    achievements: [],
    settings: {
        theme: 'catppuccin-mocha',
        animationsEnabled: true
    },
    streaks: {
        current: 0,
        longest: 0,
        lastQuizDate: null
    }
}

const useStore = create((set, get) => ({
    ...initialState,

    currentView: 'home',
    currentTopic: null,
    currentDifficulty: 'easy',

    setView: (view) => set({ currentView: view }),
    setTopic: (topic) => set({ currentTopic: topic }),
    setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),

    addXP: (topic, difficulty) => {
        const amount = XP_REWARDS[difficulty]
        const state = get()

        const topicData = state.topics[topic]
        const newTopicXP = topicData.xp + amount
        const newTopicLevel = calculateLevel(newTopicXP)

        const newTotalXP = state.user.totalXP + amount
        const newOverallLevel = calculateLevel(newTotalXP)

        const newState = {
            user: {
                ...state.user,
                totalXP: newTotalXP,
                overallLevel: newOverallLevel,
                lastActive: new Date().toISOString()
            },
            topics: {
                ...state.topics,
                [topic]: {
                    ...topicData,
                    xp: newTopicXP,
                    level: newTopicLevel
                }
            }
        }

        set(newState)
        saveToStorage({ ...state, ...newState })
    },

    recordAnswer: (topic, correct) => {
        const state = get()
        const topicData = state.topics[topic]

        const newState = {
            topics: {
                ...state.topics,
                [topic]: {
                    ...topicData,
                    questionsAnswered: topicData.questionsAnswered + 1,
                    questionsCorrect: topicData.questionsCorrect + (correct ? 1 : 0)
                }
            }
        }

        set(newState)
        saveToStorage({ ...state, ...newState })
    },

    unlockAchievement: (id) => {
        const state = get()
        if (state.achievements.find(a => a.id === id)) return

        const newState = {
            achievements: [
                ...state.achievements,
                { id, unlockedAt: new Date().toISOString() }
            ]
        }

        set(newState)
        saveToStorage({ ...state, ...newState })
    },

    setTheme: (theme) => {
        const state = get()
        const newState = {
            settings: { ...state.settings, theme }
        }
        set(newState)
        saveToStorage({ ...state, ...newState })
    },

    exportData: () => {
        const state = get()
        const data = {
            user: state.user,
            topics: state.topics,
            achievements: state.achievements,
            settings: state.settings,
            streaks: state.streaks
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mathgame-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    },

    importData: (jsonString) => {
        try {
            const data = JSON.parse(jsonString)
            set(data)
            saveToStorage(data)
            return true
        } catch {
            return false
        }
    }
}))

export { TOPICS, XP_REWARDS, XP_PER_LEVEL }
export default useStore
