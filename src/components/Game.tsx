import React, { useEffect, useRef, useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { GameState } from '../types';
import { useGameLoop } from '../hooks/useGameLoop';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';
import { useGameStore } from '../store/gameStore';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    player1Score: 0,
    player2Score: 0,
    gameOver: false,
    winner: null,
  });

  const { settings, setMenuScreen } = useGameStore();
  const { startGame, resetGame } = useGameLoop(canvasRef, setGameState, settings);

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-white mb-4 flex items-center gap-8 text-4xl font-bold">
        <div className="flex items-center gap-4">
          <span>Player 1</span>
          <span className="text-blue-400 bg-blue-400/10 px-4 py-2 rounded-lg">
            {gameState.player1Score}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
            {gameState.player2Score}
          </span>
          <span>{settings.gameMode === 'ai' ? 'CPU' : 'Player 2'}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-black rounded-lg shadow-lg"
        />

        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white mb-4">
                <Trophy className="text-yellow-400" size={32} />
                <span>{gameState.winner} Wins!</span>
              </div>
              <div className="space-x-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Jugar de nuevo
                </button>
                <button
                  onClick={() => setMenuScreen('main')}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Menú Principal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-white text-center">
        <h2 className="text-xl font-bold mb-2">Controles</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-1">Player 1</h3>
            <p>W - Subir</p>
            <p>S - Bajar</p>
          </div>
          {settings.gameMode === 'pvp' && (
            <div>
              <h3 className="font-semibold mb-1">Player 2</h3>
              <p>↑ - Subir</p>
              <p>↓ - Bajar</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setMenuScreen('main')}
        className="mt-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver al Menú Principal</span>
      </button>
    </div>
  );
}