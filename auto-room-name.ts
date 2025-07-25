
'use server';

/**
 * @fileOverview AI-powered automatic room name generation for tournaments.
 *
 * - generateRoomName - A function that generates a creative room name.
 * - GenerateRoomNameInput - The input type for the generateRoomName function.
 * - GenerateRoomNameOutput - The return type for the generateRoomName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoomNameInputSchema = z.object({
  gameMode: z.string().describe('The game mode of the tournament (e.g., BR, CS).'),
  roomSize: z.string().describe('The room size of the tournament (e.g., 1v1, 4v4).'),
});
export type GenerateRoomNameInput = z.infer<typeof GenerateRoomNameInputSchema>;

const GenerateRoomNameOutputSchema = z.object({
  roomName: z.string().describe('The generated room name for the tournament.'),
});
export type GenerateRoomNameOutput = z.infer<typeof GenerateRoomNameOutputSchema>;

export async function generateRoomName(input: GenerateRoomNameInput): Promise<GenerateRoomNameOutput> {
  return generateRoomNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoomNamePrompt',
  input: {schema: GenerateRoomNameInputSchema},
  output: {schema: GenerateRoomNameOutputSchema},
  prompt: `You are an expert copywriter specializing in creating cool, stylish, and attention-grabbing names for online gaming tournaments, especially for an Indian audience. Your tone should be energetic and exciting.

Generate a unique and engaging room name based on the provided game mode and room size. The name should be short, memorable, and make players feel like they are entering an epic battle.

Game Mode: {{{gameMode}}}
Room Size: {{{roomSize}}}

**Guidelines:**
1.  **Be Creative & Stylish:** Use a mix of English and Hinglish if it sounds cool. Think like a pro gamer.
2.  **Mode-Specific:**
    *   For **Battle Royale (BR)**, names should feel grand, epic, and about survival. Examples: 'BR ka Badshah', 'Survival Showdown', 'Aakhri Zone Tak'.
    *   For **Clash Squad (CS)**, names should be about quick action, team fights, and skill. Examples: 'CS Kings', '4v4 Takedown', 'Squad Ki Takkar'.
3.  **Short & Punchy:** The name must not be longer than 30 characters.
4.  **Unique:** Avoid generic names like "My Tournament".

Generate the best possible room name based on these rules.`,
});

const generateRoomNameFlow = ai.defineFlow(
  {
    name: 'generateRoomNameFlow',
    inputSchema: GenerateRoomNameInputSchema,
    outputSchema: GenerateRoomNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    