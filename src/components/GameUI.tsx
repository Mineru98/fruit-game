import React from 'react';

interface GameUIProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
}

export default function GameUI({ score, gameOver, onRestart }: GameUIProps) {
  return (
    <div className="mt-6 text-center">
      <div className="text-2xl font-bold text-red-600 mb-4">
        점수: <span className="text-3xl">{score}</span>
      </div>
      <div className="text-sm text-gray-600 mb-4">
        ⬅️ ➡️ 이동 | Space 떨어뜨리기
      </div>
      {gameOver && (
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
        >
          게임 다시 시작 (Space)
        </button>
      )}
    </div>
  );
}
