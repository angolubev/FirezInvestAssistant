export default class FirezEquity {
  static UNDEFINED_VALUE = -999999;

  constructor() {
    this.price = 0;
    this.marketCap = 0;
    this.trailingPE = 0;
    this.dividendYield = 0;
    this.totalRevenue = 0;
    this.PS = 0;
    this.forwardPE = 0;
  }

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
    console.log(FirezEquity.UNDEFINED_VALUE);
    this.id = id;
    this.ticker = equityFromYahoo.symbol ? equityFromYahoo.symbol : null;
    this.name = equityFromYahoo.longName ? equityFromYahoo.longName : null;
    this.price = equityFromYahoo.bid ? equityFromYahoo.bid : FirezEquity.UNDEFINED_VALUE;
    this.marketCap = equityFromYahoo.marketCap ? equityFromYahoo.marketCap : FirezEquity.UNDEFINED_VALUE;
    this.trailingPE = equityFromYahoo.trailingPE ? equityFromYahoo.trailingPE : FirezEquity.UNDEFINED_VALUE;
    this.forwardPE = equityFromYahoo.forwardPE ? equityFromYahoo.forwardPE : FirezEquity.UNDEFINED_VALUE;
    this.lastUpdateTimestamp = Date.now();
    return this;
  }

  fromAlphavantageOverview(equityFromAlphavantage, id) {
    this.id = id;
    this.ticker = equityFromAlphavantage.Symbol ? equityFromAlphavantage.Symbol : null;
    this.name = equityFromAlphavantage.Name ? equityFromAlphavantage.Name : null;
    this.marketCap = equityFromAlphavantage.MarketCapitalization ? parseInt(equityFromAlphavantage.MarketCapitalization) : null;
    this.trailingPE = equityFromAlphavantage.TrailingPE ? parseFloat(equityFromAlphavantage.TrailingPE) : null;
    this.forwardPE = equityFromAlphavantage.ForwardPE ? parseFloat(equityFromAlphavantage.ForwardPE) : null;
    this.dividendYield = equityFromAlphavantage.DividendYield ? parseFloat(equityFromAlphavantage.DividendYield) : 0;
    this.PS = equityFromAlphavantage.RevenuePerShareTTM ? parseFloat(equityFromAlphavantage.RevenuePerShareTTM) : 0;
    this.lastUpdateTimestamp = Date.now();
  }

  fromAlphavantageGlobalQuote(globalQuote) {
    this.price = globalQuote["05. price"] ? parseFloat(globalQuote["05. price"]) : null;
  }

  fromSummary(summary) {
    this.dividendYield = summary.dividendYield.raw ? summary.dividendYield.raw : 0;
  }

  fromFinancialData(data) {
    this.totalRevenue = data.totalRevenue.raw ? data.totalRevenue.raw : FirezEquity.UNDEFINED_VALUE;
    if(this.totalRevenue && this.marketCap) {
      this.PS = this.marketCap / this.totalRevenue;
    } else {
      this.PS = FirezEquity.UNDEFINED_VALUE;
    }
  }

  get needsUpdate() {
    const currentDate = new Date();
    const latestMidnight = currentDate.setHours(0, 0, 0, 0);
    return latestMidnight > this.lastUpdateTimestamp;
  }

  get recentlyUpdated() {
    return !this.needsUpdate;
  }
}
