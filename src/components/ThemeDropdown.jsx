import { useState, useRef, useEffect } from 'react'
import useStore, { THEMES } from '../store/useStore'
import '../styles/components/theme-dropdown.css'

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

    const formatted = (t) => t.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

    return (
        <div className="theme-dropdown-wrapper" ref={ref}>
            <button
                className="theme-trigger"
                onClick={() => setOpen(o => !o)}
                title="Change theme"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
                <span>{formatted(theme)}</span>
            </button>

            {open && (
                <div className="theme-menu fade-in">
                    {THEMES.map(t => (
                        <button
                            key={t}
                            className={`theme-option ${theme === t ? 'active' : ''}`}
                            onClick={() => { setTheme(t); setOpen(false) }}
                        >
                            <span className="theme-dot" style={{ background: getAccentFor(t) }} />
                            {formatted(t)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function getAccentFor(t) {
    const map = {
        'rose-pine': '#ebbcba',
        'catppuccin-mocha': '#89b4fa',
        'tokyo-night': '#7aa2f7',
        'nord': '#88c0d0',
        'gruvbox': '#83a598',
        'ayu-mirage': '#73d0ff',
        'everforest': '#a7c080',
        'solarized-light': '#268bd2'
    }
    return map[t] || '#fff'
}
