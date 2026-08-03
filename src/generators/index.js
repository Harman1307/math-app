import { generateArithmetic } from './arithmetic'

const generators = {
    arithmetic: generateArithmetic,
    algebra: generateArithmetic,
    geometry: generateArithmetic,
    trigonometry: generateArithmetic,
    statistics: generateArithmetic,
    probability: generateArithmetic,
    calculus: generateArithmetic,
    linearAlgebra: generateArithmetic
}

export function generateQuestions(topic, difficulty, count = 5) {
    const generator = generators[topic]
    if (!generator) {
        throw new Error(`No generator for topic: ${topic}`)
    }
    return generator(difficulty, count)
}
