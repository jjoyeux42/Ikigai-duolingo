// Importation des îles et des modules IKIGAI
import { islands } from "./islands";

// Structure pour stocker tous les modules IKIGAI
export const allModules: Array<{
  id: string;
  title: string;
  description: string;
  icon: string;
  islandId: string;
  islandName: string;
  islandColor: string;
  questions: any[];
  content: string;
  duration: string;
  level: number;
  points: number;
}> = [];

// Transformation des modules IKIGAI en format compatible avec les leçons Duolingo
islands.forEach(island => {
  // Ensure that island.modules is an array
  if (Array.isArray(island.modules)) {
    island.modules.forEach(module => {
      allModules.push({
        id: module.id,
        title: module.title,
        description: module.description,
        icon: module.icon,
        islandId: island.id,
        islandName: island.name,
        islandColor: island.color,
        questions: module.questions || [],
        content: module.content || "",
        duration: module.duration || "15 min",
        level: module.level || 1,
        points: module.points || 100,
      });
    });
  }
});

// Fonction pour obtenir un module par son ID
export const getModuleById = (id: string) => {
  return allModules.find(module => module.id === id) || null;
};