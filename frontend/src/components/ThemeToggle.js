import React, { useEffect } from 'react';

function ThemeToggle({ darkMode, toggleDarkMode }) {
    // Apply dark mode class when darkMode state changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <button
            type="button"
            onClick={toggleDarkMode}
            className="relative inline-flex items-center px-2 py-1 rounded-full transition-all focus:outline-none"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div className={`absolute inset-0 ${darkMode ? 'bg-indigo-900' : 'bg-gradient-to-r from-blue-400 to-indigo-500'} rounded-full transition-colors duration-300 shadow-lg`}></div>
            <div className="relative flex items-center justify-between w-14">
                <span className={`absolute left-1 w-5 h-5 rounded-full transform transition-transform duration-300 ${darkMode ? 'translate-x-7 bg-indigo-200' : 'translate-x-0 bg-white'} shadow-md z-10 flex items-center justify-center`}>
                    {darkMode ? (
                        <svg className="w-3 h-3 text-indigo-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </span>
                <span className="sr-only">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
        </button>
    );
}

export default ThemeToggle; 