import { type GameMode, type MatchType } from "./validators/tournament";

export const getMaxPlayers = (gameMode: GameMode, matchType: MatchType): number => {
  const map = {
    BR: { Solo: 48, Duo: 24, Squad: 12 },
    CS: { Solo: 2, Duo: 4, Squad: 8 },
  };
  return map[gameMode]?.[matchType] || 0;
};

export const calculatePlatformFee = (entryFee: number): number => {
    if (entryFee >= 9001 && entryFee <= 10000) return 50;
    if (entryFee >= 8001 && entryFee <= 9000) return 45;
    if (entryFee >= 7001 && entryFee <= 8000) return 40;
    if (entryFee >= 6001 && entryFee <= 7000) return 35;
    if (entryFee >= 5001 && entryFee <= 6000) return 30;
    if (entryFee >= 4001 && entryFee <= 5000) return 25;
    if (entryFee >= 3001 && entryFee <= 4000) return 20;
    if (entryFee >= 2001 && entryFee <= 3000) return 15;
    if (entryFee >= 1001 && entryFee <= 2000) return 10;
    if (entryFee >= 501 && entryFee <= 1000) return 5;
    if (entryFee >= 101 && entryFee <= 500) return 3;
    if (entryFee >= 1 && entryFee <= 100) return 1.5;
    return 0;
};

export const getStartTime = (): Date => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    return date;
};

export const generateTournamentId = (): string => {
    return `FP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
