import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-4xl mr-auto">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-white" />
      </div>

      {/* Typing Animation */}
      <div className="flex-1 text-left">
        <div className="inline-block bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <span>AI Assistant is typing...</span>
        </div>
      </div>
    </div>
  );
}
