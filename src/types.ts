export interface GameState {
  player1Score: number;
  player2Score: number;
  gameOver: boolean;
  winner: string | null;
}

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  baseSpeed: number;
  lastTouchedBy: 1 | 2 | null;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

export interface GameSettings {
  gameMode: 'pvp' | 'ai';
  gameType: 'classic' | 'pong2';
  ballSpeed: 'slow' | 'normal' | 'fast';
  winningScore: 3 | 5 | 7 | 10 | 20;
  aiDifficulty: 'easy' | 'normal' | 'hard';
}

export interface HighScore {
  playerName: string;
  score: number;
  date: string;
  gameMode: string;
  gameType: string;
}

export type MenuScreen = 'main' | 'mode' | 'options' | 'highscores' | 'game';