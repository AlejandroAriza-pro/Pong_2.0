import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft } from 'lucide-react';

export const OptionsScreen: React.FC = () => {
  const { settings, updateSettings, setMenuScreen } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">Opciones</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-white text-xl mb-3">Velocidad de la Pelota</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['slow', 'normal', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ ballSpeed: speed })}
                  className={`p-2 rounded ${
                    settings.ballSpeed === speed
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-white/80 hover:bg-blue-500/10'
                  }`}
                >
                  {speed === 'slow'
                    ? 'Lenta'
                    : speed === 'normal'
                    ? 'Normal'
                    : 'Rápida'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white text-xl mb-3">Puntos para Ganar</h3>
            <div className="grid grid-cols-4 gap-2">
              {([3, 5, 7, 10] as const).map((score) => (
                <button
                  key={score}
                  onClick={() => updateSettings({ winningScore: score })}
                  className={`p-2 rounded ${
                    settings.winningScore === score
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-white/80 hover:bg-blue-500/10'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white text-xl mb-3">Dificultad de la IA</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'normal', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => updateSettings({ aiDifficulty: difficulty })}
                  className={`p-2 rounded ${
                    settings.aiDifficulty === difficulty
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-white/80 hover:bg-blue-500/10'
                  }`}
                >
                  {difficulty === 'easy'
                    ? 'Fácil'
                    : difficulty === 'normal'
                    ? 'Normal'
                    : 'Difícil'}
                </button>
              ))}
            </div>
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