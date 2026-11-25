import { config } from '../config';
import type { Cell } from './types';

export const GRID_SIZE = config.GRID_SIZE;

const DIRECTIONS: ReadonlyArray<{ dr: number; dc: number }> = [
  { dr: -1, dc: 0 }, // UP
  { dr: 0, dc: 1 }, // RIGHT
  { dr: 1, dc: 0 }, // DOWN
  { dr: 0, dc: -1 }, // LEFT
];

export function neighbours(cell: Cell): Cell[] {
  const result: Cell[] = [];
  for (const { dr, dc } of DIRECTIONS) {
    const row = cell.row + dr;
    const col = cell.col + dc;
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      result.push({ row, col });
    }
  }
  return result;
}

export function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

export function sameCell(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

export function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
