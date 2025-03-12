// Contient les questions et exercices IKIGAI
import type { QuestionType } from "./types";

export type Problem = {
  type: QuestionType;
  question: string;
  answers?: {icon: JSX.Element | string; name: string}[];
  correctAnswer: number | number[];
  answerTiles?: string[];
  options?: {value: string | number; label: string}[];
  minValue?: number;
  maxValue?: number;
  required?: boolean;
};

export type ModuleQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: {id: string; label: string}[];
  correctAnswer?: string | string[];
  minValue?: number;
  maxValue?: number;
  labels?: string[];
  required?: boolean;
  placeholder?: string;
  maxSelect?: number;
};

// Module 1: Comprendre son équilibre
export const equilibreModule1Questions: ModuleQuestion[] = [
  {
    id: 'equilibre_module1_q1',
    type: 'RATING',
    question: 'Comment évaluez-vous votre équilibre actuel entre vie professionnelle et personnelle ?',
    minValue: 1,
    maxValue: 5,
    labels: ['Très déséquilibré', 'Plutôt déséquilibré', 'Neutre', 'Plutôt équilibré', 'Très équilibré'],
    required: true
  },
  {
    id: 'equilibre_module1_q2',
    type: 'MULTIPLE_CHOICE',
    question: 'Combien d\'heures travaillez-vous en moyenne par semaine ?',
    options: [
      { id: 'less_35', label: 'Moins de 35 heures' },
      { id: '35_40', label: '35 à 40 heures' },
      { id: '40_45', label: '40 à 45 heures' },
      { id: '45_50', label: '45 à 50 heures' },
      { id: 'more_50', label: 'Plus de 50 heures' }
    ],
    required: true
  },
  {
    id: 'equilibre_module1_q3',
    type: 'CHECKBOX',
    question: 'Quels signes de déséquilibre ressentez-vous actuellement ? (Plusieurs réponses possibles)',
    options: [
      { id: 'fatigue', label: 'Fatigue persistante' },
      { id: 'deconnexion', label: 'Difficulté à déconnecter du travail' },
      { id: 'depasse', label: 'Sentiment d\'être dépassé(e)' },
      { id: 'reduction', label: 'Réduction du temps pour les loisirs et relations' },
      { id: 'stress', label: 'Stress chronique' },
      { id: 'sommeil', label: 'Troubles du sommeil' },
      { id: 'aucun', label: 'Aucun signe particulier' }
    ],
    required: true
  },
  {
    id: 'equilibre_module1_q4',
    type: 'TEXT',
    question: 'Quelle action concrète pourriez-vous mettre en place dès cette semaine pour améliorer votre équilibre ?',
    placeholder: 'Par exemple : bloquer 30 minutes par jour pour une activité personnelle',
    required: true
  }
];

// Module 2: Gérer son temps efficacement
export const equilibreModule2Questions: ModuleQuestion[] = [
  {
    id: 'equilibre_module2_q1',
    type: 'MULTIPLE_CHOICE',
    question: 'Quelle technique de gestion du temps vous semble la plus adaptée à votre situation ?',
    options: [
      { id: 'pomodoro', label: 'La technique Pomodoro (25 min de travail, 5 min de pause)' },
      { id: 'eisenhower', label: 'La matrice d\'Eisenhower (Urgent/Important)' },
      { id: 'timeblocking', label: 'Le time-blocking (bloquer des plages horaires dédiées)' },
      { id: 'rule2min', label: 'La règle des 2 minutes' },
      { id: 'other', label: 'Une autre technique' }
    ],
    required: true
  },
  {
    id: 'equilibre_module2_q2',
    type: 'RATING',
    question: 'À quel point arrivez-vous à établir des frontières claires entre votre vie professionnelle et personnelle ?',
    minValue: 1,
    maxValue: 5,
    labels: ['Pas du tout', 'Difficilement', 'Moyennement', 'Plutôt bien', 'Très bien'],
    required: true
  },
  {
    id: 'equilibre_module2_q3',
    type: 'CHECKBOX',
    question: 'Quelles frontières saines allez-vous mettre en place ? (Plusieurs réponses possibles)',
    options: [
      { id: 'horaires', label: 'Définir des heures précises de début et fin de travail' },
      { id: 'espace', label: 'Créer un espace de travail séparé' },
      { id: 'rituel', label: 'Établir un rituel de transition entre travail et vie perso' },
      { id: 'notif', label: 'Désactiver les notifications professionnelles hors travail' },
      { id: 'pause', label: 'Planifier des pauses régulières' },
      { id: 'agenda', label: 'Bloquer du temps dans l\'agenda pour la vie personnelle' }
    ],
    required: true
  },
  {
    id: 'equilibre_module2_q4',
    type: 'TEXT',
    question: 'Décrivez votre planning idéal pour une journée équilibrée',
    placeholder: 'Par exemple : 8h-9h: préparation, 9h-12h: travail concentré...',
    required: true
  }
];

// Contenu simplifié pour les démonstrations de leçons Duolingo
export const lessonProblem1 = {
  type: "SELECT_1_OF_3",
  question: `Quelle phrase correspond le mieux à l'équilibre vie pro-perso ?`,
  answers: [
    { icon: "⚖️", name: "Équilibrer ses activités professionnelles et personnelles" },
    { icon: "📱", name: "Être disponible 24h/24 pour son travail" },
    { icon: "🏃", name: "Travailler sans pause pour être plus productif" },
  ],
  correctAnswer: 0,
} as const;

export const lessonProblem2 = {
  type: "TEXT",
  question: "Qu'est-ce qu'une frontière saine entre vie pro et perso ?",
  answerTiles: ["Une", "limite", "claire", "entre", "travail", "et", "vie", "personnelle"],
  correctAnswer: [0, 1, 2, 3, 4, 5, 6, 7],
} as const;

export const lessonProblems = [lessonProblem1, lessonProblem2];