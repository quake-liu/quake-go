import React from 'react';
import { RotateCcw, Play, RefreshCw, Info } from 'lucide-react';
import { GameState, PlayerColor } from '../types';

interface ControlsProps {
  gameState: GameState;
  onUndo: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ gameState, onUndo, onReset }) => {
  return (
    <div className="flex flex-col w-full max-w-[650px] mt-6 gap-4 px-4">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-stone-200">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full shadow-sm border ${gameState.currentPlayer === PlayerColor.Black ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-300'}`}></div>
          <span className="font-serif font-bold text-lg text-stone-800">
            {gameState.currentPlayer === PlayerColor.Black ? 'Black Turn' : 'White Turn'}
          </span>
        </div>
        <div className="text-sm text-stone-500 italic font-serif">
          {gameState.message}
        </div>
      </div>

      {/* Score / Captures */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-stone-800 text-stone-100 p-3 rounded-lg shadow flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-sm uppercase tracking-wider">Captured White</span>
          </div>
          <span className="text-xl font-bold">{gameState.capturedBlack}</span>
        </div>

        <div className="bg-white text-stone-800 p-3 rounded-lg shadow border border-stone-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <span className="text-sm uppercase tracking-wider">Captured Black</span>
          </div>
          <span className="text-xl font-bold">{gameState.capturedWhite}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-2">
        <button 
          onClick={onUndo}
          disabled={gameState.history.length === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-800 rounded transition-colors font-semibold"
        >
          <RotateCcw size={18} /> Undo
        </button>
        
        <button 
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-wood-500 hover:bg-wood-600 text-white shadow-md rounded transition-colors font-semibold"
        >
          <RefreshCw size={18} /> New Game
        </button>
      </div>
    </div>
  );
};

export default Controls;