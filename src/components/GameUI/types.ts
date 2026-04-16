export interface GameUIProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
  soundOn: boolean;
  onSoundToggle: () => void;
}
