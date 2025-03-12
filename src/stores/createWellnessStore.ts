import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type WellnessLevel = "low" | "medium" | "high" | "excellent";

export interface WellnessSlice {
  wellnessScore: number;
  wellnessLevel: WellnessLevel;
  setWellnessScore: (score: number) => void;
  increaseWellnessScore: (amount: number) => void;
  decreaseWellnessScore: (amount: number) => void;
}

export const createWellnessSlice: BoundStateCreator<WellnessSlice> = (
  set,
  get
) => ({
  wellnessScore: 65,
  wellnessLevel: "medium",
  setWellnessScore: (score) => {
    const level = 
      score < 40 ? "low" : 
      score < 70 ? "medium" : 
      score < 90 ? "high" : "excellent";
      
    set({ wellnessScore: score, wellnessLevel: level });
  },
  increaseWellnessScore: (amount) => {
    const newScore = Math.min(100, get().wellnessScore + amount);
    get().setWellnessScore(newScore);
  },
  decreaseWellnessScore: (amount) => {
    const newScore = Math.max(0, get().wellnessScore - amount);
    get().setWellnessScore(newScore);
  }
});