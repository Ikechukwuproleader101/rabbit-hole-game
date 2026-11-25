import {
  applyCurveball,
  CURVEBALL_TYPES,
  curveballText,
  findCenterHole,
  selectTarget,
} from './curveballs';
import { difficultyFor, indexInSetFor, setIndexFor } from './difficulty';
import { cellKey, sameCell } from './grid';
import { generateMap } from './mapGen';
import { createRng, hashString, levelSeedString, pick } from './rng';
import { pickSpawns } from './spawn';
import type { Curveball, LevelData } from './types';

const MAX_BUILD_ATTEMPTS = 100;

function allDistinct(cells: ReadonlyArray<{ row: number; col: number }>): boolean {
  const seen = new Set<string>();
  for (const cell of cells) {
    const k = cellKey(cell);
    if (seen.has(k)) return false;
    seen.add(k);
  }
  return true;
}

export function buildLevel(dateKey: string, level: number): LevelData {
  const setIndex = setIndexFor(level);
  const indexInSet = indexInSetFor(level);
  const map = generateMap(dateKey, setIndex);
  const { rabbits: rabbitCount, carrots, flashMs } = difficultyFor(level);

  for (let k = 0; k < MAX_BUILD_ATTEMPTS; k++) {
    const rng = createRng(hashString(levelSeedString(dateKey, level, k)));
    const spawns = pickSpawns(map, rabbitCount, rng);

    if (indexInSet !== 3) {
      return {
        level,
        setIndex,
        indexInSet,
        map,
        rabbits: spawns,
        carrots,
        flashMs,
        curveball: null,
      };
    }

    const type = pick(rng, CURVEBALL_TYPES);
    const targetIndex = selectTarget(type, spawns);
    const curveball: Curveball = {
      type,
      text: curveballText(type),
      targetIndex,
    };

    if (type === 'social') {
      const rightMostIdx = selectTarget('cavein', spawns);
      if (targetIndex === rightMostIdx) continue;
    }

    if (type === 'cavein') {
      const centerHole = findCenterHole(map);
      if (sameCell(spawns[targetIndex]!, centerHole)) continue;
    }

    const finalPositions = applyCurveball(map, spawns, curveball);
    if (sameCell(finalPositions[targetIndex]!, spawns[targetIndex]!)) continue;
    if (!allDistinct(finalPositions)) continue;

    return {
      level,
      setIndex,
      indexInSet,
      map,
      rabbits: spawns,
      carrots,
      flashMs,
      curveball,
    };
  }

  throw new Error(
    `Failed to build valid level ${level} for ${dateKey} within ${MAX_BUILD_ATTEMPTS} attempts`
  );
}
