export default class FirezYahooConnector {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getQuoteByTicker(ticker, callback) {
    return fetch(
      'https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=' + ticker,
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': this.apiKey,
        },
      }
    );
  }
}
