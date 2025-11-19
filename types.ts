export enum PlayerColor {
  Black = 'BLACK',
  White = 'WHITE'
}

export interface Coordinate {
  x: number;
  y: number;
}

// The board is a 2D array where each cell can be a color or null (empty)
export type BoardState = (PlayerColor | null)[][];

export interface GameState {
  board: BoardState;
  currentPlayer: PlayerColor;
  capturedBlack: number; // Stones captured BY Black (white stones removed)
  capturedWhite: number; // Stones captured BY White (black stones removed)
  history: BoardState[]; // For undo
  message: string; // Status or error message
  isGameOver: boolean;
}

export const BOARD_SIZE = 19;

// Star points for a 19x19 board (0-indexed)
export const STAR_POINTS: Coordinate[] = [
  { x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 },
  { x: 3, y: 9 }, { x: 9, y: 9 }, { x: 15, y: 9 },
  { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 },
];