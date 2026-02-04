import React, { useState, useEffect } from 'react';

const Alerts = ({ cryptos }) => {
    const [alerts, setAlerts] = useState(() => {
        const savedAlerts = localStorage.getItem('cryptoAlerts');
        return savedAlerts ? JSON.parse(savedAlerts) : [];
    });
    
    const [newAlert, setNewAlert] = useState({
        crypto: '',
        price: '',
        condition: 'above', // 'above' or 'below'
    });
    
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        // Save alerts to localStorage when they change
        localStorage.setItem('cryptoAlerts', JSON.stringify(alerts));
        
        // Check for triggered alerts
        if (cryptos && cryptos.length > 0 && alerts.length > 0) {
            alerts.forEach(alert => {
                const crypto = cryptos.find(c => c.symbol === alert.crypto);
                if (crypto && crypto.quote && crypto.quote.USD) {
                    const currentPrice = crypto.quote.USD.price;
                    if (
                        (alert.condition === 'above' && currentPrice >= alert.price) ||
                        (alert.condition === 'below' && currentPrice <= alert.price)
                    ) {
                        // Create notification
                        showNotification(
                            `${alert.crypto} is now ${alert.condition} $${alert.price}! Current price: $${currentPrice.toFixed(2)}`
                        );
                    }
                }
            });
        }
    }, [alerts, cryptos]);
    
    const showNotification = (text) => {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }
        
        // Check notification permission
        if (Notification.permission === "granted") {
            new Notification("Crypto Alert", { body: text });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Crypto Alert", { body: text });
                }
            });
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!newAlert.crypto || !newAlert.price) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            return;
        }
        
        const price = parseFloat(newAlert.price);
        if (isNaN(price) || price <= 0) {
            setMessage('Please enter a valid price');
            setMessageType('error');
            return;
        }
        
        // Add new alert
        setAlerts([...alerts, {...newAlert, price, id: Date.now()}]);
        
        // Reset form
        setNewAlert({
            crypto: '',
            price: '',
            condition: 'above',
        });
        
        setMessage('Alert added successfully');
        setMessageType('success');
        
        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };
    
    const removeAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
        setMessage('Alert removed');
        setMessageType('success');
        
        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    return (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Price Alerts</h2>
            
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Cryptocurrency</label>
                        <select 
                            className="w-full p-2 border rounded"
                            value={newAlert.crypto}
                            onChange={(e) => setNewAlert({...newAlert, crypto: e.target.value})}
                        >
                            <option value="">Select a cryptocurrency</option>
                            {cryptos && cryptos.map(crypto => (
                                <option key={crypto.id} value={crypto.symbol}>
                                    {crypto.name} ({crypto.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        <select 
                            className="w-full p-2 border rounded"
                            value={newAlert.condition}
                            onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                        >
                            <option value="above">Price goes above</option>
                            <option value="below">Price goes below</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Price ($)</label>
                        <input 
                            type="number" 
                            className="w-full p-2 border rounded"
                            value={newAlert.price}
                            onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                            placeholder="Enter price"
                            step="0.01"
                            min="0"
                        />
                    </div>
                </div>
                
                {message && (
                    <div className={`mt-4 p-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}
                
                <button 
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Alert
                </button>
            </form>
            
            <div>
                <h3 className="font-semibold text-lg mb-2">Active Alerts</h3>
                {alerts.length === 0 ? (
                    <p className="text-gray-500">No active alerts</p>
                ) : (
                    <div className="space-y-2">
                        {alerts.map(alert => {
                            const crypto = cryptos && cryptos.find(c => c.symbol === alert.crypto);
                            const currentPrice = crypto && crypto.quote?.USD?.price;
                            
                            return (
                                <div key={alert.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <span className="font-medium">{alert.crypto}</span>
                                        <span className="text-gray-600"> {alert.condition} </span>
                                        <span className="font-medium">${alert.price}</span>
                                        {currentPrice && (
                                            <span className="text-gray-600 text-sm ml-2">
                                                (Current: ${currentPrice.toFixed(2)})
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeAlert(alert.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts; 