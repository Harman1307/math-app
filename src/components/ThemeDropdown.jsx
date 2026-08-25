import { useState, useRef, useEffect } from 'react'
import useStore, { THEMES } from '../store/useStore'
import '../styles/components/theme-dropdown.css'

const THEME_DATA = {
    'rose-pine':           { label: 'Rose Pine',           bg: '#191724', surface: '#1f1d2e', accent: '#ebbcba', text: '#e0def4' },
    'catppuccin-mocha':    { label: 'Catppuccin Mocha',    bg: '#1e1e2e', surface: '#313244', accent: '#89b4fa', text: '#cdd6f4' },
    'tokyo-night':         { label: 'Tokyo Night',         bg: '#1a1b26', surface: '#24283b', accent: '#7aa2f7', text: '#c0caf5' },
    'tokyo-night-storm':   { label: 'Tokyo Night Storm',   bg: '#1f2335', surface: '#24283b', accent: '#7aa2f7', text: '#c0caf5' },
    'nord':                { label: 'Nord',                bg: '#2e3440', surface: '#3b4252', accent: '#88c0d0', text: '#eceff4' },
    'gruvbox':             { label: 'Gruvbox',             bg: '#282828', surface: '#3c3836', accent: '#83a598', text: '#ebdbb2' },
    'gruvbox-material':    { label: 'Gruvbox Material',    bg: '#282828', surface: '#32302f', accent: '#7daea3', text: '#ddc7a1' },
    'everforest':          { label: 'Everforest',          bg: '#2b3339', surface: '#323c41', accent: '#a7c080', text: '#d3c6aa' },
    'ayu-mirage':          { label: 'Ayu Mirage',          bg: '#1f2430', surface: '#232834', accent: '#73d0ff', text: '#cbccc6' },
    'dracula':             { label: 'Dracula',             bg: '#282a36', surface: '#44475a', accent: '#bd93f9', text: '#f8f8f2' },
    'dracula-soft':        { label: 'Dracula Soft',        bg: '#30313d', surface: '#3b3c4a', accent: '#caa9fa', text: '#f8f8f2' },
    'one-dark':            { label: 'One Dark',            bg: '#282c34', surface: '#21252b', accent: '#61afef', text: '#abb2bf' },
    'kanagawa':            { label: 'Kanagawa',            bg: '#1f1f28', surface: '#2a2a37', accent: '#7e9cd8', text: '#dcd7ba' },
    'kanagawa-dragon':     { label: 'Kanagawa Dragon',     bg: '#181616', surface: '#282727', accent: '#8ba4b0', text: '#c5c9c5' },
    'monokai':             { label: 'Monokai',             bg: '#272822', surface: '#2f302a', accent: '#66d9ef', text: '#f8f8f2' },
    'material-dark':       { label: 'Material Dark',       bg: '#263238', surface: '#1f292e', accent: '#82aaff', text: '#eeffff' },
    'night-owl':           { label: 'Night Owl',           bg: '#011627', surface: '#0b2942', accent: '#82aaff', text: '#d6deeb' },
    'moonlight':           { label: 'Moonlight',           bg: '#222436', surface: '#2f334d', accent: '#82aaff', text: '#c8d3f5' },
    'poimandres':          { label: 'Poimandres',          bg: '#1b1e28', surface: '#252936', accent: '#add7ff', text: '#e4f0fb' },
    'ember':               { label: 'Ember',               bg: '#1c1917', surface: '#292321', accent: '#f59e67', text: '#f5e9df' },
    'synthwave-84':        { label: 'Synthwave 84',        bg: '#262335', surface: '#241b2f', accent: '#ff7edb', text: '#ffffff' },
    'cyberpunk':           { label: 'Cyberpunk',           bg: '#0d0d18', surface: '#151525', accent: '#00f0ff', text: '#f4f4f5' },
    'solarized-light':     { label: 'Solarized Light',     bg: '#fdf6e3', surface: '#eee8d5', accent: '#268bd2', text: '#586e75' },
    'one-light':           { label: 'One Light',           bg: '#fafafa', surface: '#f0f0f0', accent: '#4078f2', text: '#383a42' },
    'github-light':        { label: 'Github Light',        bg: '#ffffff', surface: '#f6f8fa', accent: '#0969da', text: '#24292f' },
    'catppuccin-latte':    { label: 'Catppuccin Latte',    bg: '#eff1f5', surface: '#e6e9ef', accent: '#1e66f5', text: '#4c4f69' },
    'everforest-light':    { label: 'Everforest Light',    bg: '#fdf6e3', surface: '#f3ead3', accent: '#8da101', text: '#5c6a72' },
    'nord-light':          { label: 'Nord Light',          bg: '#eceff4', surface: '#e5e9f0', accent: '#5e81ac', text: '#2e3440' },
    'rose-pine-dawn':      { label: 'Rose Pine Dawn',      bg: '#faf4ed', surface: '#f2e9de', accent: '#907aa9', text: '#575279' },
}

const DARK_THEMES = [
    'rose-pine', 'catppuccin-mocha', 'tokyo-night', 'tokyo-night-storm',
    'nord', 'gruvbox', 'gruvbox-material', 'everforest', 'ayu-mirage',
    'dracula', 'dracula-soft', 'one-dark', 'kanagawa', 'kanagawa-dragon',
    'monokai', 'material-dark', 'night-owl', 'moonlight', 'poimandres',
    'ember', 'synthwave-84', 'cyberpunk'
]

const LIGHT_THEMES = [
    'solarized-light', 'one-light', 'github-light', 'catppuccin-latte',
    'everforest-light', 'nord-light', 'rose-pine-dawn'
]

function ThemeCard({ id, isActive, onClick }) {
    const data = THEME_DATA[id]
    if (!data) return null

    return (
        <button
            className={`theme-card ${isActive ? 'active' : ''}`}
            onClick={onClick}
            title={data.label}
        >
            <div className="theme-preview" style={{ background: data.bg }}>
                <div className="preview-surface" style={{ background: data.surface }}>
                    <div className="preview-text-line" style={{ background: data.text + '99' }} />
                    <div className="preview-text-line short" style={{ background: data.text + '55' }} />
                </div>
                <div className="preview-accent-dot" style={{ background: data.accent }} />
            </div>
            <span className="theme-card-label">{data.label}</span>
        </button>
    )
}

export default function ThemeDropdown() {
    const theme = useStore(state => state.theme)
    const setTheme = useStore(state => state.setTheme)
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const current = THEME_DATA[theme]

    return (
        <div className="theme-dropdown-wrapper" ref={ref}>
            <button
                className="theme-trigger"
                onClick={() => setOpen(o => !o)}
                title="Change theme"
            >
                <div
                    className="trigger-preview"
                    style={{ background: current?.bg || '#000' }}
                >
                    <div
                        className="trigger-accent"
                        style={{ background: current?.accent || '#fff' }}
                    />
                </div>
                <span>{current?.label || 'Theme'}</span>
                <svg
                    className={`trigger-chevron ${open ? 'flipped' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="theme-panel fade-in">
                    <div className="theme-panel-section">
                        <span className="theme-group-label">Dark</span>
                        <div className="theme-cards-grid">
                            {DARK_THEMES.map(t => (
                                <ThemeCard
                                    key={t}
                                    id={t}
                                    isActive={theme === t}
                                    onClick={() => { setTheme(t); setOpen(false) }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="theme-panel-section">
                        <span className="theme-group-label">Light</span>
                        <div className="theme-cards-grid">
                            {LIGHT_THEMES.map(t => (
                                <ThemeCard
                                    key={t}
                                    id={t}
                                    isActive={theme === t}
                                    onClick={() => { setTheme(t); setOpen(false) }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
