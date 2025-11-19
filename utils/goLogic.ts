import { BoardState, PlayerColor, BOARD_SIZE, Coordinate } from '../types';

// Helpers for directions (Up, Down, Left, Right)
const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

// Deep clone the board to avoid mutating state directly during calculations
export const cloneBoard = (board: BoardState): BoardState => {
  return board.map(row => [...row]);
};

// Check if a coordinate is on the board
const isOnBoard = (x: number, y: number): boolean => {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
};

// Get the group of stones connected to (x, y) of the same color
// Returns the group coordinates and the number of liberties
export const getGroupAndLiberties = (
  board: BoardState,
  startX: number,
  startY: number,
  color: PlayerColor
): { group: Coordinate[]; liberties: number } => {
  const group: Coordinate[] = [];
  const visited = new Set<string>();
  const liberties = new Set<string>(); // Use a set to count unique liberties
  const stack: Coordinate[] = [{ x: startX, y: startY }];

  visited.add(`${startX},${startY}`);

  while (stack.length > 0) {
    const current = stack.pop()!;
    group.push(current);

    for (const dir of DIRECTIONS) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;

      if (!isOnBoard(nx, ny)) continue;

      const neighborKey = `${nx},${ny}`;
      const neighborColor = board[ny][nx];

      if (neighborColor === null) {
        // It's an empty spot, so it's a liberty
        liberties.add(neighborKey);
      } else if (neighborColor === color && !visited.has(neighborKey)) {
        // Same color, part of the group
        visited.add(neighborKey);
        stack.push({ x: nx, y: ny });
      }
    }
  }

  return { group, liberties: liberties.size };
};

export const hasLiberties = (board: BoardState, x: number, y: number, color: PlayerColor): boolean => {
  return getGroupAndLiberties(board, x, y, color).liberties > 0;
};
