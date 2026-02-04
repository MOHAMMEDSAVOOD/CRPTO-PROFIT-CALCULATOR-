import React from 'react';

function TradeJournal() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6">Trade Journal</h2>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">Trade Journal Coming Soon</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Track your trades, analyze performance, and improve your strategy with advanced analytics.
                    </p>
                    
                    <div className="flex flex-col space-y-4 max-w-md mx-auto">
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Auto-import trades via API/broker integration</p>
                        </div>
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Tag trades and attach self-review notes</p>
                        </div>
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Generate key metrics like win-rate, expectancy, and Sharpe ratio</p>
                        </div>
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Visualize performance trends with charts and heatmaps</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TradeJournal; 