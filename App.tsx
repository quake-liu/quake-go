import React, { useState } from 'react';
import { useGoGame } from './hooks/useGoGame';
import Board from './components/Board';
import Controls from './components/Controls';
import { PlayerColor } from './types';

const App: React.FC = () => {
  const { gameState, placeStone, undoMove, startNewGame } = useGoGame();
  const [gameStarted, setGameStarted] = useState(false);
  const [startingColor, setStartingColor] = useState<PlayerColor>(PlayerColor.Black);

  const handleStartGame = () => {
    startNewGame(startingColor);
    setGameStarted(true);
  };

  const handleExit = () => {
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-4 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-stone-200 text-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-2">Zen Go</h1>
            <p className="text-stone-500 font-serif italic">The Art of Weiqi</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-stone-700 font-semibold">Select Starting Color</p>
            <div className="flex justify-center gap-6">
               <button 
                onClick={() => setStartingColor(PlayerColor.Black)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${startingColor === PlayerColor.Black ? 'border-wood-500 bg-wood-100' : 'border-transparent hover:bg-stone-50'}`}
               >
                 <div className="w-12 h-12 bg-stone-900 rounded-full shadow-stone-black"></div>
                 <span className="font-serif">Black First</span>
               </button>

               <button 
                onClick={() => setStartingColor(PlayerColor.White)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${startingColor === PlayerColor.White ? 'border-wood-500 bg-wood-100' : 'border-transparent hover:bg-stone-50'}`}
               >
                 <div className="w-12 h-12 bg-stone-100 rounded-full shadow-stone-white border border-stone-200"></div>
                 <span className="font-serif">White First</span>
               </button>
            </div>
          </div>

          <button 
            onClick={handleStartGame}
            className="w-full py-4 bg-stone-900 text-white text-lg font-bold rounded-lg hover:bg-stone-800 transition-transform transform hover:scale-[1.02] shadow-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-stone-100 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Zen Go</h1>
      </header>
      
      <Board gameState={gameState} onPlaceStone={placeStone} />
      
      <Controls 
        gameState={gameState} 
        onUndo={undoMove} 
        onReset={handleExit} 
      />

      <footer className="mt-12 text-stone-400 text-sm font-serif">
        Simple rules: Capture by removing liberties. Suicide is forbidden.
      </footer>
    </div>
  );
};

export default App;