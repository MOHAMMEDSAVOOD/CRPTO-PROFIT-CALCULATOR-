import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Chart from './components/Chart';
import Alerts from './components/Alerts';
import CryptoConverter from './components/CryptoConverter';
import MarketOverview from './components/MarketOverview';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import ChatBot from './components/ChatBot';
import PreTradeCalculator from './components/PreTradeCalculator';
import PostTradeCalculator from './components/PostTradeCalculator';
import PositionSizing from './components/PositionSizing';
import TradeJournal from './components/TradeJournal';
import TaxReporting from './components/TaxReporting';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './components/Auth/Profile';
import Pricing from './components/Pricing';
import { AuthContextProvider, useAuth } from './components/Auth/AuthContextProvider';

// Import styles
import './styles/main.css';
import './styles/dashboard.css';
import './styles/navigation.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light dark:border-primary-dark"></div>
        </div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(() => {
        // Check if user has previously set a preference
        const savedMode = localStorage.getItem('darkMode');
        // Or check system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedMode ? savedMode === 'true' : prefersDark;
    });

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await axios.get('/api/crypto/price');
                
                if (response.data && response.data.success && response.data.data) {
                    setCryptos(response.data.data);
                } else {
                    setError('Failed to fetch cryptocurrency data');
                }
            } catch (error) {
                console.error('Error fetching crypto data:', error);
                setError('Failed to connect to the API. Please check if the backend server is running.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        
        // Refresh data every 5 minutes
        const intervalId = setInterval(fetchData, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        logout();
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light dark:border-primary-dark"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-background-light dark:bg-background-dark transition-colors ${darkMode ? 'dark' : ''}`}>
            <div className="container mx-auto px-4 py-4">
                <header className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-primary-light dark:text-primary-dark">
                            <span className="flex items-center">
                                <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                                </svg>
                                Trading Calculator Pro
                            </span>
                        </h1>
                        
                        {isAuthenticated && (
                            <>
                                <a 
                                    href="/profile"
                                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    {user?.fullName || 'My Profile'}
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <a 
                                    href="/login"
                                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    Login
                                </a>
                                <a 
                                    href="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                                >
                                    Sign Up
                                </a>
                            </>
                        )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-center">Complete analysis suite for crypto, forex, and stock trading</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light dark:border-primary-dark"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <p className="mt-2">
                            Make sure your backend server is running and the API key is properly configured.
                        </p>
                    </div>
                ) : (
                    <div>
                        <Navigation isAuthenticated={isAuthenticated} />
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-4">
                            <Routes>
                                <Route path="/" element={<Dashboard cryptos={cryptos} />} />
                                <Route path="/dashboard" element={<Dashboard cryptos={cryptos} />} />
                                <Route path="/market" element={<MarketOverview cryptos={cryptos} />} />
                                <Route path="/converter" element={<CryptoConverter cryptos={cryptos} />} />
                                <Route path="/alerts" element={<Alerts cryptos={cryptos} />} />
                                <Route path="/chart" element={<Chart cryptos={cryptos} />} />
                                <Route path="/pretrade" element={<PreTradeCalculator cryptos={cryptos} />} />
                                <Route path="/posttrade" element={<PostTradeCalculator cryptos={cryptos} />} />
                                <Route path="/position" element={<PositionSizing cryptos={cryptos} />} />
                                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                                <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/chatbot" element={<div className="h-[70vh] flex items-center justify-center"><ChatBot cryptos={cryptos} openByDefault={true} /></div>} />
                                <Route path="/forgot-password" element={<div>Password Reset Page</div>} />
                                
                                {/* Protected routes */}
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                                <Route path="/journal" element={
                                    <ProtectedRoute>
                                        <TradeJournal cryptos={cryptos} />
                                    </ProtectedRoute>
                                } />
                                <Route path="/tax" element={
                                    <ProtectedRoute>
                                        <TaxReporting cryptos={cryptos} />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Fallback route */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </div>
                )}
                
                <div className="fixed bottom-4 right-4 z-10 flex space-x-2">
                    <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <ChatBot cryptos={cryptos} />
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthContextProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthContextProvider>
    );
}

export default App;