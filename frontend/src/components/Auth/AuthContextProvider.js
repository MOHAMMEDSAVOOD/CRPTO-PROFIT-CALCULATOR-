import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create auth context
const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            setError(null);

            try {
                // First check if we have a token in localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Verify token with the backend
                const response = await axios.get('/api/auth/verify', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && response.data.success) {
                    setIsAuthenticated(true);
                    setUser(response.data.user || JSON.parse(localStorage.getItem('user')));
                } else {
                    // Token is invalid, clear local storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth verification error:', err);
                // Don't clear token on network errors to allow offline usage
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setUser(null);
                }
                setError('Failed to verify authentication status');
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            
            if (response.data && response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                setIsAuthenticated(true);
                setUser(response.data.user);
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred during login';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Signup function
    const signup = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/auth/signup', userData);
            
            if (response.data && response.data.success) {
                if (response.data.token) {
                    // Auto-login after signup
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                }
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Signup failed');
            }
        } catch (err) {
            console.error('Signup error:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred during signup';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Optional: Call to backend to invalidate token
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post('/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Clear local storage regardless of server response
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('/api/auth/profile', profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Profile update failed');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred while updating profile';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Provide auth context
    const value = {
        isAuthenticated,
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}

export default AuthContext;