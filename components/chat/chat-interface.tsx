'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleClearChat = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-hidden p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your AI Assistant!
              </h2>
              <p className="text-gray-600 mb-8">
                I can help you with weather information, Formula 1 race schedules, and stock prices. 
                Just ask me anything!
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <strong>Try asking:</strong> "What's the weather in New York?"
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <strong>Or:</strong> "When is the next F1 race?"
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
                Clear Chat
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