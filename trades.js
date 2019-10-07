const package = require('./package.json')
const ccxt = require('ccxt')
const { Exporter } = require('@santiment-network/san-exporter')

const exporter = new Exporter(`${package.name}-trades`)

function currentTimestamp() {
  return Math.floor(Date.now())
}

async function fetch_trades(exchange, preProcessor = null) {
  const lastTimestamp = {}

  while (true) {
    const markets = await exchange.load_markets()
    console.log(`${exchange.name}: fetching ${exchange.symbols.length} markets`)

    for (symbol in markets) {
      const fromTimestamp = lastTimestamp[symbol] || (currentTimestamp() - 60 * 60 * 1000)
      const trades = await exchange.fetchTrades(symbol, fromTimestamp)

      if (trades.length == 0) continue

      lastTimestamp[symbol] = trades[trades.length - 1].timestamp
      let exported_data = trades

      if (preProcessor) {
        exported_data = exported_data.map(preProcessor)
      }

      exported_data = exported_data.map((trade) => ({
        symbol: trade.symbol,
        side: trade.side,
        amount: trade.amount,
        price: trade.price,
        cost: trade.cost,
        timestamp: trade.timestamp,
        source: exchange.name,
        id: trade.id
      }))

      await exporter.sendData(exported_data)

      console.log(`${exchange.name} ${symbol}: pushed ${trades.length} trades`)
    }
  }
}

function assignKrakenIDs(trade) {
  if (trade.id) return trade

  trade.id = trade.timestamp + ''

  return trade
}

async function main() {
  await exporter.connect()

  fetch_trades(new ccxt.binance({ 'enableRateLimit': true }))
  fetch_trades(new ccxt.kraken({ 'enableRateLimit': true }), assignKrakenIDs)
  fetch_trades(new ccxt.bitfinex2({ 'enableRateLimit': true, 'rateLimit': 5000 }))
  fetch_trades(new ccxt.bittrex({ 'enableRateLimit': true }))
  fetch_trades(new ccxt.poloniex({ 'enableRateLimit': true }))
}

main()