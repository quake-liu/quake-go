import React, { useMemo } from 'react';
import { GameState, PlayerColor } from '../types';
import Intersection from './Intersection';

interface BoardProps {
  gameState: GameState;
  onPlaceStone: (x: number, y: number) => void;
}

const Board: React.FC<BoardProps> = ({ gameState, onPlaceStone }) => {
  // Determine last move coordinate to highlight it
  const lastBoard = gameState.history[gameState.history.length - 1];
  let lastMoveCoord: {x: number, y: number} | null = null;
  
  if (lastBoard) {
      // Find the diff between current board and last board to confirm last move
      // Note: This is a simplistic check. In a real app, we might store lastMove in state.
      for(let y=0; y<19; y++) {
          for(let x=0; x<19; x++) {
              if (gameState.board[y][x] !== lastBoard[y][x] && gameState.board[y][x] !== null) {
                  lastMoveCoord = {x, y};
                  break;
              }
          }
          if(lastMoveCoord) break;
      }
  }

  // Pre-calculate indices to avoid inline arrays causing re-renders
  const rows = useMemo(() => Array.from({ length: 19 }, (_, i) => i), []);
  const cols = useMemo(() => Array.from({ length: 19 }, (_, i) => i), []);

  return (
    <div className="relative select-none p-2 md:p-4 bg-wood-400 rounded shadow-board border border-wood-600">
      {/* Wood Texture Gradient Overlay (Simulated with CSS) */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none rounded" />
      
      {/* Axis Labels (Optional but nice) - Simplified: omitting for clean aesthetics matching prompt image, 
          but adding coordinates makes it 'pro'. Prompt image has letters A-T and numbers 1-19. 
      */}
      <div className="flex flex-col">
        
        {/* Top Letters */}
        <div className="flex pl-6 md:pl-8 mb-1 text-[8px] md:text-xs font-sans text-stone-800 font-bold justify-between w-full pr-1">
             {'ABCDEFGHJKLMNOPQRST'.split('').map(char => <span key={char} className="flex-1 text-center">{char}</span>)}
        </div>

        <div className="flex">
            {/* Left Numbers */}
            <div className="flex flex-col justify-between pr-1 md:pr-2 text-[8px] md:text-xs font-sans text-stone-800 font-bold h-auto py-1 md:py-2">
                {Array.from({length: 19}, (_, i) => 19 - i).map(num => <span key={num} className="flex-1 flex items-center justify-end h-full">{num}</span>)}
            </div>

            {/* The Grid */}
            <div 
                className="grid grid-cols-[repeat(19,1fr)] grid-rows-[repeat(19,1fr)] w-full aspect-square bg-wood-400 border border-stone-800 relative z-10"
                style={{
                    width: 'min(85vw, 600px)',
                    height: 'min(85vw, 600px)',
                }}
            >
                {rows.map(y => (
                    cols.map(x => (
                        <Intersection 
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            stone={gameState.board[y][x]}
                            onClick={onPlaceStone}
                            lastMove={lastMoveCoord?.x === x && lastMoveCoord?.y === y}
                        />
                    ))
                ))}
            </div>

            {/* Right Numbers */}
            <div className="flex flex-col justify-between pl-1 md:pl-2 text-[8px] md:text-xs font-sans text-stone-800 font-bold h-auto py-1 md:py-2">
                {Array.from({length: 19}, (_, i) => 19 - i).map(num => <span key={num} className="flex-1 flex items-center justify-start h-full">{num}</span>)}
            </div>
        </div>

         {/* Bottom Letters */}
         <div className="flex pl-6 md:pl-8 mt-1 text-[8px] md:text-xs font-sans text-stone-800 font-bold justify-between w-full pr-1">
             {'ABCDEFGHJKLMNOPQRST'.split('').map(char => <span key={char} className="flex-1 text-center">{char}</span>)}
        </div>

      </div>
    </div>
  );
};

export default Board;