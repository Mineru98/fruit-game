interface GameUIProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
}

export default function GameUI({ score, gameOver, onRestart }: GameUIProps) {
  return (
    <div className="mt-3 text-center">
      <div className="text-2xl font-bold text-red-600 mb-2">
        점수: <span className="text-3xl">{score}</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">
        <span className="hidden md:inline">⬅️ ➡️ 이동 | Space/클릭으로 떨어뜨리기</span>
        <span className="md:hidden">터치로 위치 지정 후 손 떼면 떨어짐</span>
      </div>
      {gameOver && (
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:bg-blue-700 transition text-lg"
        >
          다시 시작
        </button>
      )}
    </div>
  );
}
