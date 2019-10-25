const package = require('./package.json')
const ccxt = require('ccxt')
const { Exporter } = require('@santiment-network/san-exporter')
const { marketDepth, healthcheckServer } = require('./utils')
const merge = require('lodash/merge')
const exporter = new Exporter(`${package.name}-market-depth`)

async function fetch_markets(exchange, order_book_limit) {
  while (true) {
    const currentTickers = await exchange.fetchTickers()
    console.log(`${exchange.name} - getting order books for ${exchange.symbols.length} markets`)

    for (ticker in currentTickers) {
      if (!currentTickers[ticker]) continue

      let result = {
        symbol: ticker,
        ask: currentTickers[ticker].ask,
        bid: currentTickers[ticker].bid,
        timestamp: currentTickers[ticker].timestamp,
        source: exchange.name
      }

      const orderBook = await exchange.fetchL2OrderBook(ticker, order_book_limit)

      result = merge(result, marketDepth(orderBook.bids, [0.25, 0.5, 0.75, 1, 2, 5, 10, 20, 30], "bids_"))
      result = merge(result, marketDepth(orderBook.asks, [0.25, 0.5, 0.75, 1, 2, 5, 10, 20, 30], "asks_"))

      exporter.sendData(result)
    }
  }
}

async function main() {
  await exporter.connect()

  fetch_markets(new ccxt.binance({ 'enableRateLimit': true, 'rateLimit': 3000 }), 5000)
  fetch_markets(new ccxt.kraken({ 'enableRateLimit': true }), 3000)
  fetch_markets(new ccxt.bitfinex({ 'enableRateLimit': true, 'rateLimit': 2000 }), 3000)
  fetch_markets(new ccxt.bittrex({ 'enableRateLimit': true }), 3000)
  fetch_markets(new ccxt.poloniex({ 'enableRateLimit': true }), 3000)
}

main()

module.exports = healthcheckServer(exporter)