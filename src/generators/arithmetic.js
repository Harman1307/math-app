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
    return b === 0 ? a : gcd(b, a % b)
}

function lcm(a, b) {
    if (a === 0 || b === 0) return 0
    return Math.abs(a * b) / gcd(a, b)
}

function isPrime(n) {
    n = Math.abs(n)
    if (n <= 1) return false
    if (n <= 3) return true
    if (n % 2 === 0 || n % 3 === 0) return false
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false
    }
    return true
}

function factorial(n) {
    if (n <= 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
}

function primeFactors(n) {
    n = Math.abs(n)
    const factors = {}
    if (n === 0 || n === 1) return factors

    while (n % 2 === 0) {
        factors[2] = (factors[2] || 0) + 1
        n /= 2
    }
    for (let d = 3; d * d <= n; d += 2) {
        while (n % d === 0) {
            factors[d] = (factors[d] || 0) + 1
            n /= d
        }
    }
    if (n > 1) {
        factors[n] = (factors[n] || 0) + 1
    }
    return factors
}

function eulerTotient(n) {
    const factors = primeFactors(n)
    let result = n
    for (const p in factors) {
        result = result * (parseInt(p) - 1) / parseInt(p)
    }
    return Math.floor(result)
}

function numDivisors(n) {
    const factors = primeFactors(n)
    let count = 1
    for (const p in factors) count *= (factors[p] + 1)
    return count
}

function modPow(base, exp, mod) {
    let result = 1
    base = base % mod
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod
        exp = Math.floor(exp / 2)
        base = (base * base) % mod
    }
    return result
}

function lastDigitCycle(base) {
    const cycles = {
        0: [0], 1: [1], 2: [2, 4, 8, 6], 3: [3, 9, 7, 1],
        4: [4, 6], 5: [5], 6: [6], 7: [7, 9, 3, 1],
        8: [8, 4, 2, 6], 9: [9, 1]
    }
    return cycles[Math.abs(base) % 10]
}

function buildOptions(correct, distractors) {
    const isString = typeof correct === 'string'
    let uniqueList = []

    for (const d of distractors) {
        if (d !== correct && !uniqueList.includes(d) && d !== null && d !== undefined) {
            uniqueList.push(d)
        }
    }

    let attempts = 0
    while (uniqueList.length < 3 && attempts < 50) {
        let fallback
        if (isString) {
            if (correct.includes(':')) {
                fallback = `${randomInt(1, 9)}:${randomInt(1, 9)}`
            } else if (dayNames.includes(correct)) {
                fallback = dayNames[randomInt(0, 6)]
            } else {
                fallback = correct + " (alt)"
            }
        } else {
            const offsets = [1, -1, 10, -10, 100, -100]
            const offset = offsets[randomInt(0, offsets.length - 1)]
            fallback = correct + offset

            if (!Number.isInteger(correct)) {
                fallback = parseFloat(fallback.toFixed(2))
            }
        }

        if (fallback !== correct && !uniqueList.includes(fallback)) {
            if (typeof correct === 'number' && correct >= 0 && fallback < 0) {
                attempts++
                continue
            }
            uniqueList.push(fallback)
        }
        attempts++
    }

    if (uniqueList.length < 3) return null

    return shuffle([correct, ...uniqueList.slice(0, 3)])
}

const easyTemplates = [
    () => {
        const a = randomInt(50, 300)
        const b = randomInt(50, 300)
        const c = randomInt(20, 150)
        const answer = a + b - c
        return {
            question: `Calculate: ${a} + ${b} - ${c}`,
            answer,
            options: buildOptions(answer, [a + b + c, a - b + c, a - b - c])
        }
    },
    () => {
        const a = randomInt(12, 30)
        const b = randomInt(12, 30)
        const answer = a * b
        return {
            question: `Calculate: ${a} × ${b}`,
            answer,
            options: buildOptions(answer, [(a + 1) * b, a * (b - 1), a * b + 10])
        }
    },
    () => {
        const divisor = randomInt(7, 20)
        const quotient = randomInt(8, 25)
        const dividend = divisor * quotient
        return {
            question: `What is ${dividend} ÷ ${divisor}?`,
            answer: quotient,
            options: buildOptions(quotient, [quotient + 1, quotient - 1, dividend * divisor])
        }
    },
    () => {
        const a = randomInt(100, 500)
        const percent = [10, 20, 25, 50, 75][randomInt(0, 4)]
        const answer = (a * percent) / 100
        return {
            question: `What is ${percent}% of ${a}?`,
            answer,
            options: buildOptions(answer, [a / percent, a - percent, (a * (percent + 10)) / 100])
        }
    },
    () => {
        const a = randomInt(5, 20)
        const b = randomInt(5, 20)
        const answer = gcd(a * 2, b * 2)
        const x = a * 2
        const y = b * 2
        return {
            question: `What is the GCD of ${x} and ${y}?`,
            answer,
            options: buildOptions(answer, [lcm(x, y), x + y, Math.abs(x - y)])
        }
    },
    () => {
        const a = randomInt(3, 12)
        const b = randomInt(3, 12)
        const answer = lcm(a, b)
        return {
            question: `What is the LCM of ${a} and ${b}?`,
            answer,
            options: buildOptions(answer, [gcd(a, b), a * b, a + b])
        }
    },
    () => {
        const n = randomInt(15, 40)
        const answer = (n * (n + 1)) / 2
        return {
            question: `What is 1 + 2 + 3 + ... + ${n}?`,
            answer,
            options: buildOptions(answer, [n * n, (n * (n - 1)) / 2, Math.floor(n / 2)])
        }
    },
    () => {
        const base = randomInt(2, 5)
        const exp = randomInt(4, 7)
        const answer = Math.pow(base, exp)
        return {
            question: `What is ${base}^${exp}?`,
            answer,
            options: buildOptions(answer, [base * exp, Math.pow(base, exp - 1), Math.pow(exp, base)])
        }
    },
    () => {
        const speed = randomInt(40, 100)
        const time = randomInt(2, 6)
        const answer = speed * time
        return {
            question: `A car travels at ${speed} km/h for ${time} hours. How far does it travel?`,
            answer,
            options: buildOptions(answer, [speed / time, speed + time, speed * (time - 1)])
        }
    },
    () => {
        const cp = randomInt(2, 10) * 100 // Constructive approach for integers
        const profitPercent = [10, 20, 25, 50][randomInt(0, 3)]
        const answer = cp + (cp * profitPercent) / 100
        return {
            question: `Cost price is ₹${cp}. Profit is ${profitPercent}%. What is the selling price?`,
            answer,
            options: buildOptions(answer, [cp - (cp * profitPercent) / 100, cp * profitPercent, (cp * profitPercent) / 100])
        }
    }
]

const mediumTemplates = [
    () => {
        const ageDiff = randomInt(3, 20)
        const futureYears = randomInt(3, 15)
        const olderFuture = randomInt(25, 50)
        const olderNow = olderFuture - futureYears
        const youngerNow = olderNow - ageDiff
        if (youngerNow <= 0) return null
        return {
            question: `A is ${ageDiff} years older than B. In ${futureYears} years, A will be ${olderFuture}. What is B's current age?`,
            answer: youngerNow,
            options: buildOptions(youngerNow, [olderNow, youngerNow + futureYears, youngerNow - ageDiff])
        }
    },
    () => {
        const ratioOlder = randomInt(2, 4)
        const multiplier = randomInt(4, 12)
        const olderPast = ratioOlder * multiplier
        const youngerPast = 1 * multiplier
        const yearsAgo = randomInt(5, 15)

        const olderNow = olderPast + yearsAgo
        const youngerNow = youngerPast + yearsAgo
        const presentSum = olderNow + youngerNow

        return {
            question: `Sum of ages of A and B is ${presentSum}. ${yearsAgo} years ago, A was ${ratioOlder} times as old as B. How old is A now?`,
            answer: olderNow,
            options: buildOptions(olderNow, [olderPast, presentSum - olderNow, olderNow - yearsAgo])
        }
    },
    () => {
        const price1 = randomInt(20, 60)
        const price2 = randomInt(price1 + 20, price1 + 60)
        const mixPrice = randomInt(price1 + 5, price2 - 5)
        const ratio1 = price2 - mixPrice
        const ratio2 = mixPrice - price1
        const totalParts = ratio1 + ratio2
        const totalKg = totalParts * randomInt(2, 5)
        const answer = (ratio1 * totalKg) / totalParts
        return {
            question: `Two varieties of rice cost ₹${price1}/kg and ₹${price2}/kg. Mix them to get ₹${mixPrice}/kg. If total mixture is ${totalKg}kg, how many kg of cheaper variety?`,
            answer,
            options: buildOptions(answer, [totalKg - answer, totalKg / 2, ratio1])
        }
    },
    () => {
        const concentration1 = randomInt(20, 40)
        const concentration2 = randomInt(60, 90)
        const targetConc = randomInt(concentration1 + 5, concentration2 - 5)
        const ratio1 = concentration2 - targetConc
        const ratio2 = targetConc - concentration1
        return {
            question: `Solution A is ${concentration1}% acid. Solution B is ${concentration2}% acid. What ratio A:B gives ${targetConc}% acid?`,
            answer: `${ratio1}:${ratio2}`,
            options: buildOptions(`${ratio1}:${ratio2}`, [`${ratio2}:${ratio1}`, `${ratio1 + 1}:${ratio2}`, `${Math.abs(ratio1 - 1)}:${ratio2}`])
        }
    },
    () => {
        const daysA = randomInt(8, 20)
        const daysB = randomInt(8, 20)
        const combined = (daysA * daysB) / (daysA + daysB)
        const answer = parseFloat(combined.toFixed(2))
        return {
            question: `A completes a job in ${daysA} days. B completes it in ${daysB} days. Working together, how many days? (Round to 2 decimal places)`,
            answer,
            options: buildOptions(answer, [daysA + daysB, (daysA + daysB) / 2, Math.abs(daysA - daysB)])
        }
    },
    () => {
        const totalDays = randomInt(12, 30)
        const daysWorked = randomInt(4, totalDays - 4)
        const daysA = randomInt(10, 25)
        const workDoneByA = daysWorked / daysA

        if (workDoneByA >= 1) return null

        const remainingWork = 1 - workDoneByA
        const daysBRemaining = totalDays - daysWorked
        const bRate = remainingWork / daysBRemaining
        const bDays = parseFloat((1 / bRate).toFixed(2)) // Exact floating answer

        if (bDays <= 0 || !isFinite(bDays)) return null

        return {
            question: `A and B together finish in ${totalDays} days. A works for ${daysWorked} days then leaves. B finishes the rest in ${daysBRemaining} more days. In how many days can B alone finish? (Round to 2 decimal places)`,
            answer: bDays,
            options: buildOptions(bDays, [daysA, daysBRemaining, parseFloat((bDays + daysWorked).toFixed(2))])
        }
    },
    () => {
        const fillTime = randomInt(4, 12)
        const drainTime = randomInt(fillTime + 4, fillTime + 12)
        const netRate = (drainTime - fillTime) / (fillTime * drainTime)
        const answer = parseFloat((1 / netRate).toFixed(2)) // Exact floating answer
        return {
            question: `Pipe A fills a tank in ${fillTime} hours. Pipe B drains it in ${drainTime} hours. Both open together, when does the tank fill? (Round to 2 decimal places)`,
            answer,
            options: buildOptions(answer, [fillTime + drainTime, Math.abs(fillTime - drainTime), fillTime])
        }
    },
    () => {
        const speed1 = randomInt(40, 80)
        const speed2 = randomInt(50, 90)
        const distance = randomInt(100, 400)
        const timeDiff = Math.abs(distance / speed1 - distance / speed2)
        const answer = parseFloat(timeDiff.toFixed(2))
        return {
            question: `Distance between two cities is ${distance} km. Car A travels at ${speed1} km/h and car B at ${speed2} km/h. How many hours difference in their travel times? (Round to 2 decimal places)`,
            answer,
            options: buildOptions(answer, [parseFloat((distance / speed1).toFixed(2)), parseFloat((distance / (speed1 + speed2)).toFixed(2)), parseFloat((distance / Math.abs(speed1 - speed2)).toFixed(2))])
        }
    },
    () => {
        const speed1 = randomInt(40, 70)
        const speed2 = randomInt(50, 80)
        const distance = randomInt(200, 600)
        const timeToMeet = distance / (speed1 + speed2)
        const answer = parseFloat(timeToMeet.toFixed(2))
        return {
            question: `Two trains ${distance} km apart travel towards each other at ${speed1} km/h and ${speed2} km/h. In how many hours do they meet? (Round to 2 decimal places)`,
            answer,
            options: buildOptions(answer, [parseFloat((distance / Math.abs(speed1 - speed2)).toFixed(2)), parseFloat((distance / speed1).toFixed(2)), parseFloat(((speed1 + speed2) / distance).toFixed(2))])
        }
    },
    () => {
        const upstreamSpeed = randomInt(10, 25)
        const downstreamSpeed = upstreamSpeed + randomInt(4, 10)
        const boatSpeed = (upstreamSpeed + downstreamSpeed) / 2
        const currentSpeed = (downstreamSpeed - upstreamSpeed) / 2
        return {
            question: `A boat's upstream speed is ${upstreamSpeed} km/h and downstream speed is ${downstreamSpeed} km/h. What is the speed of the current?`,
            answer: currentSpeed,
            options: buildOptions(currentSpeed, [boatSpeed, downstreamSpeed - upstreamSpeed, boatSpeed + currentSpeed])
        }
    },
    () => {
        const cp = randomInt(100, 600)
        const sp = cp - randomInt(10, 100)
        const lossPercent = parseFloat(((cp - sp) * 100 / cp).toFixed(2))
        const wrongBaseLoss = parseFloat(((cp - sp) * 100 / sp).toFixed(2))
        return {
            question: `Bought at ₹${cp}, sold at ₹${sp}. What is the loss percentage?`,
            answer: lossPercent,
            options: buildOptions(lossPercent, [wrongBaseLoss, cp - sp, 100 - lossPercent])
        }
    },
    () => {
        const cp = randomInt(2, 8) * 100 // Clean integer
        const markup = randomInt(20, 50)
        const discount = randomInt(5, 20)
        const markedPrice = cp * (1 + markup / 100)
        const sp = markedPrice * (1 - discount / 100)
        const profitPercent = parseFloat(((sp - cp) * 100 / cp).toFixed(2))
        return {
            question: `CP = ₹${cp}. Marked ${markup}% above CP. Sold at ${discount}% discount. What is profit/loss %?`,
            answer: profitPercent,
            options: buildOptions(profitPercent, [markup - discount, markup + discount, parseFloat((markup * discount / 100).toFixed(2))])
        }
    },
    () => {
        // Constructive generation for exactness
        const cp = randomInt(2, 8) * 100
        const profitPercent = [10, 20, 25, 30][randomInt(0, 3)]
        const sp = cp * (1 + profitPercent / 100)

        return {
            question: `An article sold for ₹${sp} at ${profitPercent}% profit. What was the cost price?`,
            answer: cp,
            options: buildOptions(cp, [Math.round(sp - (sp * profitPercent / 100)), sp - profitPercent, Math.round(sp * (1 + profitPercent / 100))])
        }
    },
    () => {
        const invest1 = randomInt(2, 8) * 1000
        const invest2 = randomInt(2, 8) * 1000
        const months1 = randomInt(6, 12)
        const months2 = randomInt(6, 12)
        const profit = randomInt(10, 30) * 1000
        const share1 = invest1 * months1
        const share2 = invest2 * months2
        const answer = parseFloat(((share1 * profit) / (share1 + share2)).toFixed(2)) // Handled exactly
        const wrongShare = parseFloat(((invest1 * profit) / (invest1 + invest2)).toFixed(2))
        return {
            question: `A invests ₹${invest1} for ${months1} months, B invests ₹${invest2} for ${months2} months. Total profit is ₹${profit}. A's share? (Round to 2 decimal places if needed)`,
            answer,
            options: buildOptions(answer, [wrongShare, profit - answer, parseFloat((profit / 2).toFixed(2))])
        }
    },
    () => {
        const n = randomInt(5, 10)
        const avg = randomInt(40, 80)
        const newValue = randomInt(avg + 20, avg + 60)
        const newAvg = parseFloat(((avg * n + newValue) / (n + 1)).toFixed(2))
        const wrongAvg = parseFloat(((avg * n + newValue) / n).toFixed(2))
        return {
            question: `Average of ${n} numbers is ${avg}. A new number ${newValue} is added. What is the new average?`,
            answer: newAvg,
            options: buildOptions(newAvg, [wrongAvg, (avg + newValue) / 2, avg + (newValue / n)])
        }
    },
    () => {
        const n = randomInt(6, 12)
        const avg = randomInt(50, 100)
        const removedValue = randomInt(20, avg - 10)
        const newAvg = parseFloat(((avg * n - removedValue) / (n - 1)).toFixed(2))
        const wrongAvg = parseFloat(((avg * n - removedValue) / n).toFixed(2))
        return {
            question: `Average of ${n} numbers is ${avg}. If ${removedValue} is removed, new average?`,
            answer: newAvg,
            options: buildOptions(newAvg, [wrongAvg, avg - (removedValue / n), (avg + removedValue) / 2])
        }
    },
    () => {
        const hour = randomInt(1, 11)
        const minute = randomInt(0, 59)
        const minuteAngle = minute * 6
        const hourAngle = hour * 30 + minute * 0.5
        const diff = Math.abs(minuteAngle - hourAngle)
        const answer = Math.min(diff, 360 - diff)
        const wrongAngle = Math.abs(hour * 30 - minute * 6)
        return {
            question: `What is the angle between clock hands at ${hour}:${minute.toString().padStart(2, '0')}?`,
            answer,
            options: buildOptions(answer, [wrongAngle, 360 - answer, Math.abs(wrongAngle - 30)])
        }
    },
    () => {
        const tens = randomInt(2, 9)
        const units = randomInt(0, tens - 1)
        const original = tens * 10 + units
        const reversed = units * 10 + tens
        const diff = original - reversed
        return {
            question: `A two-digit number has digit sum ${tens + units}. When digits are reversed, it's ${diff} less. Find the original number.`,
            answer: original,
            options: buildOptions(original, [reversed, tens + units * 10, tens * 10 - units])
        }
    },
    () => {
        const ratio1 = randomInt(2, 6)
        const ratio2 = randomInt(2, 6)
        const ratio3 = randomInt(2, 6)
        const total = (ratio1 + ratio2 + ratio3) * randomInt(3, 8)
        const shareA = (ratio1 * total) / (ratio1 + ratio2 + ratio3)
        const maxRatio = Math.max(ratio1, ratio2, ratio3)
        const answer = Math.round((maxRatio * total) / (ratio1 + ratio2 + ratio3))
        return {
            question: `₹${total} is divided in ratio ${ratio1}:${ratio2}:${ratio3}. What is the largest share?`,
            answer,
            options: buildOptions(answer, [Math.round(shareA), Math.round(total / 3), Math.round(total - answer)])
        }
    },
    () => {
        const principal = randomInt(2, 10) * 1000
        const rate = randomInt(5, 15)
        const time = randomInt(2, 5)
        const si = (principal * rate * time) / 100
        const ci = principal * Math.pow(1 + rate / 100, time) - principal
        const diff = parseFloat((ci - si).toFixed(2)) // Precise difference calculation
        return {
            question: `Principal ₹${principal}, Rate ${rate}%, Time ${time} years. Difference between CI and SI? (Round to 2 decimal places)`,
            answer: diff,
            options: buildOptions(diff, [si, parseFloat(ci.toFixed(2)), parseFloat((principal * Math.pow(1 + rate / 100, time)).toFixed(2))])
        }
    },
    () => {
        const principal = randomInt(5, 20) * 1000
        const rate = randomInt(4, 12)
        const time = randomInt(2, 4)
        const amount = parseFloat((principal * Math.pow(1 + rate / 100, time)).toFixed(2)) // Keep precise
        const wrongAmount = parseFloat((principal + (principal * rate * time) / 100).toFixed(2))
        return {
            question: `₹${principal} invested at ${rate}% compound interest for ${time} years. Final amount? (Round to 2 decimal places)`,
            answer: amount,
            options: buildOptions(amount, [wrongAmount, parseFloat((amount - principal).toFixed(2)), parseFloat((principal * Math.pow(1 + rate / 10, time)).toFixed(2))])
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const g = gcd(a, b)
        const l = lcm(a, b)
        return {
            question: `GCD(x, y) = ${g} and LCM(x, y) = ${l}. If x = ${a}, find y.`,
            answer: b,
            options: buildOptions(b, [g * l, a * g, Math.round(l / g)])
        }
    },
    () => {
        const a = randomInt(50, 150)
        const b = randomInt(50, 150)
        const c = randomInt(50, 150)
        const answer = lcm(lcm(a, b), c)
        return {
            question: `Three bells ring every ${a}, ${b}, and ${c} seconds. If they ring together now, after how many seconds will they ring together again?`,
            answer,
            options: buildOptions(answer, [a + b + c, gcd(gcd(a, b), c), (a * b * c) / 2])
        }
    }
]

const hardTemplates = [
    () => {
        const n = randomInt(50, 200)
        let count = 0
        for (let i = 1; i <= n; i++) {
            if (i % 3 === 0 || i % 5 === 0) count++
        }
        let sum = 0
        for (let i = 1; i <= n; i++) {
            if (i % 3 === 0 || i % 5 === 0) sum += i
        }
        return {
            question: `Sum of all multiples of 3 or 5 from 1 to ${n}?`,
            answer: sum,
            options: buildOptions(sum, [count, sum + n, Math.floor(sum / 2)])
        }
    },
    () => {
        const p = [7, 11, 13, 17, 19, 23, 29, 31][randomInt(0, 7)]
        return {
            question: `By Fermat's Little Theorem, what is 2^${p - 1} mod ${p}? (${p} is prime)`,
            answer: 1,
            options: buildOptions(1, [0, 2, p - 1])
        }
    },
    () => {
        const composites = [12, 15, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60, 72, 84, 90, 100]
        const n = composites[randomInt(0, composites.length - 1)]
        const answer = eulerTotient(n)
        return {
            question: `Calculate Euler's totient φ(${n})`,
            answer,
            options: buildOptions(answer, [n - 1, answer + 2, Math.floor(n / 2)])
        }
    },
    () => {
        const base = randomInt(2, 9)
        const exp = randomInt(15, 30)
        const cycle = lastDigitCycle(base)
        const cyclePos = (exp - 1) % cycle.length
        const answer = cycle[cyclePos]
        return {
            question: `What is the units digit of ${base}^${exp}?`,
            answer,
            options: buildOptions(answer, [cycle[(cyclePos + 1) % cycle.length], base % 10, exp % 10])
        }
    },
    () => {
        const n = randomInt(100, 400)
        const answer = numDivisors(n)
        return {
            question: `How many positive divisors does ${n} have?`,
            answer,
            options: buildOptions(answer, [answer + 2, answer - 2, Math.floor(Math.sqrt(n))])
        }
    },
    () => {
        const n = randomInt(5, 12)
        let trailingZeros = 0
        let power = 5
        while (power <= n) {
            trailingZeros += Math.floor(n / power)
            power *= 5
        }
        return {
            question: `How many trailing zeros in ${n}!?`,
            answer: trailingZeros,
            options: buildOptions(trailingZeros, [Math.floor(n / 5), Math.floor(n / 2), trailingZeros + 1])
        }
    },
    () => {
        const trainLength = randomInt(100, 400)
        const speed = randomInt(54, 108)
        const speedMs = speed * 1000 / 3600
        const time = parseFloat((trainLength / speedMs).toFixed(2)) // Exact floating answer
        const wrongTime = parseFloat((trainLength / speed).toFixed(2))
        return {
            question: `A ${trainLength}m train travels at ${speed} km/h. How many seconds to cross a pole? (Round to 2 decimal places)`,
            answer: time,
            options: buildOptions(time, [wrongTime, parseFloat((time * 2).toFixed(2)), parseFloat((time * 3.6).toFixed(2))])
        }
    },
    () => {
        const train1 = randomInt(100, 300)
        const train2 = randomInt(100, 300)
        const speed1 = randomInt(54, 90)
        const speed2 = randomInt(54, 90)
        const relativeSpeed = (speed1 + speed2) * 1000 / 3600
        const time = parseFloat(((train1 + train2) / relativeSpeed).toFixed(2)) // Exact floating answer
        const wrongRelative = parseFloat(((train1 + train2) / (Math.abs(speed1 - speed2) * 1000 / 3600)).toFixed(2))
        return {
            question: `Two trains of length ${train1}m and ${train2}m approach each other at ${speed1} km/h and ${speed2} km/h. Time to pass each other (seconds)? (Round to 2 decimal places)`,
            answer: time,
            options: buildOptions(time, [wrongRelative, parseFloat(((train1 + train2) / speed1).toFixed(2)), parseFloat((time * 2).toFixed(2))])
        }
    },
    () => {
        const walkSpeed = randomInt(4, 8)
        const runSpeed = randomInt(walkSpeed + 4, walkSpeed + 10)
        const walkTime = randomInt(1, 4)
        const runTime = randomInt(1, 4)

        const totalTime = walkTime + runTime
        const walkDist = walkSpeed * walkTime
        const runDist = runSpeed * runTime
        const totalDist = walkDist + runDist

        return {
            question: `A person walks at ${walkSpeed} km/h and runs at ${runSpeed} km/h. Covers ${totalDist} km in ${totalTime} hours. Distance walked?`,
            answer: walkDist,
            options: buildOptions(walkDist, [runDist, totalDist / 2, walkSpeed * totalTime])
        }
    },
    () => {
        const cp1 = randomInt(200, 500)
        const cp2 = randomInt(200, 500)
        const profit = randomInt(15, 35)
        const loss = randomInt(15, 35)
        const sp1 = cp1 * (1 + profit / 100)
        const sp2 = cp2 * (1 - loss / 100)
        const totalCp = cp1 + cp2
        const totalSp = sp1 + sp2
        const overallPercent = parseFloat(((totalSp - totalCp) * 100 / totalCp).toFixed(2))
        return {
            question: `Two articles bought at ₹${cp1} and ₹${cp2}. First sold at ${profit}% profit, second at ${loss}% loss. Overall profit/loss %?`,
            answer: overallPercent,
            options: buildOptions(overallPercent, [profit - loss, (profit + loss) / 2, -overallPercent])
        }
    },
    () => {
        const dishonestPercent = randomInt(10, 25)
        const profitPercent = randomInt(10, 30)
        const falseWeight = Math.round(1000 * (1 - dishonestPercent / 100))
        const trueProfit = parseFloat((((1 + profitPercent / 100) * 1000 / falseWeight - 1) * 100).toFixed(2))
        return {
            question: `A shopkeeper uses a ${falseWeight}g weight instead of 1000g and also charges ${profitPercent}% above cost price. Actual profit %?`,
            answer: trueProfit,
            options: buildOptions(trueProfit, [profitPercent + dishonestPercent, dishonestPercent, profitPercent])
        }
    },
    () => {
        const a = randomInt(100, 999)
        const b = randomInt(10, 99)
        const mod = randomInt(7, 13)
        const answer = (a * b) % mod
        return {
            question: `What is the remainder when ${a} × ${b} is divided by ${mod}?`,
            answer,
            options: buildOptions(answer, [mod - answer, Math.floor((a * b) / mod) % mod, (answer + 2) % mod])
        }
    },
    () => {
        const base = randomInt(2, 9)
        const exp = randomInt(10, 25)
        const mod = [7, 9, 11, 13][randomInt(0, 3)]
        const answer = modPow(base, exp, mod)
        return {
            question: `Find the remainder when ${base}^${exp} is divided by ${mod}.`,
            answer,
            options: buildOptions(answer, [mod - answer, (base * exp) % mod, (answer + 1) % mod])
        }
    },
    () => {
        const n = randomInt(8, 12)
        const r = randomInt(3, 5)
        const combinations = factorial(n) / (factorial(r) * factorial(n - r))
        const permutations = factorial(n) / factorial(n - r)
        return {
            question: `From ${n} students, a committee of ${r} is formed. How many ways?`,
            answer: combinations,
            options: buildOptions(combinations, [permutations, factorial(r), n * r])
        }
    },
    () => {
        const n = randomInt(5, 8)
        const answer = factorial(n - 1)
        return {
            question: `${n} people sit in a circle. How many distinct arrangements?`,
            answer,
            options: buildOptions(answer, [factorial(n), factorial(n - 2), n * n])
        }
    },
    () => {
        const n = randomInt(6, 10)
        const r = randomInt(2, Math.floor(n / 2))
        const answer = factorial(n - 2) / (factorial(r) * factorial(n - 2 - r))
        const without = factorial(n) / (factorial(r) * factorial(n - r))
        return {
            question: `From ${n} people including A and B, form a group of ${r}. How many groups have neither A nor B?`,
            answer,
            options: buildOptions(answer, [without, Math.round(without / 2), factorial(n - 1) / (factorial(r) * factorial(n - 1 - r))])
        }
    },
    () => {
        const total = randomInt(80, 150)
        const a = randomInt(40, 70)
        const b = randomInt(40, 70)
        const both = randomInt(15, Math.min(a, b) - 5)
        const neither = total - a - b + both

        if (neither < 0) return null

        return {
            question: `In a class of ${total}, ${a} play cricket, ${b} play football, ${both} play both. How many play neither?`,
            answer: neither,
            options: buildOptions(neither, [total - a - b, a + b - both, both])
        }
    },
    () => {
        const a = randomInt(2, 8)
        const r = randomInt(2, 4)
        const n = randomInt(6, 10)
        const answer = Math.round(a * (Math.pow(r, n) - 1) / (r - 1))
        return {
            question: `Sum of geometric series: first term ${a}, ratio ${r}, ${n} terms?`,
            answer,
            options: buildOptions(answer, [a * Math.pow(r, n), a * n * r, Math.round(a * Math.pow(r, n - 1))])
        }
    },
    () => {
        const n = randomInt(10, 20)
        const sumCubes = Math.pow((n * (n + 1)) / 2, 2)
        return {
            question: `What is 1³ + 2³ + 3³ + ... + ${n}³?`,
            answer: sumCubes,
            options: buildOptions(sumCubes, [(n * (n + 1) * (2 * n + 1)) / 6, Math.pow(n, 3), sumCubes - Math.pow(n, 3)])
        }
    },
    () => {
        const candidates = [
            randomInt(100, 999),
            randomInt(100, 999),
            randomInt(100, 999),
            randomInt(100, 999)
        ]
        const divisor = [7, 11, 13][randomInt(0, 2)]
        const answer = candidates.filter(x => x % divisor === 0).length
        return {
            question: `How many of these are divisible by ${divisor}? ${candidates.join(', ')}`,
            answer,
            options: buildOptions(answer, [candidates.length - answer, answer + 1, 0])
        }
    },
    () => {
        const days = randomInt(100, 500)
        const startDay = randomInt(0, 6)
        const answerIdx = (startDay + days) % 7
        return {
            question: `If today is ${dayNames[startDay]}, what day is it ${days} days from now?`,
            answer: dayNames[answerIdx],
            options: buildOptions(dayNames[answerIdx], [dayNames[(answerIdx + 1) % 7], dayNames[(answerIdx + 2) % 7], dayNames[(answerIdx + 6) % 7]])
        }
    }
]

const expertTemplates = [
    () => {
        const mod1 = 3
        const mod2 = 5
        const mod3 = 7
        const r1 = randomInt(0, mod1 - 1)
        const r2 = randomInt(0, mod2 - 1)
        const r3 = randomInt(0, mod3 - 1)

        let answer = -1
        for (let x = 1; x <= mod1 * mod2 * mod3; x++) {
            if (x % mod1 === r1 && x % mod2 === r2 && x % mod3 === r3) {
                answer = x
                break
            }
        }

        if (answer === -1) return null

        return {
            question: `Find smallest positive x: x ≡ ${r1} (mod ${mod1}), x ≡ ${r2} (mod ${mod2}), x ≡ ${r3} (mod ${mod3})`,
            answer,
            options: buildOptions(answer, [answer + mod1 * mod2 * mod3, r1 * mod2 * mod3 + r2 * mod1 * mod3 + r3 * mod1 * mod2, Math.abs(answer - mod1)])
        }
    },
    () => {
        const p = [5, 7, 11, 13, 17, 19][randomInt(0, 5)]
        return {
            question: `By Wilson's Theorem, what is (${p - 1})! mod ${p}? (${p} is prime)`,
            answer: p - 1,
            options: buildOptions(p - 1, [1, 0, p])
        }
    },
    () => {
        const n = [12, 18, 24, 30, 36, 48, 60, 72, 84, 96, 100, 120][randomInt(0, 11)]
        const answer = eulerTotient(n)
        return {
            question: `Find φ(${n}) using the formula φ(n) = n∏(1 - 1/p) for prime factors p of n.`,
            answer,
            options: buildOptions(answer, [n - 1, Math.floor(n / 2), answer + 4])
        }
    },
    () => {
        const composites = [30, 42, 60, 70, 78, 84, 90, 102, 110]
        const n = composites[randomInt(0, composites.length - 1)]
        const factors = primeFactors(n)
        let answer = 1
        for (const p in factors) {
            answer *= (factors[p] + 1)
        }
        return {
            question: `How many positive divisors does ${n} have?`,
            answer,
            options: buildOptions(answer, [answer - 1, Object.keys(factors).length, answer + 2])
        }
    },
    () => {
        const n = randomInt(20, 40)
        const p = [2, 3, 5, 7][randomInt(0, 3)]
        let answer = 0
        let pk = p
        while (pk <= n) {
            answer += Math.floor(n / pk)
            pk *= p
        }
        return {
            question: `What is the highest power of ${p} that divides ${n}!? (Legendre's formula)`,
            answer,
            options: buildOptions(answer, [Math.floor(n / p), answer + 1, answer - 1])
        }
    },
    () => {
        const n = randomInt(4, 7)
        let derangement = 0
        for (let k = 0; k <= n; k++) {
            derangement += Math.pow(-1, k) / factorial(k)
        }
        const answer = Math.round(factorial(n) * derangement)
        return {
            question: `${n} letters are placed randomly into ${n} addressed envelopes. Probability all are wrong = D(${n})/${n}!. What is D(${n})?`,
            answer,
            options: buildOptions(answer, [factorial(n), factorial(n - 1), answer + 1])
        }
    },
    () => {
        const pigeons = randomInt(25, 50)
        const holes = randomInt(7, 15)
        const answer = Math.floor((pigeons - 1) / holes) + 1
        return {
            question: `${pigeons} balls are placed into ${holes} boxes. What is the minimum guaranteed number of balls in some box?`,
            answer,
            options: buildOptions(answer, [Math.floor(pigeons / holes), Math.ceil(pigeons / holes) + 1, answer + 1])
        }
    },
    () => {
        const n = randomInt(5, 10)
        const r = randomInt(3, 6)
        const answer = factorial(n + r - 1) / (factorial(r - 1) * factorial(n))
        return {
            question: `In how many ways can ${n} identical balls be placed into ${r} distinct boxes (empty boxes allowed)?`,
            answer,
            options: buildOptions(answer, [Math.pow(r, n), factorial(n + r - 1) / (factorial(r) * factorial(n - 1)), answer + r])
        }
    },
    () => {
        const a1 = randomInt(2, 5)
        const a2 = randomInt(2, 5)
        const n = randomInt(8, 12)
        const seq = [a1, a2]
        for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2])
        const answer = seq[n - 1]
        return {
            question: `Sequence: ${a1}, ${a2}, ${a1 + a2}, ${a2 + (a1 + a2)}, ... (each term = sum of two before). What is term ${n}?`,
            answer,
            options: buildOptions(answer, [seq[n - 2], answer + seq[n - 3], seq[n - 1] + 1])
        }
    },
    () => {
        const n = randomInt(10, 25)
        const answer = parseFloat((1 - 1 / (n + 1)).toFixed(4))
        return {
            question: `Find the sum: 1/(1×2) + 1/(2×3) + 1/(3×4) + ... + 1/(${n}×${n + 1})`,
            answer,
            options: buildOptions(answer, [1 / (n + 1), parseFloat((n / (n + 1)).toFixed(4)), 1])
        }
    },
    () => {
        const n = randomInt(6, 10)
        const answer = Math.pow(2, n) - n - 1
        return {
            question: `How many subsets of {1,2,...,${n}} have at least 2 elements?`,
            answer,
            options: buildOptions(answer, [Math.pow(2, n), Math.pow(2, n) - 1, answer - 1])
        }
    },
    () => {
        const n = randomInt(5, 8)
        const r = randomInt(2, n - 2)
        const withBoth = factorial(n - 2) / (factorial(r - 2) * factorial(n - r))
        const answer = Math.round(withBoth)
        return {
            question: `How many r=${r} subsets of n=${n} elements contain both the 1st and 2nd elements?`,
            answer,
            options: buildOptions(answer, [factorial(n) / (factorial(r) * factorial(n - r)), factorial(n - 2) / (factorial(r - 1) * factorial(n - r - 1)), answer * 2])
        }
    },
    () => {
        const decimal = randomInt(50, 200)
        const base = randomInt(2, 8)
        let n = decimal
        const digits = []
        while (n > 0) {
            digits.unshift(n % base)
            n = Math.floor(n / base)
        }
        const answer = parseInt(digits.join(''))
        return {
            question: `Convert ${decimal} (base 10) to base ${base}.`,
            answer,
            options: buildOptions(answer, [parseInt(digits.reverse().join('')), answer + 10, decimal % base])
        }
    },
    () => {
        const n = randomInt(100, 500)
        let sumDiv = 0
        for (let i = 1; i < n; i++) {
            if (n % i === 0) sumDiv += i
        }
        return {
            question: `What is the sum of proper divisors of ${n}? (All divisors except ${n} itself)`,
            answer: sumDiv,
            options: buildOptions(sumDiv, [sumDiv + n, numDivisors(n), Math.floor(sumDiv / 2)])
        }
    },
    () => {
        const p = [7, 11, 13, 17][randomInt(0, 3)]
        const a = randomInt(2, p - 1)
        const inverse = modPow(a, p - 2, p)
        return {
            question: `Find the modular inverse of ${a} mod ${p}. (x such that ${a}x ≡ 1 mod ${p})`,
            answer: inverse,
            options: buildOptions(inverse, [p - inverse, (inverse + 1) % p, p - a])
        }
    },
    () => {
        const a = randomInt(3, 8)
        const b = randomInt(3, 8)
        const g = gcd(a, b)
        const c = g * randomInt(2, 5)
        const answers = []
        for (let x = -20; x <= 20; x++) {
            if ((c - a * x) % b === 0) {
                const y = (c - a * x) / b
                if (x >= 0 && y >= 0) answers.push({ x, y })
            }
        }

        if (answers.length === 0) return null

        const ans = answers[0]
        return {
            question: `Find a non-negative integer solution to ${a}x + ${b}y = ${c}. What is x + y?`,
            answer: ans.x + ans.y,
            options: buildOptions(ans.x + ans.y, [ans.x, ans.y, Math.abs(ans.x - ans.y)])
        }
    }
]

function generateFromTemplates(templates) {
    for (let attempt = 0; attempt < 20; attempt++) {
        const template = templates[randomInt(0, templates.length - 1)]
        const q = template()

        if (q && q.options && q.options.length === 4 && q.options.includes(q.answer)) {
            return q
        }
    }
    return {
        question: "Calculate: 2 + 2",
        answer: 4,
        options: [4, 3, 5, 2]
    }
}

export function generateArithmetic(difficulty, count = 5) {
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
        const q = generateFromTemplates(templates)
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
