import type { BoundStateCreator } from "~/hooks/useBoundStore";

export interface ModuleSlice {
  completedModules: Record<string, boolean>;
  currentModule: string | null;
  completeModule: (moduleId: string) => void;
  setCurrentModule: (moduleId: string | null) => void;
  isModuleCompleted: (moduleId: string) => boolean;
}

export const createModuleSlice: BoundStateCreator<ModuleSlice> = (set, get) => ({
  completedModules: {},
  currentModule: null,
  completeModule: (moduleId) => {
    const updatedModules = { ...get().completedModules };
    updatedModules[moduleId] = true;
    set({ completedModules: updatedModules });
  },
  setCurrentModule: (moduleId) => {
    set({ currentModule: moduleId });
  },
  isModuleCompleted: (moduleId) => {
    return !!get().completedModules[moduleId];
  }
});