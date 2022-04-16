export default class FirezYahooConnector {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getQuoteByTicker(ticker, callbackSuccess, callbackError) {
    fetch(
      'https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=' + ticker,
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': this.apiKey,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.quoteResponse) {
          if (result.quoteResponse.result.length > 0) {
            callbackSuccess(result.quoteResponse.result[0]);
          } else {
            callbackError("Can't get equity with ticker " + ticker);
          }
        } else if (result.message) {
          callbackError(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        callbackError(error.message);
      });
  }

  getQuoteSummaryDetailByTicker(ticker, callbackSuccess, callbackError) {
    fetch(
      'https://yfapi.net/v11/finance/quoteSummary/' +
        ticker +
        '?lang=en&region=US&modules=summaryDetail',
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': this.apiKey,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.quoteSummary) {
          if (result.quoteSummary.result) {
            callbackSuccess(result.quoteSummary.result[0].summaryDetail);
          } else {
            console.error(result.quoteSummary.error);
          }
        } else if (result.message) {
          callbackError(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        callbackError(error.message);
      });
  }

  getQuoteFinancialDataByTicker(ticker, callbackSuccess, callbackError) {
    fetch(
      'https://yfapi.net/v11/finance/quoteSummary/AAPL?lang=en&region=US&modules=financialData',
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': this.apiKey,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.quoteSummary) {
          if (result.quoteSummary.result) {
            callbackSuccess(result.quoteSummary.result[0].financialData);
          } else {
            console.error(result.quoteSummary.error);
          }
        } else if (result.message) {
          callbackError(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        callbackError(error.message);
      });
  }
}
