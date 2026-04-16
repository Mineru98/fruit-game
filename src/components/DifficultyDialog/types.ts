import { Difficulty } from '../Game/types';

export interface DifficultyDialogProps {
  onSelect: (difficulty: Difficulty) => void;
}
