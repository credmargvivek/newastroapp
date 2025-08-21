'use client';

import { Message } from 'ai';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ToolCards } from './tool-cards';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { data: session } = useSession();

  return (
    <ScrollArea className="flex-1 pr-4 h-1/2">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <Avatar className="h-8 w-8 mt-1">
              {message.role === 'user' ? (
                <>
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </>
              ) : (
                <AvatarFallback className="bg-blue-100">
                  <Bot className="h-4 w-4 text-blue-600" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {message.role === 'user' ? session?.user?.name || 'You' : 'AI Assistant'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>
              

              {message.content && (
                <Card className={message.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </CardContent>
                </Card>
              )}
              
              {message.toolInvocations && (
                <div className="space-y-2">
                  {message.toolInvocations.map((toolInvocation) => (
                    console.log('Tool Invocation:', toolInvocation),
                    <ToolCards
                      key={toolInvocation.toolCallId}
                      toolInvocation={toolInvocation}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}