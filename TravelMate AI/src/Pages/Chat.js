import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentSDK } from "@/agents/index.js";
import { Button } from "@/Components/ui/button.jsx";
import { ArrowLeft, RotateCcw, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MessageBubble from '../Components/chat/MessageBubble.js';
import ChatInput from '../Components/chat/ChatInput.js';
import QuickActions from '../Components/chat/QuickActions.js';
import TypingIndicator from '../Components/chat/TypingIndicator.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs.jsx";

export default function ChatPage() {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (!conversation) return;
    
    const unsubscribe = agentSDK.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initConversation = async () => {
    const conv = await agentSDK.createConversation({
      agent_name: "customer_support",
      metadata: {
        name: "Customer Support",
        description: "Get help with bookings and travel info"
      }
    });
    setConversation(conv);
  };

  const handleSendMessage = async (content, fileUrls = []) => {
    if (!conversation) return;
    
    setIsLoading(true);
    await agentSDK.addMessage(conversation, {
      role: "user",
      content,
      file_urls: fileUrls.length > 0 ? fileUrls : undefined
    });
  };

  const handleQuickAction = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleNewConversation = () => {
    setConversation(null);
    setMessages([]);
    initConversation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-white/95"
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  AI Assistant
                </h1>
                <p className="text-sm text-slate-500">Always here to help</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="gap-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-11 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger 
                value="chat" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="chat" className="mt-0">
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center space-y-6 py-12">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                          Welcome! How can I assist you today?
                        </h2>
                        <p className="text-slate-600 max-w-lg mx-auto text-lg">
                          I'm here to help you with bookings, routes, schedules, and any questions about your travel.
                        </p>
                      </div>
                    </div>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-sm font-medium text-slate-700 mb-4">Quick actions to get started:</p>
                      <QuickActions onSelectAction={handleQuickAction} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <MessageBubble message={message} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <TypingIndicator />
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Menu className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Conversation History</h3>
                <p className="text-slate-600">Your chat history will appear here</p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border-t border-slate-200 sticky bottom-0 shadow-lg backdrop-blur-sm bg-white/95"
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !conversation} />
        </div>
      </motion.div>
    </div>
  );
}