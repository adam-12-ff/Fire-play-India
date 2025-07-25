import { config } from 'dotenv';
config();

import '@/ai/flows/predictive-tournament-suggestions.ts';
import '@/ai/flows/auto-room-name.ts';
import '@/ai/flows/ocr-uid-verification.ts';
import '@/ai/flows/ocr-profile-details.ts';
import '@/ai/flows/verify-winner-flow.ts';
