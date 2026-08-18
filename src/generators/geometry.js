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
        [3, 4, 5], [5, 12, 13], [6, 8, 10],
        [8, 15, 17], [9, 12, 15], [10, 24, 26]
    ]
    return triples[randomInt(0, triples.length - 1)]
}

function circleTerm(variable, value, opposite = false) {
    if (value === 0) return `${variable}²`
    const sign = opposite ? (value > 0 ? '+' : '-') : (value > 0 ? '-' : '+')
    return `(${variable} ${sign} ${Math.abs(value)})²`
}

const easyTemplates = [
    () => {
        const w = randomInt(3, 12)
        const h = randomInt(3, 12)
        const area = w * h
        return {
            question: `Find the area of a rectangle with width ${w} and height ${h}.`,
            answer: area,
            options: buildOptions(area, [w + h, 2 * w + 2 * h, w * w]),
            visual: { type: 'rectangle', width: w, height: h, labels: { bottom: w, right: h } }
        }
    },
    () => {
        const side = randomInt(4, 20)
        const perimeter = 4 * side
        return {
            question: `What is the perimeter of a square with a side length of ${side}?`,
            answer: perimeter,
            options: buildOptions(perimeter, [side * side, side * 2, perimeter + 4]),
            visual: { type: 'square', side: side, labels: { bottom: side } }
        }
    },
    () => {
        const b = randomInt(4, 15)
        const h = randomInt(4, 15)
        const area = (b * h) / 2
        const ansStr = Number.isInteger(area) ? area : area.toFixed(1)
        return {
            question: `What is the area of a triangle with base ${b} and height ${h}?`,
            answer: ansStr,
            options: buildOptions(ansStr, [b * h, b + h, (b * h) / 3]),
            visual: null
        }
    },
    () => {
        const angle = randomInt(15, 75)
        const comp = 90 - angle
        return {
            question: `Two angles are complementary. If one angle is ${angle}°, what is the other?`,
            answer: `${comp}°`,
            options: buildOptions(`${comp}°`, [`${180 - angle}°`, `${angle}°`, `${90 + angle}°`]),
            visual: null
        }
    },
    () => {
        const angle = randomInt(30, 150)
        const supp = 180 - angle
        return {
            question: `Two angles are supplementary. If one angle is ${angle}°, what is the other?`,
            answer: `${supp}°`,
            options: buildOptions(`${supp}°`, [`${90 - angle > 0 ? 90 - angle : 360 - angle}°`, `${angle}°`, `${180 + angle}°`]),
            visual: null
        }
    }
]

const mediumTemplates = [
    () => {
        const w = randomInt(4, 12)
        const h = randomInt(4, 12)
        const area = w * h
        const perimeter = 2 * w + 2 * h
        return {
            question: `A rectangle has an area of ${area}. If its width is ${w}, what is its perimeter?`,
            answer: perimeter,
            options: buildOptions(perimeter, [w + h, area / w, 2 * area]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 10)
        const circumference = 2 * r
        const area = r * r
        return {
            question: `A circle has a circumference of ${circumference}π. What is its exact area?`,
            answer: `${area}π`,
            options: buildOptions(`${area}π`, [`${circumference}π`, `${2 * area}π`, `${r}π`]),
            visual: null
        }
    },
    () => {
        const sides = [5, 6, 8, 9, 10, 12]
        const n = sides[randomInt(0, sides.length - 1)]
        const interiorAngle = ((n - 2) * 180) / n
        return {
            question: `Each interior angle of a regular polygon is ${interiorAngle}°. How many sides does the polygon have?`,
            answer: n,
            options: buildOptions(n, [n - 1, n + 2, n * 2]),
            visual: null
        }
    },
    () => {
        const k1 = randomInt(2, 5)
        const k2 = randomInt(k1 + 1, k1 + 4)
        const ratioSq1 = k1 * k1
        const ratioSq2 = k2 * k2
        return {
            question: `Two similar triangles have corresponding sides in the ratio ${k1}:${k2}. What is the ratio of their areas?`,
            answer: `${ratioSq1}:${ratioSq2}`,
            options: buildOptions(`${ratioSq1}:${ratioSq2}`, [`${k1}:${k2}`, `${k1 * 2}:${k2 * 2}`, `${k2}:${k1}`]),
            visual: null
        }
    },
    () => {
        const side = randomInt(4, 12)
        const scale = randomInt(2, 4)
        const originalArea = side * side
        const newArea = (side * scale) * (side * scale)
        return {
            question: `A square has a side length of ${side}. If the side length is multiplied by ${scale}, what is the new area?`,
            answer: newArea,
            options: buildOptions(newArea, [originalArea * scale, originalArea + scale, originalArea * scale * 3]),
            visual: null
        }
    }
]

const hardTemplates = [
    () => {
        const w = randomInt(3, 10)
        const diff = randomInt(2, 6)
        const l = w + diff
        const area = w * l
        const perimeter = 2 * (w + l)
        return {
            question: `A rectangle has an area of ${area}. Its length is ${diff} units greater than its width. What is its perimeter?`,
            answer: perimeter,
            options: buildOptions(perimeter, [w + l, perimeter + diff, area / 2]),
            visual: null
        }
    },
    () => {
        const s = randomInt(3, 8)
        const sa = 6 * s * s
        const vol = s * s * s
        return {
            question: `The surface area of a cube is ${sa}. What is its volume?`,
            answer: vol,
            options: buildOptions(vol, [s * s, sa * s, vol * 2]),
            visual: null
        }
    },
    () => {
        const [bx, by, dist] = getPythagoreanTriple()
        const x1 = randomInt(-5, 5)
        const y1 = randomInt(-5, 5)
        const mx = (x1 + bx) / 2
        const my = (y1 + by) / 2
        return {
            question: `The midpoint of line segment AB is (${mx}, ${my}). If point A is at (${x1}, ${y1}), what is the exact distance of point B from the origin (0, 0)?`,
            answer: dist,
            options: buildOptions(dist, [dist + 2, Math.abs(bx + by), Math.round(dist * 1.5)]),
            visual: null
        }
    },
    () => {
        const x = randomInt(5, 15)
        const mult1 = randomInt(2, 4)
        const mult2 = randomInt(5, 7)
        const offset1 = randomInt(10, 30)
        const val = mult1 * x + offset1
        const offset2 = mult2 * x - val
        return {
            question: `Two parallel lines are cut by a transversal. The alternate interior angles are (${mult1}x + ${offset1})° and (${mult2}x - ${offset2})°. Find x.`,
            answer: x,
            options: buildOptions(x, [x + 5, x - 2, val]),
            visual: null
        }
    },
    () => {
        const [dx, dy, dist] = getPythagoreanTriple()
        const x1 = randomInt(-5, 5)
        const y1 = randomInt(-5, 5)
        const x2 = x1 + dx
        const y2 = y1 + dy
        return {
            question: `What is the exact distance between the points (${x1}, ${y1}) and (${x2}, ${y2})?`,
            answer: dist,
            options: buildOptions(dist, [dx + dy, Math.abs(x2 - x1), dist + 2]),
            visual: null
        }
    }
]

const expertTemplates = [
    () => {
        const h = randomInt(-5, 5)
        const k = randomInt(-5, 5)
        const [dx, dy, r] = getPythagoreanTriple()
        const px = h + dx
        const py = k + dy
        const rSq = r * r
        const hStr = circleTerm('x', h, false)
        const kStr = circleTerm('y', k, false)
        const answer = `${hStr} + ${kStr} = ${rSq}`

        return {
            question: `A circle has its center at (${h}, ${k}) and passes through the point (${px}, ${py}). Which is its equation?`,
            answer: answer,
            options: buildOptions(answer, [
                `${hStr} + ${kStr} = ${r}`,
                `${circleTerm('x', h, true)} + ${circleTerm('y', k, true)} = ${rSq}`,
                `x² + y² = ${rSq}`
            ]),
            visual: null
        }
    },
    () => {
        const [radius, height, slantHeight] = getPythagoreanTriple()
        const multiplier = randomInt(1, 3)
        const trueR = radius * multiplier
        const trueH = height * multiplier
        const trueL = slantHeight * multiplier
        const volume = (trueR * trueR * trueH) / 3

        return {
            question: `A cone has a volume of ${volume}π and a radius of ${trueR}. What is its slant height?`,
            answer: trueL,
            options: buildOptions(trueL, [trueH, trueL + multiplier, trueR + trueH]),
            visual: null
        }
    },
    () => {
        const x1 = randomInt(1, 5)
        const y1 = randomInt(1, 5)
        const x2 = randomInt(-5, -1)
        const y2 = randomInt(1, 5)
        const x3 = randomInt(-2, 2)
        const y3 = randomInt(-5, -1)
        const area2 = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2))
        const area = area2 / 2

        return {
            question: `A triangle on the coordinate plane has vertices at (${x1}, ${y1}), (${x2}, ${y2}), and (${x3}, ${y3}). What is its exact area?`,
            answer: area,
            options: buildOptions(area, [area2, area + 2, area2 + 1]),
            visual: null
        }
    },
    () => {
        const k1 = randomInt(2, 4)
        const k2 = randomInt(k1 + 1, 6)
        const saRatio1 = k1 * k1
        const saRatio2 = k2 * k2
        const volRatio1 = k1 * k1 * k1
        const volRatio2 = k2 * k2 * k2

        return {
            question: `Two similar solids have surface areas in the ratio ${saRatio1}:${saRatio2}. What is the ratio of their volumes?`,
            answer: `${volRatio1}:${volRatio2}`,
            options: buildOptions(`${volRatio1}:${volRatio2}`, [`${saRatio1}:${saRatio2}`, `${k1}:${k2}`, `${volRatio2}:${volRatio1}`]),
            visual: null
        }
    },
    () => {
        const V = randomInt(6, 12)
        const F = randomInt(6, 12)
        const E = V + F - 2

        return {
            question: `According to Euler's polyhedron formula, if a convex polyhedron has ${V} vertices and ${F} faces, how many edges does it have?`,
            answer: E,
            options: buildOptions(E, [V + F, V * F, E + 2]),
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
        easy: { question: "Find the area of a 2 by 3 rectangle.", answer: 6, options: [6, 5, 10, 12], visual: null },
        medium: { question: "A rectangle has area 24 and width 4. Find its perimeter.", answer: 20, options: [20, 10, 24, 16], visual: null },
        hard: { question: "The surface area of a cube is 54. What is its volume?", answer: 27, options: [27, 9, 36, 18], visual: null },
        expert: { question: "A solid's surface area ratio is 4:9. What is its volume ratio?", answer: "8:27", options: ["8:27", "2:3", "16:81", "4:9"], visual: null }
    }
    return fallbacks[difficulty] || fallbacks.easy
}

export function generateGeometry(difficulty, count = 5) {
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
