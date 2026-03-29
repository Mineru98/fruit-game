import { forwardRef } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
  className?: string;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width, height, className }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className={`block mx-auto ${className || ''}`}
        style={{
          display: 'block',
          margin: '6px auto',
          background: '#000000',
          border: '2px solid #00ffff',
          boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 30px rgba(0,255,255,0.04)',
          cursor: 'pointer',
          maxWidth: '100%',
          height: 'auto',
          touchAction: 'none',
        }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
