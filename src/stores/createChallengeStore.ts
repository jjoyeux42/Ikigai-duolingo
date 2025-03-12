import type { BoundStateCreator } from "~/hooks/useBoundStore";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  color: string;
  category: string;
  duration: string;
}

export interface ChallengeSlice {
  completedChallenges: string[];
  dailyChallenges: Challenge[];
  completeChallenge: (challengeId: string) => void;
  isChallengeCompleted: (challengeId: string) => boolean;
  refreshDailyChallenges: () => void;
}

const defaultChallenges: Challenge[] = [
  {
    id: 'mindful_breathing',
    title: 'Respirez en pleine conscience',
    description: 'Prendre 5 minutes aujourd\'hui pour respirer profondément et vous reconnecter à l\'instant présent',
    points: 50,
    icon: '🫁',
    color: '#4EAAF0',
    category: 'mindfulness',
    duration: '5 min'
  },
  {
    id: 'digital_detox',
    title: 'Détox numérique',
    description: 'Prenez une pause de 30 minutes sans téléphone ni écran pour vous reconnecter à votre environnement',
    points: 50,
    icon: '📵',
    color: '#41D185',
    category: 'balance',
    duration: '30 min'
  },
  {
    id: 'gratitude_practice',
    title: 'Pratique de gratitude',
    description: 'Notez 3 choses pour lesquelles vous êtes reconnaissant aujourd\'hui',
    points: 50,
    icon: '🙏',
    color: '#B069F8',
    category: 'positivity',
    duration: '5 min'
  },
  {
    id: 'mindful_break',
    title: 'Pause consciente',
    description: 'Faites une pause de 10 minutes en pleine conscience entre deux réunions',
    points: 50,
    icon: '⏸️',
    color: '#FF8747',
    category: 'stress',
    duration: '10 min'
  }
];

export const createChallengeSlice: BoundStateCreator<ChallengeSlice> = (set, get) => ({
  completedChallenges: [],
  dailyChallenges: defaultChallenges,
  completeChallenge: (challengeId) => {
    if (!get().isChallengeCompleted(challengeId)) {
      set({ completedChallenges: [...get().completedChallenges, challengeId] });
    }
  },
  isChallengeCompleted: (challengeId) => {
    return get().completedChallenges.includes(challengeId);
  },
  refreshDailyChallenges: () => {
    // Cette fonction pourrait générer de nouveaux défis, mais pour simplifier
    // nous réutilisons les défis par défaut
    set({ dailyChallenges: defaultChallenges });
  }
});