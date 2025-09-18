import { streamText, convertToCoreMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/lib/db';
import { chatMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getWeatherTool } from '@/tools/weather';
import { getF1RaceTool } from '@/tools/f1';
import { getStockPriceTool } from '@/tools/stocks';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export async function  PUT(req:Request){
 // here i am created one function
 // Now I need to raise the PR
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    // Save user message to database
    const userMessage = messages[messages.length - 1];
    if (userMessage && userMessage.role === 'user') {
      await db.insert(chatMessages).values({
        userId: session.user.id,
        role: userMessage.role,
        content: userMessage.content,
      });
    }
    // gemini-2.0-flash

    const result = await streamText({
      model: google('models/gemini-2.5-pro'),
      messages: convertToCoreMessages(messages),
      tools: {
        getWeather: getWeatherTool,
        getF1Race: getF1RaceTool,
        getStockPrice: getStockPriceTool,
      },
      system: `You are a helpful AI assistant. You have access to the following tools: getWeather, getF1Race, getStockPrice. Respond conversationally even if the user's query does not require a tool. Use tools only when necessary. Normal messages also be sent in the same format as tool results.`,
      onFinish: async (result) => {
        // Debug logging to see what we get
        console.log('=== DEBUG onFinish ===');
        console.log('result.text:', result.text);
        console.log('result.toolCalls:', result.toolCalls);
        console.log('typeof result.toolCalls:', typeof result.toolCalls);
        
        // Properly format toolInvocations for JSONB storage
        let toolInvocations = null;
        if (result.toolCalls && result.toolCalls.length > 0) {
          try {
            // Ensure it's properly serializable JSON
            toolInvocations = JSON.parse(JSON.stringify(result.toolResults));
            console.log('Formatted toolInvocations:', toolInvocations);
          } catch (error) {
            console.error('Error formatting toolCalls for JSONB:', error);
          }
        }
        
        // Save assistant response to database
        await db.insert(chatMessages).values({
          userId: session.user.id,
          role: 'assistant',
          content: result.text || '',
          toolInvocations: toolInvocations,
        });
      },
    });

    return result.toDataStreamResponse();
    // return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's chat messages
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all messages for this user
    const messages = await db.query.chatMessages.findMany({
      where: eq(chatMessages.userId, session.user.id),
      orderBy: [chatMessages.createdAt],
    });

    return Response.json({ messages });
  } catch (error) {
    console.error('Chat GET error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear user's chat history
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all messages for this user
    await db.delete(chatMessages)
      .where(eq(chatMessages.userId, session.user.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Chat DELETE error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

