import { tool } from 'ai';
import { z } from 'zod';

export const getStockPriceTool = tool({
  description: 'Get current stock price information for a specific symbol',
  parameters: z.object({
    symbol: z.string().describe('The stock symbol (e.g., AAPL, GOOGL, TSLA)'),
  }),
  execute: async ({ symbol }) => {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (!apiKey) {
        throw new Error('Alpha Vantage API key not configured');
      }

      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Stock API error: ${response.status}`);
      }

      const data = await response.json();
      const quote = data['Global Quote'];

      if (!quote || Object.keys(quote).length === 0) {
        return {
          error: `Stock symbol "${symbol}" not found or API limit reached.`,
        };
      }

      const price = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = quote['10. change percent'];

      return {
        symbol: quote['01. symbol'],
        price: price.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent,
        previousClose: parseFloat(quote['08. previous close']).toFixed(2),
        open: parseFloat(quote['02. open']).toFixed(2),
        high: parseFloat(quote['03. high']).toFixed(2),
        low: parseFloat(quote['04. low']).toFixed(2),
        volume: parseInt(quote['06. volume']).toLocaleString(),
        latestTradingDay: quote['07. latest trading day'],
      };
    } catch (error) {
      console.error('Stock fetch error:', error);
      return {
        error: 'Unable to fetch stock data. Please try again or check the symbol.',
      };
    }
  },
});