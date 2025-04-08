import React from 'react';
import { useGameStore } from './store/gameStore';
import { MainMenu } from './components/MainMenu';
import { GameModeScreen } from './components/GameModeScreen';
import { OptionsScreen } from './components/OptionsScreen';
import { HighScoresScreen } from './components/HighScoresScreen';
import { Game } from './components/Game';

function App() {
  const menuScreen = useGameStore((state) => state.menuScreen);

  return (
    <>
      {menuScreen === 'main' && <MainMenu />}
      {menuScreen === 'mode' && <GameModeScreen />}
      {menuScreen === 'options' && <OptionsScreen />}
      {menuScreen === 'highscores' && <HighScoresScreen />}
      {menuScreen === 'game' && <Game />}
    </>
  );
}

export default App;