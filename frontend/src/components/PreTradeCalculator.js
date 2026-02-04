import React, { useState, useEffect, useCallback } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function PreTradeCalculator({ cryptos = [] }) {
    // Form states
    const [formData, setFormData] = useState({
        assetType: 'crypto',
        symbol: 'BTC',
        entryPrice: '',
        exitPrice: '',
        amount: '',
        leverage: 1,
        feeRate: 0.1,
        slippage: 0.05,
        riskPercentage: 2,
        stopLossPrice: '',
    });
    
    // Results states
    const [results, setResults] = useState({
        investmentAmount: 0,
        leveragedAmount: 0,
        potentialProfit: 0,
        potentialLoss: 0,
        fees: 0,
        netProfitLoss: 0,
        roi: 0,
        riskRewardRatio: 0,
        maxLoss: 0,
        recommendedStopLoss: 0,
    });
    
    // Multiple scenarios for comparison
    const [scenarios, setScenarios] = useState([]);
    const [showScenarios, setShowScenarios] = useState(false);
    
    // Chart data for trade visualization
    const [tradeChartData, setTradeChartData] = useState(null);
    const [scenarioChartData, setScenarioChartData] = useState(null);
    
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
                return (cryptos || []).map(crypto => ({
                    value: crypto.symbol || '',
                    label: `${crypto.name || ''} (${crypto.symbol || ''})`,
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
        try {
            const symbols = getSymbols();
            const selectedSymbol = symbols.find(s => s.value === formData.symbol);
            return selectedSymbol?.price || 0;
        } catch (error) {
            console.error("Error getting current price:", error);
            return 0;
        }
    }, [formData.symbol, getSymbols]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Handle asset type change
    const handleAssetTypeChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            assetType: value,
            symbol: getSymbols()[0]?.value || ''
        });
    };
    
    // Create chart for current trade
    const updateTradeChart = useCallback((entry, exit, stopLoss) => {
        // Create price points for visualization
        const range = Math.abs(exit - entry) * 1.5;
        const minPrice = Math.min(entry, exit, stopLoss > 0 ? stopLoss : Infinity) - range * 0.2;
        const maxPrice = Math.max(entry, exit, stopLoss > 0 ? stopLoss : 0) + range * 0.2;
        
        // Generate price points
        const pricePoints = [];
        const numPoints = 100;
        for (let i = 0; i < numPoints; i++) {
            pricePoints.push(minPrice + (maxPrice - minPrice) * (i / (numPoints - 1)));
        }
        
        // Calculate P&L at each price point
        const plPoints = pricePoints.map(price => {
            const units = (parseFloat(formData.amount) * parseFloat(formData.leverage)) / entry;
            const grossPl = units * (price - entry);
            const fees = ((parseFloat(formData.amount) * parseFloat(formData.leverage)) * parseFloat(formData.feeRate)) / 100;
            return grossPl - fees;
        });
        
        // Create chart data
        const data = {
            labels: pricePoints.map(price => price.toFixed(2)),
            datasets: [
                {
                    label: 'Profit/Loss ($)',
                    data: plPoints,
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                }
            ]
        };
        
        // Add entry, exit and stop loss markers
        if (entry && exit) {
            // Add entry price marker
            data.datasets.push({
                label: 'Entry Price',
                data: pricePoints.map(price => price === entry ? 0 : null),
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 1)',
                pointRadius: 5,
                pointStyle: 'rectRot',
                showLine: false
            });
            
            // Add exit price marker
            data.datasets.push({
                label: 'Exit Price',
                data: pricePoints.map(price => price === exit ? 0 : null),
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 1)',
                pointRadius: 5,
                pointStyle: 'rectRot',
                showLine: false
            });
            
            // Add stop loss marker if set
            if (stopLoss > 0) {
                data.datasets.push({
                    label: 'Stop Loss',
                    data: pricePoints.map(price => price === stopLoss ? 0 : null),
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 1)',
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                });
            }
            
            // Add breakeven line
            data.datasets.push({
                label: 'Breakeven',
                data: pricePoints.map(() => 0),
                borderColor: 'rgba(107, 114, 128, 0.5)',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
            });
        }
        
        setTradeChartData(data);
    }, [formData.amount, formData.leverage, formData.feeRate]);
    
    // Calculate results
    const calculateResults = useCallback(() => {
        const entry = parseFloat(formData.entryPrice) || getCurrentPrice();
        const exit = parseFloat(formData.exitPrice) || entry;
        const amount = parseFloat(formData.amount) || 0;
        const leverage = parseFloat(formData.leverage) || 1;
        const feeRate = parseFloat(formData.feeRate) || 0.1;
        const slippage = parseFloat(formData.slippage) || 0.05;
        const riskPercentage = parseFloat(formData.riskPercentage) || 2;
        const stopLoss = parseFloat(formData.stopLossPrice) || 0;
        
        // Calculate base values
        const investmentAmount = amount;
        const leveragedAmount = amount * leverage;
        const units = leveragedAmount / entry;
        
        // Calculate fees
        const entryFee = (leveragedAmount * feeRate) / 100;
        const exitFee = (units * exit * feeRate) / 100;
        const totalFees = entryFee + exitFee;
        
        // Calculate slippage
        const slippageAmount = (units * exit * slippage) / 100;
        
        // Calculate profit/loss
        const grossProfitLoss = units * (exit - entry);
        const netProfitLoss = grossProfitLoss - totalFees - slippageAmount;
        
        // Calculate ROI
        const roi = (netProfitLoss / investmentAmount) * 100;
        
        // Calculate risk-based values
        const maxLoss = (investmentAmount * riskPercentage) / 100;
        
        // Calculate recommended stop loss price
        let recommendedStopLoss = 0;
        if (exit > entry) { // Long position
            recommendedStopLoss = entry - (maxLoss / units / leverage);
        } else { // Short position
            recommendedStopLoss = entry + (maxLoss / units / leverage);
        }
        
        // Calculate risk-to-reward ratio
        let riskRewardRatio = 0;
        if (stopLoss > 0) {
            const potentialReward = Math.abs(exit - entry);
            const potentialRisk = Math.abs(entry - stopLoss);
            riskRewardRatio = potentialRisk > 0 ? potentialReward / potentialRisk : 0;
        }
        
        setResults({
            investmentAmount,
            leveragedAmount,
            potentialProfit: exit > entry ? netProfitLoss : 0,
            potentialLoss: exit < entry ? Math.abs(netProfitLoss) : 0,
            fees: totalFees,
            slippage: slippageAmount,
            netProfitLoss,
            roi,
            units,
            riskRewardRatio,
            maxLoss,
            recommendedStopLoss
        });
        
        // Update chart data for the current trade
        updateTradeChart(entry, exit, stopLoss);
    }, [formData, getCurrentPrice, updateTradeChart]);
    
    // Calculate stop loss price based on risk percentage
    const calculateStopLoss = useCallback(() => {
        const entry = parseFloat(formData.entryPrice) || getCurrentPrice();
        const exit = parseFloat(formData.exitPrice) || entry;
        const amount = parseFloat(formData.amount) || 0;
        const leverage = parseFloat(formData.leverage) || 1;
        const riskPercentage = parseFloat(formData.riskPercentage) || 2;
        
        if (entry > 0 && amount > 0) {
            const maxLoss = (amount * riskPercentage) / 100;
            const units = (amount * leverage) / entry;
            
            // Different calculation for long vs short
            let stopLossPrice;
            if (exit >= entry) { // Long position
                stopLossPrice = entry - (maxLoss / units / leverage);
            } else { // Short position
                stopLossPrice = entry + (maxLoss / units / leverage);
            }
            
            // Update form with calculated stop loss
            setFormData(prev => ({
                ...prev,
                stopLossPrice: stopLossPrice > 0 ? stopLossPrice.toFixed(2) : ''
            }));
        }
    }, [formData.entryPrice, formData.exitPrice, formData.amount, formData.leverage, formData.riskPercentage, getCurrentPrice]);
    
    // Update chart with all scenarios
    const updateScenariosChart = useCallback((updatedScenarios) => {
        if (updatedScenarios.length === 0) return;
        
        const data = {
            labels: updatedScenarios.map(s => s.name),
            datasets: [
                {
                    label: 'Net Profit/Loss ($)',
                    data: updatedScenarios.map(s => s.results.netProfitLoss),
                    backgroundColor: updatedScenarios.map(s => 
                        s.results.netProfitLoss >= 0 
                            ? 'rgba(16, 185, 129, 0.7)' // green for profit
                            : 'rgba(239, 68, 68, 0.7)'  // red for loss
                    ),
                    borderColor: updatedScenarios.map(s => 
                        s.results.netProfitLoss >= 0 
                            ? 'rgba(16, 185, 129, 1)'
                            : 'rgba(239, 68, 68, 1)'
                    ),
                    borderWidth: 1
                },
                {
                    label: 'ROI (%)',
                    data: updatedScenarios.map(s => s.results.roi),
                    backgroundColor: updatedScenarios.map(s => 
                        s.results.roi >= 0 
                            ? 'rgba(99, 102, 241, 0.7)' // indigo for positive ROI
                            : 'rgba(249, 115, 22, 0.7)' // orange for negative ROI
                    ),
                    borderColor: updatedScenarios.map(s => 
                        s.results.roi >= 0 
                            ? 'rgba(99, 102, 241, 1)'
                            : 'rgba(249, 115, 22, 1)'
                    ),
                    borderWidth: 1,
                    hidden: true
                }
            ]
        };
        
        setScenarioChartData(data);
    }, []);
    
    // Add current calculation as a scenario
    const addScenario = useCallback(() => {
        const newScenario = {
            id: scenarios.length + 1,
            name: `Scenario ${scenarios.length + 1}`,
            ...formData,
            results: { ...results }
        };
        
        setScenarios([...scenarios, newScenario]);
        setShowScenarios(true);
        
        // Update scenarios chart
        updateScenariosChart([...scenarios, newScenario]);
    }, [formData, results, scenarios, updateScenariosChart]);
    
    // Clear all scenarios
    const clearScenarios = useCallback(() => {
        setScenarios([]);
        setShowScenarios(false);
        setScenarioChartData(null);
    }, []);
    
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

    // Chart options
    const tradeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.label === 'Profit/Loss ($)') {
                            label += '$' + context.parsed.y.toFixed(2);
                        } else if (context.dataset.label === 'Breakeven') {
                            label = 'Breakeven: $0.00';
                        } else {
                            label += '$' + context.parsed.x;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        }
    };
    
    // Scenario chart options
    const scenarioChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.label === 'Net Profit/Loss ($)') {
                            label += '$' + context.parsed.y.toFixed(2);
                        } else if (context.dataset.label === 'ROI (%)') {
                            label += context.parsed.y.toFixed(2) + '%';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6">Pre-Trade Calculator</h2>
                    
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
                        
                        {/* Exit Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Target Exit Price ($)
                            </label>
                            <input
                                type="number"
                                name="exitPrice"
                                value={formData.exitPrice}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Investment Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Investment Amount ($)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Risk Management Section */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-md font-semibold mb-3">Risk Management</h3>
                            
                            {/* Risk Percentage */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Risk Percentage (%)
                                </label>
                                <input
                                    type="number"
                                    name="riskPercentage"
                                    value={formData.riskPercentage}
                                    onChange={handleInputChange}
                                    min="0.1"
                                    max="100"
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Percentage of investment you're willing to risk
                                </p>
                            </div>
                            
                            {/* Stop Loss Price with Calculate Button */}
                            <div className="flex space-x-2">
                                <div className="flex-grow">
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
                                <div className="flex items-end">
                                    <button
                                        onClick={calculateStopLoss}
                                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded transition-colors"
                                        disabled={!formData.amount || !formData.entryPrice}
                                    >
                                        Calculate
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Leverage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Leverage (x)
                            </label>
                            <input
                                type="number"
                                name="leverage"
                                value={formData.leverage}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Fee Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fee Rate (%)
                            </label>
                            <input
                                type="number"
                                name="feeRate"
                                value={formData.feeRate}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Slippage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Expected Slippage (%)
                            </label>
                            <input
                                type="number"
                                name="slippage"
                                value={formData.slippage}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                onClick={addScenario}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                                disabled={!formData.amount || !formData.entryPrice || !formData.exitPrice}
                            >
                                Save Scenario
                            </button>
                            
                            <button
                                onClick={clearScenarios}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded transition-colors"
                                disabled={scenarios.length === 0}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Results Panel */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Trade Analysis</h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Current Price: ${(getCurrentPrice() || 0).toFixed(2)}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Investment */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Investment</p>
                            <p className="text-2xl font-bold mt-1">${(results?.investmentAmount || 0).toFixed(2)}</p>
                            {results?.leverage > 1 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Leveraged: ${(results?.leveragedAmount || 0).toFixed(2)}
                                </p>
                            )}
                        </div>
                        
                        {/* P&L */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Net P&L</p>
                            <p className={`text-2xl font-bold mt-1 ${(results?.netProfitLoss || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {(results?.netProfitLoss || 0) >= 0 ? '+' : ''}{(results?.netProfitLoss || 0).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                ROI: {(results?.roi || 0).toFixed(2)}%
                            </p>
                        </div>
                        
                        {/* Fees & Slippage */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fees & Slippage</p>
                            <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                                -${((results?.fees || 0) + (results?.slippage || 0)).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Fees: ${(results?.fees || 0).toFixed(2)} | Slippage: ${(results?.slippage || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    
                    {/* Risk Analysis Section */}
                    <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Risk Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Max Risk Amount</p>
                                <p className="font-semibold text-red-600 dark:text-red-400">
                                    ${(results?.maxLoss || 0).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formData.riskPercentage || 0}% of investment
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Risk/Reward Ratio</p>
                                <p className="font-semibold">
                                    {(results?.riskRewardRatio || 0) > 0 ? `1:${(results?.riskRewardRatio || 0).toFixed(2)}` : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {(results?.riskRewardRatio || 0) >= 1 ? 'Favorable' : (results?.riskRewardRatio || 0) > 0 ? 'Unfavorable' : 'Set stop loss'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recommended Stop Loss</p>
                                <p className="font-semibold">
                                    ${(results?.recommendedStopLoss || 0) > 0 ? (results?.recommendedStopLoss || 0).toFixed(2) : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Based on risk %
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Trade Details */}
                    <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Trade Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Entry Price</p>
                                <p className="font-semibold">${(parseFloat(formData.entryPrice) || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Exit Price</p>
                                <p className="font-semibold">${(parseFloat(formData.exitPrice) || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Units</p>
                                <p className="font-semibold">{(results?.units || 0).toFixed(6)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Direction</p>
                                <p className={`font-semibold ${(parseFloat(formData.exitPrice) || 0) > (parseFloat(formData.entryPrice) || 0) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {(parseFloat(formData.exitPrice) || 0) > (parseFloat(formData.entryPrice) || 0) ? 'Long' : 'Short'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Trade Visualization Chart */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3">P&L Visualization</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-64">
                            {tradeChartData ? (
                                <Line data={tradeChartData} options={tradeChartOptions} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Enter trade details to see P&L visualization
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Scenarios Comparison */}
                {showScenarios && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Scenarios Comparison</h2>
                        
                        {/* Scenarios Chart */}
                        <div className="mb-6 h-64">
                            {scenarioChartData ? (
                                <Line data={scenarioChartData} options={scenarioChartOptions} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No scenarios to display
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scenario</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry/Exit</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Investment</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net P&L</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ROI</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">R/R Ratio</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {scenarios.map((scenario) => (
                                        <tr key={scenario.id}>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {scenario.name || ''}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {scenario.symbol || ''}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ${scenario.entryPrice || 0} → ${scenario.exitPrice || 0}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                ${(parseFloat(scenario.amount) || 0).toFixed(2)}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                                                <span className={(scenario.results?.netProfitLoss || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                    {(scenario.results?.netProfitLoss || 0) >= 0 ? '+' : ''}${(scenario.results?.netProfitLoss || 0).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                                                <span className={(scenario.results?.roi || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                    {(scenario.results?.roi || 0) >= 0 ? '+' : ''}{(scenario.results?.roi || 0).toFixed(2)}%
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                                                {(scenario.results?.riskRewardRatio || 0) > 0 ? `1:${(scenario.results?.riskRewardRatio || 0).toFixed(2)}` : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreTradeCalculator; 