import { shuffle } from './rng';
import type { Rng } from './rng';
import type { Cell, GameMap } from './types';

export function pickSpawns(map: GameMap, count: number, rng: Rng): Cell[] {
  if (count < 0 || count > map.holes.length - 1) {
    throw new Error(
      `Invalid spawn count ${count} for map with ${map.holes.length} holes`
    );
  }
  return shuffle(rng, map.holes).slice(0, count);
}
