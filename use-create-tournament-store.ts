
import { create } from "zustand";
import { type TournamentData, tournamentSchema } from "@/lib/validators/tournament";
import { devtools, persist } from "zustand/middleware";
import { getStartTime } from "@/lib/tournament-utils";

type State = {
  currentStep: number;
  formData: TournamentData;
};

type Actions = {
  nextStep: () => void;
  prevStep: () => void;
  setFormData: (data: Partial<TournamentData>) => void;
  reset: () => void;
};

const initialState: State = {
  currentStep: 1,
  formData: {
    id: "",
    title: "",
    gameMode: "BR",
    matchType: "Solo",
    rounds: "7",
    visibility: "public",
    entryFee: 0,
    prizePool: 0,
    startTime: getStartTime(),
    maxPlayers: 48,
    platformFee: 0,
    rules: {
      headshotOnly: false,
      unlimitedAmmo: false,
      gunAttributes: true,
      grenadeThrow: true,
      revive: true,
    },
    presetMode: "Competitive Store",
    gunCardSupport: false,
  },
};

export const useCreateTournamentStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
        prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
        setFormData: (data) =>
          set((state) => ({
            formData: { ...state.formData, ...data },
          })),
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: "create-tournament-store",
      }
    )
  )
);
