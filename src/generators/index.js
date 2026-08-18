import { generateArithmetic } from './arithmetic'
import { generateAlgebra } from './algebra'
import { generateGeometry } from './geometry'
import { generateTrigonometry } from './trigonometry.js'

const generators = {
    arithmetic: generateArithmetic,
    algebra: generateAlgebra,
    geometry: generateGeometry,
    trigonometry: generateTrigonometry,
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
