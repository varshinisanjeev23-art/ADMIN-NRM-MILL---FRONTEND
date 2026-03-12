import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello Admin! 👋 How can I assist you with managing Rice Mart today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef();

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/chat/message', {
                messages: [...messages, userMsg].slice(-10) // Send last 10 messages for context
            });

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }]);
        } catch (err) {
            console.error('Chat error:', err);
            const errMsg = err.response?.data?.message || "I'm having trouble connecting right now. Please try again later! 🌾";
            setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">🛡️</div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest">Admin AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Systems Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-[#3ba829] text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Suggestions */}
                    {!isLoading && messages.length < 3 && (
                        <div className="px-4 pb-2 bg-gray-50/50 flex gap-2 overflow-x-auto no-scrollbar">
                            {['Price of Ponni Rice?', 'Free Shipping?', 'Where are you?'].map(q => (
                                <button 
                                    key={q}
                                    onClick={() => { setInput(q); }}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-[#3ba829] hover:bg-green-50 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3ba829] outline-none transition-all font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="w-11 h-11 bg-[#3ba829] text-white rounded-xl flex items-center justify-center hover:bg-[#318b22] disabled:opacity-50 disabled:hover:bg-[#3ba829] transition-all shadow-md shadow-green-100"
                        >
                            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
                    isOpen ? 'bg-white text-gray-600 rotate-90' : 'bg-[#3ba829] text-white'
                }`}
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#3ba829] rounded-full animate-ping"></span>
                    </div>
                )}
            </button>
        </div>
    );
}
