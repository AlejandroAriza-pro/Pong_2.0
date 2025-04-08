import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, Trophy } from 'lucide-react';

export const HighScoresScreen: React.FC = () => {
  const { highScores, setMenuScreen } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b border-gray-700">
          <Trophy size={40} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Récords</h2>
        </div>
        <div className="p-6">
          {highScores.length > 0 ? (
            <div className="space-y-3">
              {highScores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold">{score.playerName}</p>
                    <p className="text-sm text-gray-400">
                      {score.gameMode} - {new Date(score.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {score.score}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">
              No hay récords disponibles
            </p>
          )}
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