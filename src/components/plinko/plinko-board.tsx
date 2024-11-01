'use client';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

const GAME_CONSTANTS = {
  PIN: {
    SIZE: 8,
    GAP: 24,
  },
  BALL: {
    SIZE: 4,
    SPEED: 2,
  },
  MULTIPLIERS: ['16x', '9x', '2x', '1.4x', '1.4x', '1.2x', '1.1x', '1x', '0.5x', '1x', '1.1x', '1.2x', '1.4x', '1.4x', '2x', '9x', '16x'],
  COLORS: {
    '16x': '#FF3333',  
    '9x': '#FF4444',  
    '2x': '#FF8850',  
    '1.4x': '#FFA542',
    '1.2x': '#FFB83B', 
    '1.1x': '#FFC933', 
    '1x': '#FFD700',   
    '0.5x': '#FFE44D', 
  },
} as const;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PlinkoBoardProps {
  width: number;
  height: number;
  rows: number;
}

interface Pin {
  x: number;
  y: number;
}

function usePins(rows: number, width: number, height: number): Pin[] {
  return useMemo(() => {
    const pins: Pin[] = [];
    const verticalPadding = height * 0.1;
    const verticalSpace = height - (verticalPadding * 2);
    const verticalGap = verticalSpace / (rows - 1);
    
    const multiplierWidth = width / GAME_CONSTANTS.MULTIPLIERS.length;
    
    for (let row = 0; row < rows; row++) {
      const pinsInRow = row + 3;
      
      const horizontalSpace = multiplierWidth * (pinsInRow - 1);
      const startX = (width * 0.05)/2 + (width - horizontalSpace) / 2;
      
      for (let pin = 0; pin < pinsInRow; pin++) {
        pins.push({
          x: startX + (pin * multiplierWidth),
          y: verticalPadding + (row * verticalGap),
        });
      }
    }
    return pins;
  }, [rows, width, height]);
}

const renderUtils = {
  drawPin: (ctx: CanvasRenderingContext2D, pin: Pin) => {
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, GAME_CONSTANTS.PIN.SIZE/2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  },

  drawBall: (ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, GAME_CONSTANTS.BALL.SIZE, 0, Math.PI * 2);
    ctx.fillStyle = 'pink';
    ctx.fill();
    ctx.closePath();
  },

  drawMultiplier: (
    ctx: CanvasRenderingContext2D, 
    multiplier: string, 
    x: number, 
    y: number, 
    width: number,
    height: number
  ) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x, y, width - 1, height);

    const color = GAME_CONSTANTS.COLORS[multiplier as keyof typeof GAME_CONSTANTS.COLORS] || GAME_CONSTANTS.COLORS['1x'];
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustColor(color, -20));

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width - 1, height);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.fillStyle = 'white';
    ctx.font = `bold ${height * 0.35}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(multiplier, x + width/2, y + height/2);
    ctx.shadowBlur = 0;
  }
};

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function PlinkoBoard({ width, height, rows }: PlinkoBoardProps) {
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const pins = usePins(rows, width - width * 0.05, height);

  const { isDropping, finishBall} = usePlinkoStore(state => state);

  const drawPins = useCallback((ctx: CanvasRenderingContext2D) => {
    pins.forEach(pin => renderUtils.drawPin(ctx, pin));
  }, [pins]);

  const drawMultipliers = useCallback((ctx: CanvasRenderingContext2D) => {
    const multiplierHeight = height * 0.06;
    const multiplierY = height - multiplierHeight;
    const multiplierWidth = width / GAME_CONSTANTS.MULTIPLIERS.length;
    
    GAME_CONSTANTS.MULTIPLIERS.forEach((mult, index) => {
      renderUtils.drawMultiplier(
        ctx, 
        mult, 
        index * multiplierWidth, 
        multiplierY, 
        multiplierWidth,
        multiplierHeight
      );
    });
  }, [height, width]);

  const handleCollision = (ball: Ball, pin: Pin): Ball => {
    const direction = Math.random() < 0.5 ? -1 : 1;
    return {
      ...ball,
      x: pin.x + (direction * GAME_CONSTANTS.PIN.GAP/4),
      y: pin.y,
      vx: direction * GAME_CONSTANTS.BALL.SPEED * 0.5,
      vy: GAME_CONSTANTS.BALL.SPEED
    };
  };

  const animate = useCallback((ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.clearRect(0, 0, width, height);
    drawPins(ctx);
    drawMultipliers(ctx);
    
    let updatedBall = {
      ...ball,
      x: ball.x + ball.vx,
      y: ball.y + ball.vy
    };
    
    pins.forEach((pin) => {
      const dx = updatedBall.x - pin.x;
      const dy = updatedBall.y - pin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (GAME_CONSTANTS.PIN.SIZE/2 + GAME_CONSTANTS.BALL.SIZE/2)) {
        updatedBall = handleCollision(updatedBall, pin);
      }
    });

    if (updatedBall.y < height) {
      renderUtils.drawBall(ctx, updatedBall);
      animationRef.current = requestAnimationFrame(() => animate(ctx, updatedBall));
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      finishBall()
    }
}, [width, height, pins, drawPins, drawMultipliers]);

  const handleNewBall = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const newBall: Ball = {
      x: width / 2,
      y: 0,
      vx: 0,
      vy: GAME_CONSTANTS.BALL.SPEED
    };

    animationRef.current = requestAnimationFrame(() => animate(ctx, newBall));
    setBalls(prev => [...prev, newBall]);
  }, [width, animate]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    drawPins(ctx);
    drawMultipliers(ctx);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawPins, drawMultipliers]);

  useEffect(() => {
    if (isDropping) {
      handleNewBall();
    }
  }, [isDropping, handleNewBall]);

  return (
    <div className='bg-primary-800 p-5 flex flex-col items-center'>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className='bg-primary-800'
      />
    </div>
  );
}