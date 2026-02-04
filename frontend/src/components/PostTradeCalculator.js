import React, { useState } from 'react';

function PostTradeCalculator({ cryptos }) {
    const [tradeData, setTradeData] = useState({
        assetType: 'crypto',
        symbol: 'BTC',
        entryPrice: '',
        exitPrice: '',
        amount: '',
        fees: '',
        date: '',
        notes: ''
    });

    const [trades, setTrades] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTradeData({
            ...tradeData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create a new trade
        const newTrade = {
            id: Date.now(),
            date: tradeData.date || new Date().toISOString().slice(0, 10),
            ...tradeData,
            profit: calculateProfit()
        };
        
        // Add to trades list
        setTrades([...trades, newTrade]);
        
        // Reset form
        setTradeData({
            assetType: 'crypto',
            symbol: 'BTC',
            entryPrice: '',
            exitPrice: '',
            amount: '',
            fees: '',
            date: '',
            notes: ''
        });
    };

    const calculateProfit = () => {
        const entry = parseFloat(tradeData.entryPrice) || 0;
        const exit = parseFloat(tradeData.exitPrice) || 0;
        const amount = parseFloat(tradeData.amount) || 0;
        const fees = parseFloat(tradeData.fees) || 0;
        
        if (entry && exit && amount) {
            const units = amount / entry;
            const grossProfit = units * (exit - entry);
            return grossProfit - fees;
        }
        return 0;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6">Post-Trade Analyzer</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Asset Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Asset Type
                            </label>
                            <select
                                name="assetType"
                                value={tradeData.assetType}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            >
                                <option value="crypto">Crypto</option>
                                <option value="forex">Forex</option>
                                <option value="stocks">Stocks</option>
                            </select>
                        </div>
                        
                        {/* Symbol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Symbol
                            </label>
                            <select
                                name="symbol"
                                value={tradeData.symbol}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            >
                                {cryptos && cryptos.slice(0, 10).map(crypto => (
                                    <option key={crypto.symbol} value={crypto.symbol}>
                                        {crypto.name} ({crypto.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Entry Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entry Price ($)
                            </label>
                            <input
                                type="number"
                                name="entryPrice"
                                value={tradeData.entryPrice}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Exit Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Exit Price ($)
                            </label>
                            <input
                                type="number"
                                name="exitPrice"
                                value={tradeData.exitPrice}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Investment Amount ($)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={tradeData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Fees */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fees ($)
                            </label>
                            <input
                                type="number"
                                name="fees"
                                value={tradeData.fees}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Trade Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={tradeData.date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={tradeData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            ></textarea>
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                        >
                            Record Trade
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Results Panel */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 mb-6">
                    <h2 className="text-xl font-bold mb-6">Recorded Trades</h2>
                    
                    {trades.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No trades recorded yet.</p>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Use the form to add your completed trades.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry/Exit</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">P&L</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {trades.map(trade => (
                                        <tr key={trade.id}>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {trade.date}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {trade.symbol}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ${trade.entryPrice} → ${trade.exitPrice}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ${parseFloat(trade.amount).toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                                                <span className={trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                    {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {trades.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Trades</p>
                                <p className="text-2xl font-bold mt-1">{trades.length}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total P&L</p>
                                <p className={`text-2xl font-bold mt-1 ${trades.reduce((sum, trade) => sum + trade.profit, 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${trades.reduce((sum, trade) => sum + trade.profit, 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                                <p className="text-2xl font-bold mt-1">
                                    {(trades.filter(trade => trade.profit > 0).length / trades.length * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostTradeCalculator; 