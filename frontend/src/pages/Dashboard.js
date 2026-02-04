import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import '../../styles/dashboard.css';

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

function Dashboard({ cryptos = [] }) {
    const [marketStats, setMarketStats] = useState({
        totalMarketCap: 0,
        volume24h: 0,
        btcDominance: 0,
        activeCoins: 0
    });
    
    const [chartData, setChartData] = useState(null);
    
    // Calculate market statistics
    useEffect(() => {
        if (cryptos.length > 0) {
            const totalMarketCap = cryptos.reduce((sum, crypto) => sum + (crypto.quote?.USD?.market_cap || 0), 0);
            const volume24h = cryptos.reduce((sum, crypto) => sum + (crypto.quote?.USD?.volume_24h || 0), 0);
            const btcMarketCap = cryptos.find(crypto => crypto.symbol === 'BTC')?.quote?.USD?.market_cap || 0;
            const btcDominance = (btcMarketCap / totalMarketCap) * 100;
            
            setMarketStats({
                totalMarketCap,
                volume24h,
                btcDominance,
                activeCoins: cryptos.length
            });
            
            // Create chart data
            const top5Cryptos = cryptos.slice(0, 5);
            setChartData({
                labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d', 'Now'],
                datasets: top5Cryptos.map((crypto, index) => {
                    // Generate some random data for the chart
                    const data = Array.from({ length: 8 }, () => {
                        const currentPrice = crypto.quote?.USD?.price || 100;
                        const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
                        return currentPrice * randomFactor;
                    });
                    
                    // Last point should be the current price
                    data[data.length - 1] = crypto.quote?.USD?.price || 100;
                    
                    // Colors for each crypto
                    const colors = [
                        { border: 'rgba(99, 102, 241, 1)', background: 'rgba(99, 102, 241, 0.1)' },
                        { border: 'rgba(16, 185, 129, 1)', background: 'rgba(16, 185, 129, 0.1)' },
                        { border: 'rgba(245, 158, 11, 1)', background: 'rgba(245, 158, 11, 0.1)' },
                        { border: 'rgba(236, 72, 153, 1)', background: 'rgba(236, 72, 153, 0.1)' },
                        { border: 'rgba(139, 92, 246, 1)', background: 'rgba(139, 92, 246, 0.1)' }
                    ];
                    
                    return {
                        label: crypto.symbol,
                        data: data,
                        borderColor: colors[index % colors.length].border,
                        backgroundColor: colors[index % colors.length].background,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        borderWidth: 2
                    };
                })
            });
        }
    }, [cryptos]);
    
    // Feature modules data
    const modules = [
        {
            id: 'pretrade',
            title: 'Pre-Trade Calculator',
            description: 'Model entry/exit scenarios, calculate potential P&L with fee adjustments',
            icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
            color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
        },
        {
            id: 'posttrade',
            title: 'Post-Trade P&L',
            description: 'Calculate realized profit/loss with fee breakdowns and performance metrics',
            icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
            color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
        },
        {
            id: 'position',
            title: 'Position Sizing',
            description: 'Set optimal lot sizes based on risk parameters and stop-loss distances',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
        },
        {
            id: 'alerts',
            title: 'Real-Time Alerts',
            description: 'Set price and indicator alerts with multi-channel notifications',
            icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
            color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
        },
        {
            id: 'journal',
            title: 'Trade Journal',
            description: 'Track trades and analyze performance with advanced metrics',
            icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
            color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
        },
        {
            id: 'tax',
            title: 'Tax Reporting',
            description: 'Estimate tax liabilities and generate compliant reports',
            icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z',
            color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
        }
    ];
    
    // Platform benefits
    const benefits = [
        {
            title: 'Unified Trading Analysis',
            description: 'Centralized calculations across crypto, forex, and stocks'
        },
        {
            title: 'Comprehensive P&L Tracking',
            description: 'Model potential trades and analyze executed positions'
        },
        {
            title: 'Risk Management Tools',
            description: 'Optimize position sizing and manage trading risk effectively'
        },
        {
            title: 'Advanced Record-Keeping',
            description: 'Automated trade journaling with performance analytics'
        }
    ];
    
    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    font: {
                        size: 10
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toFixed(0);
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Get top 5 cryptos for the market overview section
    const topCryptos = cryptos.slice(0, 5);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Your Trading Dashboard</h2>
                <p className="dashboard-subtitle">Get insights into market trends and your trading performance</p>
            </div>
            
            {/* Market Stats Section */}
            <div className="stats-section">
                <div className="stat-card">
                    <p className="stat-label">Total Market Cap</p>
                    <p className="stat-value text-indigo-600 dark:text-indigo-400">${(marketStats.totalMarketCap / 1e9).toFixed(2)}B</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">24h Volume</p>
                    <p className="stat-value text-green-600 dark:text-green-400">${(marketStats.volume24h / 1e9).toFixed(2)}B</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">BTC Dominance</p>
                    <p className="stat-value text-amber-600 dark:text-amber-400">{marketStats.btcDominance.toFixed(2)}%</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Active Coins</p>
                    <p className="stat-value text-purple-600 dark:text-purple-400">{marketStats.activeCoins}</p>
                </div>
            </div>
            
            {/* Market Chart */}
            <div className="chart-section">
                <div className="chart-container">
                    <h3 className="text-lg font-semibold mb-4">Price Trends</h3>
                    {chartData ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Market Overview Card */}
            <div className="market-snapshot">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="market-snapshot-title">Market Snapshot</h3>
                        <p className="text-white/80 mb-4">Top cryptocurrencies by market cap</p>
                    </div>
                    <Link to="/market" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                        View All
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-2 px-1 text-sm font-medium">Asset</th>
                                <th className="text-right py-2 px-1 text-sm font-medium">Price</th>
                                <th className="text-right py-2 px-1 text-sm font-medium">24h Change</th>
                                <th className="text-right py-2 px-1 text-sm font-medium">Market Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCryptos.map((crypto) => (
                                <tr key={crypto.symbol} className="market-data-row">
                                    <td className="py-3 px-1 text-sm">
                                        <div className="flex items-center">
                                            <span className="font-medium">{crypto.symbol}</span>
                                            <span className="ml-2 text-white/70 text-xs">{crypto.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-right py-3 px-1 text-sm">${(crypto.quote?.USD?.price || 0).toFixed(2)}</td>
                                    <td className={`text-right py-3 px-1 text-sm ${(crypto.quote?.USD?.percent_change_24h || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {(crypto.quote?.USD?.percent_change_24h || 0) >= 0 ? '+' : ''}{(crypto.quote?.USD?.percent_change_24h || 0).toFixed(2)}%
                                    </td>
                                    <td className="text-right py-3 px-1 text-sm">
                                        ${((crypto.quote?.USD?.market_cap || 0) / 1e9).toFixed(2)}B
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Features Grid */}
            <h3 className="text-xl font-bold mb-4 mt-8">Trading Tools</h3>
            <div className="feature-grid">
                {modules.map((module) => (
                    <Link
                        key={module.id}
                        to={`/${module.id}`}
                        className="feature-card p-6 cursor-pointer"
                    >
                        <div className="flex items-start">
                            <div className={`feature-icon ${module.color}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={module.icon} />
                                </svg>
                            </div>
                            <div>
                                <h3 className="feature-title">{module.title}</h3>
                                <p className="feature-description">{module.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* Benefits Section */}
            <div className="benefits-section">
                <h2 className="benefits-title">Platform Benefits</h2>
                <div className="benefits-card">
                    <ul className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="benefit-item">
                                <div className="benefit-icon">
                                    <svg className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="benefit-content">
                                    <p className="benefit-title">{benefit.title}</p>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 