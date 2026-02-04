import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navigation.css';

function Navigation({ isAuthenticated }) {
    const [showAllTabs, setShowAllTabs] = useState(false);
    const [animatedItems, setAnimatedItems] = useState([]);
    
    // Add animation delay to items
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedItems(['dashboard', 'market', 'pretrade', 'posttrade', 'position']);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);
    
    const tabs = [
        { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'market', path: '/market', label: 'Market Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'pretrade', path: '/pretrade', label: 'Pre-Trade Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
        { id: 'posttrade', path: '/posttrade', label: 'Post-Trade P&L', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
        { id: 'position', path: '/position', label: 'Position Sizing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'converter', path: '/converter', label: 'Converter', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
        { id: 'alerts', path: '/alerts', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { id: 'chart', path: '/chart', label: 'Charts', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'chatbot', path: '/chatbot', label: 'ChatBot', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ];

    // Auth-dependent tabs
    const authTabs = [
        { id: 'journal', path: '/journal', label: 'Trade Journal', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { id: 'tax', path: '/tax', label: 'Tax Reporting', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
    ];

    // Special tabs
    const specialTabs = [
        { id: 'pricing', path: '/pricing', label: 'Pricing', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    ];

    // Combine tabs based on authentication state
    const visibleTabs = [...tabs, ...(isAuthenticated ? authTabs : []), ...specialTabs];
    
    // For mobile view, we'll display only key tabs and a "More" dropdown
    const mainTabs = visibleTabs.slice(0, 5);
    const moreTabs = visibleTabs.slice(5);
    
    return (
        <div className="navigation-container">
            <div className="nav-wrapper">
                {/* Desktop Navigation */}
                <div className="desktop-nav">
                    {visibleTabs.map((tab, index) => (
                        <NavLink
                            key={tab.id}
                            to={tab.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${animatedItems.includes(tab.id) ? 'animate-fade-in' : ''}`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                            </svg>
                            <span className="nav-text">{tab.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Navigation */}
                <div className="mobile-nav">
                    {mainTabs.map((tab, index) => (
                        <NavLink
                            key={tab.id}
                            to={tab.path}
                            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''} ${animatedItems.includes(tab.id) ? 'animate-fade-in' : ''}`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                            </svg>
                            <span className="truncate">{tab.label}</span>
                        </NavLink>
                    ))}
                    
                    {/* More dropdown for mobile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAllTabs(!showAllTabs)}
                            className="mobile-more-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                            <span className="ml-1">More</span>
                        </button>
                        
                        {showAllTabs && (
                            <div className="mobile-dropdown">
                                {moreTabs.map((tab, index) => (
                                    <NavLink
                                        key={tab.id}
                                        to={tab.path}
                                        className={({ isActive }) => `mobile-dropdown-link ${isActive ? 'active' : ''}`}
                                        onClick={() => setShowAllTabs(false)}
                                    >
                                        <div className="dropdown-icon-wrapper">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                                            </svg>
                                            {tab.label}
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navigation; 