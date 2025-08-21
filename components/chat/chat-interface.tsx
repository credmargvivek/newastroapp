'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { streamToResponse, tool } from 'ai';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  createdAt: string;
}

export function ChatInterface() {
  const [mounted, setMounted] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    setMessages 
  } = useChat({ api: "/api/chat" , streamMode:true});

  useEffect(() => {
    setMounted(true);
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.messages.map((msg: ChatMessage) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content || '',
          toolInvocations: msg.toolInvocations || [],
        }));
        console.log('Loaded messages:', data.messages);
        console.log('Formatted messages:', formattedMessages);
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear your entire chat history? This cannot be undone.')) {
      try {
        const response = await fetch('/api/chat', { method: 'DELETE' });
        if (response.ok) {
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to clear chat:', error);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-hidden p-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading chat history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your AI Assistant!
              </h2>
              <p className="text-gray-600 mb-8">
                I can help you with weather information, Formula 1 race schedules, and stock prices.
                <span className='font-extrabold'>Just ask me related to these topics only! I will not give other Answers</span>
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <strong>Try asking:</strong> "What's the weather in New York?"
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <strong>Or:</strong> "Tell me about the next F1 race in 2025?"
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <strong>Or:</strong> "What's the price of AAPL stock?"
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chat History</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear All History
              </Button>
            </div>
           
            <MessageList messages={messages} />
          </div>
        )}
      </div>
      
      <div className="border-t bg-white p-4">
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}