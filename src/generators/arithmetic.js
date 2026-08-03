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

function generateEasy() {
    const operations = [
        () => {
            const a = randomInt(1, 50)
            const b = randomInt(1, 50)
            const answer = a + b
            return {
                question: `What is ${a} + ${b}?`,
                answer,
                options: shuffle([answer, answer + randomInt(1, 10), answer - randomInt(1, 10), answer + randomInt(11, 20)])
            }
        },
        () => {
            const a = randomInt(10, 50)
            const b = randomInt(1, a)
            const answer = a - b
            return {
                question: `What is ${a} - ${b}?`,
                answer,
                options: shuffle([answer, answer + randomInt(1, 10), answer - randomInt(1, 10), answer + randomInt(11, 20)])
            }
        }
    ]
    
    const op = operations[randomInt(0, operations.length - 1)]
    return op()
}

function generateMedium() {
    const operations = [
        () => {
            const a = randomInt(2, 12)
            const b = randomInt(2, 12)
            const answer = a * b
            return {
                question: `What is ${a} × ${b}?`,
                answer,
                options: shuffle([answer, answer + randomInt(1, 10), answer - randomInt(1, 10), a * (b + 1)])
            }
        },
        () => {
            const b = randomInt(2, 12)
            const answer = randomInt(2, 12)
            const a = b * answer
            return {
                question: `What is ${a} ÷ ${b}?`,
                answer,
                options: shuffle([answer, answer + 1, answer - 1, answer + 2])
            }
        },
        () => {
            const num = randomInt(50, 200)
            const percent = randomInt(10, 50)
            const answer = Math.round((num * percent) / 100)
            return {
                question: `What is ${percent}% of ${num}?`,
                answer,
                options: shuffle([answer, answer + randomInt(5, 15), answer - randomInt(5, 15), Math.round((num * (percent + 10)) / 100)])
            }
        }
    ]
    
    const op = operations[randomInt(0, operations.length - 1)]
    return op()
}

function generateHard() {
    const operations = [
        () => {
            const a = randomInt(5, 20)
            const b = randomInt(5, 20)
            const c = randomInt(2, 10)
            const answer = a + b * c
            return {
                question: `What is ${a} + ${b} × ${c}?`,
                answer,
                options: shuffle([answer, (a + b) * c, a + b + c, answer + randomInt(5, 15)])
            }
        },
        () => {
            const a = randomInt(100, 500)
            const percent = randomInt(15, 35)
            const answer = Math.round((a * percent) / 100)
            return {
                question: `What is ${percent}% of ${a}?`,
                answer,
                options: shuffle([answer, answer + randomInt(10, 30), answer - randomInt(10, 30), Math.round((a * (percent + 5)) / 100)])
            }
        },
        () => {
            const a = randomInt(10, 30)
            const b = randomInt(5, 15)
            const c = randomInt(2, 5)
            const answer = (a * b) - c
            return {
                question: `What is (${a} × ${b}) - ${c}?`,
                answer,
                options: shuffle([answer, answer + randomInt(5, 20), answer - randomInt(5, 20), a * (b - c)])
            }
        }
    ]
    
    const op = operations[randomInt(0, operations.length - 1)]
    return op()
}

function generateExpert() {
    const operations = [
        () => {
            const a = randomInt(15, 40)
            const b = randomInt(10, 25)
            const c = randomInt(3, 8)
            const d = randomInt(2, 5)
            const answer = (a + b) * c - d
            return {
                question: `What is (${a} + ${b}) × ${c} - ${d}?`,
                answer,
                options: shuffle([answer, answer + randomInt(10, 40), a + b * c - d, (a + b) * (c - d)])
            }
        },
        () => {
            const base = randomInt(50, 200)
            const increase = randomInt(20, 40)
            const answer = Math.round(base * (1 + increase / 100))
            return {
                question: `A number increases by ${increase}%. If the original number is ${base}, what is the new number?`,
                answer,
                options: shuffle([answer, base + increase, answer + randomInt(10, 30), Math.round(base * (increase / 100))])
            }
        },
        () => {
            const a = randomInt(8, 20)
            const b = randomInt(3, 8)
            const c = randomInt(2, 6)
            const answer = Math.floor((a * b) / c)
            return {
                question: `What is (${a} × ${b}) ÷ ${c}? (Round down)`,
                answer,
                options: shuffle([answer, answer + 1, answer - 1, Math.ceil((a * b) / c)])
            }
        }
    ]
    
    const op = operations[randomInt(0, operations.length - 1)]
    return op()
}

export function generateArithmetic(difficulty, count = 5) {
    const generators = {
        easy: generateEasy,
        medium: generateMedium,
        hard: generateHard,
        expert: generateExpert
    }
    
    const generate = generators[difficulty]
    const questions = []
    
    for (let i = 0; i < count; i++) {
        const q = generate()
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
