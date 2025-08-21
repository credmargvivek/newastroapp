import { tool } from 'ai';
import { z } from 'zod';

export const getWeatherTool = tool({
  description: 'Get current weather information for a specific location',
  parameters: z.object({
    location: z.string().describe('The city name or location to get weather for'),
  }),
  execute: async ({ location }) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
       
     
      return {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return {
        error: 'Unable to fetch weather data. Please try again.',
      };
    }
  },
});