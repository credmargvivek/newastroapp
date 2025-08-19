import { streamText,convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { chatMessages, chatSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getWeatherTool } from '@/tools/weather';
import { getF1RaceTool } from '@/tools/f1';
import { getStockPriceTool } from '@/tools/stocks';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, sessionId } = await req.json();

    // Verify session belongs to user
    if (sessionId) {
      const chatSession = await db.query.chatSessions.findFirst({
        where: eq(chatSessions.id, sessionId),
      });

      if (!chatSession || chatSession.userId !== session.user.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages: convertToModelMessages(messages),
      tools: {
        getWeather: getWeatherTool,
        getF1Race: getF1RaceTool,
        getStockPrice: getStockPriceTool,
      },
      system: `You are a helpful AI assistant with access to real-time information tools. 
      
      When users ask about weather, use the getWeather tool.
      When users ask about Formula 1 or F1 races, use the getF1Race tool.
      When users ask about stock prices or market data, use the getStockPrice tool.
      
      Be conversational and helpful. Present tool results in a clear, user-friendly way.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}