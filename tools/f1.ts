import { tool } from 'ai';
import { z } from 'zod';

export const getF1RaceTool = tool({
  description: 'Get information about the next Formula 1 race',
  parameters: z.object({}),
  execute: async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(
        `https://ergast.com/api/f1/${currentYear}.json`
      );

      if (!response.ok) {
        throw new Error(`F1 API error: ${response.status}`);
      }

      const data = await response.json();
      const races = data.MRData.RaceTable.Races;
      
      if (!races || races.length === 0) {
        return {
          error: 'No race data available for this year.',
        };
      }

      // Find next race
      const now = new Date();
      const nextRace = races.find((race: any) => {
        const raceDate = new Date(race.date + 'T' + (race.time || '00:00:00Z'));
        return raceDate > now;
      }) || races[races.length - 1]; // Fallback to last race if season ended

      return {
        raceName: nextRace.raceName,
        circuitName: nextRace.Circuit.circuitName,
        location: `${nextRace.Circuit.Location.locality}, ${nextRace.Circuit.Location.country}`,
        date: nextRace.date,
        time: nextRace.time || 'TBD',
        round: nextRace.round,
        season: nextRace.season,
        url: nextRace.url,
      };
    } catch (error) {
      console.error('F1 fetch error:', error);
      return {
        error: 'Unable to fetch F1 race data. Please try again.',
      };
    }
  },
});