import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Users, Bot, ArrowLeft, Zap } from 'lucide-react';

export const GameModeScreen: React.FC = () => {
  const { settings, updateSettings, setMenuScreen } = useGameStore();

  const startGame = (gameMode: 'pvp' | 'ai', gameType: 'classic' | 'pong2') => {
    updateSettings({ gameMode, gameType });
    if (gameType === 'pong2') {
      updateSettings({ winningScore: 20 });
    }
    setMenuScreen('game');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">Modo de Juego</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl text-white mb-3">Pong Clásico</h3>
            <button
              onClick={() => startGame('pvp', 'classic')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                settings.gameMode === 'pvp' && settings.gameType === 'classic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-blue-500/10 text-white/80 hover:text-white'
              }`}
            >
              <Users size={24} />
              <span className="text-xl">Jugador vs Jugador</span>
            </button>
            <button
              onClick={() => startGame('ai', 'classic')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                settings.gameMode === 'ai' && settings.gameType === 'classic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-blue-500/10 text-white/80 hover:text-white'
              }`}
            >
              <Bot size={24} />
              <span className="text-xl">Jugador vs IA</span>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl text-white mb-3">Pong 2.0</h3>
            <div className="text-gray-400 text-sm mb-3">
              ¡Gana puntos por rebotes en las paredes! Primer jugador en llegar a 20 puntos gana.
            </div>
            <button
              onClick={() => startGame('pvp', 'pong2')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                settings.gameMode === 'pvp' && settings.gameType === 'pong2'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 hover:bg-purple-500/10 text-white/80 hover:text-white'
              }`}
            >
              <Zap size={24} />
              <span className="text-xl">2.0 - Jugador vs Jugador</span>
            </button>
            <button
              onClick={() => startGame('ai', 'pong2')}
              className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                settings.gameMode === 'ai' && settings.gameType === 'pong2'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 hover:bg-purple-500/10 text-white/80 hover:text-white'
              }`}
            >
              <Zap size={24} />
              <span className="text-xl">2.0 - Jugador vs IA</span>
            </button>
          </div>
        </div>
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={() => setMenuScreen('main')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al Menú Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};