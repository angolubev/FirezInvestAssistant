export default class FirezAlphavantageConnector {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }

    getQuoteOverviewByTicker(ticker, callbackSuccess, callbackError) {
        fetch('https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + ticker + '&apikey=' + this.apiKey,
        {
            headers: {'User-Agent': 'request'}
        }
        ).then((response) => response.json())
        .then((result) => {
            console.log(result);
            callbackSuccess(result);
        })
        .catch((error) => {
            console.error(error);
            callbackError(error.message);
        });
    }

    getGlobalQuoteByTicker(ticker, callbackSuccess, callbackError) {
        fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + ticker + '&apikey=' + this.apiKey,
        {
            headers: {'User-Agent': 'request'}
        }
        ).then((response) => response.json())
        .then((result) => {
            console.log(result["Global Quote"]);
            callbackSuccess(result["Global Quote"]);
        })
        .catch((error) => {
            console.error(error);
            callbackError(error.message);
        });
    }
}