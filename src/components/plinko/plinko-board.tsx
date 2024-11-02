'use client';

import { usePlinkoStore, type Ball } from '@/stores/plinko-store';
import { useEffect, useMemo, useRef, useCallback } from 'react';

export const GAME_CONSTANTS = {
  PIN: {
    SIZE: 8,
    GAP: 24,
  },
  BALL: {
    SIZE: 6,
    SPEED: 2.5,
  },
  MULTIPLIERS: {
    'low': ['16x', '9x', '2x', '1.4x', '1.4x', '1.2x', '1.1x', '1x', '0.5x', '1x', '1.1x', '1.2x', '1.4x', '1.4x', '2x', '9x', '16x'],
    'medium': [],
    'high': [],
  },
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

interface PlinkoBoardProps {
  width: number;
  height: number;
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
    
    const multiplierWidth = width / GAME_CONSTANTS.MULTIPLIERS['low'].length;
    
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

  drawBall: (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, GAME_CONSTANTS.BALL.SIZE, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  },
};

function getCurrentRow(pinIndex: number): number {
  let pinsSum = 0;
  let currentRow = 0;
  
  while (pinsSum <= pinIndex) {
    currentRow++;
    pinsSum += currentRow + 2;
  }
  
  return currentRow - 1;
}

interface AnimationBall {
  animationRefNumber: number | undefined;
  ball: Ball;
}

interface BallMovement {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export function PlinkoBoard({ width, height }: PlinkoBoardProps) {
  const { rows } = usePlinkoStore(state => state);
  
  const { balls, drawAllBalls } = usePlinkoStore(state => state)

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animations = useRef<AnimationBall[]>([]);
  const pins = usePins(Number(rows), width - width * 0.05, height);

  const drawPins = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    pins.forEach(pin => renderUtils.drawPin(ctx, pin));
  }, [pins]);

  const handleCollision = (ball: Ball, pin: Pin, currentRow: number): BallMovement => {
    const direction = ball.directions[currentRow];

    return {
      x: pin.x + (direction === 'left' ? -1 : 1) * GAME_CONSTANTS.PIN.GAP/4,
      y: pin.y,
      vx: (direction === 'left' ? -1 : 1) * GAME_CONSTANTS.BALL.SPEED * 0.5,
      vy: GAME_CONSTANTS.BALL.SPEED
    };
  };

  const animate = useCallback((ctx: CanvasRenderingContext2D, ball: Ball, ballMovement?: BallMovement) => {
    const prevX = ballMovement?.x || width / 2;
    const prevY = ballMovement?.y || 0;
    ctx.clearRect(
      prevX - GAME_CONSTANTS.BALL.SIZE * 2,
      prevY - GAME_CONSTANTS.BALL.SIZE * 2,
      GAME_CONSTANTS.BALL.SIZE * 4,
      GAME_CONSTANTS.BALL.SIZE * 4
    );
    
    pins.forEach(pin => {
      const dx = prevX - pin.x;
      const dy = prevY - pin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < GAME_CONSTANTS.BALL.SIZE * 2 + GAME_CONSTANTS.PIN.SIZE) {
        renderUtils.drawPin(ctx, pin);
      }
    });

    const x = ballMovement?.x || width / 2;
    const y = ballMovement?.y || 0;
    const vx = ballMovement?.vx || 0;
    const vy = ballMovement?.vy || GAME_CONSTANTS.BALL.SPEED;
    
    let updatedBall: BallMovement = {
      ...ballMovement,
      x: x + vx,
      y: y + vy
    };

    pins.forEach((pin, indexPin) => {
      const dx = updatedBall.x - pin.x;
      const dy = updatedBall.y - pin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (GAME_CONSTANTS.PIN.SIZE/2 + GAME_CONSTANTS.BALL.SIZE/2)) {
        const currentRowPin = getCurrentRow(indexPin)
        updatedBall = handleCollision(ball, pin, currentRowPin);
      }
    });
 
    if (updatedBall.y < height) {
      renderUtils.drawBall(ctx, updatedBall.x, updatedBall.y);
      const newAnimationRefNumber = requestAnimationFrame(() => animate(ctx, ball, updatedBall));
      UpdateAnimationRefNumber(ball.id, newAnimationRefNumber)
    } else {
      clearAnimation(ball.id)
      ball.callback()
    }
}, [width, height, pins, drawPins]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    drawPins(ctx);

    return () => {
      clearAllAnimations()
    };
  }, [drawPins]);

  function clearAllAnimations() {
    const currentAnimations = animations.current
    currentAnimations.forEach(animation => {
      if (animation.animationRefNumber) {
        cancelAnimationFrame(animation.animationRefNumber);
      }
    });
    animations.current = []
  }

  function clearAnimation(ballId: string) {
    const currentAnimations = animations.current
    const animationIndex = currentAnimations.findIndex(animation => animation.ball.id === ballId)
    if (animationIndex !== -1) {
      if (currentAnimations[animationIndex].animationRefNumber) {
        cancelAnimationFrame(currentAnimations[animationIndex].animationRefNumber);
        currentAnimations[animationIndex].animationRefNumber = undefined
      }
    }
  }

  function UpdateAnimationRefNumber(ballId: string, animationRefNumber: number) {
    const currentAnimations = animations.current
    const animationIndex = currentAnimations.findIndex(animation => animation.ball.id === ballId)
    if (animationIndex !== -1) {
      currentAnimations[animationIndex].animationRefNumber = animationRefNumber
    }
  }

  useEffect(() => {
    const ballsWithoutDraw = balls.filter(ball => ball.drawn === false);
    if (ballsWithoutDraw.length === 0) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const existingBallIds = animations.current.map(a => a.ball.id);
    const newBalls = ballsWithoutDraw.filter(ball => !existingBallIds.includes(ball.id));

    for (const ball of newBalls) {
      const animationRefNumber = requestAnimationFrame(() => animate(ctx, ball));
  
      animations.current.push({
        animationRefNumber,
        ball
      });
    }

    drawAllBalls()
  }, [balls])

  return (
    <div className='bg-primary-800 p-5 flex flex-col items-center'>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className='bg-primary-800'
      />
      
      <div className='flex gap-2'>
        {GAME_CONSTANTS.MULTIPLIERS['low'].map((multiplier, i) => (
          <div 
            key={i} 
            className={`text-white text-sm p-2 rounded-md`}
            style={{ backgroundColor: GAME_CONSTANTS.COLORS[multiplier as keyof typeof GAME_CONSTANTS.COLORS] }}
          >
            <span className='text-xs font-extrabold text-zinc-800'>{multiplier}</span>
          </div>
        ))}
      </div>
    </div>
  );
}