import { Difficulty, DifficultyConfig } from './components/Game/types';

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;
export const SPAWN_Y = 50;

export const NEON_COLORS: Record<number, string> = {
  1: '#ff0055',
  2: '#ff3366',
  3: '#cc00ff',
  4: '#ff9900',
  5: '#ff8800',
  6: '#ff2222',
  7: '#ccdd22',
  8: '#ff88aa',
  9: '#ffdd00',
  10: '#99cc66',
  11: '#ff1155',
};

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { label: 'EASY', scale: 1.0, timeLimit: 120, description: '큰 과일 · 2분' },
  normal: { label: 'NORMAL', scale: 0.85, timeLimit: 90, description: '보통 크기 · 90초' },
  hard: { label: 'HARD', scale: 0.7, timeLimit: 60, description: '작은 과일 · 60초' },
  medmax: { label: 'MEDMAX', scale: 0.55, timeLimit: 45, description: '극소 과일 · 45초' },
};
