import React, { useState } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  currentUser: 'Vendor' | 'Driver';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Vendor', text: 'Hey, update on the Main St delivery?', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', sender: 'Driver', text: 'Stuck in slight traffic, but should be there in 15.', timestamp: new Date(Date.now() - 3500000) },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      text: inputText,
      timestamp: new Date()
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
       <div className="bg-white p-4 shadow-sm border-b border-gray-200 z-10">
         <h1 className="text-xl font-bold text-gray-800">Dispatch Chat</h1>
         <p className="text-xs text-gray-500">Connected with {currentUser === 'Vendor' ? 'John Doe (Driver)' : 'Central Dispatch'}</p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map((msg) => {
           const isMe = msg.sender === currentUser;
           return (
             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                 isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
               }`}>
                 <p className="text-sm">{msg.text}</p>
                 <span className={`text-[10px] block mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                   {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
               </div>
             </div>
           );
         })}
       </div>

       <div className="bg-white p-4 border-t border-gray-200 mb-[64px] sm:mb-0">
         <div className="flex gap-2">
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Type a message..."
             className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
           />
           <button 
             onClick={handleSend}
             className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
           >
             <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
           </button>
         </div>
       </div>
    </div>
  );
};

export default ChatInterface;