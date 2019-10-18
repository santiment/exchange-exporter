const assert = require("assert")
const slice = require("lodash/slice")
const { marketDepth } = require("../utils")

const deepMarket = require('./deep_order_book.json')


describe('marketDepth', function () {
  it("computes the market depth for a deep market", function () {
    const bidsDepth = marketDepth(deepMarket.bids)
    const asksDepth = marketDepth(deepMarket.asks)

    assert.equal(bidsDepth["0_25_percent_volume"], 331.96)
    assert.equal(bidsDepth["0_25_percent_depth"], 0.6253533000000001)
    assert.equal(bidsDepth["1_percent_volume"], 6722.47)
    assert.equal(bidsDepth["1_percent_depth"], 12.571950399999999)
    assert.equal(asksDepth["0_25_percent_volume"], 210.19)
    assert.equal(asksDepth["0_25_percent_depth"], 0.40051791999999997)
    assert.equal(asksDepth["1_percent_volume"], 220.89)
    assert.equal(asksDepth["1_percent_depth"], 0.42110472)
    assert.equal(bidsDepth["30_percent_volume"], 79452.21)
    assert.equal(bidsDepth["30_percent_depth"], 136.70846597999997)
    assert.equal(asksDepth["30_percent_volume"], 35592.670000000006)
    assert.equal(asksDepth["30_percent_depth"], 77.99963647999999)
  })

  it("computes the market depth for a shallow market", function () {
    const bidsDepth = marketDepth(slice(deepMarket.bids, 0, 10))
    const asksDepth = marketDepth(slice(deepMarket.asks, 0, 10))

    assert.equal(bidsDepth["1_percent_volume"], 6722.47)
    assert.equal(asksDepth["1_percent_volume"], 220.89)
    assert.ok("30_percent_volume" in bidsDepth)
    assert.ok("30_percent_volume" in asksDepth)
  })

  it("computes the market depth for an empty market", function () {
    const bidsDepth = marketDepth([])
    const asksDepth = marketDepth([])

    assert.ok("0_25_percent_volume" in bidsDepth)
    assert.ok("0_25_percent_volume" in asksDepth)
    assert.ok("1_percent_volume" in bidsDepth)
    assert.ok("1_percent_volume" in asksDepth)
    assert.ok("30_percent_volume" in bidsDepth)
    assert.ok("30_percent_volume" in asksDepth)
  })
})
