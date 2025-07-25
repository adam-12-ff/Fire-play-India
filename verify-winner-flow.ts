
'use server';

/**
 * @fileOverview Implements OCR-based winner verification from a result screenshot.
 *
 * - verifyWinnerFromScreenshot - A function that handles the winner verification process.
 * - VerifyWinnerInput - The input type for the verifyWinnerFromScreenshot function.
 * - VerifyWinnerOutput - The return type for the verifyWinnerFromScreenshot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyWinnerInputSchema = z.object({
  resultScreenshotDataUri: z
    .string()
    .describe(
      "A screenshot of the in-game result screen, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  lobbyScreenshotDataUri: z
    .string()
    .describe(
      "A screenshot of the tournament lobby before the match start, as a data URI."
    ),
    startScreenshotDataUri: z
    .string()
    .describe(
      "A screenshot of the match start (0 kills/0 damage), as a data URI."
    ),
  expectedWinnerName: z.string().describe('The in-game username of the player who claims to be the winner.'),
});
export type VerifyWinnerInput = z.infer<typeof VerifyWinnerInputSchema>;

const VerifyWinnerOutputSchema = z.object({
  isVerified: z.boolean().describe('Whether the screenshot confirms the expected player as the winner.'),
  reason: z.string().describe('The reason for the verification decision (e.g., "Winner name matches", "Player list mismatch", "Winner name not found").'),
  detectedWinnerName: z.string().optional().describe('The name of the winner detected in the screenshot.'),
});
export type VerifyWinnerOutput = z.infer<typeof VerifyWinnerOutputSchema>;

export async function verifyWinnerFromScreenshot(
  input: VerifyWinnerInput
): Promise<VerifyWinnerOutput> {
  return verifyWinnerFlow(input);
}

const verifyWinnerPrompt = ai.definePrompt({
  name: 'verifyWinnerPrompt',
  input: {schema: VerifyWinnerInputSchema},
  output: {schema: VerifyWinnerOutputSchema},
  prompt: `You are an expert OCR system for the game Free Fire with a multi-step verification process. Your task is to analyze three screenshots to verify the winner of a tournament.

**Verification Steps:**

1.  **Player Roster Consistency Check:**
    *   Extract all player usernames from the **Lobby Screenshot**.
    *   Extract all player usernames from the **Start-Game Screenshot**.
    *   Extract all player usernames from the **Result Screenshot**.
    *   Compare the player lists from all three screenshots. They must be identical. If there is any mismatch in the player roster, immediately fail the verification. Set 'isVerified' to false and the 'reason' to "Player roster mismatch between screenshots."

2.  **Winner Verification (only if Step 1 passes):**
    *   The most important text on the result screen is "BOOYAH!" which signifies victory. Check if the **Result Screenshot** contains the "BOOYAH!" text. If it doesn't, the screenshot is invalid.
    *   Analyze the **Result Screenshot** to find the winner's name, which is usually displayed prominently near the "BOOYAH!" text.
    *   Compare the detected winner's name with the 'expectedWinnerName'.

**Output Rules:**

*   If the player roster is inconsistent (Step 1 fails), set 'isVerified' to false and 'reason' to "Player roster mismatch between screenshots.".
*   If the "BOOYAH!" text is missing from the result screenshot, set 'isVerified' to false and set the reason to "Invalid result screenshot. 'BOOYAH!' text not found."
*   If the detected winner's name on the result screenshot matches the 'expectedWinnerName' (and Step 1 passed), set 'isVerified' to true.
*   If the names do not match, or if you cannot find a winner's name on the result screenshot, set 'isVerified' to false.
*   Provide a clear reason for your decision.

**Input Data:**
Expected Winner's In-Game Name: {{{expectedWinnerName}}}
Lobby Screenshot: {{media url=lobbyScreenshotDataUri}}
Start-Game Screenshot: {{media url=startScreenshotDataUri}}
Result Screenshot: {{media url=resultScreenshotDataUri}}
  `,
});

const verifyWinnerFlow = ai.defineFlow(
  {
    name: 'verifyWinnerFlow',
    inputSchema: VerifyWinnerInputSchema,
    outputSchema: VerifyWinnerOutputSchema,
  },
  async input => {
    const {output} = await verifyWinnerPrompt(input);
    return output!;
  }
);
