const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

function simplifyFraction(num, den) {
    if (den === 0) return "undefined"
    if (num === 0) return "0"
    const g = gcd(num, den)
    let n = num / g
    let d = den / g
    if (d < 0) {
        n = -n
        d = -d
    }
    return d === 1 ? `${n}` : `${n}/${d}`
}

function factorial(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error("factorial requires a non-negative integer")
    }
    if (n <= 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
}

function formatSign(num) {
    return num >= 0 ? `+ ${num}` : `- ${Math.abs(num)}`
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
        let fallback
        if (typeof correct === 'string') {
            // Intelligently tweak numbers inside strings (e.g. "(x - 4)" -> "(x - 5)")
            fallback = correct.replace(/\d+/g, (match) => {
                const val = parseInt(match, 10)
                const offset = randomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1)
                return Math.max(1, val + offset).toString()
            })
            if (fallback === correct) {
                fallback = correct + ` (alt ${attempts})`
            }
        } else {
            const offsets = [1, -1, 2, -2, 5, -5, 10, -10]
            const offset = offsets[randomInt(0, offsets.length - 1)]
            fallback = correct + offset

            if (!Number.isInteger(correct)) {
                fallback = parseFloat(fallback.toFixed(2))
            }
        }

        if (fallback !== correct && !uniqueList.includes(fallback)) {
            uniqueList.push(fallback)
        }
        attempts++
    }

    if (uniqueList.length < 3) return null

    return shuffle([correct, ...uniqueList.slice(0, 3)])
}

const easyTemplates = [
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(3, 10)
        const x = randomInt(2, 8)
        const answer = a * x + b
        return {
            question: `If f(x) = ${a}x + ${b}, what is f(${x})?`,
            answer,
            options: buildOptions(answer, [a * x, x + b, answer + a])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const x = randomInt(2, 5)
        const answer = a * x * x
        return {
            question: `If f(x) = ${a}x², evaluate f(${x}).`,
            answer,
            options: buildOptions(answer, [a * x, Math.pow(x, 2), answer + a])
        }
    },
    () => {
        const a = randomInt(2, 8)
        const b = randomInt(2, 8)
        const c = a * b
        return {
            question: `Factor: ${a}x + ${c}`,
            answer: `${a}(x + ${b})`,
            options: buildOptions(`${a}(x + ${b})`, [`${a}x(1 + ${b})`, `x(${a} + ${c})`, `${b}(x + ${a})`])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(2, 6)
        const c = a * b
        return {
            question: `Factor completely: ${c}x² + ${c * a}x`,
            answer: `${c}x(x + ${a})`,
            options: buildOptions(`${c}x(x + ${a})`, [`x(${c}x + ${c * a})`, `${c}(x² + ${a}x)`, `${c}x²(1 + ${a})`])
        }
    },
    () => {
        const p = randomInt(2, 8)
        const q = randomInt(2, 8)
        const sum = p + q
        const prod = p * q
        return {
            question: `Factor: x² + ${sum}x + ${prod}`,
            answer: `(x + ${p})(x + ${q})`,
            options: buildOptions(`(x + ${p})(x + ${q})`, [`(x - ${p})(x - ${q})`, `x(x + ${sum})`, `(x + ${prod})(x + 1)`])
        }
    },
    () => {
        const p = randomInt(2, 7)
        const diff = p * p
        return {
            question: `Factor using difference of squares: x² - ${diff}`,
            answer: `(x - ${p})(x + ${p})`,
            options: buildOptions(`(x - ${p})(x + ${p})`, [`(x - ${diff})(x + 1)`, `x(x - ${diff})`, `(x - ${p})²`])
        }
    },
    () => {
        const a = randomInt(2, 13)
        const answer = randomInt(2, 18)
        const b = a * answer
        return {
            question: `Solve for x: ${a}x = ${b}`,
            answer,
            options: buildOptions(answer, [b, a + answer, answer + 1])
        }
    },
    () => {
        const a = randomInt(3, 20)
        const b = randomInt(3, 25)
        const answer = a + b
        return {
            question: `Solve for x: x - ${a} = ${b}`,
            answer,
            options: buildOptions(answer, [b - a > 0 ? b - a : b + 1, Math.abs(a - b), answer + 1])
        }
    },
    () => {
        const a = randomInt(3, 18)
        const b = randomInt(5, 25)
        const answer = Math.abs(b - a) + 2
        const c = answer + a
        return {
            question: `Solve for x: x + ${a} = ${c}`,
            answer,
            options: buildOptions(answer, [c, a + c, answer - 1])
        }
    },
    () => {
        const a = randomInt(2, 9)
        const answer = randomInt(2, 12)
        return {
            question: `Solve for x: x/${a} = ${answer}`,
            answer: a * answer,
            options: buildOptions(a * answer, [answer, a + answer, a * answer + a])
        }
    },
    () => {
        const a = randomInt(2, 8)
        const b = randomInt(5, 20)
        const answer = randomInt(3, 15)
        const c = a * answer + b
        return {
            question: `Solve for x: ${a}x + ${b} = ${c}`,
            answer,
            options: buildOptions(answer, [c - b, Math.round((c + b) / a), answer + 1])
        }
    },
    () => {
        const a = randomInt(2, 8)
        const b = randomInt(5, 20)
        const answer = randomInt(3, 15)
        const c = a * answer - b
        return {
            question: `Solve for x: ${a}x - ${b} = ${c}`,
            answer,
            options: buildOptions(answer, [c + b, Math.round((c - b) / a), answer - 1])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(3, 10)
        const answer = randomInt(4, 12)
        const c = a * (answer + b)
        return {
            question: `Solve for x: ${a}(x + ${b}) = ${c}`,
            answer,
            options: buildOptions(answer, [c / a, answer + b, answer - b])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(2, 8)
        const answer = randomInt(4, 14)
        const c = a * (answer - b)
        return {
            question: `Solve for x: ${a}(x - ${b}) = ${c}`,
            answer,
            options: buildOptions(answer, [c / a, answer + b, c / a + b])
        }
    },
    () => {
        const x = randomInt(2, 10)
        const y = randomInt(2, 10)
        const sumXY = x + y
        const prodXY = x * y
        return {
            question: `If x + y = ${sumXY} and xy = ${prodXY}, what is x² + y²?`,
            answer: x * x + y * y,
            options: buildOptions(x * x + y * y, [sumXY * sumXY, prodXY * 2, sumXY * sumXY - 2 * prodXY])
        }
    },
    () => {
        const x = randomInt(3, 10)
        const a = randomInt(2, 9)
        const rhs = x * x + a
        return {
            question: `Solve for positive x: x² + ${a} = ${rhs}`,
            answer: x,
            options: buildOptions(x, [x + 1, a, rhs - a])
        }
    },
    () => {
        const coefficient = randomInt(2, 5)
        const answer = randomInt(3, 12)
        const constant = randomInt(5, 20)
        const rhs = coefficient * answer + constant
        return {
            question: `If ${coefficient}x + ${constant} = ${rhs}, what is ${coefficient + 1}x?`,
            answer: (coefficient + 1) * answer,
            options: buildOptions((coefficient + 1) * answer, [rhs + constant, coefficient * answer, rhs])
        }
    },
    () => {
        const a = randomInt(3, 9)
        const b = randomInt(3, 9)
        const answer = a * b
        return {
            question: `The product of two numbers is ${answer}. One number is ${a}. What is the other?`,
            answer: b,
            options: buildOptions(b, [a + b, answer - a, answer + a])
        }
    }
]

const mediumTemplates = [
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(3, 8)
        const x = randomInt(2, 6)
        const fx = a * x + b
        const answer = a * fx + b
        return {
            question: `If f(x) = ${a}x + ${b}, find f(f(${x})).`,
            answer,
            options: buildOptions(answer, [fx, a * x + 2 * b, 2 * fx])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 8)
        const answer = randomInt(3, 10)
        const y = a * answer + b
        return {
            question: `If f(x) = ${a}x + ${b}, for what x is f(x) = ${y}?`,
            answer,
            options: buildOptions(answer, [y - b, Math.round(y / a), answer + 1])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(3, 12)
        const answer = `(x - ${b})/${a}`
        return {
            question: `Find the inverse function of f(x) = ${a}x + ${b}.`,
            answer,
            options: buildOptions(answer, [`${a}x - ${b}`, `(x + ${b})/${a}`, `x/${a} - ${b}`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const c = randomInt(2, 4)
        return {
            question: `If f(x) = ${c}x and g(x) = ${a}x + ${b}, what is the expanded form of (f ∘ g)(x)?`,
            answer: `${c * a}x + ${c * b}`,
            options: buildOptions(`${c * a}x + ${c * b}`, [`${c * a}x + ${b}`, `${a}x + ${c * b}`, `${a}x + ${b}`])
        }
    },
    () => {
        const diff = randomInt(3, 9)
        return {
            question: `Factor: x² - ${diff * diff}`,
            answer: `(x - ${diff})(x + ${diff})`,
            options: buildOptions(`(x - ${diff})(x + ${diff})`, [`(x - ${diff})²`, `x(x - ${diff})`, `(x + ${diff})²`])
        }
    },
    () => {
        const gcf = randomInt(2, 6)
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const expanded1 = gcf * a
        const expanded2 = gcf * b
        return {
            question: `Factor by grouping: ${expanded1}xy + ${expanded2}y`,
            answer: `${gcf}y(${a}x + ${b})`,
            options: buildOptions(`${gcf}y(${a}x + ${b})`, [`y(${expanded1}x + ${expanded2})`, `${gcf}(${a}xy + ${b}y)`, `${expanded1}y(x + ${b})`])
        }
    },
    () => {
        const a = randomInt(3, 8)
        return {
            question: `Factor: x³ + ${Math.pow(a, 3)}`,
            answer: `(x + ${a})(x² - ${a}x + ${a * a})`,
            options: buildOptions(`(x + ${a})(x² - ${a}x + ${a * a})`, [`(x + ${a})³`, `x(x² + ${Math.pow(a, 3)})`, `(x + ${a})(x + ${a})²`])
        }
    },
    () => {
        const a = randomInt(3, 8)
        const diffCubes = Math.pow(a, 3)
        return {
            question: `Factor: x³ - ${diffCubes}`,
            answer: `(x - ${a})(x² + ${a}x + ${a * a})`,
            options: buildOptions(`(x - ${a})(x² + ${a}x + ${a * a})`, [`(x - ${a})³`, `x(x² - ${diffCubes})`, `(x - ${a})(x - ${a})²`])
        }
    },
    () => {
        const a = randomInt(2, 7)
        const b = randomInt(2, 8)
        const answer = `x = ${-b}`
        return {
            question: `For what value of x is the rational function f(x) = ${a}/(x + ${b}) undefined?`,
            answer,
            options: buildOptions(answer, [`x = ${b}`, `x = 0`, `x = ${a}`])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const answer = 2 * a
        return {
            question: `Piecewise function: f(x) = 2x for x ≤ ${a}, f(x) = x + 3 for x > ${a}. Find f(${a}).`,
            answer,
            options: buildOptions(answer, [a + 3, a, 2 * a + 3])
        }
    },
    () => {
        const a = randomInt(2, 7)
        const b = randomInt(2, 6)
        const c = randomInt(2, 7)
        const solX = randomInt(3, 9)
        const solY = randomInt(3, 9)
        const eq1 = a * solX + b * solY
        const eq2 = c * solX + (a + b) * solY

        // Prevent systems with infinite or zero solutions
        if (a * (a + b) - b * c === 0) return null

        return {
            question: `Solve the system: ${a}x + ${b}y = ${eq1}, ${c}x + ${a + b}y = ${eq2}. Find x.`,
            answer: solX,
            options: buildOptions(solX, [solY, solX + solY, Math.abs(solX - solY)])
        }
    },
    () => {
        const p = randomInt(2, 7)
        const q = randomInt(2, 7)
        const sumRoots = p + q
        const prodRoots = p * q
        return {
            question: `A quadratic has roots ${p} and ${q}. Which equation represents it?`,
            answer: `x² - ${sumRoots}x + ${prodRoots} = 0`,
            options: buildOptions(`x² - ${sumRoots}x + ${prodRoots} = 0`, [`x² + ${sumRoots}x + ${prodRoots} = 0`, `x² - ${prodRoots}x + ${sumRoots} = 0`, `x² + ${sumRoots}x - ${prodRoots} = 0`])
        }
    },
    () => {
        const p = randomInt(2, 8)
        const q = randomInt(2, 8)
        const b = -(p + q)
        const c = p * q
        return {
            question: `For x² ${formatSign(b)}x + ${c} = 0, what is the exact sum of the roots divided by their product?`,
            answer: `${p + q}/${p * q}`,
            options: buildOptions(`${p + q}/${p * q}`, [`${p * q}/${p + q}`, `${p + q}`, `${p * q}`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(3, 8)
        const c = randomInt(2, 5)
        const d = randomInt(3, 8)
        if (a === c) return null
        const answer = (d - b) / (a - c)
        if (!Number.isInteger(answer) || answer <= 0) return null
        return {
            question: `Solve for x: ${a}x + ${b} = ${c}x + ${d}`,
            answer,
            options: buildOptions(answer, [answer + 1, Math.round((d + b) / (a + c)), Math.abs(answer - 1)])
        }
    },
    () => {
        const r = randomInt(2, 6)
        const s = randomInt(2, 6)
        const sumSq = r * r + s * s
        const sum = r + s
        const prod = r * s
        return {
            question: `If p + q = ${sum} and pq = ${prod}, find p² + q² - pq.`,
            answer: sumSq - prod,
            options: buildOptions(sumSq - prod, [sumSq, sumSq + prod, sum * sum - 3 * prod])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(2, 8)
        const answer = randomInt(3, 10)
        const c = a * answer + b
        const numA = randomInt(2, 5)
        const numB = randomInt(2, 5)
        const lhsA = numA * a
        const lhsB = numA * b + numB
        const rhsC = numA * c + numB
        return {
            question: `If ${a}x + ${b} = ${c}, evaluate the expression ${lhsA}x + ${lhsB}.`,
            answer: rhsC,
            options: buildOptions(rhsC, [numA * answer, numA * c, rhsC + numB])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const n = randomInt(2, 4) * 2 // Force even exponent to avoid float math
        const half = n / 2
        const answer = Math.pow(a, n)
        return {
            question: `Simplify: (${a}^${half})² × ${a}^(${n} % 2)`,
            answer,
            options: buildOptions(answer, [Math.pow(a, n + 1), a * n, Math.pow(a, n - 1)])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(2, 5)
        const posAnswer = randomInt(4, 10)
        const c = a * posAnswer - b

        // Prevent multiple positive solutions: x = (c+b)/a and x = (b-c)/a
        if (c < b) return null

        return {
            question: `Solve: |${a}x - ${b}| = ${c}. What is the positive solution?`,
            answer: posAnswer,
            options: buildOptions(posAnswer, [Math.round((c - b) / a), Math.round((c + b) / a) + 1, posAnswer - 1])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const answer = randomInt(6, 12)
        const d = a * (answer - b) * (answer - b)

        // Ensure the second root (2b - answer) is strictly negative
        if (answer <= 2 * b) return null

        return {
            question: `Solve: ${a}(x - ${b})² = ${d}. Find the positive solution.`,
            answer,
            options: buildOptions(answer, [b, answer + b, answer - 2])
        }
    },
    () => {
        const first = randomInt(3, 10)
        const diff = randomInt(3, 8)
        const n = randomInt(15, 30)
        const nthTerm = first + (n - 1) * diff
        return {
            question: `Arithmetic progression: first term ${first}, common difference ${diff}. What is the ${n}th term?`,
            answer: nthTerm,
            options: buildOptions(nthTerm, [first + n * diff, n * diff, first * n])
        }
    },
    () => {
        const first = randomInt(3, 10)
        const diff = randomInt(3, 7)
        const n = randomInt(15, 30)
        const last = first + (n - 1) * diff
        const answer = (n * (first + last)) / 2
        return {
            question: `Sum of AP: first term ${first}, last term ${last}, ${n} terms. What is the sum?`,
            answer,
            options: buildOptions(answer, [n * first, n * last, Math.round((first + last) * n)])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const r = randomInt(2, 4)
        const n = randomInt(5, 8)
        const nthTerm = a * Math.pow(r, n - 1)
        return {
            question: `Geometric progression: first term ${a}, common ratio ${r}. What is the ${n}th term?`,
            answer: nthTerm,
            options: buildOptions(nthTerm, [a * Math.pow(r, n), a * r * n, Math.pow(r, n - 1)])
        }
    },
    () => {
        const p = randomInt(2, 7)
        const q = randomInt(-6, -2)
        const b = -(p + q)
        const c = p * q
        const disc = b * b - 4 * c
        return {
            question: `What is the discriminant of x² ${formatSign(b)}x ${formatSign(c)} = 0?`,
            answer: disc,
            options: buildOptions(disc, [-disc, b * b + 4 * c, b * b])
        }
    },
    () => {
        const base = randomInt(2, 5)
        const exp1 = randomInt(2, 6)
        const exp2 = randomInt(2, 6)
        const answer = exp1 + exp2
        return {
            question: `Simplify: ${base}^${exp1} × ${base}^${exp2} = ${base}^x. Find x.`,
            answer,
            options: buildOptions(answer, [exp1 * exp2, Math.abs(exp1 - exp2), answer + 1])
        }
    },
    () => {
        const base = randomInt(2, 5)
        const exp1 = randomInt(4, 8)
        const exp2 = randomInt(2, exp1 - 1)
        const answer = exp1 - exp2
        return {
            question: `Simplify: ${base}^${exp1} ÷ ${base}^${exp2} = ${base}^x. Find x.`,
            answer,
            options: buildOptions(answer, [exp1 + exp2, exp1 * exp2, exp2])
        }
    },
    () => {
        const sum = randomInt(20, 50)
        const diff = randomInt(2, 15)
        if ((sum + diff) % 2 !== 0) return null
        const larger = (sum + diff) / 2
        const smaller = sum - larger
        return {
            question: `Two numbers sum to ${sum} and their difference is ${diff}. What is their product?`,
            answer: larger * smaller,
            options: buildOptions(larger * smaller, [sum, diff, sum - diff])
        }
    },
    () => {
        const numTerms = randomInt(3, 6)
        const start = randomInt(5, 15)
        const sumN = numTerms * start + numTerms * (numTerms - 1) / 2
        return {
            question: `Sum of ${numTerms} consecutive integers starting from ${start} is?`,
            answer: sumN,
            options: buildOptions(sumN, [numTerms * start, sumN + 1, numTerms * (start + numTerms)])
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const c = randomInt(3, 8)
        const answer = a * c - b * c
        return {
            question: `If a = ${a}, b = ${b}, c = ${c}, evaluate a(b + c) - b(a + c).`,
            answer,
            options: buildOptions(answer, [a * b - b * c, a * c + b * c, a * c])
        }
    }
]

const hardTemplates = [
    () => {
        const a = randomInt(2, 4)
        const b = randomInt(2, 4)
        const c = randomInt(3, 8)
        const x = randomInt(2, 5)
        const fx = a * x * x + b * x + c
        const answer = a * fx * fx + b * fx + c
        return {
            question: `If f(x) = ${a}x² + ${b}x + ${c}, find f(f(${x})).`,
            answer,
            options: buildOptions(answer, [fx, a * fx + b, Math.pow(fx, 2)])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(3, 10)
        const c = randomInt(2, 5)
        const d = randomInt(3, 10)
        const x = randomInt(2, 5)
        const gx = c * x + d
        const answer = a * gx + b
        return {
            question: `If f(x) = ${a}x + ${b} and g(x) = ${c}x + ${d}, evaluate (f ∘ g)(${x}).`,
            answer,
            options: buildOptions(answer, [a * x + b, c * x + d, answer + x])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 8)

        // Constructive generation for inverse evaluation
        const ans = randomInt(-5, 5)
        const val = a * ans + b
        return {
            question: `If f(x) = ${a}x + ${b} and g(x) is its inverse function, find g(${val}).`,
            answer: ans,
            options: buildOptions(ans, [val, a * val + b, ans * -1])
        }
    },
    () => {
        const poly = [1, randomInt(-8, -2), randomInt(2, 12), randomInt(-15, -5)]
        const x = randomInt(2, 5)
        const remainder = poly[0] * Math.pow(x, 3) + poly[1] * Math.pow(x, 2) + poly[2] * x + poly[3]
        return {
            question: `Using synthetic division, find the remainder when x³ ${formatSign(poly[1])}x² ${formatSign(poly[2])}x ${formatSign(poly[3])} is divided by (x - ${x}).`,
            answer: remainder,
            options: buildOptions(remainder, [remainder + x, 0, poly[3]])
        }
    },
    () => {
        const a = randomInt(2, 4)
        // Ensure vertex is clean integer
        const bMultiplier = randomInt(-3, 3) || 1
        const b = 2 * a * bMultiplier
        const c = randomInt(-10, 10)
        const vertexX = -b / (2 * a)
        return {
            question: `Find the x-coordinate of the vertex of the parabola y = ${a}x² ${formatSign(b)}x ${formatSign(c)}.`,
            answer: vertexX,
            options: buildOptions(vertexX, [b / (2 * a), -b / a, b])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const c = randomInt(2, 5)
        const d = randomInt(2, 5)
        return {
            question: `Factor by grouping: ${a}x³ + ${b}x² + ${c}x + ${d}. First, factor out the GCF of the first two terms. What is it?`,
            answer: `${gcd(a, b)}x²`,
            options: buildOptions(`${gcd(a, b)}x²`, [`${a}x²`, `x²`, `${gcd(a, b)}x`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const p = randomInt(2, 6)
        const q = randomInt(2, 6)
        const expanded = a * p + b * q
        return {
            question: `Expand: ${a}(x + ${p}) + ${b}(x + ${q})`,
            answer: `${a + b}x + ${expanded}`,
            options: buildOptions(`${a + b}x + ${expanded}`, [`${a}x + ${b}x + ${p + q}`, `${a + b}x + ${p + q}`, `${a * p}x + ${b * q}`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const c = randomInt(2, 5)
        const x = randomInt(1, 4)
        const y = randomInt(1, 4)
        const P = a * x * x + b * x + c
        const Q = a * y * y + b * y + c
        const diff = Math.abs(P - Q)
        return {
            question: `If P(x) = ${a}x² + ${b}x + ${c}, find |P(${x}) - P(${y})|.`,
            answer: diff,
            options: buildOptions(diff, [P, Q, Math.abs(x - y)])
        }
    },
    () => {
        const threshold = randomInt(3, 8)
        const valBelow = randomInt(10, 20)
        const valAbove = randomInt(30, 50)
        const testVal = randomInt(1, threshold - 1)
        return {
            question: `Piecewise: f(x) = ${valBelow} if x < ${threshold}, f(x) = ${valAbove} if x ≥ ${threshold}. Find f(${testVal}).`,
            answer: valBelow,
            options: buildOptions(valBelow, [valAbove, testVal, threshold])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const d = randomInt(2, 5)
        const numerCoeff = a * d
        const linearTerm = (a + d) * d
        const answer = `${a}x + ${a + d}, x ≠ 0`
        return {
            question: `Simplify the rational expression and state its restriction: (${numerCoeff}x² + ${linearTerm}x) / (${d}x)`,
            answer,
            options: buildOptions(answer, [`${a}x + ${a + d}`, `${a}x², x ≠ 0`, `${numerCoeff}x, x ≠ 0`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const range = randomInt(-20, 20)
        return {
            question: `The range of f(x) = ${a}x + ${range} for all real x is:`,
            answer: `all real numbers`,
            options: buildOptions(`all real numbers`, [`x ≥ ${range}`, `x > 0`, `y ≥ ${range}`])
        }
    },
    () => {
        const p = randomInt(2, 6)
        const q = randomInt(2, 6)
        const r = randomInt(2, 6)
        const e1 = p + q + r
        const e2 = p * q + q * r + p * r
        const e3 = p * q * r
        return {
            question: `A cubic x³ - ${e1}x² + ${e2}x - ${e3} = 0 has roots p, q, r. Find p² + q² + r².`,
            answer: e1 * e1 - 2 * e2,
            options: buildOptions(e1 * e1 - 2 * e2, [e1 * e1, e2 * 2, e1 * e1 + 2 * e2])
        }
    },
    () => {
        const p = randomInt(2, 7)
        const q = randomInt(2, 7)
        const r = randomInt(2, 7)
        const e1 = p + q + r
        const e2 = p * q + q * r + p * r
        const e3 = p * q * r
        const answer = e1 * e1 * e1 - 3 * e1 * e2 + 3 * e3
        return {
            question: `Given roots p, q, r of a polynomial where p+q+r=${e1}, pq+qr+pr=${e2}, pqr=${e3}, find p³+q³+r³.`,
            answer,
            options: buildOptions(answer, [Math.pow(e1, 3), e1 * e2 - 3 * e3, answer + e3])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const disc = b * b - 4 * a
        return {
            question: `For ${a}x² + ${b}x + 1 = 0, the discriminant is ${disc}. How many real roots?`,
            answer: disc > 0 ? 2 : disc === 0 ? 1 : 0,
            options: buildOptions(disc > 0 ? 2 : disc === 0 ? 1 : 0, [disc > 0 ? 1 : 2, 2, 0])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const answer = `x³ + ${3 * a}x² + ${3 * a * a}x + ${Math.pow(a, 3)}`
        return {
            question: `Expand (x + ${a})³ completely.`,
            answer,
            options: buildOptions(answer, [
                `x³ + ${a}x² + ${a * a}x + ${Math.pow(a, 3)}`,
                `x³ + ${Math.pow(a, 3)}`,
                `x³ + ${3 * a}x² + ${a * a}x + ${Math.pow(a, 3)}`
            ])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(2, 6)
        const sumCubes = Math.pow(a, 3) + Math.pow(b, 3)
        const sum = a + b
        const prod = a * b
        return {
            question: `If a + b = ${sum} and ab = ${prod}, find a³ + b³.`,
            answer: sumCubes,
            options: buildOptions(sumCubes, [Math.pow(sum, 3), sumCubes - prod, Math.pow(sum, 3) - 3 * prod * sum])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const diffCubes = Math.pow(a, 3) - Math.pow(b, 3)
        const diff = a - b
        const prod = a * b
        return {
            question: `If a - b = ${diff} and ab = ${prod}, find a³ - b³.`,
            answer: diffCubes,
            options: buildOptions(diffCubes, [Math.pow(diff, 3), diffCubes + prod, diff * (diff * diff + 3 * prod)])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const n = randomInt(3, 7)
        const r = randomInt(1, n - 1)
        const coeff = factorial(n) / (factorial(r) * factorial(n - r))
        return {
            question: `In the expansion of (x + ${a})^${n}, what is the coefficient of x^${n - r}?`,
            answer: coeff * Math.pow(a, r),
            options: buildOptions(coeff * Math.pow(a, r), [coeff, Math.pow(a, r), factorial(n) / factorial(r)])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const answer = randomInt(3, 8)
        const b = randomInt(2, 6)
        const c = a * answer * answer - b * answer
        return {
            question: `Solve for the roots of: ${a}x² - ${b}x = ${c}. What is the positive root?`,
            answer,
            options: buildOptions(answer, [-answer, Math.round(b / a), Math.round(c / b)])
        }
    },
    () => {
        const a = randomInt(1, 4)
        const b = randomInt(1, 4)
        const c = randomInt(1, 4)
        return {
            question: `Find the discriminant of ${a}x² + ${a * b}x + ${c} = 0.`,
            answer: a * b * a * b - 4 * a * c,
            options: buildOptions(a * b * a * b - 4 * a * c, [a * b * a * b + 4 * a * c, a * b - 4 * a * c, a * b * a * b - 4 * c])
        }
    },
    () => {
        const base = randomInt(2, 4)
        const exp = randomInt(3, 7)
        const answer = exp
        return {
            question: `Evaluate: log base ${base} of ${Math.pow(base, exp)}`,
            answer,
            options: buildOptions(answer, [Math.pow(base, exp), base * exp, answer + 1])
        }
    },
    () => {
        const base = randomInt(2, 5)
        const val1 = randomInt(2, 6)
        const val2 = randomInt(2, 6)
        return {
            question: `Simplify into a single log: log_${base}(${val1}) + log_${base}(${val2}) = log_${base}(?) `,
            answer: val1 * val2,
            options: buildOptions(val1 * val2, [val1 + val2, val1 - val2, Math.pow(base, val1 + val2)])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const x = randomInt(3, 8)
        const answer = x
        return {
            question: `Solve for x: ${a}^(2x - 1) = ${Math.pow(a, 2 * x - 1)}`,
            answer,
            options: buildOptions(answer, [Math.pow(a, x), a * x, answer + 1])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const x = randomInt(2, 6)
        const y = randomInt(2, 6)
        const eq1rhs = a * x + b * y
        const eq2rhs = a * x - b * y
        return {
            question: `System: ${a}x + ${b}y = ${eq1rhs} and ${a}x - ${b}y = ${eq2rhs}. Find x × y.`,
            answer: x * y,
            options: buildOptions(x * y, [x + y, x - y, Math.pow(x, 2)])
        }
    },
    () => {
        const a = randomInt(2, 8)
        const b = randomInt(2, 8)
        return {
            question: `Use the Sophie Germain identity: a⁴ + 4b⁴ = (a²+2b²+2ab)(a²+2b²-2ab). Evaluate ${a}⁴ + 4×${b}⁴.`,
            answer: Math.pow(a, 4) + 4 * Math.pow(b, 4),
            options: buildOptions(Math.pow(a, 4) + 4 * Math.pow(b, 4), [Math.pow(a + b, 4), Math.pow(a, 4) + Math.pow(b, 4), Math.pow(a * b, 4)])
        }
    },
    () => {
        const n = randomInt(4, 8)
        const a = randomInt(2, 5)
        const r = randomInt(2, 4)
        const answer = Math.round(a * (Math.pow(r, n) - 1) / (r - 1))
        return {
            question: `GP with first term ${a}, ratio ${r}, ${n} terms. Find the sum.`,
            answer,
            options: buildOptions(answer, [a * Math.pow(r, n), a * n * r, answer - a])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const r = randomInt(2, 4)
        const term = randomInt(4, 7)
        const nthTerm = a * Math.pow(r, term - 1)
        return {
            question: `GP: first term ${a}, ratio ${r}. Which term number equals ${nthTerm}?`,
            answer: term,
            options: buildOptions(term, [term + 1, term - 1, Math.round(nthTerm / a)])
        }
    }
]

const expertTemplates = [
    () => {
        const a = randomInt(2, 4)
        const b = randomInt(2, 4)
        const x = randomInt(2, 4)
        const fx = a * x + b
        const ffx = a * fx + b
        const fffx = a * ffx + b
        return {
            question: `If f(x) = ${a}x + ${b}, find f(f(f(${x}))).`,
            answer: fffx,
            options: buildOptions(fffx, [ffx, fx, fffx + a])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const n = randomInt(3, 6)
        let result = 0
        for (let i = 0; i < n; i++) {
            if (i === 0) result = b
            else result = a * result + b
        }
        return {
            question: `If f(x) = ${a}x + ${b}, and we apply f ${n} times starting from x=0, what is the result?`,
            answer: result,
            options: buildOptions(result, [n * (a + b), Math.pow(a, n) + b, n * b])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 8)
        const c = randomInt(2, 5)
        const d = randomInt(2, 8)
        if (a * d === b * c) return null
        return {
            question: `The inverse function of f(x) = (${a}x + ${b})/(${c}x + ${d}) can be written as (dx - b)/(-cx + a). What is the exact coefficient of x in the numerator of this form?`,
            answer: d,
            options: buildOptions(d, [a, -a, d - a])
        }
    },
    () => {
        const n = randomInt(3, 6)
        const a = randomInt(2, 4)
        const r = randomInt(2, 4)
        const lastTerm = a * Math.pow(r, n - 1)
        return {
            question: `GP: ${a}, ${a * r}, ${a * r * r}, ... What position is the term ${lastTerm}?`,
            answer: n,
            options: buildOptions(n, [n - 1, n + 1, n + 2])
        }
    },
    () => {
        const coeffs = [1, randomInt(-6, -2), randomInt(2, 10), randomInt(-12, -3)]
        const x = randomInt(2, 5)
        const syntheticQuotient = [coeffs[0]]
        let temp = coeffs[0]
        for (let i = 1; i < coeffs.length; i++) {
            temp = temp * x + coeffs[i]
            if (i < coeffs.length - 1) syntheticQuotient.push(temp)
        }
        return {
            question: `Using synthetic division on x³ ${formatSign(coeffs[1])}x² ${formatSign(coeffs[2])}x ${formatSign(coeffs[3])} by (x - ${x}), the quotient is ax² + bx + c. Find a.`,
            answer: syntheticQuotient[0],
            options: buildOptions(syntheticQuotient[0], [coeffs[1], syntheticQuotient[1], 1])
        }
    },
    () => {
        const x0 = 0
        const y0 = randomInt(2, 8)
        const x1 = randomInt(2, 5)
        const y1 = randomInt(5, 15)
        return {
            question: `Find the exact slope of the line passing through (${x0}, ${y0}) and (${x1}, ${y1}).`,
            answer: simplifyFraction(y1 - y0, x1 - x0),
            options: buildOptions(simplifyFraction(y1 - y0, x1 - x0), [simplifyFraction(y1, x1), `${y1 - y0}`, `${x1 - x0}`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const root1 = randomInt(2, 5)
        const root2 = randomInt(2, 5)
        if (root1 === root2) return null
        const b = -a * (root1 + root2)
        const c = a * root1 * root2
        return {
            question: `P(x) = ${a}x² ${formatSign(b)}x + ${c}. By Factor Theorem, P(${root1}) = 0 means (x - ${root1}) is a factor. What is the other factor?`,
            answer: `${a}(x - ${root2})`,
            options: buildOptions(`${a}(x - ${root2})`, [`(x + ${root2})`, `${a}x - ${root2}`, `x - ${root1 * root2}`])
        }
    },
    () => {
        const p = randomInt(2, 5)
        const q = randomInt(2, 5)
        const r = randomInt(2, 5)
        const s = randomInt(2, 5)
        const prodAll = p * q * r * s
        return {
            question: `A quartic polynomial has roots ${p}, ${q}, ${r}, ${s}. What is the product of all roots?`,
            answer: prodAll,
            options: buildOptions(prodAll, [p + q + r + s, p * q + r * s, Math.round(Math.pow(prodAll, 0.5))])
        }
    },
    () => {
        const a = randomInt(2, 4)
        const b = randomInt(2, 4)
        const x1 = randomInt(2, 5)
        const x2 = randomInt(2, 5)
        if (x1 === x2) return null
        return {
            question: `For f(x) = ${a}x + ${b}, the difference quotient [f(${x2}) - f(${x1})] / (${x2} - ${x1}) equals:`,
            answer: a,
            options: buildOptions(a, [b, x2 - x1, a + b])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const k = randomInt(2, 6)
        return {
            question: `The function f(x) = ${a}x is stretched vertically by factor ${k}. What is the new function?`,
            answer: `${a * k}x`,
            options: buildOptions(`${a * k}x`, [`${a}x + ${k}`, `${a * k}x²`, `${a + k}x`])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        return {
            question: `For what value of x is the rational function (${a}x + ${b})/(${a}x² + ${2 * a * b}x + ${a * b * b}) undefined?`,
            answer: `x = ${-b}`,
            options: buildOptions(`x = ${-b}`, [`x = 0`, `x = ${b}`, `x = ${a}`])
        }
    },
    () => {
        const base = randomInt(2, 4)
        const exp1 = randomInt(2, 5)
        const exp2 = randomInt(2, 5)
        const answer = exp1 * exp2
        return {
            question: `Simplify: (${base}^${exp1})^${exp2} = ${base}^x. Find x.`,
            answer,
            options: buildOptions(answer, [exp1 + exp2, Math.pow(exp1, exp2), Math.pow(base, exp1)])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const c = randomInt(2, 5)
        const sumRoots = a + b + c
        const sumSquares = a * a + b * b + c * c
        return {
            question: `If p, q, r are roots of x³ - ${sumRoots}x² + kx - ${a * b * c} = 0, and p² + q² + r² = ${sumSquares}, find k.`,
            answer: (sumRoots * sumRoots - sumSquares) / 2,
            options: buildOptions((sumRoots * sumRoots - sumSquares) / 2, [sumSquares, sumRoots * sumRoots, a * b + b * c + a * c])
        }
    },
    () => {
        const n = randomInt(4, 7)
        const k = randomInt(1, n - 1)
        const coeff = factorial(n) / (factorial(k) * factorial(n - k))
        return {
            question: `The coefficient of x^${k} in the expansion of (1 + x)^${n} is:`,
            answer: coeff,
            options: buildOptions(coeff, [factorial(n), Math.pow(2, n), n])
        }
    },
    () => {
        const p = randomInt(2, 6)
        const q = randomInt(2, 6)
        const r = randomInt(2, 6)
        const e1 = p + q + r
        const e2 = p * q + q * r + p * r
        const e3 = p * q * r
        const sumFourthPowers = Math.pow(p, 4) + Math.pow(q, 4) + Math.pow(r, 4)
        return {
            question: `Given roots p,q,r of a cubic where p+q+r=${e1}, pq+qr+pr=${e2}, pqr=${e3}. Find p⁴+q⁴+r⁴.`,
            answer: sumFourthPowers,
            options: buildOptions(sumFourthPowers, [Math.pow(e1, 4), e1 * e1 - 2 * e2, sumFourthPowers + e3])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const n = randomInt(2, 4) * 2 // Force even exponent for exactly 1 middle term
        const r = n / 2
        const coeff = factorial(n) / (factorial(r) * factorial(n - r))
        const answer = coeff * Math.pow(a, n - r) * Math.pow(b, r)
        return {
            question: `Find the coefficient of the middle term in (${a}x + ${b})^${n}.`,
            answer,
            options: buildOptions(answer, [coeff * Math.pow(a * b, r), Math.pow(a + b, n), coeff * Math.pow(b, r)])
        }
    },
    () => {
        const a = randomInt(1, 4)
        const k = randomInt(2, 4)
        const b = a * k * k // Ensures a*b is a perfect square
        return {
            question: `Given AM-GM inequality, what is the minimum value of ${a}/x + ${b}x for x > 0?`,
            answer: 2 * Math.sqrt(a * b), // Clean integer
            options: buildOptions(2 * Math.sqrt(a * b), [a + b, a * b, Math.sqrt(a * b)])
        }
    },
    () => {
        const n = randomInt(4, 7)
        return {
            question: `A polynomial of degree at most ${n} is uniquely determined by its values at how many distinct points?`,
            answer: n + 1,
            options: buildOptions(n + 1, [n, n * 2, factorial(n)])
        }
    },
    () => {
        const a = randomInt(2, 6)
        const b = randomInt(2, 6)
        const x = randomInt(2, 5)
        const remainder = Math.pow(x, 3) - a * Math.pow(x, 2) + b * x - (a + b)
        return {
            question: `By the Remainder Theorem, find the remainder when x³ - ${a}x² + ${b}x - ${a + b} is divided by (x - ${x}).`,
            answer: remainder,
            options: buildOptions(remainder, [remainder + a, remainder - b, 0])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(-5, 5)
        const isFactor = Math.random() > 0.5
        const d = isFactor ? -(a * b) : -(a * b) + randomInt(1, 5)

        return {
            question: `Is (x - ${a}) a factor of x³ - ${a}x² ${formatSign(b)}x ${formatSign(d)}?`,
            answer: isFactor ? 'Yes' : 'No',
            options: buildOptions(isFactor ? 'Yes' : 'No', [isFactor ? 'No' : 'Yes', 'Cannot determine', 'Only if x > 0'])
        }
    },
    () => {
        const a = randomInt(2, 4)
        const b = randomInt(2, 4)
        const c = a + b
        return {
            question: `For the system x + y = ${c}, xy = ${a * b}: without solving for x and y, find x² + y².`,
            answer: c * c - 2 * a * b,
            options: buildOptions(c * c - 2 * a * b, [c * c, 2 * a * b, c * c + 2 * a * b])
        }
    },
    () => {
        const n = randomInt(20, 35)
        const answer = (n * (n + 1)) / 2
        return {
            question: `Find the sum of the first ${n} positive integers.`,
            answer,
            options: buildOptions(answer, [n * n, answer - n, (n * (n - 1)) / 2])
        }
    },
    () => {
        const base = randomInt(2, 5)
        const answer = randomInt(3, 8)
        const lhs = Math.pow(base, 2 * answer)
        return {
            question: `Solve: ${base}^(2x) = ${lhs}. Find x.`,
            answer,
            options: buildOptions(answer, [2 * answer, Math.round(Math.log(lhs) / Math.log(base)), answer + 1])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const ans = randomInt(4, 9)
        const k = randomInt(1, ans - 2)
        const rhs = ans * (ans - k)
        return {
            question: `Solve for x: log_${a}(x) + log_${a}(x - ${k}) = log_${a}(${rhs})`,
            answer: ans,
            options: buildOptions(ans, [ans - k, rhs, k])
        }
    },
    () => {
        const p = randomInt(2, 5)
        const q = randomInt(2, 5)
        const answer = Math.pow(p + q, 2) - 3 * p * q
        return {
            question: `If α and β are roots of x² - ${p + q}x + ${p * q} = 0, find α² - αβ + β².`,
            answer,
            options: buildOptions(answer, [Math.pow(p + q, 2), p * q, answer + p * q])
        }
    },
    () => {
        const a = randomInt(2, 5)
        const b = randomInt(2, 5)
        const n = randomInt(3, 6)
        const answer = factorial(n) / (factorial(2) * factorial(n - 2)) * Math.pow(a, n - 2) * Math.pow(b, 2)
        return {
            question: `In (${a}x + ${b}y)^${n}, find the coefficient of x^${n - 2}y².`,
            answer,
            options: buildOptions(answer, [Math.pow(b, 2) * n, factorial(n) / factorial(n - 2), Math.round(answer / a)])
        }
    },
    () => {
        const a = randomInt(2, 4)
        const b = randomInt(2, 4)
        const product = a * b
        const sumSquares = a * a + b * b
        return {
            question: `x and y are positive integers. x² + y² = ${sumSquares} and xy = ${product}. Find (x + y)².`,
            answer: sumSquares + 2 * product,
            options: buildOptions(sumSquares + 2 * product, [sumSquares, sumSquares - 2 * product, Math.pow(a + b, 2)])
        }
    },
    () => {
        const k = randomInt(2, 5)
        const n = randomInt(3, 6)
        return {
            question: `If x = ${k} is a root of x^${n} - ${Math.pow(k, n)} = 0, what is the sum of all n complex roots?`,
            answer: 0,
            options: buildOptions(0, [k * n, Math.pow(k, n), k])
        }
    },
    () => {
        const p = randomInt(3, 7)
        const q = randomInt(3, 7)
        if (p === q) return null
        const sumCubes = Math.pow(p, 3) + Math.pow(q, 3)
        return {
            question: `The equation x² - ${p + q}x + ${p * q} = 0 has roots α and β. Find α³ + β³.`,
            answer: sumCubes,
            options: buildOptions(sumCubes, [Math.pow(p + q, 3), sumCubes - p * q, Math.pow(p + q, 3) - p * q * (p + q)])
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

    // Deterministic safe fallbacks based on difficulty to avoid breaking the curve
    const fallbacks = {
        easy: { question: "Solve for x: x + 2 = 4", answer: 2, options: [2, 4, 0, 6] },
        medium: { question: "Factor: x² - 4", answer: "(x - 2)(x + 2)", options: ["(x - 2)(x + 2)", "(x - 4)(x + 1)", "x(x - 4)", "(x - 2)²"] },
        hard: { question: "If f(x) = 2x + 1, find f(f(2)).", answer: 11, options: [11, 5, 9, 7] },
        expert: { question: "Find the sum of the roots of x² - 5x + 6 = 0.", answer: 5, options: [5, -5, 6, -6] }
    }
    return fallbacks[difficulty] || fallbacks.easy
}

export function generateAlgebra(difficulty, count = 5) {
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
            correctAnswer: correctIndex
        })
    }

    return questions
}
