export default class FirezEquity {
  constructor() {}

  fromObject(obj) {
    this.id = obj.id;
    this.ticker = obj.ticker;
    this.name = obj.name;
    this.price = obj.price;
    this.marketCap = obj.marketCap;
    this.trailingPE = obj.trailingPE;
    if (obj.lastUpdateTimestamp) {
      this.lastUpdateTimestamp = obj.lastUpdateTimestamp;
    } else {
      this.lastUpdateTimestamp = Date.now();
    }
    return this;
  }

  fromYahoo(equityFromYahoo, id) {
    this.id = id;
    this.ticker = equityFromYahoo.symbol ? equityFromYahoo.symbol : null,
    this.name = equityFromYahoo.longName ? equityFromYahoo.longName : null,
    this.price = equityFromYahoo.bid ? equityFromYahoo.bid : null,
    this.marketCap = equityFromYahoo.marketCap ? equityFromYahoo.marketCap : null,
    this.trailingPE = equityFromYahoo.trailingPE ? equityFromYahoo.trailingPE : null,
    this.lastUpdateTimestamp = Date.now();
    return this;
  }

  get needsUpdate() {
    const currentDate = new Date();
    const latestMidnight = currentDate.setHours(0, 0, 0, 0);
    return latestMidnight > this.lastUpdateTimestamp;
  }
}
