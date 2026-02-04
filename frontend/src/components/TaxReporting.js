import React from 'react';

function TaxReporting() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6">Tax & Reporting Module</h2>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">Tax Reporting Coming Soon</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Estimate tax liabilities and generate compliance reports for crypto, forex, and stock trading.
                    </p>
                    
                    <div className="flex flex-col space-y-4 max-w-md mx-auto">
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Automated tax calculations for capital gains/losses</p>
                        </div>
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Support for major tax regimes (US, UK, EU)</p>
                        </div>
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">IRS-ready reports and documentation</p>
                        </div>
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-left text-gray-600 dark:text-gray-300">Exportable CSV/PDF reports for accounting and audits</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaxReporting; 