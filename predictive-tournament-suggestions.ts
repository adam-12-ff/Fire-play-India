// Implemented Genkit flow for predictive tournament suggestions based on user data.

'use server';

/**
 * @fileOverview Provides tournament suggestions to the user based on their game history, skill level and preferences.
 *
 * - getTournamentSuggestions - A function that returns suggested tournaments.
 * - TournamentSuggestionInput - The input type for the getTournamentSuggestions function.
 * - TournamentSuggestionOutput - The return type for the getTournamentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TournamentSuggestionInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting tournament suggestions.'),
  gameHistory: z.array(z.string()).describe('A list of game IDs the user has played in the past.'),
  skillLevel: z.string().describe('The user skill level (e.g., Beginner, Intermediate, Advanced).'),
  preferences: z.string().describe('The user preferences for tournaments, such as game mode or entry fee.'),
});

export type TournamentSuggestionInput = z.infer<typeof TournamentSuggestionInputSchema>;

const TournamentSuggestionOutputSchema = z.object({
  suggestedTournaments: z.array(
    z.object({
      tournamentId: z.string().describe('The ID of the suggested tournament.'),
      tournamentName: z.string().describe('The name of the suggested tournament.'),
      reason: z.string().describe('The reason why this tournament is suggested for the user.'),
    })
  ).describe('A list of suggested tournaments for the user, with a reason for each suggestion.'),
});

export type TournamentSuggestionOutput = z.infer<typeof TournamentSuggestionOutputSchema>;

export async function getTournamentSuggestions(input: TournamentSuggestionInput): Promise<TournamentSuggestionOutput> {
  return tournamentSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tournamentSuggestionPrompt',
  input: {schema: TournamentSuggestionInputSchema},
  output: {schema: TournamentSuggestionOutputSchema},
  prompt: `You are an AI tournament suggestion expert. Given a user's game history, skill level, and preferences, you will suggest tournaments that the user might be interested in.

User ID: {{{userId}}}
Game History: {{#each gameHistory}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Skill Level: {{{skillLevel}}}
Preferences: {{{preferences}}}

Suggest tournaments based on this information, providing a reason for each suggestion. Return the data in JSON format.`,
});

const tournamentSuggestionFlow = ai.defineFlow(
  {
    name: 'tournamentSuggestionFlow',
    inputSchema: TournamentSuggestionInputSchema,
    outputSchema: TournamentSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
