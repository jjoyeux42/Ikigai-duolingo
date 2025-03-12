import type { TileType } from "./types";

export type Unit = {
  unitNumber: number;
  description: string;
  backgroundColor: `bg-${string}`;
  borderColor: `border-${string}`;
  textColor: `text-${string}`;
  tiles: Tile[];
};

export type Tile = {
  type: TileType;
  description: string;
  badgeId?: string;
};

// Structure inspirée de l'île IKIGAI
export const units: Unit[] = [
  {
    unitNumber: 1,
    description: "Équilibre Vie Pro-Perso",
    backgroundColor: "bg-[#41D185]",
    borderColor: "border-[#2F9D00]",
    textColor: "text-[#41D185]",
    tiles: [
      {
        type: "book",
        description: "Comprendre son équilibre",
        badgeId: "explorer_equilibre"
      },
      {
        type: "dumbbell",
        description: "Gérer son temps efficacement",
        badgeId: "maitre_temps"
      },
      {
        type: "book",
        description: "Cultiver le sens et la satisfaction",
        badgeId: "chercheur_sens"
      },
      {
        type: "treasure",
        description: "Récompense"
      },
      {
        type: "trophy",
        description: "Maîtrise de l'Équilibre",
        badgeId: "maitre_equilibre"
      }
    ]
  },
  {
    unitNumber: 2,
    description: "Pleine Conscience",
    backgroundColor: "bg-[#4EAAF0]",
    borderColor: "border-[#1CB0F6]",
    textColor: "text-[#4EAAF0]",
    tiles: [
      {
        type: "book",
        description: "Initiation à la pleine conscience",
        badgeId: "meditant"
      },
      {
        type: "dumbbell",
        description: "Observation sans jugement",
        badgeId: "observateur"
      },
      {
        type: "book",
        description: "Pleine conscience au quotidien",
        badgeId: "present"
      },
      {
        type: "treasure",
        description: "Récompense"
      },
      {
        type: "trophy",
        description: "Maîtrise de la Pleine Conscience"
      }
    ]
  },
  {
    unitNumber: 3,
    description: "Résilience & Stress",
    backgroundColor: "bg-[#FF8747]",
    borderColor: "border-[#F49000]",
    textColor: "text-[#FF8747]",
    tiles: [
      {
        type: "book",
        description: "Comprendre le stress",
        badgeId: "zen"
      },
      {
        type: "dumbbell",
        description: "Développer sa résilience",
        badgeId: "resilient"
      },
      {
        type: "book",
        description: "Équilibre émotionnel",
        badgeId: "equilibre"
      },
      {
        type: "treasure",
        description: "Récompense"
      },
      {
        type: "trophy",
        description: "Maîtrise de la Résilience"
      }
    ]
  },
  {
    unitNumber: 4,
    description: "Relations Saines",
    backgroundColor: "bg-[#B069F8]",
    borderColor: "border-[#A560E8]",
    textColor: "text-[#B069F8]",
    tiles: [
      {
        type: "book",
        description: "Communication authentique",
        badgeId: "communicateur"
      },
      {
        type: "dumbbell",
        description: "Développer l'empathie",
        badgeId: "empathique"
      },
      {
        type: "book",
        description: "Collaboration positive",
        badgeId: "collaborateur"
      },
      {
        type: "treasure",
        description: "Récompense"
      },
      {
        type: "trophy",
        description: "Maîtrise des Relations Saines"
      }
    ]
  },
  {
    unitNumber: 5,
    description: "Vitalité & Énergie",
    backgroundColor: "bg-[#FF5252]",
    borderColor: "border-[#E53535]",
    textColor: "text-[#FF5252]",
    tiles: [
      {
        type: "book",
        description: "Gérer son énergie",
        badgeId: "energique"
      },
      {
        type: "dumbbell",
        description: "Habitudes de vitalité",
        badgeId: "vitalite"
      },
      {
        type: "book",
        description: "Équilibre corps-esprit",
        badgeId: "equilibre_global"
      },
      {
        type: "treasure",
        description: "Récompense"
      },
      {
        type: "trophy",
        description: "Maîtrise de la Vitalité"
      }
    ]
  }
];