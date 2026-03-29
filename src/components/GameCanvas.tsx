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
        className={`block mx-auto bg-white ${className || ''}`}
        style={{
          display: 'block',
          margin: '8px auto',
          background: '#fff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
