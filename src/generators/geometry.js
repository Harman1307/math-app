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

        if (fallback > 0 && fallback !== correct && !uniqueList.includes(fallback)) {
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

function simplifyRatio(a, b) {
    const g = gcd(a, b)
    return `${a / g}:${b / g}`
}

const easyTemplates = [
    () => {
        const w = randomInt(3, 15)
        const h = randomInt(3, 15)
        const area = w * h
        return {
            question: `Find the area of a rectangle with width ${w} and height ${h}.`,
            answer: area,
            options: buildOptions(area, [2 * (w + h), w + h, w * w]),
            visual: { type: 'rectangle', width: w, height: h, labels: { bottom: w, right: h } }
        }
    },
    () => {
        const side = randomInt(4, 20)
        const perimeter = 4 * side
        return {
            question: `What is the perimeter of a square with side length ${side}?`,
            answer: perimeter,
            options: buildOptions(perimeter, [side * side, side * 2, perimeter + 4]),
            visual: { type: 'square', side, labels: { bottom: side } }
        }
    },
    () => {
        const b = randomInt(4, 20)
        const h = randomInt(4, 20)
        const area = (b * h) / 2
        const ansStr = Number.isInteger(area) ? area : parseFloat(area.toFixed(1))
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
            question: `Two angles are complementary. One angle is ${angle}°. What is the other?`,
            answer: `${comp}°`,
            options: buildOptions(`${comp}°`, [`${180 - angle}°`, `${angle}°`, `${90 + angle}°`]),
            visual: null
        }
    },
    () => {
        const angle = randomInt(30, 150)
        const supp = 180 - angle
        return {
            question: `Two angles are supplementary. One angle is ${angle}°. What is the other?`,
            answer: `${supp}°`,
            options: buildOptions(`${supp}°`, [`${360 - angle}°`, `${angle}°`, `${90 - angle > 0 ? 90 - angle : 270 - angle}°`]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 14)
        const area = r * r
        return {
            question: `What is the exact area of a circle with radius ${r}?`,
            answer: `${area}π`,
            options: buildOptions(`${area}π`, [`${2 * r}π`, `${r}π`, `${area * 2}π`]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 14)
        const circumference = 2 * r
        return {
            question: `What is the exact circumference of a circle with radius ${r}?`,
            answer: `${circumference}π`,
            options: buildOptions(`${circumference}π`, [`${r * r}π`, `${r}π`, `${circumference + 2}π`]),
            visual: null
        }
    },
    () => {
        const [a, b, c] = getPythagoreanTriple()
        const mult = randomInt(1, 3)
        return {
            question: `A right triangle has legs ${a * mult} and ${b * mult}. What is the length of the hypotenuse?`,
            answer: c * mult,
            options: buildOptions(c * mult, [a * mult + b * mult, (a + b) * mult - 1, c * mult + 1]),
            visual: null
        }
    },
    () => {
        const base = randomInt(4, 14)
        const height = randomInt(4, 14)
        const area = base * height
        return {
            question: `What is the area of a parallelogram with base ${base} and height ${height}?`,
            answer: area,
            options: buildOptions(area, [2 * (base + height), (base * height) / 2, base + height]),
            visual: null
        }
    },
    () => {
        const b1 = randomInt(4, 12)
        const b2 = randomInt(4, 12)
        const h = randomInt(3, 10)
        const area = ((b1 + b2) * h) / 2
        const ansStr = Number.isInteger(area) ? area : parseFloat(area.toFixed(1))
        return {
            question: `A trapezoid has parallel sides of length ${b1} and ${b2}, and a height of ${h}. What is its area?`,
            answer: ansStr,
            options: buildOptions(ansStr, [b1 * h + b2 * h, ((b1 + b2) * h), (b1 + b2) / 2]),
            visual: null
        }
    },
    () => {
        const angle = randomInt(20, 80)
        const verticalAngle = angle
        return {
            question: `Two lines intersect forming vertical angles. One angle measures ${angle}°. What is the measure of its vertical angle?`,
            answer: `${verticalAngle}°`,
            options: buildOptions(`${verticalAngle}°`, [`${180 - angle}°`, `${90 - angle}°`, `${angle + 10}°`]),
            visual: null
        }
    },
    () => {
        const sides = [3, 4, 5, 6, 8, 10, 12]
        const n = sides[randomInt(0, sides.length - 1)]
        const interiorSum = (n - 2) * 180
        return {
            question: `What is the sum of interior angles of a polygon with ${n} sides?`,
            answer: `${interiorSum}°`,
            options: buildOptions(`${interiorSum}°`, [`${n * 180}°`, `${(n - 1) * 180}°`, `${interiorSum - 180}°`]),
            visual: null
        }
    },
    () => {
        const w = randomInt(3, 12)
        const h = randomInt(3, 12)
        const perimeter = 2 * (w + h)
        return {
            question: `A rectangle has width ${w} and height ${h}. What is its perimeter?`,
            answer: perimeter,
            options: buildOptions(perimeter, [w * h, w + h, perimeter + 2]),
            visual: { type: 'rectangle', width: w, height: h, labels: { bottom: w, right: h } }
        }
    },
    () => {
        const side = randomInt(4, 15)
        const area = side * side
        return {
            question: `A square has side length ${side}. What is its area?`,
            answer: area,
            options: buildOptions(area, [4 * side, side * 2, area + side]),
            visual: { type: 'square', side, labels: { bottom: side } }
        }
    },
    () => {
        const r = randomInt(3, 10)
        const d = 2 * r
        return {
            question: `A circle has a diameter of ${d}. What is its radius?`,
            answer: r,
            options: buildOptions(r, [d, d * 2, r + 1]),
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
            question: `A rectangle has area ${area}. Its width is ${w}. What is its perimeter?`,
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
            question: `A circle has circumference ${circumference}π. What is its exact area?`,
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
            question: `Each interior angle of a regular polygon is ${interiorAngle}°. How many sides does it have?`,
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
            question: `Two similar triangles have corresponding sides in ratio ${k1}:${k2}. What is the ratio of their areas?`,
            answer: simplifyRatio(ratioSq1, ratioSq2),
            options: buildOptions(simplifyRatio(ratioSq1, ratioSq2), [
                simplifyRatio(k1, k2),
                simplifyRatio(k2, k1),
                simplifyRatio(ratioSq1 + 1, ratioSq2)
            ]),
            visual: null
        }
    },
    () => {
        const side = randomInt(4, 12)
        const scale = randomInt(2, 4)
        const originalArea = side * side
        const newArea = (side * scale) * (side * scale)
        return {
            question: `A square has side length ${side}. The side is multiplied by ${scale}. What is the new area?`,
            answer: newArea,
            options: buildOptions(newArea, [originalArea * scale, originalArea + scale * scale, side * scale]),
            visual: null
        }
    },
    () => {
        const [a, b, c] = getPythagoreanTriple()
        const mult = randomInt(2, 4)
        return {
            question: `A right triangle has a hypotenuse of ${c * mult} and one leg of ${a * mult}. What is the other leg?`,
            answer: b * mult,
            options: buildOptions(b * mult, [c * mult - a * mult, a * mult, b * mult + 1]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 10)
        const theta = [60, 90, 120, 180][randomInt(0, 3)]
        const arcLength = (theta / 360) * 2 * r
        const ansStr = Number.isInteger(arcLength) ? `${arcLength}π` : `${parseFloat(arcLength.toFixed(2))}π`
        return {
            question: `A circle has radius ${r}. What is the exact arc length subtended by a central angle of ${theta}°?`,
            answer: ansStr,
            options: buildOptions(ansStr, [`${r}π`, `${2 * r}π`, `${r * r}π`]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 10)
        const theta = [60, 90, 120][randomInt(0, 2)]
        const sectorArea = (theta / 360) * r * r
        const ansStr = Number.isInteger(sectorArea) ? `${sectorArea}π` : `${parseFloat(sectorArea.toFixed(2))}π`
        return {
            question: `A circle has radius ${r}. What is the exact area of the sector with central angle ${theta}°?`,
            answer: ansStr,
            options: buildOptions(ansStr, [`${r * r}π`, `${r}π`, `${2 * r}π`]),
            visual: null
        }
    },
    () => {
        const x = randomInt(5, 20)
        const mult1 = randomInt(2, 4)
        const offset1 = randomInt(10, 30)
        const angleVal = mult1 * x + offset1
        const offset2 = angleVal - (mult1 + randomInt(1, 3)) * x
        const mult2 = mult1 + randomInt(1, 3)

        if (angleVal <= 0 || angleVal >= 180) return null

        const offset2Abs = Math.abs(angleVal - mult2 * x)
        const expr2 = angleVal >= mult2 * x
            ? `(${mult2}x + ${offset2Abs})`
            : `(${mult2}x - ${offset2Abs})`

        return {
            question: `Two parallel lines are cut by a transversal. The co-interior (same-side interior) angles are (${mult1}x + ${offset1})° and ${expr2}°. They sum to 180°. Find x.`,
            answer: x,
            options: buildOptions(x, [x + 5, Math.round(x / 2), angleVal]),
            visual: null
        }
    },
    () => {
        const side = randomInt(3, 10)
        const sideB = randomInt(3, 10)
        const includeAngle = [60, 90, 120][randomInt(0, 2)]

        let area
        if (includeAngle === 90) {
            area = (side * sideB) / 2
        } else if (includeAngle === 60) {
            area = parseFloat(((side * sideB * Math.sqrt(3) / 4)).toFixed(2))
        } else {
            area = parseFloat(((side * sideB * Math.sqrt(3) / 4)).toFixed(2))
        }

        if (includeAngle === 90) {
            const ansStr = Number.isInteger(area) ? area : parseFloat(area.toFixed(1))
            return {
                question: `A triangle has two sides of length ${side} and ${sideB} with an included angle of ${includeAngle}°. What is its area?`,
                answer: ansStr,
                options: buildOptions(ansStr, [side * sideB, ansStr + 2, Math.round(ansStr / 2)]),
                visual: null
            }
        }

        return null
    },
    () => {
        const r = randomInt(3, 10)
        const inscribedAngle = randomInt(20, 80)
        const centralAngle = 2 * inscribedAngle
        return {
            question: `An inscribed angle in a circle measures ${inscribedAngle}°. What is the measure of the central angle subtending the same arc?`,
            answer: `${centralAngle}°`,
            options: buildOptions(`${centralAngle}°`, [`${inscribedAngle}°`, `${inscribedAngle / 2}°`, `${180 - inscribedAngle}°`]),
            visual: null
        }
    },
    () => {
        const mult = randomInt(2, 5)
        const [a, b, c] = [3 * mult, 4 * mult, 5 * mult]
        return {
            question: `A right triangle has legs ${a} and ${b}. What is the area of the semicircle drawn on the hypotenuse?`,
            answer: `${(c * c) / 8}π`,
            options: buildOptions(`${(c * c) / 8}π`, [`${c * c}π`, `${c / 2}π`, `${(c * c) / 4}π`]),
            visual: null
        }
    },
    () => {
        const totalAngle = randomInt(3, 8) * 180
        const n = totalAngle / 180 + 2
        return {
            question: `The exterior angles of a polygon each measure ${360 / n}°. How many sides does the polygon have?`,
            answer: n,
            options: buildOptions(n, [n - 1, n + 1, n * 2]),
            visual: null
        }
    },
    () => {
        const a = randomInt(4, 10)
        const b = randomInt(4, 10)
        const diag1 = 2 * a
        const diag2 = 2 * b
        const area = (diag1 * diag2) / 2
        return {
            question: `A rhombus has diagonals of length ${diag1} and ${diag2}. What is its area?`,
            answer: area,
            options: buildOptions(area, [diag1 + diag2, diag1 * diag2, area * 2]),
            visual: null
        }
    },
    () => {
        const [a, b, c] = getPythagoreanTriple()
        const mult = randomInt(1, 3)
        const s = (a * mult + b * mult + c * mult) / 2
        const area = Math.sqrt(s * (s - a * mult) * (s - b * mult) * (s - c * mult))
        const ansStr = Number.isInteger(area) ? area : parseFloat(area.toFixed(2))
        return {
            question: `Using Heron's formula, find the area of a triangle with sides ${a * mult}, ${b * mult}, and ${c * mult}.`,
            answer: ansStr,
            options: buildOptions(ansStr, [ansStr + 5, Math.round(ansStr / 2), ansStr * 2]),
            visual: null
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const c = a + b
        if (a * a + b * b !== c * c) {
            const area = parseFloat(((a * b) / 2).toFixed(1))
            return {
                question: `A right triangle has legs ${a} and ${b}. What is the length of the median to the hypotenuse?`,
                answer: parseFloat((Math.sqrt(a * a + b * b) / 2).toFixed(2)),
                options: buildOptions(parseFloat((Math.sqrt(a * a + b * b) / 2).toFixed(2)), [
                    parseFloat(Math.sqrt(a * a + b * b).toFixed(2)),
                    parseFloat(((a + b) / 2).toFixed(2)),
                    parseFloat((Math.sqrt(a * a + b * b) / 2 + 1).toFixed(2))
                ]),
                visual: null
            }
        }
        return null
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
            question: `A rectangle has area ${area}. Its length is ${diff} more than its width. What is its perimeter?`,
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
            question: `A cube has surface area ${sa}. What is its volume?`,
            answer: vol,
            options: buildOptions(vol, [s * s, sa * s, vol + s]),
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
            question: `What is the exact distance between (${x1}, ${y1}) and (${x2}, ${y2})?`,
            answer: dist,
            options: buildOptions(dist, [dx + dy, Math.abs(x2 - x1), dist + 2]),
            visual: null
        }
    },
    () => {
        const x = randomInt(5, 15)
        const mult1 = randomInt(2, 4)
        const mult2 = mult1 + randomInt(1, 3)
        const offset1 = randomInt(10, 30)
        const angleVal = mult1 * x + offset1
        const offset2Abs = Math.abs(angleVal - mult2 * x)

        if (offset2Abs === 0 || angleVal <= 0 || angleVal >= 180) return null

        const expr2 = angleVal >= mult2 * x
            ? `(${mult2}x + ${offset2Abs})`
            : `(${mult2}x - ${offset2Abs})`

        return {
            question: `Two parallel lines are cut by a transversal. The alternate interior angles are (${mult1}x + ${offset1})° and ${expr2}°. Find x.`,
            answer: x,
            options: buildOptions(x, [x + 5, x - 2, angleVal]),
            visual: null
        }
    },
    () => {
        const r = randomInt(4, 10)
        const tangentLen = randomInt(3, 10)
        const distFromCenter = Math.sqrt(r * r + tangentLen * tangentLen)
        const distRounded = parseFloat(distFromCenter.toFixed(2))
        return {
            question: `A tangent from an external point touches a circle of radius ${r}. The tangent length is ${tangentLen}. How far is the external point from the center?`,
            answer: distRounded,
            options: buildOptions(distRounded, [r + tangentLen, Math.abs(r - tangentLen), distRounded + 1]),
            visual: null
        }
    },
    () => {
        const [a, b, c] = getPythagoreanTriple()
        const mult = randomInt(2, 3)
        const hyp = c * mult
        const leg1 = a * mult
        const leg2 = b * mult
        const inradius = (leg1 + leg2 - hyp) / 2
        return {
            question: `A right triangle has legs ${leg1} and ${leg2} and hypotenuse ${hyp}. What is the radius of its inscribed circle?`,
            answer: inradius,
            options: buildOptions(inradius, [hyp / 2, (leg1 + leg2) / 2, inradius + 1]),
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
        const ansStr = Number.isInteger(area) ? area : parseFloat(area.toFixed(1))
        return {
            question: `A triangle has vertices at (${x1}, ${y1}), (${x2}, ${y2}), and (${x3}, ${y3}). What is its exact area?`,
            answer: ansStr,
            options: buildOptions(ansStr, [area2, ansStr + 2, area2 + 1]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 8)
        const chordDist = randomInt(1, r - 1)
        const halfChord = Math.sqrt(r * r - chordDist * chordDist)
        const chordLen = parseFloat((2 * halfChord).toFixed(2))
        return {
            question: `A chord is ${chordDist} units from the center of a circle with radius ${r}. What is the exact length of the chord? (Round to 2 decimal places)`,
            answer: chordLen,
            options: buildOptions(chordLen, [
                parseFloat((2 * r - chordDist).toFixed(2)),
                parseFloat(halfChord.toFixed(2)),
                parseFloat((chordLen + 1).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const base = randomInt(4, 10)
        const slantHeight = randomInt(base + 1, base + 8)
        const sa = base * base + 2 * base * slantHeight
        return {
            question: `A square pyramid has a base side of ${base} and slant height ${slantHeight}. What is its total surface area?`,
            answer: sa,
            options: buildOptions(sa, [base * base + base * slantHeight, 4 * base * slantHeight, sa + base]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 8)
        const h = randomInt(4, 12)
        const vol = r * r * h
        return {
            question: `A cylinder has radius ${r} and height ${h}. What is its exact volume?`,
            answer: `${vol}π`,
            options: buildOptions(`${vol}π`, [`${2 * r * h}π`, `${r * h}π`, `${vol + r}π`]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 8)
        const h = randomInt(4, 12)
        const vol = Math.round((r * r * h) / 3)
        return {
            question: `A cone has radius ${r} and height ${h}. What is its exact volume?`,
            answer: `${(r * r * h)}π/3`,
            options: buildOptions(`${(r * r * h)}π/3`, [`${r * r * h}π`, `${r * h}π/3`, `${(r * r * h) * 2}π/3`]),
            visual: null
        }
    },
    () => {
        const r = randomInt(3, 8)
        const vol = Math.round((4 / 3) * r * r * r)
        return {
            question: `A sphere has radius ${r}. What is its exact volume?`,
            answer: `${4 * r * r * r}π/3`,
            options: buildOptions(`${4 * r * r * r}π/3`, [`${4 * r * r}π`, `${r * r * r}π`, `${2 * r * r * r}π/3`]),
            visual: null
        }
    },
    () => {
        const angle = randomInt(20, 80)
        const centralAngle = angle
        const inscribed = angle / 2
        return {
            question: `A chord subtends a central angle of ${centralAngle}°. An inscribed angle subtending the same chord from the major arc measures?`,
            answer: `${inscribed}°`,
            options: buildOptions(`${inscribed}°`, [`${centralAngle}°`, `${180 - inscribed}°`, `${centralAngle * 2}°`]),
            visual: null
        }
    },
    () => {
        const [a, b, c] = getPythagoreanTriple()
        const mult = randomInt(2, 4)
        const leg1 = a * mult
        const leg2 = b * mult
        const hyp = c * mult
        const altToHyp = parseFloat(((leg1 * leg2) / hyp).toFixed(2))
        return {
            question: `In a right triangle with legs ${leg1} and ${leg2} and hypotenuse ${hyp}, what is the length of the altitude drawn to the hypotenuse?`,
            answer: altToHyp,
            options: buildOptions(altToHyp, [
                parseFloat(((leg1 * leg1) / hyp).toFixed(2)),
                parseFloat(((leg1 + leg2) / 2).toFixed(2)),
                parseFloat((altToHyp + 1).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const powerOfPoint = randomInt(20, 80)
        const seg1a = randomInt(2, 8)
        const seg1b = powerOfPoint / seg1a

        if (!Number.isInteger(seg1b)) return null

        return {
            question: `From an external point, two secants are drawn to a circle. The external segment and whole length of one secant are ${seg1a} and ${seg1a + randomInt(2, 6)}. The external segment of the second secant is ${randomInt(2, 6)}. Using the power of a point, what is the constant product?`,
            answer: powerOfPoint,
            options: buildOptions(powerOfPoint, [powerOfPoint + seg1a, Math.round(powerOfPoint / 2), powerOfPoint * 2]),
            visual: null
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const angleC = 90
        const cSq = a * a + b * b
        return {
            question: `A triangle has sides ${a} and ${b} with an included right angle. Using the law of cosines, what is the square of the third side?`,
            answer: cSq,
            options: buildOptions(cSq, [a * a - b * b, a * b * 2, cSq + a]),
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
        const hTerm = h === 0 ? 'x²' : `(x ${h > 0 ? '-' : '+'} ${Math.abs(h)})²`
        const kTerm = k === 0 ? 'y²' : `(y ${k > 0 ? '-' : '+'} ${Math.abs(k)})²`
        const answer = `${hTerm} + ${kTerm} = ${rSq}`
        return {
            question: `A circle has center (${h}, ${k}) and passes through (${px}, ${py}). What is its equation?`,
            answer,
            options: buildOptions(answer, [
                `${hTerm} + ${kTerm} = ${r}`,
                `x² + y² = ${rSq}`,
                `${hTerm} + ${kTerm} = ${rSq + 1}`
            ]),
            visual: null
        }
    },
    () => {
        const [radius, height, slantHeight] = getPythagoreanTriple()
        const mult = randomInt(1, 3)
        const trueR = radius * mult
        const trueH = height * mult
        const trueL = slantHeight * mult
        const volume = (trueR * trueR * trueH) / 3
        return {
            question: `A cone has volume ${volume}π and radius ${trueR}. What is its slant height?`,
            answer: trueL,
            options: buildOptions(trueL, [trueH, trueL + mult, trueR + trueH]),
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
            question: `Two similar solids have surface areas in ratio ${saRatio1}:${saRatio2}. What is the ratio of their volumes?`,
            answer: `${volRatio1}:${volRatio2}`,
            options: buildOptions(`${volRatio1}:${volRatio2}`, [
                `${saRatio1}:${saRatio2}`,
                `${k1}:${k2}`,
                `${volRatio2}:${volRatio1}`
            ]),
            visual: null
        }
    },
    () => {
        const V = randomInt(6, 12)
        const F = randomInt(6, 12)
        const E = V + F - 2
        return {
            question: `A convex polyhedron has ${V} vertices and ${F} faces. By Euler's formula V - E + F = 2, how many edges does it have?`,
            answer: E,
            options: buildOptions(E, [V + F, V * F, E + 2]),
            visual: null
        }
    },
    () => {
        const r = randomInt(4, 10)
        const externalDist = randomInt(r + 2, r + 8)
        const tangentLen = parseFloat(Math.sqrt(externalDist * externalDist - r * r).toFixed(2))
        return {
            question: `A point is ${externalDist} units from the center of a circle with radius ${r}. What is the exact length of the tangent from this point to the circle? (Round to 2 decimal places)`,
            answer: tangentLen,
            options: buildOptions(tangentLen, [
                parseFloat((externalDist - r).toFixed(2)),
                parseFloat((externalDist + r).toFixed(2)),
                parseFloat((tangentLen + 1).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(3, 7)
        const b = randomInt(3, 7)
        const c = randomInt(3, 7)
        const s = (a + b + c) / 2
        const inradius = parseFloat((Math.sqrt((s - a) * (s - b) * (s - c) / s)).toFixed(2))
        const area = parseFloat((Math.sqrt(s * (s - a) * (s - b) * (s - c))).toFixed(2))
        return {
            question: `A triangle has sides ${a}, ${b}, ${c}. Its semi-perimeter is ${s}. What is the area using Heron's formula? (Round to 2 decimal places)`,
            answer: area,
            options: buildOptions(area, [
                parseFloat((area + 2).toFixed(2)),
                parseFloat((s * s).toFixed(2)),
                parseFloat((area * 2).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const p = randomInt(3, 7)
        const q = randomInt(3, 7)
        const r = randomInt(3, 7)
        const intersectX = parseFloat(((p + q + r) / 3).toFixed(2))
        const x1 = 0, y1 = 0
        const x2 = p * 3, y2 = 0
        const x3 = q, y3 = r * 3
        const centroidX = parseFloat(((x1 + x2 + x3) / 3).toFixed(2))
        const centroidY = parseFloat(((y1 + y2 + y3) / 3).toFixed(2))
        return {
            question: `A triangle has vertices at (0, 0), (${x2}, 0), and (${x3}, ${y3}). What are the coordinates of its centroid?`,
            answer: `(${centroidX}, ${centroidY})`,
            options: buildOptions(`(${centroidX}, ${centroidY})`, [
                `(${centroidX + 1}, ${centroidY})`,
                `(${Math.round(x2 / 2)}, ${Math.round(y3 / 2)})`,
                `(${centroidX}, ${centroidY + 1})`
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const cosC = randomInt(-3, 3) * 0.25
        const cSq = parseFloat((a * a + b * b - 2 * a * b * cosC).toFixed(2))
        if (cSq <= 0) return null
        const c = parseFloat(Math.sqrt(cSq).toFixed(2))
        return {
            question: `A triangle has sides a = ${a}, b = ${b}, and the included angle C where cos(C) = ${cosC}. Using the law of cosines, find c. (Round to 2 decimal places)`,
            answer: c,
            options: buildOptions(c, [
                parseFloat((c + 1).toFixed(2)),
                parseFloat(Math.sqrt(a * a + b * b).toFixed(2)),
                parseFloat((a + b - c).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const r1 = randomInt(3, 7)
        const r2 = randomInt(r1 + 2, r1 + 6)
        const externalTangents = 2
        const d = r1 + r2 + randomInt(2, 6)
        const answer = parseFloat(Math.sqrt(d * d - (r2 - r1) * (r2 - r1)).toFixed(2))
        return {
            question: `Two circles have radii ${r1} and ${r2}, and their centers are ${d} units apart. What is the length of their common external tangent? (Round to 2 decimal places)`,
            answer: answer,
            options: buildOptions(answer, [
                parseFloat((answer + 1).toFixed(2)),
                parseFloat(Math.sqrt(d * d - (r1 + r2) * (r1 + r2)).toFixed(2)),
                parseFloat((d - r1 - r2).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(4, 8)
        const b = randomInt(4, 8)
        const area = a * b
        const diag = parseFloat(Math.sqrt(a * a + b * b).toFixed(2))
        return {
            question: `A rectangle has sides ${a} and ${b}. A diagonal divides it into two right triangles. What is the exact length of the diagonal? (Round to 2 decimal places)`,
            answer: diag,
            options: buildOptions(diag, [
                parseFloat((a + b).toFixed(2)),
                parseFloat((diag + 1).toFixed(2)),
                parseFloat(Math.sqrt(a * a + b * b + 1).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const n = [6, 8, 10, 12][randomInt(0, 3)]
        const side = randomInt(3, 8)
        let area
        if (n === 6) {
            area = parseFloat(((3 * Math.sqrt(3) / 2) * side * side).toFixed(2))
        } else if (n === 8) {
            area = parseFloat(((2 * (1 + Math.sqrt(2))) * side * side).toFixed(2))
        } else if (n === 10) {
            area = parseFloat(((5 / 2) * Math.sqrt(5 + 2 * Math.sqrt(5)) * side * side).toFixed(2))
        } else {
            area = parseFloat((3 * (2 + Math.sqrt(3)) * side * side).toFixed(2))
        }
        return {
            question: `What is the area of a regular ${n}-gon with side length ${side}? (Round to 2 decimal places)`,
            answer: area,
            options: buildOptions(area, [
                parseFloat((area + 5).toFixed(2)),
                parseFloat((n * side).toFixed(2)),
                parseFloat((area / 2).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const r = randomInt(4, 10)
        const angle = [30, 60, 90, 120][randomInt(0, 3)]
        const chordLen = parseFloat((2 * r * Math.sin((angle / 2) * Math.PI / 180)).toFixed(2))
        return {
            question: `A chord in a circle of radius ${r} subtends a central angle of ${angle}°. What is the exact length of the chord? (Round to 2 decimal places)`,
            answer: chordLen,
            options: buildOptions(chordLen, [
                parseFloat((r * angle / 90).toFixed(2)),
                parseFloat((chordLen + 1).toFixed(2)),
                parseFloat((2 * r).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const a = randomInt(5, 10)
        const b = randomInt(5, 10)
        const h = randomInt(3, 8)
        const vol = parseFloat(((a * b * h) / 3).toFixed(2))
        return {
            question: `A pyramid with a rectangular base of ${a} by ${b} has height ${h}. What is its volume? (Round to 2 decimal places)`,
            answer: vol,
            options: buildOptions(vol, [
                parseFloat((a * b * h).toFixed(2)),
                parseFloat((vol * 2).toFixed(2)),
                parseFloat((vol + h).toFixed(2))
            ]),
            visual: null
        }
    },
    () => {
        const r = randomInt(4, 10)
        const sa = 4 * r * r
        return {
            question: `A sphere has radius ${r}. What is its exact surface area?`,
            answer: `${sa}π`,
            options: buildOptions(`${sa}π`, [`${r * r}π`, `${2 * r * r}π`, `${sa + 4}π`]),
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
        easy: { question: "Find the area of a 4 by 6 rectangle.", answer: 24, options: [24, 20, 10, 12], visual: null },
        medium: { question: "A circle has circumference 10π. What is its exact area?", answer: "25π", options: ["25π", "10π", "50π", "5π"], visual: null },
        hard: { question: "The surface area of a cube is 54. What is its volume?", answer: 27, options: [27, 9, 36, 18], visual: null },
        expert: { question: "Two similar solids have surface area ratio 4:9. What is their volume ratio?", answer: "8:27", options: ["8:27", "2:3", "16:81", "4:9"], visual: null }
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
