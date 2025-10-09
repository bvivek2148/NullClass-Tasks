// Mock agent SDK for TravelMate AI
export const agentSDK = {
  sendMessage: async (message) => {
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock responses based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        text: "नमस्ते! मैं आपका यात्रा सहायक हूं। मैं आपकी यात्रा की योजना बनाने में मदद कर सकता हूं। आप कहां जाना चाहते हैं?",
        type: "text"
      };
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('booking')) {
      return {
        text: "मैं आपकी बुकिंग में मदद कर सकता हूं। कृपया बताएं कि आप कहां से कहां जाना चाहते हैं और कब?",
        type: "text"
      };
    }
    
    if (lowerMessage.includes('route') || lowerMessage.includes('रूट')) {
      return {
        text: "मैं आपके लिए सबसे अच्छे रूट की सुझाव दे सकता हूं। कृपया अपना गंतव्य बताएं।",
        type: "text"
      };
    }
    
    // Default response
    return {
      text: "धन्यवाद आपके संदेश के लिए। मैं आपकी यात्रा संबंधी सभी जरूरतों में सहायता कर सकता हूं। कृपया अपनी आवश्यकता बताएं।",
      type: "text"
    };
  },

  // Create a new conversation
  createConversation: async (config) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      id: 'conv_' + Date.now(),
      agent_name: config.agent_name,
      metadata: config.metadata,
      created_at: new Date().toISOString()
    };
  },

  // Subscribe to conversation updates
  subscribeToConversation: (conversationId, callback) => {
    // Mock subscription - in real app this would be WebSocket or EventSource
    const mockMessages = [];
    
    // Simulate initial empty state
    setTimeout(() => {
      callback({ messages: mockMessages });
    }, 100);
    
    // Return unsubscribe function
    return () => {
      // Mock unsubscribe
    };
  },

  // Add message to conversation
  addMessage: async (conversation, messageData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock adding message and getting AI response
    const userMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: messageData.content,
      timestamp: new Date().toISOString(),
      file_urls: messageData.file_urls
    };
    
    // Simulate AI response
    const aiResponse = await agentSDK.sendMessage(messageData.content);
    const assistantMessage = {
      id: 'msg_' + (Date.now() + 1),
      role: 'assistant',
      content: aiResponse.text,
      timestamp: new Date().toISOString(),
      type: aiResponse.type
    };
    
    return { userMessage, assistantMessage };
  }
};