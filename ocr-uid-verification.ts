'use server';

/**
 * @fileOverview Implements OCR-based UID verification from a screenshot.
 *
 * - verifyUidFromScreenshot - A function that handles the UID verification process.
 * - VerifyUidFromScreenshotInput - The input type for the verifyUidFromScreenshot function.
 * - VerifyUidFromScreenshotOutput - The return type for the verifyUidFromScreenshot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyUidFromScreenshotInputSchema = z.object({
  screenshotDataUri: z
    .string()
    .describe(
      "A screenshot of the in-game profile, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyUidFromScreenshotInput = z.infer<typeof VerifyUidFromScreenshotInputSchema>;

const VerifyUidFromScreenshotOutputSchema = z.object({
  uid: z.string().describe('The extracted UID from the screenshot.'),
  confidence: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the accuracy of the OCR extraction.'
    ),
});
export type VerifyUidFromScreenshotOutput = z.infer<typeof VerifyUidFromScreenshotOutputSchema>;

export async function verifyUidFromScreenshot(
  input: VerifyUidFromScreenshotInput
): Promise<VerifyUidFromScreenshotOutput> {
  return verifyUidFromScreenshotFlow(input);
}

const ocrUidPrompt = ai.definePrompt({
  name: 'ocrUidPrompt',
  input: {schema: VerifyUidFromScreenshotInputSchema},
  output: {schema: VerifyUidFromScreenshotOutputSchema},
  prompt: `You are an OCR (Optical Character Recognition) expert specializing in extracting UIDs from game profile screenshots.

  Analyze the provided screenshot and extract the UID. Return the extracted UID and a confidence score (0-1) indicating the accuracy of the extraction. If the UID cannot be reliably determined, return a low confidence score.

  Screenshot: {{media url=screenshotDataUri}}
  `,
});

const verifyUidFromScreenshotFlow = ai.defineFlow(
  {
    name: 'verifyUidFromScreenshotFlow',
    inputSchema: VerifyUidFromScreenshotInputSchema,
    outputSchema: VerifyUidFromScreenshotOutputSchema,
  },
  async input => {
    const {output} = await ocrUidPrompt(input);
    return output!;
  }
);
