'use server';

/**
 * @fileOverview Implements OCR-based profile detail extraction from a screenshot.
 *
 * - extractProfileDetailsFromScreenshot - A function that handles the profile detail extraction process.
 * - ExtractProfileDetailsInput - The input type for the extractProfileDetailsFromScreenshot function.
 * - ExtractProfileDetailsOutput - The return type for the extractProfileDetailsFromScreenshot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractProfileDetailsInputSchema = z.object({
  screenshotDataUri: z
    .string()
    .describe(
      "A screenshot of the in-game profile, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractProfileDetailsInput = z.infer<typeof ExtractProfileDetailsInputSchema>;

const ExtractProfileDetailsOutputSchema = z.object({
  uid: z.string().describe('The extracted User ID (UID) from the screenshot. This should be a numeric string.'),
  level: z.string().describe('The extracted player level from the screenshot. This should be a numeric string.'),
  username: z.string().describe('The extracted username from the screenshot.'),
});
export type ExtractProfileDetailsOutput = z.infer<typeof ExtractProfileDetailsOutputSchema>;

export async function extractProfileDetailsFromScreenshot(
  input: ExtractProfileDetailsInput
): Promise<ExtractProfileDetailsOutput> {
  return extractProfileDetailsFlow(input);
}

const ocrProfilePrompt = ai.definePrompt({
  name: 'ocrProfilePrompt',
  input: {schema: ExtractProfileDetailsInputSchema},
  output: {schema: ExtractProfileDetailsOutputSchema},
  prompt: `You are an OCR (Optical Character Recognition) expert specializing in extracting information from game profile screenshots, specifically from games like Free Fire.

  Analyze the provided screenshot and extract the following details:
  1.  **UID**: The unique player identifier, which is a sequence of numbers.
  2.  **Level**: The player's current level, also a number.
  3.  **Username**: The player's in-game name.

  Return the extracted information in the specified JSON format.

  Screenshot: {{media url=screenshotDataUri}}
  `,
});

const extractProfileDetailsFlow = ai.defineFlow(
  {
    name: 'extractProfileDetailsFlow',
    inputSchema: ExtractProfileDetailsInputSchema,
    outputSchema: ExtractProfileDetailsOutputSchema,
  },
  async input => {
    const {output} = await ocrProfilePrompt(input);
    return output!;
  }
);
