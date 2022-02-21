export default class FirezEquityView {
    constructor() {}

    fromEquity(equity) {
        this.id = equity.id;
        this.ticker = equity.ticker;
        this.name = equity.name;
        this.price = equity.price;
        this.marketCap = Math.round(equity.marketCap / 1000000);
        this.trailingPE = this.round2Decimals(equity.trailingPE);
        this.dividendYield =  this.round2Decimals(equity.dividendYield * 100);
        this.PS =  this.round2Decimals(equity.PS);
        this.forwardPE =  this.round2Decimals(equity.forwardPE);
        this.recentlyUpdated = !equity.needsUpdate;
        return this;
    }

    round2Decimals(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }
}