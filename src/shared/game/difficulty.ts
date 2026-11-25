import { config } from '../config';

export function setIndexFor(level: number): number {
  return Math.floor((level - 1) / config.LEVELS_PER_SET);
}

export function indexInSetFor(level: number): 1 | 2 | 3 {
  const rem = (level - 1) % config.LEVELS_PER_SET;
  if (rem === 0) return 1;
  if (rem === 1) return 2;
  return 3;
}

export function difficultyFor(level: number): {
  rabbits: number;
  carrots: number;
  flashMs: number;
} {
  if (level >= 1 && level <= config.LEVEL_TABLE.length) {
    const entry = config.LEVEL_TABLE[level - 1]!;
    return { ...entry };
  }

  const setIndex = setIndexFor(level);
  const baseRabbits = config.LEVEL_TABLE[config.LEVEL_TABLE.length - 1]!.rabbits;
  const baseFlash = config.LEVEL_TABLE[config.LEVEL_TABLE.length - 1]!.flashMs;

  const rabbits = Math.min(
    config.RABBITS_MAX,
    baseRabbits + setIndex * config.RABBITS_PER_SET_GROWTH
  );
  const flashMs = Math.max(
    config.FLASH_MIN_MS,
    baseFlash - setIndex * config.FLASH_DROP_MS_PER_SET
  );

  return {
    rabbits,
    carrots: rabbits,
    flashMs,
  };
}
