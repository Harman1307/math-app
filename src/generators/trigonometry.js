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
    { deg: 30, rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '1/√3', csc: '2', sec: '2/√3', cot: '√3' },
    { deg: 45, rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1', csc: '√2', sec: '√2', cot: '1' },
    { deg: 60, rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3', csc: '2/√3', sec: '2', cot: '1/√3' }
]

const easyTemplates = [
    () => {
        const angles = [30, 45, 60, 90, 120, 135, 150, 180, 270, 360]
        const deg = angles[randomInt(0, angles.length - 1)]
        const divisor = gcd(deg, 180)
        const num = deg / divisor
        const den = 180 / divisor

        let rad
        if (num === 1 && den === 1) rad = 'π'
        else if (num === 1) rad = `π/${den}`
        else if (den === 1) rad = `${num}π`
        else rad = `${num}π/${den}`

        const wrongNum = num + 1
        const wrongDen = den === 1 ? 2 : den + 1

        return {
            question: `Convert ${deg}° to radians.`,
            answer: rad,
            options: buildOptions(rad, [
                `${wrongNum}π/${den}`,
                den === 1 ? `${num}π/2` : `${num}π/${wrongDen}`,
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
        const other = isSin ? val.cos : val.sin

        return {
            question: `What is the exact value of ${func}(${val.deg}°)?`,
            answer: ans,
            options: buildOptions(ans, [other, val.tan, '1']),
            visual: null
        }
    },
    () => {
        const val = exactValues[randomInt(0, exactValues.length - 1)]
        return {
            question: `What is the exact value of tan(${val.deg}°)?`,
            answer: val.tan,
            options: buildOptions(val.tan, [val.sin, val.cos, val.cot]),
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
            question: `In a right triangle, the side opposite to angle θ is ${opp}, adjacent is ${adj}, hypotenuse is ${hyp}. Find ${choice.name}(θ).`,
            answer: choice.ans,
            options: buildOptions(choice.ans, [`${opp}/${hyp}`, `${adj}/${hyp}`, `${opp}/${adj}`, `${adj}/${opp}`]),
            visual: { type: 'right-triangle', base: adj, height: opp, labels: { bottom: adj, left: opp, hypotenuse: hyp } }
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const reciprocalFunctions = [
            { name: 'csc', ans: `${hyp}/${opp}` },
            { name: 'sec', ans: `${hyp}/${adj}` },
            { name: 'cot', ans: `${adj}/${opp}` }
        ]
        const choice = reciprocalFunctions[randomInt(0, 2)]

        return {
            question: `In a right triangle with opposite = ${opp}, adjacent = ${adj}, hypotenuse = ${hyp}, find ${choice.name}(θ).`,
            answer: choice.ans,
            options: buildOptions(choice.ans, [`${opp}/${hyp}`, `${adj}/${hyp}`, `${opp}/${adj}`]),
            visual: null
        }
    },
    () => {
        const radians = ['π/6', 'π/4', 'π/3', 'π/2', 'π', '3π/2', '2π']
        const degrees = [30, 45, 60, 90, 180, 270, 360]
        const idx = randomInt(0, radians.length - 1)
        return {
            question: `Convert ${radians[idx]} radians to degrees.`,
            answer: `${degrees[idx]}°`,
            options: buildOptions(`${degrees[idx]}°`, [
                `${degrees[idx] + 30}°`,
                `${degrees[idx] - 15 > 0 ? degrees[idx] - 15 : degrees[idx] + 45}°`,
                `${degrees[(idx + 1) % degrees.length]}°`
            ]),
            visual: null
        }
    },
    () => {
        const angles = [0, 30, 45, 60, 90, 180, 270, 360]
        const sinValues = ['0', '1/2', '√2/2', '√3/2', '1', '0', '-1', '0']
        const idx = randomInt(0, angles.length - 1)
        return {
            question: `What is sin(${angles[idx]}°)?`,
            answer: sinValues[idx],
            options: buildOptions(sinValues[idx], [
                sinValues[(idx + 1) % sinValues.length],
                sinValues[(idx + 2) % sinValues.length],
                '-' + sinValues[idx] === '-0' ? '1' : '-' + sinValues[idx]
            ]),
            visual: null
        }
    },
    () => {
        const angles = [0, 30, 45, 60, 90, 180, 270, 360]
        const cosValues = ['1', '√3/2', '√2/2', '1/2', '0', '-1', '0', '1']
        const idx = randomInt(0, angles.length - 1)
        return {
            question: `What is cos(${angles[idx]}°)?`,
            answer: cosValues[idx],
            options: buildOptions(cosValues[idx], [
                cosValues[(idx + 1) % cosValues.length],
                cosValues[(idx + 2) % cosValues.length],
                cosValues[(idx + 3) % cosValues.length]
            ]),
            visual: null
        }
    },
    () => {
        const hyp = randomInt(5, 15)
        const angle = exactValues[randomInt(0, exactValues.length - 1)]
        let opp
        if (angle.deg === 30) opp = hyp / 2
        else if (angle.deg === 60) opp = parseFloat((hyp * Math.sqrt(3) / 2).toFixed(2))
        else opp = parseFloat((hyp * Math.sqrt(2) / 2).toFixed(2))

        if (!Number.isInteger(opp) && angle.deg === 30) return null

        return {
            question: `In a right triangle, the hypotenuse is ${hyp} and one angle is ${angle.deg}°. What is the side opposite to that angle? (Round to 2 decimal places if needed)`,
            answer: opp,
            options: buildOptions(opp, [hyp, parseFloat((opp + 1).toFixed(2)), parseFloat((opp * 2).toFixed(2))]),
            visual: null
        }
    },
    () => {
        const quadrantInfo = [
            { quadrant: 'I', sinSign: '+', cosSign: '+', tanSign: '+' },
            { quadrant: 'II', sinSign: '+', cosSign: '-', tanSign: '-' },
            { quadrant: 'III', sinSign: '-', cosSign: '-', tanSign: '+' },
            { quadrant: 'IV', sinSign: '-', cosSign: '+', tanSign: '-' }
        ]
        const q = quadrantInfo[randomInt(0, 3)]
        const func = ['sin', 'cos', 'tan'][randomInt(0, 2)]
        let sign
        if (func === 'sin') sign = q.sinSign
        else if (func === 'cos') sign = q.cosSign
        else sign = q.tanSign

        return {
            question: `In Quadrant ${q.quadrant}, what is the sign of ${func}(θ)?`,
            answer: sign,
            options: buildOptions(sign, [sign === '+' ? '-' : '+', '0', 'undefined']),
            visual: null
        }
    },
    () => {
        const val = exactValues[randomInt(0, exactValues.length - 1)]
        return {
            question: `What is the exact value of csc(${val.deg}°)?`,
            answer: val.csc,
            options: buildOptions(val.csc, [val.sec, val.sin, val.cos]),
            visual: null
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
            question: `What is the amplitude of y = ${amp}${isSin ? 'sin' : 'cos'}(${periodFactor}x)?`,
            answer: amp,
            options: buildOptions(amp, [periodFactor, amp * 2, 1]),
            visual: null
        }
    },
    () => {
        const amp = randomInt(2, 6)
        const b = randomInt(2, 6)
        return {
            question: `What is the period of y = ${amp}sin(${b}x)?`,
            answer: `2π/${b}`,
            options: buildOptions(`2π/${b}`, [`π/${b}`, `${b}π`, `2π`]),
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

        const sinIsPos = quadrant === 2
        const ans = sinIsPos ? val.sin : `-${val.sin}`

        return {
            question: `What is the exact value of sin(${targetAngle}°)?`,
            answer: ans,
            options: buildOptions(ans, [
                sinIsPos ? `-${val.sin}` : val.sin,
                sinIsPos ? val.cos : `-${val.cos}`,
                val.tan
            ]),
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

        const cosIsNeg = quadrant === 2 || quadrant === 3
        const ans = cosIsNeg ? `-${val.cos}` : val.cos

        return {
            question: `What is the exact value of cos(${targetAngle}°)?`,
            answer: ans,
            options: buildOptions(ans, [
                cosIsNeg ? val.cos : `-${val.cos}`,
                val.sin,
                `-${val.sin}`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const sinVal = opp / hyp
        const cosVal = adj / hyp
        const sinSq = parseFloat((sinVal * sinVal).toFixed(4))
        const cosSq = parseFloat((cosVal * cosVal).toFixed(4))
        return {
            question: `If sin(θ) = ${opp}/${hyp}, verify the Pythagorean identity. What is sin²(θ) + cos²(θ)?`,
            answer: 1,
            options: buildOptions(1, [0, 2, parseFloat((sinSq + cosSq - 0.1).toFixed(1))]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const tanSq = (opp * opp) / (adj * adj)
        const secSq = (hyp * hyp) / (adj * adj)
        const tanStr = `${opp * opp}/${adj * adj}`
        const secStr = `${hyp * hyp}/${adj * adj}`
        return {
            question: `If tan(θ) = ${opp}/${adj}, what is sec²(θ) using the identity 1 + tan²(θ) = sec²(θ)?`,
            answer: secStr,
            options: buildOptions(secStr, [tanStr, `${opp}/${hyp}`, `${hyp}/${adj}`]),
            visual: null
        }
    },
    () => {
        const base = randomInt(2, 5)
        const shift = randomInt(1, 4)
        const min = shift - base
        const max = shift + base
        return {
            question: `What is the range of y = ${base}cos(x) + ${shift}?`,
            answer: `[${min}, ${max}]`,
            options: buildOptions(`[${min}, ${max}]`, [
                `[-${base}, ${base}]`,
                `[${shift}, ${max}]`,
                `[${min - 1}, ${max + 1}]`
            ]),
            visual: null
        }
    },
    () => {
        const hShift = randomInt(1, 4)
        const isSin = Math.random() > 0.5
        const func = isSin ? 'sin' : 'cos'
        return {
            question: `What is the phase shift of y = ${func}(x - ${hShift}π)?`,
            answer: `${hShift}π to the right`,
            options: buildOptions(`${hShift}π to the right`, [
                `${hShift}π to the left`,
                `${hShift + 1}π to the right`,
                `${Math.max(1, hShift - 1)}π to the right`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const quadrant = [2, 3, 4][randomInt(0, 2)]
        let sinAns, cosAns

        if (quadrant === 2) { sinAns = `${opp}/${hyp}`; cosAns = `-${adj}/${hyp}` }
        else if (quadrant === 3) { sinAns = `-${opp}/${hyp}`; cosAns = `-${adj}/${hyp}` }
        else { sinAns = `-${opp}/${hyp}`; cosAns = `${adj}/${hyp}` }

        return {
            question: `sin(θ) = ${sinAns} and θ is in Quadrant ${quadrant}. What is cos(θ)?`,
            answer: cosAns,
            options: buildOptions(cosAns, [
                `-${adj}/${hyp}`,
                `${adj}/${hyp}`,
                `${opp}/${adj}`
            ]),
            visual: null
        }
    },
    () => {
        const c = randomInt(2, 6)
        const d = c - 1
        return {
            question: `Solve for x in [0, 2π): ${c}sin(x) = ${d - c}. What is x?`,
            answer: `3π/2`,
            options: buildOptions(`3π/2`, [`π/2`, `π`, `2π`]),
            visual: null
        }
    },
    () => {
        const k = randomInt(2, 5)
        const b = randomInt(2, 4)
        const period = `2π/${b}`
        return {
            question: `For y = ${k}sin(${b}x), what is the period?`,
            answer: period,
            options: buildOptions(period, [`${b}π`, `π/${b}`, `2π`]),
            visual: null
        }
    },
    () => {
        const val = exactValues[randomInt(0, exactValues.length - 1)]
        return {
            question: `What is sin²(${val.deg}°) + cos²(${val.deg}°)?`,
            answer: 1,
            options: buildOptions(1, [0, 2, parseFloat((Math.random() * 0.5 + 0.5).toFixed(2))]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const angle = parseFloat((Math.atan2(opp, adj) * 180 / Math.PI).toFixed(1))
        return {
            question: `A right triangle has opposite side ${opp} and adjacent side ${adj}. To the nearest tenth of a degree, what is θ?`,
            answer: `${angle}°`,
            options: buildOptions(`${angle}°`, [
                `${parseFloat((angle + 5).toFixed(1))}°`,
                `${parseFloat((90 - angle).toFixed(1))}°`,
                `${parseFloat((angle - 5).toFixed(1))}°`
            ]),
            visual: null
        }
    },
    () => {
        const heightM = randomInt(10, 50)
        const dist = randomInt(10, 50)
        const angleOfElev = parseFloat((Math.atan2(heightM, dist) * 180 / Math.PI).toFixed(1))
        return {
            question: `A building is ${heightM}m tall. From a point ${dist}m away on level ground, what is the angle of elevation to the top? (Round to 1 decimal place)`,
            answer: `${angleOfElev}°`,
            options: buildOptions(`${angleOfElev}°`, [
                `${parseFloat((angleOfElev + 5).toFixed(1))}°`,
                `${parseFloat((90 - angleOfElev).toFixed(1))}°`,
                `${parseFloat((angleOfElev * 2).toFixed(1))}°`
            ]),
            visual: null
        }
    }
]

const hardTemplates = [
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        return {
            question: `If sin(θ) = ${opp}/${hyp} and cos(θ) = ${adj}/${hyp}, find the exact value of sin(2θ).`,
            answer: `${2 * opp * adj}/${hyp * hyp}`,
            options: buildOptions(`${2 * opp * adj}/${hyp * hyp}`, [
                `${opp * opp - adj * adj}/${hyp * hyp}`,
                `${opp}/${hyp}`,
                `${2 * opp}/${hyp}`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const cos2 = adj * adj - opp * opp
        const ansStr = cos2 === 0 ? "0" : `${cos2}/${hyp * hyp}`
        return {
            question: `If sin(θ) = ${opp}/${hyp} and θ is in Quadrant I, evaluate cos(2θ).`,
            answer: ansStr,
            options: buildOptions(ansStr, [
                `${2 * opp * adj}/${hyp * hyp}`,
                `-${Math.abs(cos2)}/${hyp * hyp}`,
                `${opp * opp}/${hyp * hyp}`
            ]),
            visual: null
        }
    },
    () => {
        const isPlus = Math.random() > 0.5
        const sign = isPlus ? '+' : '-'
        const opSign = isPlus ? '-' : '+'
        return {
            question: `Which identity correctly expands cos(α ${sign} β)?`,
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
        const isPlus = Math.random() > 0.5
        const sign = isPlus ? '+' : '-'
        const opSign = isPlus ? '+' : '-'
        return {
            question: `Which identity correctly expands sin(α ${sign} β)?`,
            answer: `sin(α)cos(β) ${opSign} cos(α)sin(β)`,
            options: buildOptions(`sin(α)cos(β) ${opSign} cos(α)sin(β)`, [
                `sin(α)cos(β) ${sign} cos(α)sin(β)`,
                `cos(α)cos(β) ${sign} sin(α)sin(β)`,
                `cos(α)cos(β) ${opSign} sin(α)sin(β)`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const halfSin = parseFloat(Math.sqrt((hyp - adj) / (2 * hyp)).toFixed(4))
        return {
            question: `If cos(θ) = ${adj}/${hyp} and θ is in Quadrant I, find the exact value of sin(θ/2). (Round to 4 decimal places)`,
            answer: halfSin,
            options: buildOptions(halfSin, [
                parseFloat(Math.sqrt((hyp + adj) / (2 * hyp)).toFixed(4)),
                parseFloat((opp / (2 * hyp)).toFixed(4)),
                parseFloat((halfSin + 0.1).toFixed(4))
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(5, 12)
        const b = randomInt(5, 12)
        const angleC = [30, 45, 60, 90][randomInt(0, 3)]
        let cSq
        if (angleC === 90) cSq = a * a + b * b
        else if (angleC === 60) cSq = parseFloat((a * a + b * b - a * b).toFixed(2))
        else if (angleC === 45) cSq = parseFloat((a * a + b * b - a * b * Math.sqrt(2)).toFixed(2))
        else cSq = parseFloat((a * a + b * b - a * b * Math.sqrt(3)).toFixed(2))

        if (cSq <= 0) return null
        const c = parseFloat(Math.sqrt(cSq).toFixed(2))

        return {
            question: `In triangle ABC, a = ${a}, b = ${b}, and angle C = ${angleC}°. Using the law of cosines, find side c. (Round to 2 decimal places)`,
            answer: c,
            options: buildOptions(c, [
                parseFloat(Math.sqrt(a * a + b * b).toFixed(2)),
                parseFloat((c + 1).toFixed(2)),
                parseFloat((a + b - c).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const mult = randomInt(2, 4)
        const a = opp * mult
        const b = randomInt(2, 5)
        const angleA = parseFloat((Math.asin(a / (hyp * mult)) * 180 / Math.PI).toFixed(1))
        const sinB = parseFloat((b * Math.sin(angleA * Math.PI / 180) / a).toFixed(4))
        if (sinB > 1) return null
        const angleB = parseFloat((Math.asin(sinB) * 180 / Math.PI).toFixed(1))
        return {
            question: `In triangle ABC, side a = ${a}, side b = ${b}, and angle A = ${angleA}°. Using the law of sines, find angle B. (Round to 1 decimal place)`,
            answer: `${angleB}°`,
            options: buildOptions(`${angleB}°`, [
                `${parseFloat((angleB + 5).toFixed(1))}°`,
                `${parseFloat((90 - angleB).toFixed(1))}°`,
                `${parseFloat((180 - angleB).toFixed(1))}°`
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const c = randomInt(3, 8)
        const s = (a + b + c) / 2

        if (s <= a || s <= b || s <= c) return null

        const area = parseFloat(Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2))
        const sinC = parseFloat(((2 * area) / (a * b)).toFixed(4))
        if (sinC > 1) return null

        return {
            question: `A triangle has sides ${a}, ${b}, ${c}. Its area (by Heron's formula) is ${area}. Using A = ½ab·sin(C), find sin(C) where C is the angle between sides ${a} and ${b}. (Round to 4 decimal places)`,
            answer: sinC,
            options: buildOptions(sinC, [
                parseFloat((sinC + 0.1).toFixed(4)),
                parseFloat((area / (a * b)).toFixed(4)),
                parseFloat((1 - sinC).toFixed(4))
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
            question: `Solve 2cos²(x) - 1 = 0 for x in [0, 2π). List all solutions.`,
            answer: `π/4, 3π/4, 5π/4, 7π/4`,
            options: buildOptions(`π/4, 3π/4, 5π/4, 7π/4`, [
                `π/4, 7π/4`,
                `π/4, 3π/4`,
                `π/4, 3π/4, 5π/4`
            ]),
            visual: null
        }
    },
    () => {
        const k = randomInt(2, 5)
        return {
            question: `Solve for x in [0, 2π): tan(x) = 0`,
            answer: `0, π`,
            options: buildOptions(`0, π`, [`π/2, 3π/2`, `0, π/2, π`, `π`]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const bearingA = randomInt(0, 359)
        const dist = randomInt(10, 100)
        const bearingRad = bearingA * Math.PI / 180
        const northComp = parseFloat((dist * Math.cos(bearingRad)).toFixed(2))
        const eastComp = parseFloat((dist * Math.sin(bearingRad)).toFixed(2))
        return {
            question: `A ship travels ${dist} km on a bearing of ${bearingA}°. What is the northward component of its displacement? (Round to 2 decimal places)`,
            answer: northComp,
            options: buildOptions(northComp, [
                eastComp,
                parseFloat((dist * Math.sin(bearingRad)).toFixed(2)),
                parseFloat((northComp + 5).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const base = randomInt(5, 12)
        const base2 = randomInt(5, 12)
        const angle = [30, 45, 60][randomInt(0, 2)]
        let area
        if (angle === 30) area = parseFloat(((base * base2 * 0.5) / 2).toFixed(2))
        else if (angle === 45) area = parseFloat(((base * base2 * Math.sqrt(2) / 2) / 2).toFixed(2))
        else area = parseFloat(((base * base2 * Math.sqrt(3) / 2) / 2).toFixed(2))

        return {
            question: `A triangle has two sides of length ${base} and ${base2} with an included angle of ${angle}°. Find its area using A = ½ab·sin(C). (Round to 2 decimal places)`,
            answer: area,
            options: buildOptions(area, [
                parseFloat((area * 2).toFixed(2)),
                parseFloat((base * base2 / 2).toFixed(2)),
                parseFloat((area + 3).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        return {
            question: `Simplify: sin²(θ) - 1 where sin(θ) = ${opp}/${hyp}`,
            answer: `-${adj * adj}/${hyp * hyp}`,
            options: buildOptions(`-${adj * adj}/${hyp * hyp}`, [
                `${opp * opp}/${hyp * hyp}`,
                `${adj * adj}/${hyp * hyp}`,
                `-${opp * opp}/${hyp * hyp}`
            ]),
            visual: null
        }
    },
    () => {
        const p = randomInt(2, 5)
        const q = randomInt(2, 5)
        const product = parseFloat(((Math.cos((p - q) * Math.PI / 6) + Math.cos((p + q) * Math.PI / 6)) / 2).toFixed(4))
        return {
            question: `Using the product-to-sum formula, cos(A)cos(B) = ½[cos(A-B) + cos(A+B)], evaluate cos(${p * 30}°)·cos(${q * 30}°). (Round to 4 decimal places)`,
            answer: product,
            options: buildOptions(product, [
                parseFloat((product * 2).toFixed(4)),
                parseFloat(Math.cos(p * Math.PI / 6).toFixed(4)),
                parseFloat((product + 0.1).toFixed(4))
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
        const [opp, adj, hyp] = getPythagoreanTriple()
        const secSq = (hyp * hyp) / (adj * adj)
        return {
            question: `If tan(θ) = ${opp}/${adj}, find sec²(θ) using 1 + tan²(θ) = sec²(θ), then find cos(2θ) using cos(2θ) = 2cos²(θ) - 1.`,
            answer: `${2 * adj * adj - hyp * hyp}/${hyp * hyp}`,
            options: buildOptions(`${2 * adj * adj - hyp * hyp}/${hyp * hyp}`, [
                `${2 * opp * adj}/${hyp * hyp}`,
                `${adj * adj - opp * opp}/${hyp * hyp}`,
                `${2 * adj * adj}/${hyp * hyp}`
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `Find all solutions in [0, 2π) for: sin(x) = cos(x)`,
            answer: `π/4, 5π/4`,
            options: buildOptions(`π/4, 5π/4`, [`π/4, 3π/4`, `π/4, 3π/4, 5π/4, 7π/4`, `π/4`]),
            visual: null
        }
    },
    () => {
        return {
            question: `Find the exact value of sin(15°) using sin(45° - 30°).`,
            answer: `(√6 - √2)/4`,
            options: buildOptions(`(√6 - √2)/4`, [
                `(√6 + √2)/4`,
                `(√3 - 1)/2`,
                `(√2 - 1)/4`
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `Find the exact value of cos(75°) using cos(45° + 30°).`,
            answer: `(√6 - √2)/4`,
            options: buildOptions(`(√6 - √2)/4`, [
                `(√6 + √2)/4`,
                `(√2 - √6)/4`,
                `(√3 - 1)/4`
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `Find the exact value of tan(75°).`,
            answer: `2 + √3`,
            options: buildOptions(`2 + √3`, [`2 - √3`, `√3 - 1`, `1 + √3`]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const halfCos = parseFloat(Math.sqrt((hyp + adj) / (2 * hyp)).toFixed(4))
        return {
            question: `If cos(θ) = ${adj}/${hyp} and θ is in Quadrant I, find cos(θ/2) using the half-angle formula. (Round to 4 decimal places)`,
            answer: halfCos,
            options: buildOptions(halfCos, [
                parseFloat(Math.sqrt((hyp - adj) / (2 * hyp)).toFixed(4)),
                parseFloat((adj / (2 * hyp)).toFixed(4)),
                parseFloat((halfCos - 0.1).toFixed(4))
            ]),
            visual: null
        }
    },
    () => {
        const n = randomInt(3, 8)
        const r = parseFloat(Math.abs(Math.cos(Math.PI / n)).toFixed(4))
        return {
            question: `Find the general solution for sin(${n}x) = 0. What is the smallest positive solution?`,
            answer: `π/${n}`,
            options: buildOptions(`π/${n}`, [`π`, `π/${n + 1}`, `2π/${n}`]),
            visual: null
        }
    },
    () => {
        return {
            question: `Which of the following is the correct sum-to-product identity for sin(A) + sin(B)?`,
            answer: `2sin((A+B)/2)cos((A-B)/2)`,
            options: buildOptions(`2sin((A+B)/2)cos((A-B)/2)`, [
                `2cos((A+B)/2)sin((A-B)/2)`,
                `2sin((A+B)/2)sin((A-B)/2)`,
                `2cos((A+B)/2)cos((A-B)/2)`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        const tanHalf = parseFloat((opp / (hyp + adj)).toFixed(4))
        return {
            question: `If sin(θ) = ${opp}/${hyp} and cos(θ) = ${adj}/${hyp}, find tan(θ/2) using the identity tan(θ/2) = sin(θ)/(1 + cos(θ)). (Round to 4 decimal places)`,
            answer: tanHalf,
            options: buildOptions(tanHalf, [
                parseFloat((opp / (hyp - adj)).toFixed(4)),
                parseFloat((adj / (hyp + opp)).toFixed(4)),
                parseFloat((tanHalf + 0.1).toFixed(4))
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `Solve for all x in [0, 2π): sin(2x) = sin(x)`,
            answer: `0, π/3, π, 5π/3`,
            options: buildOptions(`0, π/3, π, 5π/3`, [
                `0, π`,
                `π/3, 5π/3`,
                `0, π/3, 5π/3`
            ]),
            visual: null
        }
    },
    () => {
        const [opp, adj, hyp] = getPythagoreanTriple()
        return {
            question: `Using De Moivre's theorem, if z = cos(θ) + i·sin(θ) where sin(θ) = ${opp}/${hyp} and cos(θ) = ${adj}/${hyp}, what is z³ written in the form a + bi? (Use exact fractions)`,
            answer: `${adj * adj * adj - 3 * adj * opp * opp}/${hyp * hyp * hyp} + ${3 * adj * adj * opp - opp * opp * opp}/${hyp * hyp * hyp}i`,
            options: buildOptions(
                `${adj * adj * adj - 3 * adj * opp * opp}/${hyp * hyp * hyp} + ${3 * adj * adj * opp - opp * opp * opp}/${hyp * hyp * hyp}i`,
                [
                    `${adj * adj * adj}/${hyp * hyp * hyp} + ${opp * opp * opp}/${hyp * hyp * hyp}i`,
                    `${3 * adj}/${hyp} + ${3 * opp}/${hyp}i`,
                    `${adj}/${hyp} + ${opp}/${hyp}i`
                ]
            ),
            visual: null
        }
    },
    () => {
        const p = randomInt(1, 4)
        const q = randomInt(1, 4)
        const sumToProduct = `2sin(${p + q}x/2)cos(${Math.abs(p - q)}x/2)`
        return {
            question: `Apply the sum-to-product identity to simplify sin(${p}x) + sin(${q}x).`,
            answer: sumToProduct,
            options: buildOptions(sumToProduct, [
                `2cos(${p + q}x/2)sin(${Math.abs(p - q)}x/2)`,
                `2sin(${p + q}x)cos(${Math.abs(p - q)}x)`,
                `2cos(${p + q}x/2)cos(${Math.abs(p - q)}x/2)`
            ]),
            visual: null
        }
    },
    () => {
        return {
            question: `The general solution for cos(x) = -1/2 is?`,
            answer: `x = 2π/3 + 2kπ or x = 4π/3 + 2kπ`,
            options: buildOptions(`x = 2π/3 + 2kπ or x = 4π/3 + 2kπ`, [
                `x = π/3 + 2kπ or x = 5π/3 + 2kπ`,
                `x = 2π/3 + kπ`,
                `x = 2π/3 + 2kπ`
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(3, 6)
        const b = randomInt(3, 6)
        const R = parseFloat(Math.sqrt(a * a + b * b).toFixed(2))
        const phi = parseFloat(Math.atan2(b, a).toFixed(4))
        return {
            question: `Express ${a}sin(x) + ${b}cos(x) in the form R·sin(x + φ). What is R? (Round to 2 decimal places)`,
            answer: R,
            options: buildOptions(R, [
                parseFloat((a + b).toFixed(2)),
                parseFloat((a * b).toFixed(2)),
                parseFloat((R + 1).toFixed(2))
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
        hard: { question: "If sin(θ) = 3/5 and cos(θ) = 4/5, find sin(2θ).", answer: "24/25", options: ["24/25", "7/25", "12/25", "16/25"], visual: null },
        expert: { question: "Find the exact value of sin(15°).", answer: "(√6 - √2)/4", options: ["(√6 - √2)/4", "(√6 + √2)/4", "(√3 - 1)/2", "(√2 - 1)/4"], visual: null }
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
