import { create } from 'zustand';
import { GameSettings, HighScore, MenuScreen } from '../types';

interface GameStore {
  menuScreen: MenuScreen;
  settings: GameSettings;
  highScores: HighScore[];
  setMenuScreen: (screen: MenuScreen) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  addHighScore: (score: HighScore) => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  gameMode: 'pvp',
  gameType: 'classic',
  ballSpeed: 'normal',
  winningScore: 5,
  aiDifficulty: 'normal',
};

export const useGameStore = create<GameStore>((set) => ({
  menuScreen: 'main',
  settings: DEFAULT_SETTINGS,
  highScores: [],
  setMenuScreen: (screen) => set({ menuScreen: screen }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  addHighScore: (score) =>
    set((state) => ({
      highScores: [...state.highScores, score]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
    })),
}));