import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUser: string | null;
}

export const Chat: React.FC<Props> = ({ messages, onSendMessage, currentUser }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black/50 border border-gray-800 rounded-lg overflow-hidden backdrop-blur-sm">
      <div className="p-3 bg-gray-900 border-b border-gray-800 font-combat tracking-wider text-prese-green">
        COMMS CHANNEL
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center my-2' : 'items-start'}`}>
            {msg.isSystem ? (
               <span className="text-xs text-yellow-500 font-mono text-center border-y border-yellow-900 py-1 w-full bg-yellow-900/10">
                 [ANNOUNCER]: {msg.text}
               </span>
            ) : (
              <div className="bg-gray-800/80 p-2 rounded max-w-[90%]">
                <span className={`text-xs font-bold ${msg.sender === currentUser ? 'text-prese-green' : 'text-blue-400'}`}>
                  {msg.sender.substring(0, 6)}...
                </span>
                <p className="text-sm text-gray-200">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentUser ? "Digite mensagem..." : "Conecte carteira..."}
          disabled={!currentUser}
          className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-prese-green disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!currentUser}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold text-sm disabled:opacity-50"
        >
          SEND
        </button>
      </form>
    </div>
  );
};
