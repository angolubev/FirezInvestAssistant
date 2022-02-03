import { useState, useEffect } from 'react';

const Table = () => {
    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [cap, setCap] = useState(null);
    const [pe, setPe] = useState(null);
    const [yearIncome, setYearIncome] = useState(null);
    const [dividendYield, setDividendYield] = useState(null);
    const getTickerInfo = () => {
        fetch('https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=AAPL', {
            headers: {
                "accept": "application/json",
                "X-API-KEY": "l3qwKprfEf8kpp1kSGBDq9MFDBlcgY0WTWj20uGb",
            }
        }).then(response => response.json()    
        ).then((result) => {
            //console.log(result["quoteResponse"]["result"][0])
            setName(result["quoteResponse"]["result"][0]["longName"])
            setPrice(result["quoteResponse"]["result"][0]["bid"])
            setCap(result["quoteResponse"]["result"][0]["marketCap"])
            setPe(result["quoteResponse"]["result"][0]["trailingPE"])
            setYearIncome()
        })

        fetch('https://yfapi.net/v11/finance/quoteSummary/AAPL?lang=en&region=US&modules=financialData', {
            headers: {
                "accept": "application/json",
                "X-API-KEY": "l3qwKprfEf8kpp1kSGBDq9MFDBlcgY0WTWj20uGb",
            }
        }).then(response => response.json()    
        ).then((result) => {
            //console.log(result["quoteResponse"]["result"][0])
            setYearIncome(result["quoteSummary"]["result"][0]["financialData"]["totalRevenue"]["raw"])
        })

        fetch('https://yfapi.net/v11/finance/quoteSummary/AAPL?lang=en&region=US&modules=summaryDetail', {
            headers: {
                "accept": "application/json",
                "X-API-KEY": "l3qwKprfEf8kpp1kSGBDq9MFDBlcgY0WTWj20uGb",
            }
        }).then(response => response.json()    
        ).then((result) => {
            //console.log(result["quoteResponse"]["result"][0])
            setDividendYield(result["quoteSummary"]["result"][0]["summaryDetail"]["dividendYield"]["raw"])
        })
    }

    return ( 
        <div class="tbl-header">
            <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th>Тикер</th>
                        <th>Название</th>
                        <th>Котировка</th>
                        <th>Капитализация</th>
                        <th>Выручка за год</th>
                        <th>P/E</th>
                        <th>P/S</th>
                        <th>ДД</th>
                    </tr>
                </thead>
            </table>
            <table cellpadding="0" cellspacing="0" border="0">
                <tbody>
                    <tr>
                        <td>AAC</td>
                        <td>{name} </td>
                        <td>{price}</td>
                        <td>{cap}</td>
                        <td>{yearIncome}</td>
                        <td>{pe}</td>
                        <td>{cap/yearIncome}</td>
                        <td>{dividendYield*100}%</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={getTickerInfo}>update</button>
        </div>
     );
}
 
export default Table;