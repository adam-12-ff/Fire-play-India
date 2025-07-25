
import { z } from "zod";

export const participantSchema = z.object({
  uid: z.string(),
  name: z.string(),
  username: z.string(),
  gameUid: z.string(),
  level: z.string().optional(),
  rank: z.string().optional(),
  fireplayId: z.string().optional(),
  isVerified: z.boolean().optional(),
});

export const presetModeSchema = z.enum([
  "Competitive Store",
  "Random Store",
  "Crazy Store",
  "Headshot Mode",
  "CS Elite"
]);

export const tournamentSchema = z.object({
  id: z.string(),
  gameMode: z.enum(["BR", "CS"], {
    required_error: "You need to select a game mode.",
  }),
  matchType: z.enum(["Solo", "Duo", "Squad"], {
    required_error: "You need to select a match type.",
  }),
  rounds: z.enum(["7", "13", "15"]).optional(),
  visibility: z.enum(["public", "private"]),
  maxPlayers: z.number().int().positive(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(50),
  entryFee: z.preprocess(
    (val) => Number(val),
    z.number({invalid_type_error: "Entry fee must be a number."}).positive({ message: "Entry fee must be greater than 0." })
  ),
  platformFee: z.number(),
  prizePool: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number({invalid_type_error: "Prize pool must be a number."}).nonnegative()
  ),
  startTime: z.date(),
  rules: z.object({
    headshotOnly: z.boolean().default(false),
    unlimitedAmmo: z.boolean().default(false),
    gunAttributes: z.boolean().default(true),
    grenadeThrow: z.boolean().default(true),
    revive: z.boolean().default(true),
  }),
  presetMode: presetModeSchema,
  gunCardSupport: z.boolean().default(false),
  // Fields for internal use, not part of the form
  hostId: z.string().optional(),
  hostName: z.string().optional(),
  participants: z.array(z.string()).optional(), // Array of UIDs
  participants_details: z.record(participantSchema).optional(), // Map of UID to participant details
  status: z.enum(["pending", "live", "completed", "cancelled"]).optional(),
  roomId: z.string().optional(),
  roomPassword: z.string().optional(),
  roomLink: z.string().url().optional().or(z.literal('')),
  winner: z.object({ uid: z.string(), name: z.string() }).optional(),
  lobbyScreenshotUrl: z.string().url().optional(),
  startScreenshotUrl: z.string().url().optional(),
  resultScreenshotUrl: z.string().url().optional(),
});

export type TournamentData = z.infer<typeof tournamentSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type GameMode = TournamentData['gameMode'];
export type MatchType = TournamentData['matchType'];
