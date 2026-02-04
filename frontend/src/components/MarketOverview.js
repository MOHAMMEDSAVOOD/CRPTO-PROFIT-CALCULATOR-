import React, { useState } from 'react';

function MarketOverview({ cryptos }) {
    const [sortBy, setSortBy] = useState('market_cap');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    
    const getSortedCryptos = () => {
        if (!cryptos || cryptos.length === 0) return [];
        
        // Filter by search term
        let filtered = cryptos;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = cryptos.filter(crypto => 
                crypto.name.toLowerCase().includes(term) || 
                crypto.symbol.toLowerCase().includes(term)
            );
        }
        
        // Sort by selected field
        const sorted = [...filtered].sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'name':
                    valueA = a.name;
                    valueB = b.name;
                    return sortDirection === 'asc' 
                        ? valueA.localeCompare(valueB) 
                        : valueB.localeCompare(valueA);
                    
                case 'price':
                    valueA = a.quote?.USD?.price || 0;
                    valueB = b.quote?.USD?.price || 0;
                    break;
                    
                case 'change_24h':
                    valueA = a.quote?.USD?.percent_change_24h || 0;
                    valueB = b.quote?.USD?.percent_change_24h || 0;
                    break;
                    
                case 'volume_24h':
                    valueA = a.quote?.USD?.volume_24h || 0;
                    valueB = b.quote?.USD?.volume_24h || 0;
                    break;
                    
                case 'market_cap':
                default:
                    valueA = a.quote?.USD?.market_cap || 0;
                    valueB = b.quote?.USD?.market_cap || 0;
                    break;
            }
            
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        });
        
        return sorted;
    };
    
    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc');
        }
    };
    
    const getSortIcon = (field) => {
        if (sortBy !== field) return null;
        
        return (
            <span className="ml-1">
                {sortDirection === 'asc' ? '▲' : '▼'}
            </span>
        );
    };
    
    const formatPrice = (price) => {
        if (price === undefined || price === null) return '-';
        
        if (price < 0.01) {
            return `$${price.toFixed(6)}`;
        } else if (price < 1) {
            return `$${price.toFixed(4)}`;
        } else if (price < 1000) {
            return `$${price.toFixed(2)}`;
        } else {
            return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };
    
    const formatMarketCap = (marketCap) => {
        if (marketCap === undefined || marketCap === null) return '-';
        
        if (marketCap >= 1e9) {
            return `$${(marketCap / 1e9).toFixed(2)}B`;
        } else if (marketCap >= 1e6) {
            return `$${(marketCap / 1e6).toFixed(2)}M`;
        } else {
            return `$${marketCap.toLocaleString('en-US')}`;
        }
    };
    
    const formatPercentChange = (change) => {
        if (change === undefined || change === null) return '-';
        
        const isPositive = change >= 0;
        const className = isPositive ? 'text-green-500' : 'text-red-500';
        
        return (
            <span className={className}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
            </span>
        );
    };
    
    const sortedCryptos = getSortedCryptos();
    
    return (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Market Overview</h2>
            
            <div className="mb-4">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Search cryptocurrency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('name')}>
                                Name {getSortIcon('name')}
                            </th>
                            <th className="px-4 py-2 text-right cursor-pointer" onClick={() => handleSort('price')}>
                                Price {getSortIcon('price')}
                            </th>
                            <th className="px-4 py-2 text-right cursor-pointer" onClick={() => handleSort('change_24h')}>
                                24h Change {getSortIcon('change_24h')}
                            </th>
                            <th className="px-4 py-2 text-right cursor-pointer" onClick={() => handleSort('market_cap')}>
                                Market Cap {getSortIcon('market_cap')}
                            </th>
                            <th className="px-4 py-2 text-right cursor-pointer" onClick={() => handleSort('volume_24h')}>
                                Volume (24h) {getSortIcon('volume_24h')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCryptos.length > 0 ? (
                            sortedCryptos.map((crypto) => (
                                <tr key={crypto.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <span className="font-medium">{crypto.name}</span>
                                            <span className="ml-2 text-gray-500 text-xs">{crypto.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {formatPrice(crypto.quote?.USD?.price)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {formatPercentChange(crypto.quote?.USD?.percent_change_24h)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {formatMarketCap(crypto.quote?.USD?.market_cap)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {formatMarketCap(crypto.quote?.USD?.volume_24h)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                                    {searchTerm ? 'No cryptocurrencies found matching your search.' : 'No cryptocurrency data available.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MarketOverview; 