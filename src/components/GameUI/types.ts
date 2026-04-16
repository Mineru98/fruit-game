import { Difficulty } from '../Game/types';

export interface GameUIProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
  soundOn: boolean;
  onSoundToggle: () => void;
  timeRemaining: number;
  difficulty: Difficulty | null;
}
