const express = require('express');
const axios = require('axios');
const router = express.Router();

// CoinMarketCap API Key from environment variables
const API_KEY = process.env.COINMARKETCAP_API_KEY;

// Get real-time price data
router.get('/price', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                limit: 100, // Get top 100 cryptocurrencies
                convert: 'USD'
            }
        });
        
        if (response.data && response.data.data) {
            res.json({ success: true, data: response.data.data });
        } else {
            res.status(500).json({ success: false, message: 'Invalid data format from API' });
        }
    } catch (error) {
        console.error('Error fetching crypto prices:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching data',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Get trending cryptocurrencies (highest 24h percent change)
router.get('/trending', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                limit: 100,
                convert: 'USD',
                sort: 'percent_change_24h',
                sort_dir: 'desc'
            }
        });
        
        if (response.data && response.data.data) {
            // Get top 10 trending by 24h percent change
            const trendingCoins = response.data.data.slice(0, 10);
            res.json({ success: true, data: trendingCoins });
        } else {
            res.status(500).json({ success: false, message: 'Invalid data format from API' });
        }
    } catch (error) {
        console.error('Error fetching trending cryptos:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching trending data',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Get specific cryptocurrency details
router.get('/details/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                symbol: symbol.toUpperCase(),
                convert: 'USD'
            }
        });
        
        if (response.data && response.data.data && response.data.data[symbol.toUpperCase()]) {
            res.json({ 
                success: true, 
                data: response.data.data[symbol.toUpperCase()] 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: `Cryptocurrency ${symbol} not found` 
            });
        }
    } catch (error) {
        console.error(`Error fetching details for ${req.params.symbol}:`, error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching cryptocurrency details',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Get cryptocurrency metadata (logo, description, etc.)
router.get('/metadata/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/info', {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                symbol: symbol.toUpperCase()
            }
        });
        
        if (response.data && response.data.data && response.data.data[symbol.toUpperCase()]) {
            res.json({ 
                success: true, 
                data: response.data.data[symbol.toUpperCase()] 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: `Metadata for ${symbol} not found` 
            });
        }
    } catch (error) {
        console.error(`Error fetching metadata for ${req.params.symbol}:`, error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching cryptocurrency metadata',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Calculate profit/loss
router.post('/calculate', (req, res) => {
    try {
        const { buyPrice, sellPrice, amount } = req.body;
        
        if (!buyPrice || !sellPrice || !amount) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required parameters'
            });
        }
        
        const investment = parseFloat(buyPrice) * parseFloat(amount);
        const currentValue = parseFloat(sellPrice) * parseFloat(amount);
        const profitLoss = currentValue - investment;
        const profitLossPercentage = (profitLoss / investment) * 100;
        
        res.json({
            success: true,
            data: {
                investment,
                currentValue,
                profitLoss,
                profitLossPercentage,
                isProfit: profitLoss >= 0
            }
        });
    } catch (error) {
        console.error('Error calculating profit/loss:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error calculating profit/loss',
            error: error.message
        });
    }
});

module.exports = router;
