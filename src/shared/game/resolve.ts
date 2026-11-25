// Answer logic. In production only the server may import this. Do not import into client code except through the local dev adapter.

import { applyCurveball } from './curveballs';
import { cellKey } from './grid';
import type { Cell, LevelData, LevelResult } from './types';

export function resolveLevel(
  level: LevelData,
  carrots: readonly Cell[]
): LevelResult {
  if (carrots.length > level.carrots) {
    throw new Error(
      `Placed ${carrots.length} carrots, but only ${level.carrots} allowed`
    );
  }

  const carrotSet = new Set<string>(carrots.map(cellKey));
  const finalPositions = level.curveball
    ? applyCurveball(level.map, level.rabbits, level.curveball)
    : level.rabbits.map((r) => ({ ...r }));

  const caught = finalPositions.map((pos) => carrotSet.has(cellKey(pos)));
  const missed = caught.filter((c) => !c).length;

  return {
    finalPositions,
    caught,
    missed,
    passed: missed === 0,
  };
}
