export function isTradingEquationFulfilled (indicator: number, operator: string, threshold: number): boolean {
  switch (operator) {
    case '>': return indicator > threshold
    case '<': return indicator < threshold
    case '>=': return indicator >= threshold
    case '<=': return indicator <= threshold
    case '=': return indicator === threshold
    default: return false
  }
}

export function calculateTradeProfitAbsolute (openingPrice: number, closingPrice: number): number {
  return Number((closingPrice - openingPrice).toFixed(2))
}

export function calculateTradeProfitRelative (openingPrice: number, closingPrice: number): number {
  return parseFloat(((closingPrice - openingPrice) / openingPrice * 100).toFixed(4))
}

export function calculateSuccessRate (positiveTrades: number, negativeTrades: number): number {
  return parseFloat(((positiveTrades / (positiveTrades + negativeTrades)) * 100).toFixed(2))
}

export function calculateSumOfArray (array: number[]): number {
  let sumOfArray = 0
  array.forEach(arrayEntry => {
    sumOfArray += arrayEntry
  })
  return parseFloat(sumOfArray.toFixed(2))
}

export function calculateMeanOfArray (array: number[]): number {
  const meanOfArray = calculateSumOfArray(array) / array.length
  return parseFloat(meanOfArray.toFixed(2))
}

export function calculateStandardDeviationOfArray (array: number[]): number {
  const mean = calculateMeanOfArray(array)
  array = array.map(arrayEntry => {
    return (arrayEntry - mean) ** 2
  })
  const variance = calculateMeanOfArray(array)
  return parseFloat(Math.sqrt(variance).toFixed(2))
}
