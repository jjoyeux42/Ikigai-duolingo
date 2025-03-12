import type { BoundStateCreator } from "~/hooks/useBoundStore";

export interface IslandProgress {
  id: string;
  progress: number;
  completedModules: number;
}

export interface IslandSlice {
  islandProgress: Record<string, IslandProgress>;
  activeIsland: string | null;
  updateIslandProgress: (islandId: string, completedModules: number, totalModules: number) => void;
  setActiveIsland: (islandId: string | null) => void;
  getIslandProgress: (islandId: string) => number;
}

export const createIslandSlice: BoundStateCreator<IslandSlice> = (set, get) => ({
  islandProgress: {},
  activeIsland: null,
  updateIslandProgress: (islandId, completedModules, totalModules) => {
    const progress = Math.round((completedModules / totalModules) * 100);
    const islandProgress = { ...get().islandProgress };
    
    islandProgress[islandId] = {
      id: islandId,
      progress,
      completedModules
    };
    
    set({ islandProgress });
  },
  setActiveIsland: (islandId) => {
    set({ activeIsland: islandId });
  },
  getIslandProgress: (islandId) => {
    return get().islandProgress[islandId]?.progress || 0;
  }
});