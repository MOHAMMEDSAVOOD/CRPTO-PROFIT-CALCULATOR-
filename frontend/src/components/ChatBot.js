import React, { useState, useRef, useEffect } from 'react';

function ChatBot({ cryptos = [], openByDefault = false }) {
    const [isOpen, setIsOpen] = useState(openByDefault);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: 'Hi! I\'m your crypto assistant. Ask me anything about cryptocurrencies or how to use this app!', 
            sender: 'bot' 
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [showSuggestions, setShowSuggestions] = useState(true);

    // Suggested queries that users can ask
    const suggestedQueries = [
        "What is cryptocurrency?",
        "How do I use the calculator?",
        "What's the price of Bitcoin?",
        "How do I set price alerts?",
        "What is blockchain?"
    ];

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 1) {
            setShowSuggestions(true);
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() === '') return;

        // Hide suggestions when user sends a message
        setShowSuggestions(false);

        // Add user message to chat
        const userMessage = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Process the message and generate a response
        setTimeout(() => {
            const botResponse = generateResponse(inputText, cryptos);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: botResponse,
                sender: 'bot'
            }]);
            setIsTyping(false);
        }, 1000); // Simulate typing delay
    };

    const handleSuggestionClick = (query) => {
        setInputText(query);
        setShowSuggestions(false);
        
        // Add user message to chat
        const userMessage = {
            id: messages.length + 1,
            text: query,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Process the message and generate a response
        setTimeout(() => {
            const botResponse = generateResponse(query, cryptos);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: botResponse,
                sender: 'bot'
            }]);
            setIsTyping(false);
        }, 1000); // Simulate typing delay
    };

    // Function to generate responses based on user input
    const generateResponse = (userInput, cryptos) => {
        const input = userInput.toLowerCase();
        const cryptoData = cryptos || [];

        // Help with app usage
        if (input.includes('how to use') || input.includes('help')) {
            return 'This app has 5 main features: Market Overview, Profit Calculator, Crypto Converter, Price Alerts, and Price Chart. You can navigate between them using the tabs at the top of the page.';
        }

        // Price related queries
        if ((input.includes('price') || input.includes('worth') || input.includes('value') || input.includes('cost')) && 
            (input.includes('bitcoin') || input.includes('btc'))) {
            const bitcoin = cryptoData.find(crypto => crypto.symbol === 'BTC');
            if (bitcoin && bitcoin.quote && bitcoin.quote.USD) {
                return `The current price of Bitcoin (BTC) is $${bitcoin.quote.USD.price.toFixed(2)}.`;
            }
            return "I couldn't find the current price of Bitcoin. Please check the Market Overview tab.";
        }

        // Ethereum price
        if ((input.includes('price') || input.includes('worth') || input.includes('value')) && 
            (input.includes('ethereum') || input.includes('eth'))) {
            const ethereum = cryptoData.find(crypto => crypto.symbol === 'ETH');
            if (ethereum && ethereum.quote && ethereum.quote.USD) {
                return `The current price of Ethereum (ETH) is $${ethereum.quote.USD.price.toFixed(2)}.`;
            }
            return "I couldn't find the current price of Ethereum. Please check the Market Overview tab.";
        }

        // Calculator help
        if (input.includes('calculator') || input.includes('profit') || input.includes('loss')) {
            return 'The Profit Calculator helps you calculate potential profits or losses from cryptocurrency trades. Enter your buy price, sell price, and the amount to see the results.';
        }

        // Converter help
        if (input.includes('convert') || input.includes('converter')) {
            return 'The Crypto Converter allows you to convert between different cryptocurrencies using real-time exchange rates. Select the source and target cryptocurrencies and enter the amount to convert.';
        }

        // Alerts help
        if (input.includes('alert') || input.includes('notification')) {
            return 'The Price Alerts feature lets you set notifications for when cryptocurrency prices reach certain thresholds. You can set alerts for when prices go above or below a specified value.';
        }

        // Chart help
        if (input.includes('chart') || input.includes('graph')) {
            return 'The Price Chart provides a visual representation of cryptocurrency prices. You can see the current prices of top cryptocurrencies in a graphical format.';
        }

        // What is crypto
        if (input.includes('what is') && (input.includes('crypto') || input.includes('cryptocurrency'))) {
            return 'Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on a technology called blockchain, which is a distributed ledger enforced by a network of computers.';
        }

        // Blockchain explanation
        if (input.includes('what is') && input.includes('blockchain')) {
            return 'Blockchain is a decentralized, distributed ledger technology that records transactions across many computers so that any involved record cannot be altered retroactively, without the alteration of all subsequent blocks.';
        }

        // Best crypto to invest
        if ((input.includes('best') || input.includes('good')) && 
            (input.includes('invest') || input.includes('buy'))) {
            return "I can't provide investment advice. It's important to do your own research and consider factors like market capitalization, use case, development team, and your own risk tolerance before investing in any cryptocurrency.";
        }

        // Dark mode help
        if (input.includes('dark mode') || input.includes('light mode') || input.includes('theme')) {
            return 'You can toggle between dark and light mode by clicking the sun/moon icon in the top right corner of the page.';
        }

        // Get top crypto
        if ((input.includes('top') || input.includes('best') || input.includes('highest')) && 
            (input.includes('crypto') || input.includes('cryptocurrency'))) {
            if (cryptoData && cryptoData.length > 0) {
                const top5 = cryptoData.slice(0, 5).map(c => `${c.name} (${c.symbol})`).join(', ');
                return `The top 5 cryptocurrencies by market cap are: ${top5}.`;
            }
            return "I couldn't fetch the top cryptocurrencies. Please check the Market Overview tab.";
        }

        // Default fallback
        return "I'm not sure how to answer that. You can ask me about cryptocurrency prices, how to use this app's features, or general crypto concepts.";
    };

    return (
        <>
            {/* Chatbot button */}
            <button 
                className="fixed bottom-5 right-5 bg-primary-light dark:bg-primary-dark text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
                onClick={toggleChatbot}
                aria-label="Toggle chatbot"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {/* Chatbot dialog */}
            {isOpen && (
                <div className="fixed bottom-20 right-5 w-80 md:w-96 bg-card-light dark:bg-card-dark rounded-lg shadow-xl z-50 flex flex-col overflow-hidden transition-all max-h-[80vh]">
                    {/* Chat header */}
                    <div className="bg-primary-light dark:bg-primary-dark text-white p-3 flex justify-between items-center">
                        <h3 className="font-bold">Crypto Assistant</h3>
                        <button onClick={toggleChatbot} className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat messages */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-[50vh]">
                        {messages.map(message => (
                            <div 
                                key={message.id} 
                                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                            >
                                <div 
                                    className={`inline-block p-3 rounded-lg ${
                                        message.sender === 'user' 
                                            ? 'bg-primary-light dark:bg-primary-dark text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-left mb-3">
                                <div className="inline-block p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested queries */}
                    {showSuggestions && (
                        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQueries.map((query, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(query)}
                                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {query}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat input */}
                    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-3">
                        <div className="flex">
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary-light dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            <button 
                                type="submit" 
                                className="bg-primary-light dark:bg-primary-dark text-white p-2 rounded-r-lg"
                                disabled={isTyping}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default ChatBot; 