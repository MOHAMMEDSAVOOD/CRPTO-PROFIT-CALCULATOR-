import React, { useEffect, useState } from 'react';
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
  defaults
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register all required components
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

// Set default styles for better appearance
defaults.font.family = "'Inter', 'Helvetica', 'Arial', sans-serif";
defaults.color = '#6B7280';

function Chart({ cryptos }) {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [timeframe, setTimeframe] = useState('24h');
  const [selectedCryptos, setSelectedCryptos] = useState(['BTC', 'ETH', 'USDT', 'BNB']);

  // Extract and format data for the chart
  useEffect(() => {
    if (!cryptos || cryptos.length === 0) return;

    // Filter cryptocurrencies by selected ones and sort by market cap
    const filtered = cryptos
      .filter(crypto => selectedCryptos.includes(crypto.symbol))
      .sort((a, b) => (b.quote?.USD?.market_cap || 0) - (a.quote?.USD?.market_cap || 0));

    // Get data based on selected timeframe
    const getChangeByTimeframe = (crypto) => {
      if (!crypto.quote?.USD) return 0;
      
      switch (timeframe) {
        case '1h': return crypto.quote.USD.percent_change_1h || 0;
        case '24h': return crypto.quote.USD.percent_change_24h || 0;
        case '7d': return crypto.quote.USD.percent_change_7d || 0;
        case '30d': return crypto.quote.USD.percent_change_30d || 0;
        default: return crypto.quote.USD.percent_change_24h || 0;
      }
    };

    // Use either price or percent change based on chart type
    const getValue = (crypto) => {
      if (chartType === 'price') {
        return crypto.quote?.USD?.price || 0;
      } else {
        return getChangeByTimeframe(crypto);
      }
    };

    // Generate random colors for each crypto
    const getRandomColor = (index) => {
      const colors = [
        'rgba(59, 130, 246, 0.7)', // blue
        'rgba(99, 102, 241, 0.7)', // indigo
        'rgba(168, 85, 247, 0.7)', // purple
        'rgba(236, 72, 153, 0.7)', // pink
        'rgba(239, 68, 68, 0.7)', // red
        'rgba(249, 115, 22, 0.7)', // orange
        'rgba(16, 185, 129, 0.7)', // green
        'rgba(20, 184, 166, 0.7)', // teal
      ];
      
      return colors[index % colors.length];
    };

    // Format chart data
    const data = {
      labels: filtered.map(crypto => crypto.symbol),
      datasets: [{
        label: chartType === 'price' ? 'Price (USD)' : `% Change (${timeframe})`,
        data: filtered.map(crypto => getValue(crypto)),
        backgroundColor: filtered.map((_, i) => getRandomColor(i)),
        borderColor: filtered.map((_, i) => getRandomColor(i).replace('0.7', '1')),
        borderWidth: 2,
        fill: chartType === 'line',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    };

    setChartData(data);
  }, [cryptos, chartType, timeframe, selectedCryptos]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (chartType === 'price') {
              label += `$${context.parsed.y.toFixed(2)}`;
            } else {
              label += `${context.parsed.y.toFixed(2)}%`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: chartType !== 'price',
        ticks: {
          callback: function(value) {
            return chartType === 'price' ? `$${value}` : `${value}%`;
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Handle crypto selection
  const toggleCrypto = (symbol) => {
    if (selectedCryptos.includes(symbol)) {
      // Remove if already selected
      if (selectedCryptos.length > 1) { // Keep at least one selected
        setSelectedCryptos(selectedCryptos.filter(s => s !== symbol));
      }
    } else {
      // Add if not already selected (limit to 5)
      if (selectedCryptos.length < 5) {
        setSelectedCryptos([...selectedCryptos, symbol]);
      }
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0 text-gray-800 dark:text-white">Cryptocurrency Charts</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Chart type toggle */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 inline-flex">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${chartType === 'line' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${chartType === 'bar' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${chartType === 'price' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              onClick={() => setChartType('price')}
            >
              Price
            </button>
          </div>
          
          {/* Timeframe selection */}
          {chartType !== 'price' && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 inline-flex">
              {['1h', '24h', '7d', '30d'].map(tf => (
                <button
                  key={tf}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeframe === tf 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Crypto selection chips */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Select cryptocurrencies (max 5):</p>
        <div className="flex flex-wrap gap-2">
          {cryptos && cryptos.slice(0, 10).map(crypto => (
            <button
              key={crypto.symbol}
              onClick={() => toggleCrypto(crypto.symbol)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                selectedCryptos.includes(crypto.symbol)
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-2 border-indigo-500'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {crypto.symbol}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-100 dark:border-gray-700">
        <div className="h-80">
          {chartData ? (
            chartType === 'bar' ? (
              <Bar data={chartData} options={options} />
            ) : (
              <Line data={chartData} options={options} />
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Loading chart data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chart; 