import React, { useState, useEffect, useCallback } from 'react';

function PositionSizing({ cryptos }) {
    // Form states
    const [formData, setFormData] = useState({
        accountSize: 10000,
        riskPercentage: 1,
        entryPrice: '',
        stopLossPrice: '',
        takeProfit: '',
        symbol: 'BTC',
        assetType: 'crypto',
    });
    
    // Results states
    const [results, setResults] = useState({
        positionSize: 0,
        riskAmount: 0,
        potentialProfit: 0,
        riskRewardRatio: 0,
        units: 0,
    });
    
    // Asset options
    const assetTypes = [
        { value: 'crypto', label: 'Crypto' },
        { value: 'forex', label: 'Forex' },
        { value: 'stocks', label: 'Stocks' },
    ];
    
    // Get available symbols based on selected asset type
    const getSymbols = useCallback(() => {
        switch (formData.assetType) {
            case 'crypto':
                return cryptos.map(crypto => ({
                    value: crypto.symbol,
                    label: `${crypto.name} (${crypto.symbol})`,
                    price: crypto.quote?.USD?.price || 0
                }));
            case 'forex':
                return [
                    { value: 'EURUSD', label: 'EUR/USD', price: 1.09 },
                    { value: 'GBPUSD', label: 'GBP/USD', price: 1.26 },
                    { value: 'USDJPY', label: 'USD/JPY', price: 150.45 },
                ];
            case 'stocks':
                return [
                    { value: 'AAPL', label: 'Apple Inc. (AAPL)', price: 175.26 },
                    { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)', price: 142.50 },
                    { value: 'MSFT', label: 'Microsoft Corp. (MSFT)', price: 338.11 },
                ];
            default:
                return [];
        }
    }, [formData.assetType, cryptos]);
    
    // Helper to find current price of selected asset
    const getCurrentPrice = useCallback(() => {
        const symbols = getSymbols();
        const selectedSymbol = symbols.find(s => s.value === formData.symbol);
        return selectedSymbol?.price || 0;
    }, [formData.symbol, getSymbols]);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);
    
    // Handle asset type change
    const handleAssetTypeChange = useCallback((e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            assetType: value,
            symbol: getSymbols()[0]?.value || ''
        }));
    }, [getSymbols]);
    
    // Calculate results
    const calculateResults = useCallback(() => {
        const accountSize = parseFloat(formData.accountSize) || 10000;
        const riskPercentage = parseFloat(formData.riskPercentage) || 1;
        const entryPrice = parseFloat(formData.entryPrice) || getCurrentPrice();
        const stopLossPrice = parseFloat(formData.stopLossPrice) || 0;
        const takeProfitPrice = parseFloat(formData.takeProfit) || 0;
        
        // Calculate risk amount
        const riskAmount = (accountSize * riskPercentage) / 100;
        
        // Calculate position size and units
        let positionSize = 0;
        let units = 0;
        let potentialProfit = 0;
        let riskRewardRatio = 0;
        
        if (entryPrice > 0 && stopLossPrice > 0 && entryPrice !== stopLossPrice) {
            // For long positions
            if (entryPrice > stopLossPrice) {
                const riskPerUnit = entryPrice - stopLossPrice;
                units = riskAmount / riskPerUnit;
                positionSize = units * entryPrice;
                
                if (takeProfitPrice > 0) {
                    potentialProfit = units * (takeProfitPrice - entryPrice);
                    riskRewardRatio = potentialProfit / riskAmount;
                }
            } 
            // For short positions
            else {
                const riskPerUnit = stopLossPrice - entryPrice;
                units = riskAmount / riskPerUnit;
                positionSize = units * entryPrice;
                
                if (takeProfitPrice > 0) {
                    potentialProfit = units * (entryPrice - takeProfitPrice);
                    riskRewardRatio = potentialProfit / riskAmount;
                }
            }
        }
        
        setResults({
            positionSize,
            riskAmount,
            potentialProfit,
            riskRewardRatio,
            units
        });
    }, [formData, getCurrentPrice]);
    
    // Auto-calculate when form changes
    useEffect(() => {
        calculateResults();
    }, [formData, calculateResults]);
    
    // Pre-fill current price when symbol changes
    useEffect(() => {
        const currentPrice = getCurrentPrice();
        if (currentPrice > 0) {
            setFormData(prev => ({
                ...prev,
                entryPrice: currentPrice.toString()
            }));
        }
    }, [formData.symbol, formData.assetType, getCurrentPrice]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6">Position Sizing Calculator</h2>
                    
                    <div className="space-y-4">
                        {/* Asset Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Asset Type
                            </label>
                            <select
                                name="assetType"
                                value={formData.assetType}
                                onChange={handleAssetTypeChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            >
                                {assetTypes.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Symbol/Ticker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Symbol
                            </label>
                            <select
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            >
                                {getSymbols().map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Account Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Account Size ($)
                            </label>
                            <input
                                type="number"
                                name="accountSize"
                                value={formData.accountSize}
                                onChange={handleInputChange}
                                placeholder="10000"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Risk Percentage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Risk Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="riskPercentage"
                                value={formData.riskPercentage}
                                onChange={handleInputChange}
                                placeholder="1"
                                step="0.1"
                                min="0.1"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Entry Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entry Price ($)
                            </label>
                            <input
                                type="number"
                                name="entryPrice"
                                value={formData.entryPrice}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Stop Loss Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Stop Loss Price ($)
                            </label>
                            <input
                                type="number"
                                name="stopLossPrice"
                                value={formData.stopLossPrice}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Take Profit Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Take Profit Price ($)
                            </label>
                            <input
                                type="number"
                                name="takeProfit"
                                value={formData.takeProfit}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Risk Management Guidelines */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 mt-6">
                    <h3 className="text-lg font-semibold mb-3">Risk Management Guidelines</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>Risk no more than 1-2% of your account on any single trade</li>
                        <li>Aim for a risk-reward ratio of at least 1:2 (preferably 1:3 or higher)</li>
                        <li>Use stop losses for every trade to define your risk</li>
                        <li>Consider reducing position size for correlated assets</li>
                        <li>Adjust position size based on market volatility</li>
                    </ul>
                </div>
            </div>
            
            {/* Results Panel */}
            <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Position Analysis</h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Current Price: ${getCurrentPrice().toFixed(2)}
                        </div>
                    </div>
                    
                    {formData.entryPrice && formData.stopLossPrice && formData.entryPrice !== formData.stopLossPrice ? (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Position Information Card */}
                                <div className="bg-gradient-to-r from-primary-light/20 to-primary-light/5 dark:from-primary-dark/20 dark:to-primary-dark/5 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Recommended Position</h3>
                                    
                                    <div className="flex flex-col md:flex-row justify-between mb-6">
                                        <div className="mb-4 md:mb-0">
                                            <span className="block text-sm text-gray-500 dark:text-gray-400">Position Size</span>
                                            <span className="text-3xl font-bold">${results.positionSize.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="mb-4 md:mb-0">
                                            <span className="block text-sm text-gray-500 dark:text-gray-400">Units</span>
                                            <span className="text-3xl font-bold">{results.units.toFixed(6)}</span>
                                        </div>
                                        
                                        <div>
                                            <span className="block text-sm text-gray-500 dark:text-gray-400">Direction</span>
                                            <span className={`text-xl font-bold ${parseFloat(formData.entryPrice) > parseFloat(formData.stopLossPrice) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {parseFloat(formData.entryPrice) > parseFloat(formData.stopLossPrice) ? 'LONG' : 'SHORT'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Account Size:</span>
                                            <span className="font-medium">${parseFloat(formData.accountSize).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Risk Amount:</span>
                                            <span className="font-medium">${results.riskAmount.toFixed(2)} ({formData.riskPercentage}%)</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Entry Price:</span>
                                            <span className="font-medium">${parseFloat(formData.entryPrice).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Stop Loss:</span>
                                            <span className="font-medium">${parseFloat(formData.stopLossPrice).toFixed(2)}</span>
                                        </div>
                                        {formData.takeProfit && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Take Profit:</span>
                                                <span className="font-medium">${parseFloat(formData.takeProfit).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Risk/Reward Analysis */}
                                {results.riskRewardRatio > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4">Risk/Reward Analysis</h3>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                                <p className="text-sm text-red-600 dark:text-red-400">Potential Loss</p>
                                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">-${results.riskAmount.toFixed(2)}</p>
                                            </div>
                                            
                                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                                <p className="text-sm text-green-600 dark:text-green-400">Potential Profit</p>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+${results.potentialProfit.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Risk/Reward Ratio</p>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                                                <div 
                                                    className={`h-4 rounded-full ${results.riskRewardRatio >= 2 ? 'bg-green-500' : results.riskRewardRatio >= 1 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min(results.riskRewardRatio * 33.3, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span>1:1</span>
                                                <span>2:1</span>
                                                <span>3:1</span>
                                            </div>
                                            <p className="text-center mt-2 font-medium">
                                                1:{results.riskRewardRatio.toFixed(2)} 
                                                <span className={`ml-2 text-xs ${
                                                    results.riskRewardRatio >= 2 ? 'text-green-500' : 
                                                    results.riskRewardRatio >= 1 ? 'text-yellow-500' : 
                                                    'text-red-500'
                                                }`}>
                                                    {results.riskRewardRatio >= 2 ? '(Excellent)' : 
                                                     results.riskRewardRatio >= 1 ? '(Acceptable)' : 
                                                     '(Poor)'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Enter both entry price and stop loss to calculate position size</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">The difference between entry and stop loss defines your risk per unit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PositionSizing; 