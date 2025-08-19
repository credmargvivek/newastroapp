import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/chat');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          AI Assistant with Tool Calling
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Chat with an AI assistant that can fetch real-time weather, F1 race data, and stock prices
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌤️ Weather
              </CardTitle>
              <CardDescription>
                Get current weather information for any location
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏎️ Formula 1
              </CardTitle>
              <CardDescription>
                Check the next F1 race schedule and details
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Stock Prices
              </CardTitle>
              <CardDescription>
                Get real-time stock market data and prices
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Link href="/signin">
          <Button size="lg" className="text-lg px-8 py-3">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}