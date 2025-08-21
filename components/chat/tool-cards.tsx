'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Calendar, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';

interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  state: 'call' | 'result';
  args?:any;
  result?: any;
}

interface ToolCardsProps {
  toolInvocation: ToolInvocation;
}

export function ToolCards({ toolInvocation }: ToolCardsProps) {
    
    if (toolInvocation.state === 'call') {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent" />
            <span className="text-sm text-yellow-700">
              Fetching {toolInvocation.toolName} data...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const result = toolInvocation.result;

  if (result?.error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{result.error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Weather Card
  if (toolInvocation.toolName === 'getWeather' && result) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cloud className="h-5 w-5 text-blue-600" />
            Weather in {result.location}, {result.country}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-blue-900">
                {result.temperature}°C
              </div>
              <div className="text-sm text-blue-700 capitalize">
                {result.description}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Feels like {result.feelsLike}°C
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Humidity:</span>
                <span className="font-medium">{result.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Speed:</span>
                <span className="font-medium">{result.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // F1 Race Card
  if (toolInvocation.toolName === 'getF1Race' && result) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-red-600" />
            {result.raceName}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-red-900">{result.circuitName}</div>
              <div className="text-sm text-gray-600">{result.location}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Date</div>
                <div className="font-medium">{new Date(result.date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Time</div>
                <div className="font-medium">{result.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline">Round {result.round}</Badge>
              <Badge variant="outline">Season {result.season}</Badge>
            </div>

            {result.url && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                More details <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stock Price Card
  if (toolInvocation.toolName === 'getStockPrice' && result) {
    const isPositive = parseFloat(result.change) >= 0;
    
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {result.symbol} Stock Price
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-green-900">
                ${result.price}
              </div>
              <div className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? '+' : ''}{result.change} ({result.changePercent})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Open:</span>
                  <span className="font-medium">${result.open}</span>
                </div>
                <div className="flex justify-between">
                  <span>High:</span>
                  <span className="font-medium">${result.high}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low:</span>
                  <span className="font-medium">${result.low}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Previous:</span>
                  <span className="font-medium">${result.previousClose}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span className="font-medium">{result.volume}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Last updated: {result.latestTradingDay}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}