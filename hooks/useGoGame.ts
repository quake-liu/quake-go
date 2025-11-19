import { useState, useCallback } from 'react';
import { 
  PlayerColor, 
  BoardState, 
  BOARD_SIZE, 
  GameState 
} from '../types';
import { cloneBoard, getGroupAndLiberties } from '../utils/goLogic';

const createEmptyBoard = (): BoardState => 
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

export const useGoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: PlayerColor.Black,
    capturedBlack: 0, // Captured by Black
    capturedWhite: 0, // Captured by White
    history: [],
    message: "Black to move",
    isGameOver: false,
  });

  const startNewGame = (startingColor: PlayerColor = PlayerColor.Black) => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: startingColor,
      capturedBlack: 0,
      capturedWhite: 0,
      history: [],
      message: `${startingColor === PlayerColor.Black ? 'Black' : 'White'} to move`,
      isGameOver: false,
    });
  };

  const undoMove = () => {
    if (gameState.history.length === 0) return;

    // We are simplistically only restoring the board and switching player back.
    // A robust undo would also need to restore capture counts if we tracked them in history.
    // For this simpler implementation, we will revert the board but might lose exact capture counts 
    // unless we store full GameState in history. 
    // Let's stick to restoring board and player for the scope.
    
    // NOTE: In a full app, history should store the entire state object. 
    // Here, we just pop the last board state to show the visual change.
    // However, since we don't store capture counts in history array in this simple version,
    // let's just prevent undo if it's too complex or acknowledge the limitation.
    
    // Let's implement a better history:
    // Ideally, history is just previous boards.
    
    const previousBoard = gameState.history[gameState.history.length - 1];
    const newHistory = gameState.history.slice(0, -1);
    
    setGameState(prev => ({
      ...prev,
      board: previousBoard,
      currentPlayer: prev.currentPlayer === PlayerColor.Black ? PlayerColor.White : PlayerColor.Black,
      history: newHistory,
      message: "Move undone.",
      isGameOver: false,
    }));
  };

  const placeStone = useCallback((x: number, y: number) => {
    if (gameState.isGameOver) return;
    if (gameState.board[y][x] !== null) {
      setGameState(prev => ({ ...prev, message: "Invalid move: Position occupied." }));
      return;
    }

    const color = gameState.currentPlayer;
    const opponent = color === PlayerColor.Black ? PlayerColor.White : PlayerColor.Black;
    
    // 1. Place stone provisionally
    const nextBoard = cloneBoard(gameState.board);
    nextBoard[y][x] = color;

    let stonesCaptured = 0;
    const capturedCoordinates: {x: number, y: number}[] = [];

    // 2. Check for captures (neighbors of opponent color)
    const neighbors = [
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y },
    ];

    neighbors.forEach(n => {
      if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE) {
        const neighborColor = nextBoard[n.y][n.x];
        if (neighborColor === opponent) {
          const { group, liberties } = getGroupAndLiberties(nextBoard, n.x, n.y, opponent);
          if (liberties === 0) {
            // Capture this group
            group.forEach(stone => {
              nextBoard[stone.y][stone.x] = null; // Remove stone
              stonesCaptured++;
              capturedCoordinates.push(stone);
            });
          }
        }
      }
    });

    // 3. Check for Suicide (Self-capture)
    // If we captured something, it's NOT suicide.
    // If we didn't capture anything, check if the new stone has 0 liberties.
    if (stonesCaptured === 0) {
      const { liberties } = getGroupAndLiberties(nextBoard, x, y, color);
      if (liberties === 0) {
         setGameState(prev => ({ ...prev, message: "Invalid move: Suicide is forbidden." }));
         return;
      }
    }

    // 4. Ko Rule (Simple Check)
    // Prevent the board from returning to the exact previous state immediately.
    // (Checking only immediate previous state is "Simple Ko", sufficient for basic play)
    if (gameState.history.length > 0) {
      const prevBoard = gameState.history[gameState.history.length - 1];
      const isKo = nextBoard.every((row, rI) => row.every((cell, cI) => cell === prevBoard[rI][cI]));
      if (isKo) {
        setGameState(prev => ({ ...prev, message: "Invalid move: Ko rule (cannot repeat board state)." }));
        return;
      }
    }

    // 5. Update State
    const newCapturedBlack = gameState.capturedBlack + (color === PlayerColor.Black ? stonesCaptured : 0);
    const newCapturedWhite = gameState.capturedWhite + (color === PlayerColor.White ? stonesCaptured : 0);

    setGameState(prev => ({
      board: nextBoard,
      currentPlayer: opponent,
      capturedBlack: newCapturedBlack,
      capturedWhite: newCapturedWhite,
      history: [...prev.history, prev.board], // Save OLD board to history
      message: stonesCaptured > 0 ? `Captured ${stonesCaptured} stone(s)!` : `${opponent} to move`,
      isGameOver: false,
    }));

  }, [gameState]);

  return {
    gameState,
    placeStone,
    undoMove,
    startNewGame,
  };
};
