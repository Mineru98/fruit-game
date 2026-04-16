import React from 'react';
import { DIFFICULTY_CONFIG } from '../../constants';
import { Difficulty } from '../Game/types';
import { DifficultyDialogProps } from './types';

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard', 'medmax'];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#00ff88',
  normal: '#00ffff',
  hard: '#ff00ff',
  medmax: '#FFE000',
};

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({ onSelect }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Press Start 2P', monospace",
        zIndex: 1000,
      }}
    >
      <h1
        style={{
          color: '#00ffff',
          fontSize: '14px',
          marginBottom: '32px',
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff',
          letterSpacing: '2px',
        }}
      >
        SELECT DIFFICULTY
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {DIFFICULTIES.map((difficulty) => {
          const config = DIFFICULTY_CONFIG[difficulty];
          const color = DIFFICULTY_COLORS[difficulty];
          return (
            <button
              key={difficulty}
              onClick={() => onSelect(difficulty)}
              style={{
                background: 'transparent',
                border: `2px solid ${color}`,
                color: color,
                fontFamily: "'Press Start 2P', monospace",
                padding: '12px 24px',
                margin: '8px',
                minWidth: '280px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '10px' }}>{config.label}</span>
              <span style={{ fontSize: '7px', opacity: 0.8 }}>{config.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyDialog;
