function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

function gcd(a, b) {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b > 0) {
        let temp = b
        b = a % b
        a = temp
    }
    return a
}

function buildOptions(correct, distractors) {
    let uniqueList = []

    for (const d of distractors) {
        if (d !== correct && !uniqueList.includes(d) && d !== null && d !== undefined) {
            uniqueList.push(d)
        }
    }

    let attempts = 0
    while (uniqueList.length < 3 && attempts < 50) {
        if (typeof correct === 'string') {
            attempts++
            continue
        }

        const offsets = [1, -1, 2, -2, 5, -5, 10, -10]
        const offset = offsets[randomInt(0, offsets.length - 1)]
        let fallback = correct + offset

        if (!Number.isInteger(correct)) {
            fallback = parseFloat(fallback.toFixed(2))
        }

        if (fallback !== correct && !uniqueList.includes(fallback)) {
            uniqueList.push(fallback)
        }
        attempts++
    }

    if (uniqueList.length < 3) return null
    return shuffle([correct, ...uniqueList.slice(0, 3)])
}

function getPythagoreanTriple() {
    const triples = [
        [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]
    ]
    return triples[randomInt(0, triples.length - 1)]
}

const exactValues = [
    { deg: 30, rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3' },
    { deg: 45, rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1' },
    { deg: 60, rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3' }
]

const easyTemplates = [
    () => {
        const angles = [30, 45, 60, 90, 120, 135, 150, 180, 270, 360]
        const deg = angles[randomInt(0, angles.length - 1)]
        const divisor = gcd(deg, 180)
        const num = deg / divisor
        const den = 180 / divisor

        let rad = ''
        if (num === 1 && den === 1) rad = 'π'
        else if (num === 1) rad = `π/${den}`
        else if (den === 1) rad = `${num}π`
        else rad = `${num}π/${den}`

        return {
            question: `Convert ${deg}° to radians.`,
            answer: rad,
            options: buildOptions(rad, [
                `${num + 1}π/${den}`,
                `${num}π/${den === 1 ? 2 : den + 1}`,
                `${den}π/${num}`
            ]),
            visual: null
        }
    },
    () => {
        const val = exactValues[randomInt(0, exactValues.length - 1)]
        const isSin = Math.random() > 0.5
        const func = isSin ? 'sin' : 'cos'
        const ans = isSin ? val.sin : val.cos

        return {
            question: `What is the exact value of ${func}(${val.deg}°)?`,
            answer: ans,
            options: buildOptions(ans, ['1/2', '√2/2', '√3/2', '1', '0']),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const functions = [
            { name: 'sin', ans: `${opp}/${hyp}` },
            { name: 'cos', ans: `${adj}/${hyp}` },
            { name: 'tan', ans: `${opp}/${adj}` }
        ]
        const choice = functions[randomInt(0, 2)]

        return {
            question: `In a right triangle, the side opposite to angle θ is ${opp}, the adjacent side is ${adj}, and the hypotenuse is ${hyp}. Find ${choice.name}(θ).`,
            answer: choice.ans,
            options: buildOptions(choice.ans, [`${opp}/${hyp}`, `${adj}/${hyp}`, `${opp}/${adj}`, `${adj}/${opp}`]),
            visual: { type: 'right-triangle', base: adj, height: opp, labels: { bottom: adj, left: opp, hypotenuse: hyp } }
        }
    }
]

const mediumTemplates = [
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        return {
            question: `If sin(θ) = ${opp}/${hyp} and θ is in the first quadrant, what is cos(θ)?`,
            answer: `${adj}/${hyp}`,
            options: buildOptions(`${adj}/${hyp}`, [`${opp}/${adj}`, `${adj}/${opp}`, `-${adj}/${hyp}`]),
            visual: null
        }
    },
    () => {
        const amp = randomInt(2, 6)
        const periodFactor = randomInt(2, 5)
        const isSin = Math.random() > 0.5
        return {
            question: `What is the amplitude of the function y = ${amp}${isSin ? 'sin' : 'cos'}(${periodFactor}x)?`,
            answer: amp,
            options: buildOptions(amp, [periodFactor, amp * 2, 1]),
            visual: null
        }
    },
    () => {
        const amp = randomInt(2, 6)
        const b = randomInt(2, 6)
        const period = `2π/${b}`
        const periodAlt = `π/${b}`
        return {
            question: `What is the period of the function y = ${amp}sin(${b}x)?`,
            answer: period,
            options: buildOptions(period, [periodAlt, `${b}π`, `2π`]),
            visual: null
        }
    },
    () => {
        const val = exactValues[randomInt(0, exactValues.length - 1)]
        const quadrant = randomInt(2, 4)

        let targetAngle
        if (quadrant === 2) targetAngle = 180 - val.deg
        else if (quadrant === 3) targetAngle = 180 + val.deg
        else targetAngle = 360 - val.deg

        let ans = val.sin
        if (quadrant === 3 || quadrant === 4) ans = '-' + ans

        return {
            question: `What is the exact value of sin(${targetAngle}°)?`,
            answer: ans,
            options: buildOptions(ans, [val.sin, '-' + val.sin, val.cos, '-' + val.cos]),
            visual: null
        }
    }
]

const hardTemplates = [
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const sin = opp / hyp
        const cos = adj / hyp
        const doubleSin = (2 * sin * cos).toFixed(2)

        return {
            question: `If sin(θ) = ${opp}/${hyp} and cos(θ) = ${adj}/${hyp}, find the exact value of sin(2θ).`,
            answer: `${(2 * opp * adj)}/${hyp * hyp}`,
            options: buildOptions(`${(2 * opp * adj)}/${hyp * hyp}`, [
                `${(opp * opp - adj * adj)}/${hyp * hyp}`,
                `${opp}/${hyp}`,
                `${(2 * opp)}/${hyp * hyp}`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const cos2 = (adj * adj - opp * opp) / (hyp * hyp)
        let ansStr = `${adj * adj - opp * opp}/${hyp * hyp}`
        if (adj * adj - opp * opp === 0) ansStr = "0"

        return {
            question: `If sin(θ) = ${opp}/${hyp} and θ is in Quadrant I, evaluate cos(2θ).`,
            answer: ansStr,
            options: buildOptions(ansStr, [
                `${2 * opp * adj}/${hyp * hyp}`,
                `-${ansStr}`,
                `${adj * adj + opp * opp}/${hyp * hyp}`
            ]),
            visual: null
        }
    },
    () => {
        const c = randomInt(2, 5)
        const d = randomInt(1, 4)
        const target = c - d
        return {
            question: `Solve for x in the interval [0, 2π): ${c}sin(x) + ${d} = ${target}`,
            answer: `3π/2`,
            options: buildOptions(`3π/2`, [`π/2`, `π`, `0`]),
            visual: null
        }
    },
    () => {
        const base = randomInt(2, 5)
        const shift = randomInt(1, 4)
        const min = shift - base
        const max = shift + base
        return {
            question: `What is the range of the function y = ${base}cos(x) + ${shift}?`,
            answer: `[${min}, ${max}]`,
            options: buildOptions(`[${min}, ${max}]`, [
                `[-${base}, ${base}]`,
                `[${shift}, ${max}]`,
                `[${min - 1}, ${max + 1}]`
            ]),
            visual: null
        }
    }
]

const expertTemplates = [
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        return {
            question: `Evaluate exactly: sin(arccos(${adj}/${hyp}))`,
            answer: `${opp}/${hyp}`,
            options: buildOptions(`${opp}/${hyp}`, [`${adj}/${hyp}`, `${opp}/${adj}`, `${adj}/${opp}`]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        return {
            question: `Evaluate exactly: tan(arcsin(${opp}/${hyp}))`,
            answer: `${opp}/${adj}`,
            options: buildOptions(`${opp}/${adj}`, [`${adj}/${opp}`, `${opp}/${hyp}`, `${adj}/${hyp}`]),
            visual: null
        }
    },
    () => {
        const isPlus = Math.random() > 0.5
        const sign = isPlus ? '+' : '-'
        const opSign = isPlus ? '-' : '+'

        return {
            question: `Which of the following is equivalent to cos(α ${sign} β)?`,
            answer: `cos(α)cos(β) ${opSign} sin(α)sin(β)`,
            options: buildOptions(`cos(α)cos(β) ${opSign} sin(α)sin(β)`, [
                `cos(α)cos(β) ${sign} sin(α)sin(β)`,
                `sin(α)cos(β) ${sign} cos(α)sin(β)`,
                `sin(α)cos(β) ${opSign} cos(α)sin(β)`
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `Find all solutions in [0, 2π) for: 2sin²(x) - sin(x) - 1 = 0`,
            answer: `π/2, 7π/6, 11π/6`,
            options: buildOptions(`π/2, 7π/6, 11π/6`, [
                `π/2, π/6, 5π/6`,
                `3π/2, 7π/6, 11π/6`,
                `π/2, 3π/2`
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `Find the exact value of sin(15°). (Hint: 15° = 45° - 30°)`,
            answer: `(√6 - √2)/4`,
            options: buildOptions(`(√6 - √2)/4`, [
                `(√6 + √2)/4`,
                `(√3 - 1)/2`,
                `(√2 - 1)/4`
            ]),
            visual: null
        }
    }
]

function generateFromTemplates(templates, difficulty) {
    for (let attempt = 0; attempt < 20; attempt++) {
        const template = templates[randomInt(0, templates.length - 1)]
        const q = template()

        if (q && q.options && q.options.length === 4 && q.options.includes(q.answer)) {
            return q
        }
    }

    const fallbacks = {
        easy: { question: "Convert 180° to radians.", answer: "π", options: ["π", "2π", "π/2", "3π/2"], visual: null },
        medium: { question: "What is the period of y = sin(2x)?", answer: "π", options: ["π", "2π", "π/2", "4π"], visual: null },
        hard: { question: "If sin(θ) = 3/5 in Quadrant I, find sin(2θ).", answer: "24/25", options: ["24/25", "7/25", "12/25", "16/25"], visual: null },
        expert: { question: "Evaluate: sin(arccos(4/5))", answer: "3/5", options: ["3/5", "4/5", "3/4", "4/3"], visual: null }
    }
    return fallbacks[difficulty] || fallbacks.easy
}

export function generateTrigonometry(difficulty, count = 5) {
    const templateMap = {
        easy: easyTemplates,
        medium: mediumTemplates,
        hard: hardTemplates,
        expert: expertTemplates
    }

    const templates = templateMap[difficulty]
    if (!templates) {
        throw new Error(`Invalid difficulty level: ${difficulty}`)
    }

    const questions = []
    for (let i = 0; i < count; i++) {
        const q = generateFromTemplates(templates, difficulty)
        const correctIndex = q.options.indexOf(q.answer)
        questions.push({
            id: i,
            question: q.question,
            options: q.options,
            correctAnswer: correctIndex,
            visual: q.visual
        })
    }

    return questions
}
