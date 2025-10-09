import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/Components/ui/button.jsx";
import { User, Bot, Copy, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-4xl ${
        isUser ? 'ml-auto' : 'mr-auto'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
            : 'bg-gradient-to-br from-purple-500 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block max-w-full ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-white border border-slate-200'
          } rounded-2xl px-4 py-3 shadow-sm`}
        >
          <p className={`text-sm leading-relaxed ${
            isUser ? 'text-white' : 'text-slate-800'
          }`}>
            {message.content}
          </p>
          
          {/* File attachments */}
          {message.file_urls && message.file_urls.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.file_urls.map((url, index) => (
                <div key={index} className="text-xs opacity-80">
                  📎 Attachment {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message metadata */}
        <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          {message.timestamp && (
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
          
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-slate-100"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCheck className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}