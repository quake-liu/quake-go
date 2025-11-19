import React from 'react';
import { PlayerColor, Coordinate, STAR_POINTS } from '../types';

interface IntersectionProps {
  x: number;
  y: number;
  stone: PlayerColor | null;
  onClick: (x: number, y: number) => void;
  lastMove: boolean;
}

const Intersection: React.FC<IntersectionProps> = ({ x, y, stone, onClick, lastMove }) => {
  // Check if this is a star point
  const isStarPoint = STAR_POINTS.some(p => p.x === x && p.y === y);

  // Determine grid line visibility based on position (corners/edges)
  const isTop = y === 0;
  const isBottom = y === 18;
  const isLeft = x === 0;
  const isRight = x === 18;

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center cursor-pointer group"
      onClick={() => onClick(x, y)}
    >
      {/* Horizontal Line */}
      <div 
        className={`absolute bg-stone-800 h-[1px] z-0 pointer-events-none
          ${isLeft ? 'left-1/2 w-1/2' : ''} 
          ${isRight ? 'right-1/2 w-1/2' : ''} 
          ${!isLeft && !isRight ? 'w-full' : ''}
        `} 
      />

      {/* Vertical Line */}
      <div 
        className={`absolute bg-stone-800 w-[1px] z-0 pointer-events-none
          ${isTop ? 'top-1/2 h-1/2' : ''} 
          ${isBottom ? 'bottom-1/2 h-1/2' : ''} 
          ${!isTop && !isBottom ? 'h-full' : ''}
        `} 
      />

      {/* Star Point Dot */}
      {isStarPoint && !stone && (
        <div className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-900 rounded-full z-0" />
      )}

      {/* Ghost Stone (Hover Effect) - only if empty */}
      {!stone && (
        <div className="hidden group-hover:block absolute w-[85%] h-[85%] rounded-full bg-black/20 z-10 transform transition-all duration-200" />
      )}

      {/* The Stone */}
      {stone && (
        <div 
          className={`
            absolute w-[90%] h-[90%] rounded-full z-20 transition-all duration-300 transform scale-100
            ${stone === PlayerColor.Black 
              ? 'bg-stone-900 shadow-stone-black' 
              : 'bg-stone-100 shadow-stone-white'}
          `}
        >
           {/* Last move marker */}
           {lastMove && (
             <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full border-2 ${stone === PlayerColor.Black ? 'border-white/50' : 'border-black/50'}`} />
           )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Intersection);
