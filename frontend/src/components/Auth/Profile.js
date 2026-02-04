import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Get user data from localStorage or API
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setProfileData({
                fullName: parsedUser.fullName || '',
                email: parsedUser.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            // Fetch user data from API if not in localStorage
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.success) {
                setUser(response.data.user);
                setProfileData({
                    fullName: response.data.user.fullName || '',
                    email: response.data.user.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (err) {
            setError('Failed to fetch user profile. Please try again later.');
            console.error('Error fetching user profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Validate passwords if user is updating password
        if (profileData.newPassword) {
            if (profileData.newPassword !== profileData.confirmPassword) {
                setError('New passwords do not match');
                setIsLoading(false);
                return;
            }

            if (profileData.newPassword.length < 8) {
                setError('New password must be at least 8 characters long');
                setIsLoading(false);
                return;
            }

            if (!profileData.currentPassword) {
                setError('Current password is required to set a new password');
                setIsLoading(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem('token');
            
            // Only include password fields if updating password
            const updateData = {
                fullName: profileData.fullName,
                email: profileData.email
            };
            
            if (profileData.newPassword) {
                updateData.currentPassword = profileData.currentPassword;
                updateData.newPassword = profileData.newPassword;
            }
            
            const response = await axios.put('/api/auth/profile', updateData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.success) {
                setSuccess('Profile updated successfully!');
                
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Update state
                setUser(response.data.user);
                
                // Clear password fields
                setProfileData({
                    ...profileData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
                // Exit editing mode
                setIsEditing(false);
            } else {
                setError(response.data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 
                'An error occurred while updating your profile'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
            
            {error && (
                <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                        </div>
                    </div>
                </div>
            )}
            
            {success && (
                <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/30 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{success}</h3>
                        </div>
                    </div>
                </div>
            )}
            
            {isLoading && !user ? (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={profileData.fullName}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Leave the fields blank if you don't want to change your password</p>
                        </div>
                        
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={profileData.currentPassword}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={profileData.newPassword}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={profileData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-indigo-600 py-2 px-4 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                // Reset form to original values
                                if (user) {
                                    setProfileData({
                                        fullName: user.fullName || '',
                                        email: user.email || '',
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                }
                                setError('');
                            }}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 px-4 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.fullName || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.email || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user?.createdAt 
                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Not available'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile; 