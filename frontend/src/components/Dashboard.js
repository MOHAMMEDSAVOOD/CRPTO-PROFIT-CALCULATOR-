import React from 'react';

function Dashboard({ cryptos }) {
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

    // Get top 5 cryptos for the market overview section
    const topCryptos = cryptos.slice(0, 5);

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Your Trading Dashboard</h2>
                
                {/* Market Overview Card */}
                <div className="bg-gradient-to-r from-primary-light/90 to-primary-light dark:from-primary-dark/90 dark:to-primary-dark rounded-xl shadow-lg p-6 mb-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Market Snapshot</h3>
                            <p className="text-white/80 mb-4">Top cryptocurrencies by market cap</p>
                        </div>
                        <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                            View All
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-2 px-1 text-sm font-medium">Asset</th>
                                    <th className="text-right py-2 px-1 text-sm font-medium">Price</th>
                                    <th className="text-right py-2 px-1 text-sm font-medium">24h Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCryptos.map((crypto) => (
                                    <tr key={crypto.symbol} className="border-b border-white/10 last:border-0">
                                        <td className="py-2 px-1 text-sm">
                                            <div className="flex items-center">
                                                <span className="font-medium">{crypto.symbol}</span>
                                                <span className="ml-2 text-white/70 text-xs">{crypto.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-2 px-1 text-sm">${crypto.quote?.USD?.price.toFixed(2)}</td>
                                        <td className={`text-right py-2 px-1 text-sm ${crypto.quote?.USD?.percent_change_24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                            {crypto.quote?.USD?.percent_change_24h >= 0 ? '+' : ''}{crypto.quote?.USD?.percent_change_24h?.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div 
                            key={module.id} 
                            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className={`p-6 cursor-pointer`}>
                                <div className="flex items-start">
                                    <div className={`p-3 rounded-full mr-4 ${module.color}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={module.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{module.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{module.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Recent Activity Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Platform Benefits</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-1 rounded-full">
                                <svg className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-800 dark:text-white font-medium">Unified Trading Analysis</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Centralized calculations across crypto, forex, and stocks</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-1 rounded-full">
                                <svg className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-800 dark:text-white font-medium">Comprehensive P&L Tracking</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Model potential trades and analyze executed positions</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-1 rounded-full">
                                <svg className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-800 dark:text-white font-medium">Risk Management Tools</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Optimize position sizing and manage trading risk effectively</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-1 rounded-full">
                                <svg className="h-5 w-5 text-green-700 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-gray-800 dark:text-white font-medium">Advanced Record-Keeping</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Automated trade journaling with performance analytics</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 