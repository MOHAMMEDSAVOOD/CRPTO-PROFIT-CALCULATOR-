# Trading Calculator Pro

A comprehensive trading analysis platform for cryptocurrency, forex, and stock trading, providing pre-trade and post-trade profit calculations, position sizing, risk management, and more.

## Project Structure

The project is organized into two main parts:

- `backend/`: Node.js/Express backend that fetches crypto data from CoinMarketCap API and other financial data sources
- `frontend/`: React frontend with TailwindCSS for a modern, responsive UI

## Prerequisites

- Node.js and npm installed
- A CoinMarketCap API key (get one at https://coinmarketcap.com/api/)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your environment variables:
   - The `.env` file should already be set up with your CoinMarketCap API key
   - If not, make sure to update the `COINMARKETCAP_API_KEY` value in the `.env` file

4. Start the backend server:
   ```
   npm start
   ```
   The server will run on port 5000 by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Core Features

### 1. Pre-Trade Profit Calculator
- **Entry/Exit Modeling**: Input entry price, target exit, position size, and leverage to compute potential P&L and ROI
- **Fee & Spread Adjustments**: Factor in exchange/broker fees and bid-ask spreads for precise estimates
- **What-If Scenarios**: Simulate multiple stop-loss and partial-exit scenarios side-by-side

### 2. Post-Trade P&L Calculator
- **Actual P&L & ROI**: Auto-reconcile executed fills to calculate realized profit/loss, percentage return, and slippage effects
- **Fee & Tax Breakdown**: Itemize transaction fees, funding costs, and approximate tax liabilities across asset classes
- **Performance Heatmaps**: Visualize trade outcomes over time with heatmaps and distribution charts

### 3. Position Sizing & Risk Management
- **Position Sizing Calculator**: Determine lot size based on account equity, risk percentage, and stop-loss distance
- **Stop-Loss & Take-Profit Tools**: Compute exact price levels to maintain desired risk/reward ratios
- **Value-at-Risk (VaR)**: Estimate potential portfolio drawdowns under different market scenarios

### 4. Real-Time Alerts & Notifications
- **Custom Price & Indicator Alerts**: Set alerts on price levels, technical crossovers, volume spikes, and news events
- **Multi-Channel Delivery**: Receive notifications via email, SMS, mobile push, and webhooks
- **Alert Management**: Group, prioritize, and throttle alerts to prevent fatigue

### 5. Automated Trade Journaling & Analytics
- **Trade Logging**: Auto-import trades via API/broker integration or manual entry with rich metadata (strategy, notes)
- **Post-Trade Review**: Tag trades ("Good," "Bad," "Learned") and attach self-review notes for continuous improvement
- **Advanced Analytics**: Generate key metrics (win-rate, expectancy, Sharpe ratio) and visualize performance trends

### 6. Tax & Reporting Module
- **Automated Tax Estimation**: Integrate with crypto and brokerage tax APIs to compute capital gains/losses and produce tax-ready reports
- **Country-Specific Calculators**: Support major tax regimes (US, UK, EU) with configurable parameters
- **Exportable Reports**: Download CSV/PDF reports for accounting, audits, or compliance

### 7. Integration & Extensibility
- **API Access**: Expose REST/WebSocket endpoints for data ingestion and broker integrations
- **Modular Architecture**: Enable plugin modules (options P&L, futures analytics, margin calculators)
- **Cross-Platform Sync**: Seamlessly sync user data across web, PWA/mobile, and desktop clients

## Additional Features

- **Market Overview**: View a comprehensive list of top cryptocurrencies with price, market cap, and 24h change data
- **Cryptocurrency Converter**: Convert between different cryptocurrencies using real-time exchange rates
- **Price Chart**: Visual representation of cryptocurrency prices
- **Dark Mode**: Toggle between light and dark themes for better visibility in different environments
- **Trending Cryptos**: View the top trending cryptocurrencies based on 24h change
- **AI Chatbot Assistant**: Get help with using the app and answers to cryptocurrency-related questions

## Technologies Used

- **Frontend**: React, TailwindCSS, Chart.js, Axios
- **Backend**: Node.js, Express, Axios
- **API**: CoinMarketCap API and other financial data providers
- **State Management**: React Hooks for local state management
- **Styling**: Tailwind CSS with dark mode support
- **Chatbot**: Custom AI implementation with natural language processing

## API Endpoints

- `GET /api/crypto/price`: Get real-time price data for top 100 cryptocurrencies
- `GET /api/crypto/trending`: Get top 10 trending cryptocurrencies
- `GET /api/crypto/details/:symbol`: Get detailed information for a specific cryptocurrency
- `GET /api/crypto/metadata/:symbol`: Get metadata including logo and description for a cryptocurrency
- `POST /api/crypto/calculate`: Calculate profit/loss based on input values
- `POST /api/trade/journal`: Store trade journal entries
- `GET /api/trade/journal`: Retrieve trade journal history
- `POST /api/alerts/create`: Create new price or indicator alerts
- `GET /api/tax/estimate`: Get tax liability estimates based on trade history

## Note

This application requires a valid CoinMarketCap API key to function properly. If you don't have one, the application will display an error message. 