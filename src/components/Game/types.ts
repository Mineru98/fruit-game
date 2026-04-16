export type GamePhase = 'title' | 'difficulty' | 'countdown' | 'playing';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'medmax';

export interface DifficultyConfig {
  label: string;
  scale: number;
  timeLimit: number;
  description: string;
}
