export type Badge = {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  
  export type Island = {
    id: string;
    name: string;
    description: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
    icon: string;
    modules: number;
    mascot: string;
    badges: {
      [key: string]: Badge;
    };
  };
  
  export const islands = [
    {
      id: 'equilibre',
      name: "Équilibre Vie Pro-Perso",
      description: "Explorer l'équilibre entre vie professionnelle et personnelle",
      color: "#41D185",
      icon: "⚖️",
      modules: 3,
      mascot: "🧘"
    },
    {
      id: 'pleine_conscience',
      name: "Pleine Conscience",
      description: "Pratiquez la mindfulness et la présence au quotidien",
      color: "#4EAAF0",
      icon: "🧠",
      modules: 3,
      mascot: "🦋"
    },
    {
      id: 'resilience',
      name: "Résilience & Stress",
      description: "Développez votre résilience face aux situations stressantes",
      color: "#FF8747",
      icon: "🛡️",
      modules: 3,
      mascot: "🦁"
    },
    {
      id: 'relations',
      name: "Relations Saines",
      description: "Cultivez des relations professionnelles épanouissantes",
      color: "#B069F8",
      icon: "👥",
      modules: 3,
      mascot: "🦊"
    },
    {
      id: 'vitalite',
      name: "Vitalité & Énergie",
      description: "Optimisez votre énergie et votre vitalité au quotidien",
      color: "#FF5252",
      icon: "⚡",
      modules: 3,
      mascot: "🐯"
    }
  ];