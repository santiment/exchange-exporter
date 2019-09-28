const assert = require("assert")
const slice = require("lodash/slice")
const { marketDepth } = require("../utils")

const deepMarket = require('./deep_order_book.json')


describe('marketDepth', function () {
  it("computes the market depth for a deep market", function () {
    const bidsDepth = marketDepth(deepMarket.bids)
    const asksDepth = marketDepth(deepMarket.asks)

    assert.equal(bidsDepth["1_percent_depth"], 6722.47)
    assert.equal(asksDepth["1_percent_depth"], 220.89)
    assert.equal(bidsDepth["30_percent_depth"], 79452.21)
    assert.equal(asksDepth["30_percent_depth"], 35592.670000000006)
  })

  it("computes the market depth for a shallow market", function () {
    const bidsDepth = marketDepth(slice(deepMarket.bids, 0, 10))
    const asksDepth = marketDepth(slice(deepMarket.asks, 0, 10))

    assert.equal(bidsDepth["1_percent_depth"], 6722.47)
    assert.equal(asksDepth["1_percent_depth"], 220.89)
    assert.equal(bidsDepth["30_percent_depth"], null)
    assert.equal(asksDepth["30_percent_depth"], null)
  })

  it("computes the market depth for an empty market", function () {
    const bidsDepth = marketDepth([])
    const asksDepth = marketDepth([])

    assert.deepEqual(bidsDepth, {})
    assert.deepEqual(asksDepth, {})
  })
})
