import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Pricing() {
    const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annually'
    
    // Calculate annual savings percentage
    const annualSavingsPercent = 20;
    
    // Define pricing plans
    const pricingPlans = [
        {
            name: 'Free',
            description: 'Basic access to essential trading tools',
            monthlyPrice: 0,
            annualPrice: 0,
            features: [
                'Basic market overview',
                'Simple trading calculator',
                'Limited price alerts (3)',
                'Public chatbot access',
                'Standard position sizing'
            ],
            limitations: [
                'No historical data analysis',
                'No portfolio tracking',
                'Basic tools only',
                'Community support only',
                'Limited to 3 scenarios'
            ],
            cta: 'Get Started',
            highlighted: false,
            ctaLink: '/signup',
        },
        {
            name: 'Pro',
            description: 'Advanced tools for active traders',
            monthlyPrice: 19.99,
            annualPrice: 191.9, // 20% savings
            features: [
                'Everything in Free plan',
                'Advanced pre-trade analysis',
                'Unlimited price alerts',
                'Portfolio tracking',
                'Advanced position sizing',
                'Risk management tools',
                'Technical indicator access',
                'Priority support',
                'Unlimited trade scenarios',
                'Dark mode'
            ],
            limitations: [],
            cta: 'Start Pro Plan',
            highlighted: true,
            ctaLink: '/signup?plan=pro',
        },
        {
            name: 'Premium',
            description: 'Complete trading solution for professionals',
            monthlyPrice: 39.99,
            annualPrice: 383.9, // 20% savings
            features: [
                'Everything in Pro plan',
                'Real-time market data',
                'API integration',
                'Custom strategy builder',
                'Advanced portfolio analytics',
                'Tax reporting tools',
                'Dedicated support',
                'Early access to new features',
                'Multiple user accounts (3)',
                'Custom indicators'
            ],
            limitations: [],
            cta: 'Start Premium Plan',
            highlighted: false,
            ctaLink: '/signup?plan=premium',
        }
    ];

    // Format price for display
    const formatPrice = (price) => {
        if (price === 0) return 'Free';
        return `$${price.toFixed(2)}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Choose Your Trading Calculator Plan
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Select the plan that best fits your trading style and goals
                    </p>
                </div>

                {/* Billing period toggle */}
                <div className="mt-12 flex justify-center">
                    <div className="relative bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex">
                        <button
                            type="button"
                            className={`${
                                billingPeriod === 'monthly'
                                    ? 'bg-white dark:bg-gray-800 shadow-sm'
                                    : 'bg-transparent text-gray-500 dark:text-gray-400'
                            } relative py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 whitespace-nowrap`}
                            onClick={() => setBillingPeriod('monthly')}
                        >
                            Monthly billing
                        </button>
                        <button
                            type="button"
                            className={`${
                                billingPeriod === 'annually'
                                    ? 'bg-white dark:bg-gray-800 shadow-sm'
                                    : 'bg-transparent text-gray-500 dark:text-gray-400'
                            } relative py-2 px-4 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 whitespace-nowrap`}
                            onClick={() => setBillingPeriod('annually')}
                        >
                            Annual billing
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                Save {annualSavingsPercent}%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing plans */}
                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {pricingPlans.map((plan) => (
                        <div 
                            key={plan.name}
                            className={`rounded-lg shadow-lg overflow-hidden border ${
                                plan.highlighted 
                                    ? 'border-indigo-500 dark:border-indigo-400 transform scale-105' 
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="p-6 bg-white dark:bg-gray-800">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">
                                    {plan.description}
                                </p>
                                <p className="mt-4">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {formatPrice(billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice)}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                                        {plan.monthlyPrice > 0 && `/${billingPeriod === 'monthly' ? 'month' : 'year'}`}
                                    </span>
                                </p>
                                
                                {billingPeriod === 'annually' && plan.monthlyPrice > 0 && (
                                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                                        Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)} per year
                                    </p>
                                )}
                                
                                <Link
                                    to={plan.ctaLink}
                                    className={`mt-6 block w-full py-3 px-6 rounded-md text-center font-medium ${
                                        plan.highlighted
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-200'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                            
                            <div className="px-6 pt-4 pb-8 bg-gray-50 dark:bg-gray-900">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    What's included:
                                </h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span className="ml-2 text-gray-700 dark:text-gray-300">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                    
                                    {plan.limitations.map((limitation, index) => (
                                        <li key={`limitation-${index}`} className="flex items-start text-gray-500 dark:text-gray-500">
                                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            <span className="ml-2">
                                                {limitation}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* FAQ section */}
                <div className="mt-20">
                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Frequently Asked Questions
                    </h3>
                    
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                Can I change my plan later?
                            </h4>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit for your next billing cycle.
                            </p>
                        </div>
                        
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                Is there a free trial for paid plans?
                            </h4>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                Yes, we offer a 14-day free trial for both Pro and Premium plans. No credit card required for the trial period.
                            </p>
                        </div>
                        
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                What happens when I hit the limits of my plan?
                            </h4>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                When you reach the usage limits of your current plan, you'll be notified and given options to upgrade to a higher tier or wait until your limits reset in the next billing cycle.
                            </p>
                        </div>
                        
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                How do I cancel my subscription?
                            </h4>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. We don't offer refunds for partial billing periods.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* CTA banner */}
                <div className="mt-16 bg-indigo-600 rounded-lg shadow-lg overflow-hidden">
                    <div className="pt-10 pb-12 px-6 sm:px-16">
                        <div className="lg:flex lg:items-center lg:justify-between">
                            <div>
                                <h3 className="text-2xl font-extrabold text-white">
                                    Ready to take your trading to the next level?
                                </h3>
                                <p className="mt-4 text-lg text-indigo-100">
                                    Start with our free plan or dive into advanced features with Pro or Premium.
                                </p>
                            </div>
                            <div className="mt-8 lg:mt-0 lg:ml-8">
                                <div className="flex gap-3">
                                    <Link
                                        to="/signup"
                                        className="px-6 py-3 rounded-md bg-white text-indigo-600 font-medium hover:bg-indigo-50"
                                    >
                                        Get started for free
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-6 py-3 rounded-md bg-indigo-800 text-white font-medium hover:bg-indigo-700"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing; 