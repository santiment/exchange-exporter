function marketDepth(orderBook, steps = [1, 5, 10, 20, 30], prefix = "") {
  if (orderBook.length == 0) return {}

  const result = {}
  let currentStep = 0
  let currentVolume = 0
  let currentDepth = 0
  const surfacePrice = orderBook[0][0]

  for (let i = 0; i < orderBook.length && currentStep < steps.length; i++) {
    const currentSlippage = Math.abs(1 - orderBook[i][0] / surfacePrice)

    if (currentSlippage >= steps[currentStep] / 100) {
      result[`${prefix}${steps[currentStep]}_percent_volume`] = currentVolume
      result[`${prefix}${steps[currentStep]}_percent_depth`] = currentDepth
      currentStep += 1
    }

    currentVolume += orderBook[i][1]
    currentDepth += orderBook[i][0] * orderBook[i][1]
  }

  while (currentStep < steps.length) {
    result[`${prefix}${steps[currentStep]}_percent_depth`] = null
    currentStep += 1
  }

  return result
}

exports.marketDepth = marketDepth