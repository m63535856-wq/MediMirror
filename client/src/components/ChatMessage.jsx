import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  if (!message) return null;

  const { role, content, timestamp } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-[linear-gradient(90deg,#06b6d4,#3b82f6)]'
              : 'bg-[linear-gradient(90deg,#7c3aed,#fb7185)]'
          }`}
        >
          <div className="absolute inset-0 rounded-full bg-white/6 blur-sm"></div>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      {/* Message Bubble */}
      <div className="flex-1 max-w-[80%] flex flex-col">
        <div
          className={`px-4 py-3 rounded-2xl backdrop-blur-md ${
            isUser
              ? 'bg-[linear-gradient(90deg,rgba(6,182,212,0.16),rgba(59,130,246,0.12))] text-white rounded-tr-none'
              : 'bg-white/6 border border-[var(--mm-border)] text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        {timestamp && (
          <span className="text-xs text-muted mt-2">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
