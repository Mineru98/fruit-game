import { GameUIProps } from './types';

const FONT = "'Press Start 2P', monospace";

export default function GameUI({ score, gameOver, onRestart, soundOn, onSoundToggle, timeRemaining, difficulty }: GameUIProps) {
  const scoreStr = String(score).padStart(5, '0');

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ fontFamily: FONT, width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      {/* 타이틀 */}
      <div style={{
        textAlign: 'center',
        color: '#FFE000',
        fontSize: '11px',
        letterSpacing: '3px',
        textShadow: '0 0 12px #FFE000, 0 0 24px #FFE00066',
        marginBottom: '8px',
        paddingTop: '4px',
      }}>
        ★ FRUIT GAME ★
      </div>

      {/* 점수판 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 8px',
        marginBottom: '4px',
      }}>
        <div>
          <div style={{ color: '#00ffff', fontSize: '7px', letterSpacing: '2px' }}>1UP</div>
          <div style={{ color: '#ffffff', fontSize: '11px', marginTop: '3px' }}>{scoreStr}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff00ff', fontSize: '7px', letterSpacing: '2px' }}>HI SCORE</div>
          <div style={{ color: '#ffffff', fontSize: '11px', marginTop: '3px' }}>99999</div>
        </div>
        {difficulty && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#ff00ff', fontSize: '7px', letterSpacing: '2px' }}>TIME</div>
            <div style={{
              color: timeRemaining <= 10 ? '#ff0055' : '#00ffff',
              fontSize: '11px',
              marginTop: '3px',
              animation: timeRemaining <= 10 ? 'blink 0.5s step-end infinite' : 'none',
            }}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        )}
      </div>

      {/* 조작 안내 + 사운드 토글 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', marginTop: '6px' }}>
        <div style={{ color: '#444', fontSize: '6px', letterSpacing: '1px' }}>
          <span className="hidden md:inline">LEFT RIGHT MOVE | SPACE DROP</span>
          <span className="md:hidden">TOUCH TO AIM &amp; DROP</span>
        </div>
        <button
          onClick={onSoundToggle}
          style={{
            fontFamily: FONT,
            color: soundOn ? '#00ffff' : '#444',
            background: 'transparent',
            border: 'none',
            fontSize: '10px',
            cursor: 'pointer',
            padding: '2px 4px',
          }}
          title={soundOn ? 'SOUND ON' : 'SOUND OFF'}
        >
          {soundOn ? 'SND' : 'OFF'}
        </button>
      </div>

      {/* 재시작 버튼 */}
      {gameOver && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={onRestart}
            style={{
              fontFamily: FONT,
              color: '#ff00ff',
              border: '2px solid #ff00ff',
              background: 'transparent',
              padding: '8px 20px',
              fontSize: '8px',
              letterSpacing: '2px',
              cursor: 'pointer',
              animation: 'blink 1s step-end infinite',
              boxShadow: '0 0 10px rgba(255,0,255,0.4)',
            }}
          >
            PRESS START
          </button>
        </div>
      )}
    </div>
  );
}
