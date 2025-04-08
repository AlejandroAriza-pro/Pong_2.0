import React, { useEffect } from 'react';
import { Gamepad2, Settings, Trophy, LogOut } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const MenuItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  selected: boolean;
  onClick: () => void;
}> = ({ icon, text, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 text-xl transition-colors ${
      selected
        ? 'bg-blue-500 text-white'
        : 'hover:bg-blue-500/10 text-white/80 hover:text-white'
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export const MainMenu: React.FC = () => {
  const [selectedItem, setSelectedItem] = React.useState(0);
  const setMenuScreen = useGameStore((state) => state.setMenuScreen);

  const menuItems = [
    {
      icon: <Gamepad2 size={24} />,
      text: 'MODO DE JUEGO',
      screen: 'mode' as const,
    },
    {
      icon: <Settings size={24} />,
      text: 'OPCIONES',
      screen: 'options' as const,
    },
    {
      icon: <Trophy size={24} />,
      text: 'RÉCORDS',
      screen: 'highscores' as const,
    },
    {
      icon: <LogOut size={24} />,
      text: 'SALIR',
      action: () => window.close(),
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
          setSelectedItem(parseInt(e.key) - 1);
          break;
        case 'Enter':
          if (menuItems[selectedItem].screen) {
            setMenuScreen(menuItems[selectedItem].screen);
          } else if (menuItems[selectedItem].action) {
            menuItems[selectedItem].action();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, setMenuScreen]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b border-gray-700">
          <h1 className="text-4xl font-bold text-white mb-2">PONG</h1>
          <p className="text-blue-400">Use las teclas 1-4 para navegar</p>
        </div>
        <div className="divide-y divide-gray-700">
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              selected={selectedItem === index}
              onClick={() => {
                setSelectedItem(index);
                if (item.screen) {
                  setMenuScreen(item.screen);
                } else if (item.action) {
                  item.action();
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};