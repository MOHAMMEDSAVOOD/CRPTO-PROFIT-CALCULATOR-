import React, { useState, useEffect } from 'react';

function CryptoConverter({ cryptos }) {
    const [amount, setAmount] = useState('');
    const [fromCrypto, setFromCrypto] = useState('');
    const [toCrypto, setToCrypto] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [rates, setRates] = useState({});

    // Update conversion rates when cryptos change
    useEffect(() => {
        if (cryptos && cryptos.length > 0) {
            const newRates = {};
            // Use USD as base for conversion rates
            cryptos.forEach(crypto => {
                if (crypto.quote && crypto.quote.USD && crypto.quote.USD.price) {
                    newRates[crypto.symbol] = crypto.quote.USD.price;
                }
            });
            setRates(newRates);
        }
    }, [cryptos]);

    const handleConvert = () => {
        if (!amount || !fromCrypto || !toCrypto) {
            setError('Please fill all fields');
            return;
        }

        setError('');
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!rates[fromCrypto] || !rates[toCrypto]) {
            setError('Unable to get conversion rates');
            return;
        }

        // Convert from source crypto to USD, then from USD to target crypto
        const valueInUSD = parsedAmount * rates[fromCrypto];
        const convertedValue = valueInUSD / rates[toCrypto];

        setResult({
            from: {
                symbol: fromCrypto,
                amount: parsedAmount
            },
            to: {
                symbol: toCrypto,
                amount: convertedValue
            },
            rate: rates[toCrypto] / rates[fromCrypto]
        });
    };

    return (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Cryptocurrency Converter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        step="any"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">From</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={fromCrypto}
                        onChange={(e) => setFromCrypto(e.target.value)}
                    >
                        <option value="">Select cryptocurrency</option>
                        {cryptos && cryptos.map(crypto => (
                            <option key={`from-${crypto.id}`} value={crypto.symbol}>
                                {crypto.name} ({crypto.symbol})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">To</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={toCrypto}
                        onChange={(e) => setToCrypto(e.target.value)}
                    >
                        <option value="">Select cryptocurrency</option>
                        {cryptos && cryptos.map(crypto => (
                            <option key={`to-${crypto.id}`} value={crypto.symbol}>
                                {crypto.name} ({crypto.symbol})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleConvert}
            >
                Convert
            </button>

            {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Conversion Result</h3>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left">
                            <span className="text-xl font-bold">{result.from.amount}</span>
                            <span className="text-gray-600 ml-2">{result.from.symbol}</span>
                        </div>
                        
                        <div className="my-2 md:my-0">
                            <span className="text-gray-500">≈</span>
                        </div>
                        
                        <div className="text-center md:text-right">
                            <span className="text-xl font-bold">{result.to.amount.toFixed(8)}</span>
                            <span className="text-gray-600 ml-2">{result.to.symbol}</span>
                        </div>
                    </div>
                    
                    <div className="mt-2 text-center text-sm text-gray-500">
                        Exchange Rate: 1 {result.from.symbol} = {result.rate.toFixed(8)} {result.to.symbol}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CryptoConverter; 