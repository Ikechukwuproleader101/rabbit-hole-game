// Answer logic. In production only the server may import this. Do not import into client code except through the local dev adapter.

import { config } from '../config';
import { manhattan, sameCell } from './grid';
import { stepToward, walk } from './movement';
import type { Cell, Curveball, CurveballType, GameMap } from './types';

export const CURVEBALL_TYPES: readonly CurveballType[] = [
  'cranky',
  'mirror',
  'social',
  'cavein',
];

const CURVEBALL_TEXTS: Record<CurveballType, string> = {
  cranky:
    'The top-most rabbit got cranky and moved 3 steps along the tunnel.',
  mirror:
    'The bottom-most rabbit panicked and jumped to the horizontally mirrored hole.',
  social:
    'The left-most rabbit got lonely and moved 1 step closer to the right-most rabbit along the shortest tunnel path.',
  cavein:
    "A tunnel collapsed! The right-most rabbit's hole is blocked, so it retreated 1 step toward the center of the board.",
};

export function curveballText(type: CurveballType): string {
  return CURVEBALL_TEXTS[type];
}

function pickBestIndex(
  rabbits: readonly Cell[],
  isBetter: (candidate: Cell, best: Cell) => boolean
): number {
  if (rabbits.length === 0) {
    throw new Error('Cannot select target from empty rabbits list');
  }
  let bestIdx = 0;
  for (let i = 1; i < rabbits.length; i++) {
    if (isBetter(rabbits[i]!, rabbits[bestIdx]!)) {
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function selectTarget(
  type: CurveballType,
  rabbits: readonly Cell[]
): number {
  switch (type) {
    case 'cranky':
      // top-most: smallest row; ties -> smallest col
      return pickBestIndex(
        rabbits,
        (a, b) => a.row < b.row || (a.row === b.row && a.col < b.col)
      );
    case 'mirror':
      // bottom-most: largest row; ties -> smallest col
      return pickBestIndex(
        rabbits,
        (a, b) => a.row > b.row || (a.row === b.row && a.col < b.col)
      );
    case 'social':
      // left-most: smallest col; ties -> smallest row
      return pickBestIndex(
        rabbits,
        (a, b) => a.col < b.col || (a.col === b.col && a.row < b.row)
      );
    case 'cavein':
      // right-most: largest col; ties -> smallest row
      return pickBestIndex(
        rabbits,
        (a, b) => a.col > b.col || (a.col === b.col && a.row < b.row)
      );
  }
}

export function findCenterHole(map: GameMap): Cell {
  const center: Cell = { row: 2, col: 2 };
  let best = map.holes[0]!;
  let bestDist = manhattan(best, center);

  for (let i = 1; i < map.holes.length; i++) {
    const hole = map.holes[i]!;
    const dist = manhattan(hole, center);
    if (
      dist < bestDist ||
      (dist === bestDist &&
        (hole.row < best.row || (hole.row === best.row && hole.col < best.col)))
    ) {
      best = hole;
      bestDist = dist;
    }
  }
  return best;
}

function mirrorDestination(map: GameMap, start: Cell): Cell {
  const mirroredCol = config.GRID_SIZE - 1 - start.col;
  const exact: Cell = { row: start.row, col: mirroredCol };
  if (map.holes.some((h) => sameCell(h, exact))) {
    return exact;
  }

  const sameRowHoles = map.holes.filter((h) => h.row === start.row);
  let best = sameRowHoles[0]!;
  let bestDist = Math.abs(best.col - mirroredCol);
  for (let i = 1; i < sameRowHoles.length; i++) {
    const hole = sameRowHoles[i]!;
    const dist = Math.abs(hole.col - mirroredCol);
    if (dist < bestDist || (dist === bestDist && hole.col < best.col)) {
      best = hole;
      bestDist = dist;
    }
  }
  return best;
}

export function applyCurveball(
  map: GameMap,
  rabbits: readonly Cell[],
  curveball: Curveball
): Cell[] {
  const result = rabbits.map((r) => ({ ...r }));
  const start = rabbits[curveball.targetIndex]!;
  let destination = start;

  switch (curveball.type) {
    case 'cranky':
      destination = walk(map, start, 3);
      break;
    case 'mirror':
      destination = mirrorDestination(map, start);
      break;
    case 'social': {
      const rightMostIdx = selectTarget('cavein', rabbits);
      destination = stepToward(map, start, rabbits[rightMostIdx]!);
      break;
    }
    case 'cavein': {
      const centerHole = findCenterHole(map);
      destination = stepToward(map, start, centerHole);
      break;
    }
  }

  result[curveball.targetIndex] = destination;
  return result;
}
