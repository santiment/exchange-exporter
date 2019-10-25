const url = require('url')
const { send } = require('micro')

function marketDepth(orderBook, steps = [0.25, 1, 5, 10, 20, 30], prefix = "") {
  const result = {}
  let currentStep = 0
  let currentVolume = 0
  let currentDepth = 0
  const surfacePrice = orderBook.length > 0 ? orderBook[0][0] : 0

  for (let i = 0; i < orderBook.length && currentStep < steps.length; i++) {
    const currentSlippage = Math.abs(1 - orderBook[i][0] / surfacePrice)

    if (currentSlippage >= steps[currentStep] / 100) {
      result[`${prefix}${steps[currentStep]}_percent_volume`.replace(".", "_")] = currentVolume
      result[`${prefix}${steps[currentStep]}_percent_depth`.replace(".", "_")] = currentDepth
      currentStep += 1
    }

    currentVolume += orderBook[i][1]
    currentDepth += orderBook[i][0] * orderBook[i][1]
  }

  while (currentStep < steps.length) {
    result[`${prefix}${steps[currentStep]}_percent_depth`.replace(".", "_")] = null
    result[`${prefix}${steps[currentStep]}_percent_volume`.replace(".", "_")] = null
    currentStep += 1
  }

  return result
}

const healthcheckKafka = (exporter) => {
  return new Promise((resolve, reject) => {
    if (exporter.producer.isConnected()) {
      resolve()
    } else {
      reject("Kafka client is not connected to any brokers")
    }
  })
}

exports.marketDepth = marketDepth

exports.healthcheckServer = (exporter) => {
  return async (request, response) => {
    const req = url.parse(request.url, true);

    switch (req.pathname) {
      case '/healthcheck':
        return healthcheckKafka(exporter)
          .then(() => send(response, 200, "ok"))
          .catch((err) => send(response, 500, `Connection to kafka failed: ${err}`))

      default:
        return send(response, 404, 'Not found');
    }
  }
}