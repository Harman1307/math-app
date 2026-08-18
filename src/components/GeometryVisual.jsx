import React from 'react'

const SvgContainer = ({ children }) => (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
        <svg viewBox="0 0 200 200" width="200" height="200" style={{ maxWidth: '100%' }}>
            {children}
        </svg>
    </div>
)

const Rectangle = ({ data }) => {
    const w = data.width || data.side
    const h = data.height || data.side

    const scale = 120 / Math.max(w, h)
    const drawW = w * scale
    const drawH = h * scale

    const x = (200 - drawW) / 2
    const y = (200 - drawH) / 2

    return (
        <SvgContainer>
            <rect
                x={x} y={y} width={drawW} height={drawH}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <g fill="currentColor" fontSize="16" textAnchor="middle" dominantBaseline="middle">
                {data.labels?.bottom && <text x={200 / 2} y={y + drawH + 20}>{data.labels.bottom}</text>}
                {data.labels?.right && <text x={x + drawW + 20} y={200 / 2}>{data.labels.right}</text>}
                {data.labels?.left && <text x={x - 20} y={200 / 2}>{data.labels.left}</text>}
            </g>
        </SvgContainer>
    )
}

const RightTriangle = ({ data }) => {
    const scale = 100 / Math.max(data.base, data.height)
    const drawB = data.base * scale
    const drawH = data.height * scale

    const x = (200 - drawB) / 2
    const y = (200 - drawH) / 2

    return (
        <SvgContainer>
            <path
                d={`M ${x},${y} L ${x},${y + drawH} L ${x + drawB},${y + drawH} Z`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            {/* Right angle square indicator */}
            <rect x={x} y={y + drawH - 12} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />

            <g fill="currentColor" fontSize="16" textAnchor="middle" dominantBaseline="middle">
                {data.labels?.bottom && <text x={x + (drawB / 2)} y={y + drawH + 20}>{data.labels.bottom}</text>}
                {data.labels?.left && <text x={x - 20} y={y + (drawH / 2)}>{data.labels.left}</text>}
                {data.labels?.right && <text x={x + drawB + 20} y={y + (drawH / 2)}>{data.labels.right}</text>}
                {data.labels?.hypotenuse && (
                    <text x={x + (drawB / 2) + 20} y={y + (drawH / 2) - 20}>{data.labels.hypotenuse}</text>
                )}
            </g>
        </SvgContainer>
    )
}

const Circle = ({ data }) => {
    const cx = 100
    const cy = 100
    const r = 60

    return (
        <SvgContainer>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Center dot */}
            <circle cx={cx} cy={cy} r="3.5" fill="currentColor" />
            {/* Radius dashed line */}
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />

            <g fill="currentColor" fontSize="16" textAnchor="middle" dominantBaseline="bottom">
                {data.labels?.radius && <text x={cx + (r / 2)} y={cy - 8}>{data.labels.radius}</text>}
            </g>
        </SvgContainer>
    )
}

export default function GeometryVisual({ visualData }) {
    if (!visualData) return null

    switch (visualData.type) {
        case 'rectangle':
        case 'square':
            return <Rectangle data={visualData} />
        case 'right-triangle':
            return <RightTriangle data={visualData} />
        case 'circle':
            return <Circle data={visualData} />
        default:
            return null
    }
}
