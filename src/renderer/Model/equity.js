export default class FirezEquity {
  constructor() {}

  fromObject(obj) {
    this.id = obj.id;
    this.ticker = obj.ticker;
    this.name = obj.name;
    this.price = obj.price;
    this.marketCap = obj.marketCap;
    this.trailingPE = obj.trailingPE;
    this.dividendYield = obj.dividendYield;
    this.totalRevenue = obj.totalRevenue;
    this.PS = obj.PS;
    this.forwardPE = obj.forwardPE;
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
    this.forwardPE = equityFromYahoo.forwardPE ? equityFromYahoo.forwardPE : null,
    this.lastUpdateTimestamp = Date.now();
    return this;
  }

  fromSummary(summary) {
    this.dividendYield = summary.dividendYield.raw ? summary.dividendYield.raw : 0;
  }

  fromFinancialData(data) {
    this.totalRevenue = data.totalRevenue.raw ? data.totalRevenue.raw : null;
    if(this.totalRevenue && this.marketCap) {
      this.PS = this.marketCap / this.totalRevenue;
    } else {
      this.PS = null;
    }
  }

  get needsUpdate() {
    const currentDate = new Date();
    const latestMidnight = currentDate.setHours(0, 0, 0, 0);
    return latestMidnight > this.lastUpdateTimestamp;
  }
}
