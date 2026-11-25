export type Rng = () => number;

export function hashString(s: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function shuffle<T>(rng: Rng, array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

export function pick<T>(rng: Rng, array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }
  return array[Math.floor(rng() * array.length)]!;
}

export function setSeedString(dateKey: string, setIndex: number): string {
  return `${dateKey}:set:${setIndex}`;
}

export function levelSeedString(
  dateKey: string,
  level: number,
  attempt: number
): string {
  return `${dateKey}:level:${level}:attempt:${attempt}`;
}
