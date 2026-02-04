import React, { useState } from 'react';

function Portfolio({ cryptos }) {
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const calculateProfit = () => {
        if (!buyPrice || !amount || (sellPrice === '' && !selectedCrypto)) {
            setError('Please fill all required fields');
            return;
        }

        setError('');
        const buyValue = parseFloat(buyPrice);
        let sellValue = sellPrice ? parseFloat(sellPrice) : 0;
        const coinAmount = parseFloat(amount);

        // If no sell price is provided but a crypto is selected, use current market price
        if (!sellPrice && selectedCrypto) {
            const selectedCoin = cryptos.find(c => c.symbol === selectedCrypto);
            if (selectedCoin && selectedCoin.quote && selectedCoin.quote.USD) {
                sellValue = selectedCoin.quote.USD.price;
            }
        }

        if (isNaN(buyValue) || isNaN(sellValue) || isNaN(coinAmount)) {
            setError('Please enter valid numbers');
            return;
        }

        const investment = buyValue * coinAmount;
        const currentValue = sellValue * coinAmount;
        const profitLoss = currentValue - investment;
        const profitLossPercentage = (profitLoss / investment) * 100;

        setResults({
            investment: investment.toFixed(2),
            currentValue: currentValue.toFixed(2),
            profitLoss: profitLoss.toFixed(2),
            profitLossPercentage: profitLossPercentage.toFixed(2),
            isProfit: profitLoss >= 0
        });
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Crypto Trading Calculator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Cryptocurrency</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                    >
                        <option value="">Select a cryptocurrency</option>
                        {cryptos && cryptos.map(crypto => (
                            <option key={crypto.id} value={crypto.symbol}>
                                {crypto.name} ({crypto.symbol})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Buy Price ($)</label>
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        placeholder="Enter buy price"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Sell Price ($) (Optional if crypto selected)</label>
                    <input 
                        type="number" 
                        className="w-full p-2 border rounded"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        placeholder="Enter sell price or leave blank for current price"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={calculateProfit}
            >
                Calculate
            </button>

            {results && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p>Investment: ${results.investment}</p>
                            <p>Current Value: ${results.currentValue}</p>
                        </div>
                        <div>
                            <p className={results.isProfit ? 'text-green-500' : 'text-red-500'}>
                                Profit/Loss: ${results.profitLoss} ({results.profitLossPercentage}%)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Portfolio; 