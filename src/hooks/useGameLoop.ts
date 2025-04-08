import { useCallback, useRef } from 'react';
import {
  BALL_SIZE,
  BALL_SPEED_INCREMENT,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_BALL_SPEED,
  MAX_BALL_SPEED,
  PADDLE_HEIGHT,
  PADDLE_OFFSET,
  PADDLE_SPEED,
  PADDLE_WIDTH,
} from '../constants';
import { Ball, GameState, Paddle, GameSettings } from '../types';

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  settings: GameSettings
) {
  const ballRef = useRef<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED,
    baseSpeed: INITIAL_BALL_SPEED,
    lastTouchedBy: null,
  });

  const paddle1Ref = useRef<Paddle>({
    x: PADDLE_OFFSET,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
  });

  const paddle2Ref = useRef<Paddle>({
    x: CANVAS_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
  });

  const animationFrameRef = useRef<number>();

  const updateAIPaddle = useCallback(() => {
    const ball = ballRef.current;
    const paddle = paddle2Ref.current;
    const paddleCenter = paddle.y + paddle.height / 2;
    const ballCenter = ball.y + BALL_SIZE / 2;
    
    if (ball.dx > 0) {
      let aiSpeed = PADDLE_SPEED;
      switch (settings.aiDifficulty) {
        case 'easy':
          aiSpeed *= 0.5;
          break;
        case 'normal':
          aiSpeed *= 1.0;
          break;
        case 'hard':
          aiSpeed *= 1.5;
          break;
      }

      let targetY = ballCenter;
      if (settings.aiDifficulty === 'hard') {
        const timeToIntercept = (paddle.x - ball.x) / ball.dx;
        targetY = ball.y + ball.dy * timeToIntercept;
        targetY = Math.max(PADDLE_HEIGHT / 2, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT / 2, targetY));
      }

      if (Math.abs(paddleCenter - targetY) > aiSpeed) {
        paddle.dy = paddleCenter < targetY ? aiSpeed : -aiSpeed;
      } else {
        paddle.dy = 0;
      }
    } else {
      if (Math.abs(paddleCenter - CANVAS_HEIGHT / 2) > PADDLE_SPEED) {
        paddle.dy = paddleCenter < CANVAS_HEIGHT / 2 ? PADDLE_SPEED : -PADDLE_SPEED;
      } else {
        paddle.dy = 0;
      }
    }
  }, [settings.aiDifficulty]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
        paddle1Ref.current.dy = -PADDLE_SPEED;
        break;
      case 's':
        paddle1Ref.current.dy = PADDLE_SPEED;
        break;
      case 'ArrowUp':
        if (settings.gameMode === 'pvp') {
          paddle2Ref.current.dy = -PADDLE_SPEED;
        }
        break;
      case 'ArrowDown':
        if (settings.gameMode === 'pvp') {
          paddle2Ref.current.dy = PADDLE_SPEED;
        }
        break;
    }
  }, [settings.gameMode]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
      case 's':
        paddle1Ref.current.dy = 0;
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        if (settings.gameMode === 'pvp') {
          paddle2Ref.current.dy = 0;
        }
        break;
    }
  }, [settings.gameMode]);

  const resetBall = useCallback(() => {
    const ball = ballRef.current;
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.speed = INITIAL_BALL_SPEED;
    ball.baseSpeed = INITIAL_BALL_SPEED;
    ball.lastTouchedBy = null;
    
    const angle = (Math.random() * Math.PI / 4) - Math.PI / 8;
    const direction = Math.random() < 0.5 ? 1 : -1;
    ball.dx = direction * ball.speed * Math.cos(angle);
    ball.dy = ball.speed * Math.sin(angle);
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const ball = ballRef.current;
    const paddle1 = paddle1Ref.current;
    const paddle2 = paddle2Ref.current;

    if (settings.gameMode === 'ai') {
      updateAIPaddle();
    }

    paddle1.y = Math.max(0, Math.min(CANVAS_HEIGHT - paddle1.height, paddle1.y + paddle1.dy));
    paddle2.y = Math.max(0, Math.min(CANVAS_HEIGHT - paddle2.height, paddle2.y + paddle2.dy));

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + BALL_SIZE >= CANVAS_HEIGHT) {
      ball.dy = -ball.dy;
      
      // En modo Pong 2.0, dar puntos por rebotes en las paredes
      if (settings.gameType === 'pong2' && ball.lastTouchedBy !== null) {
        setGameState(prev => ({
          ...prev,
          player1Score: prev.player1Score + (ball.lastTouchedBy === 1 ? 1 : 0),
          player2Score: prev.player2Score + (ball.lastTouchedBy === 2 ? 1 : 0),
        }));
      }
    }

    // Ball collision with paddles
    const checkPaddleCollision = (paddle: Paddle, playerNumber: 1 | 2) => {
      if (
        ball.x < paddle.x + paddle.width &&
        ball.x + BALL_SIZE > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + BALL_SIZE > paddle.y
      ) {
        ball.lastTouchedBy = playerNumber;
        return true;
      }
      return false;
    };

    if (checkPaddleCollision(paddle1, 1) || checkPaddleCollision(paddle2, 2)) {
      ball.dx = -ball.dx;
      ball.speed = Math.min(ball.speed + BALL_SPEED_INCREMENT, MAX_BALL_SPEED);
      const paddle = checkPaddleCollision(paddle1, 1) ? paddle1 : paddle2;
      const relativeIntersectY = (paddle.y + (paddle.height / 2)) - (ball.y + (BALL_SIZE / 2));
      const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);
      const bounceAngle = normalizedIntersectY * Math.PI / 4;
      
      ball.dx = Math.sign(ball.dx) * ball.speed * Math.cos(bounceAngle);
      ball.dy = -ball.speed * Math.sin(bounceAngle);
    }

    // Score points for wall hits
    setGameState((prev) => {
      let newState = { ...prev };

      if (ball.x <= 0) {
        newState.player2Score++;
        resetBall();
      } else if (ball.x + BALL_SIZE >= CANVAS_WIDTH) {
        newState.player1Score++;
        resetBall();
      }

      if (newState.player1Score >= settings.winningScore) {
        newState.gameOver = true;
        newState.winner = 'Player 1';
      } else if (newState.player2Score >= settings.winningScore) {
        newState.gameOver = true;
        newState.winner = settings.gameMode === 'ai' ? 'CPU' : 'Player 2';
      }

      return newState;
    });

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

    // Draw current ball speed and game type
    ctx.font = '16px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(`Speed: ${ball.speed.toFixed(1)} - ${settings.gameType === 'pong2' ? 'Pong 2.0' : 'Classic'}`, 10, 20);

    animationFrameRef.current = requestAnimationFrame(updateGame);
  }, [resetBall, setGameState, settings.gameMode, settings.gameType, settings.winningScore, updateAIPaddle]);

  const startGame = useCallback(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    resetBall();
    updateGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, resetBall, updateGame]);

  const resetGame = useCallback(() => {
    setGameState({
      player1Score: 0,
      player2Score: 0,
      gameOver: false,
      winner: null,
    });
    resetBall();
    paddle1Ref.current.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    paddle2Ref.current.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
  }, [resetBall]);

  return { startGame, resetGame };
}