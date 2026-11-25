import { cellKey, neighbours, sameCell } from './grid';
import type { Cell, GameMap } from './types';

export function linkedNeighbours(map: GameMap, cell: Cell): Cell[] {
  const result: Cell[] = [];
  for (const candidate of neighbours(cell)) {
    const isLinked = map.links.some(
      ([a, b]) =>
        (sameCell(a, cell) && sameCell(b, candidate)) ||
        (sameCell(b, cell) && sameCell(a, candidate))
    );
    if (isLinked) {
      result.push(candidate);
    }
  }
  return result;
}

export function nextStep(
  map: GameMap,
  at: Cell,
  previous: Cell | null
): Cell {
  const options = linkedNeighbours(map, at);
  for (const option of options) {
    if (!previous || !sameCell(option, previous)) {
      return option;
    }
  }
  return previous ?? at;
}

export function walk(map: GameMap, start: Cell, steps: number): Cell {
  let current = start;
  let previous: Cell | null = null;
  for (let i = 0; i < steps; i++) {
    const next = nextStep(map, current, previous);
    previous = current;
    current = next;
  }
  return current;
}

export function distancesFrom(
  map: GameMap,
  target: Cell
): Map<string, number> {
  const distances = new Map<string, number>();
  const queue: Cell[] = [target];
  distances.set(cellKey(target), 0);

  let head = 0;
  while (head < queue.length) {
    const current = queue[head++]!;
    const dist = distances.get(cellKey(current))!;
    for (const next of linkedNeighbours(map, current)) {
      const key = cellKey(next);
      if (!distances.has(key)) {
        distances.set(key, dist + 1);
        queue.push(next);
      }
    }
  }

  return distances;
}

export function stepToward(map: GameMap, from: Cell, target: Cell): Cell {
  if (sameCell(from, target)) return from;

  const distances = distancesFrom(map, target);
  const currentDist = distances.get(cellKey(from));
  if (currentDist === undefined) return from;

  for (const option of linkedNeighbours(map, from)) {
    if (distances.get(cellKey(option)) === currentDist - 1) {
      return option;
    }
  }
  return from;
}
