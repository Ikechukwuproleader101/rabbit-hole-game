import { describe, expect, it } from 'vitest';
import { applyCurveball, CURVEBALL_TYPES, curveballText, findCenterHole, selectTarget } from './curveballs';
import { difficultyFor } from './difficulty';
import { cellKey, manhattan, sameCell } from './grid';
import { buildLevel } from './level';
import { generateMap } from './mapGen';
import { distancesFrom, nextStep, walk } from './movement';
import { resolveLevel } from './resolve';
import { createRng, hashString } from './rng';
import { applyLevelResult, newRun } from './run';
import { pickSpawns } from './spawn';
import type { Cell, Curveball, GameMap } from './types';

function dateForOffset(offset: number): string {
  const d = new Date(Date.UTC(2026, 0, 1 + offset));
  return d.toISOString().slice(0, 10);
}

describe('determinism and daily seeds', () => {
  it('produces identical maps, spawns, and curveballs for the same date and level', () => {
    const a = buildLevel('2026-11-25', 3);
    const b = buildLevel('2026-11-25', 3);
    expect(a).toEqual(b);

    const a1 = buildLevel('2026-11-25', 1);
    const b1 = buildLevel('2026-11-25', 1);
    expect(a1).toEqual(b1);
  });

  it('produces different maps for different dates', () => {
    const dates = ['2026-11-25', '2026-11-26', '2026-11-27', '2026-12-01'];
    const maps = dates.map((d) => JSON.stringify(generateMap(d, 0)));
    const unique = new Set(maps);
    expect(unique.size).toBe(dates.length);
  });
});

describe('map generator', () => {
  it('generates 12-16 connected holes with valid, non-duplicate orthogonal links across 200 seeds', () => {
    for (let i = 0; i < 200; i++) {
      const map = generateMap(dateForOffset(i), i % 4);
      expect(map.holes.length).toBeGreaterThanOrEqual(12);
      expect(map.holes.length).toBeLessThanOrEqual(16);

      const holeKeys = new Set(map.holes.map(cellKey));
      expect(holeKeys.size).toBe(map.holes.length);

      const linkKeys = new Set<string>();
      for (const [a, b] of map.links) {
        expect(holeKeys.has(cellKey(a))).toBe(true);
        expect(holeKeys.has(cellKey(b))).toBe(true);
        expect(manhattan(a, b)).toBe(1);
        const ka = cellKey(a);
        const kb = cellKey(b);
        const lk = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
        expect(linkKeys.has(lk)).toBe(false);
        linkKeys.add(lk);
      }

      const dists = distancesFrom(map, map.holes[0]!);
      expect(dists.size).toBe(map.holes.length);
    }
  });
});

describe('movement rules', () => {
  const crossMap: GameMap = {
    size: 5,
    holes: [
      { row: 1, col: 2 }, // UP
      { row: 2, col: 3 }, // RIGHT
      { row: 3, col: 2 }, // DOWN
      { row: 2, col: 1 }, // LEFT
      { row: 2, col: 2 }, // CENTER
      { row: 1, col: 3 }, // extra
    ],
    links: [
      [{ row: 2, col: 2 }, { row: 1, col: 2 }],
      [{ row: 2, col: 2 }, { row: 2, col: 3 }],
      [{ row: 2, col: 2 }, { row: 3, col: 2 }],
      [{ row: 2, col: 2 }, { row: 2, col: 1 }],
      [{ row: 1, col: 2 }, { row: 1, col: 3 }],
    ],
    connectorStyle: 1,
  };

  it('follows priority up, right, down, left and avoids backtracking unless dead end', () => {
    const center: Cell = { row: 2, col: 2 };
    // From center with no previous, goes UP (1,2)
    expect(nextStep(crossMap, center, null)).toEqual({ row: 1, col: 2 });
    // If previous was UP (1,2), skips UP and goes RIGHT (2,3)
    expect(nextStep(crossMap, center, { row: 1, col: 2 })).toEqual({
      row: 2,
      col: 3,
    });
    // At dead end (2,3) coming from (2,2), must backtrack to (2,2)
    expect(nextStep(crossMap, { row: 2, col: 3 }, center)).toEqual(center);
  });

  it('walk is deterministic', () => {
    const a = walk(crossMap, { row: 2, col: 2 }, 3);
    const b = walk(crossMap, { row: 2, col: 2 }, 3);
    expect(a).toEqual(b);
    // Step 1: (2,2) -> (1,2) [UP]
    // Step 2: (1,2) -> (1,3) [RIGHT, only non-backtrack]
    // Step 3: (1,3) -> (1,2) [dead end backtrack]
    expect(a).toEqual({ row: 1, col: 2 });
  });
});

describe('curveballs', () => {
  it('every curveball type produces a valid move across 200 seeds on levels 3, 6, 9', () => {
    const levels = [3, 6, 9];
    for (const type of CURVEBALL_TYPES) {
      for (let i = 0; i < 200; i++) {
        const levelNum = levels[i % levels.length]!;
        const dateKey = dateForOffset(i);
        const setIndex = Math.floor((levelNum - 1) / 3);
        const map = generateMap(dateKey, setIndex);
        const { rabbits: count } = difficultyFor(levelNum);

        let foundValid = false;
        for (let k = 0; k < 100; k++) {
          const rng = createRng(hashString(`${dateKey}:${levelNum}:${type}:${k}`));
          const spawns = pickSpawns(map, count, rng);
          const targetIndex = selectTarget(type, spawns);
          if (type === 'social' && targetIndex === selectTarget('cavein', spawns)) {
            continue;
          }
          if (
            type === 'cavein' &&
            sameCell(spawns[targetIndex]!, findCenterHole(map))
          ) {
            continue;
          }
          const cb: Curveball = {
            type,
            text: curveballText(type),
            targetIndex,
          };
          const finals = applyCurveball(map, spawns, cb);
          if (sameCell(finals[targetIndex]!, spawns[targetIndex]!)) continue;
          const unique = new Set(finals.map(cellKey));
          if (unique.size !== finals.length) continue;

          foundValid = true;
          break;
        }
        expect(foundValid).toBe(true);
      }
    }
  });
});

describe('levels, difficulty, and resolveLevel', () => {
  it('matches level table for levels 1-3 and curveball placement for sets', () => {
    const l1 = buildLevel('2026-11-25', 1);
    const l2 = buildLevel('2026-11-25', 2);
    const l3 = buildLevel('2026-11-25', 3);
    const l4 = buildLevel('2026-11-25', 4);
    const l5 = buildLevel('2026-11-25', 5);
    const l6 = buildLevel('2026-11-25', 6);
    const l9 = buildLevel('2026-11-25', 9);

    expect([l1.rabbits.length, l1.carrots, l1.flashMs]).toEqual([3, 3, 2000]);
    expect([l2.rabbits.length, l2.carrots, l2.flashMs]).toEqual([4, 4, 1500]);
    expect([l3.rabbits.length, l3.carrots, l3.flashMs]).toEqual([4, 4, 1500]);

    expect(l1.curveball).toBeNull();
    expect(l2.curveball).toBeNull();
    expect(l3.curveball).not.toBeNull();
    expect(l4.curveball).toBeNull();
    expect(l5.curveball).toBeNull();
    expect(l6.curveball).not.toBeNull();
    expect(l9.curveball).not.toBeNull();

    // Same set shares map; different sets differ
    expect(l1.map).toEqual(l2.map);
    expect(l2.map).toEqual(l3.map);
    expect(l1.map).not.toEqual(l4.map);
  });

  it('resolveLevel handles passes, single miss, duplicate carrots, and too many carrots', () => {
    const l1 = buildLevel('2026-11-25', 1);
    const passRes = resolveLevel(l1, l1.rabbits);
    expect(passRes.passed).toBe(true);
    expect(passRes.missed).toBe(0);

    // Miss one rabbit
    const oneMissing = l1.rabbits.slice(0, l1.rabbits.length - 1);
    const missRes = resolveLevel(l1, oneMissing);
    expect(missRes.passed).toBe(false);
    expect(missRes.missed).toBe(1);

    // Duplicate carrot cells are ignored (so 1 rabbit covered twice still misses the others)
    const dupCarrots = [l1.rabbits[0]!, l1.rabbits[0]!, l1.rabbits[1]!];
    const dupRes = resolveLevel(l1, dupCarrots);
    expect(dupRes.missed).toBe(1);
    expect(dupRes.passed).toBe(false);

    // Too many carrots throws
    const tooMany = [...l1.rabbits, l1.map.holes[0]!];
    expect(() => resolveLevel(l1, tooMany)).toThrow();
  });
});

describe('run rules and saver', () => {
  it('forgives one missed rabbit once per set, fails on two misses, and resets on new set', () => {
    let run = newRun();
    const l1 = buildLevel('2026-11-25', 1);
    const l2 = buildLevel('2026-11-25', 2);
    const l3 = buildLevel('2026-11-25', 3);

    // Level 1: 1 miss -> saved
    const r1 = resolveLevel(l1, l1.rabbits.slice(0, 2));
    const o1 = applyLevelResult(run, l1, r1, true);
    expect(o1.outcome).toBe('saved');
    expect(o1.nearMiss).toBe(true);
    expect(o1.run.level).toBe(2);
    expect(o1.run.saverAvailable).toBe(false);
    run = o1.run;

    // Level 2: 1 miss with saver already spent -> failed
    const r2 = resolveLevel(l2, l2.rabbits.slice(0, 3));
    const o2 = applyLevelResult(run, l2, r2, true);
    expect(o2.outcome).toBe('failed');
    expect(o2.run.status).toBe('over');

    // Level 2: 2 misses even with saver available -> failed
    const fresh = { ...newRun(), level: 2 };
    const r2TwoMiss = resolveLevel(l2, l2.rabbits.slice(0, 2));
    const o2TwoMiss = applyLevelResult(fresh, l2, r2TwoMiss, true);
    expect(o2TwoMiss.outcome).toBe('failed');

    // Saver does not carry over, and resets to true when advancing from level 3 to level 4
    const atL3NoSaver = { level: 3, saverAvailable: false, score: 5, status: 'playing' as const };
    const finals3 = applyCurveball(l3.map, l3.rabbits, l3.curveball!);
    const r3Pass = resolveLevel(l3, finals3);
    const o3Pass = applyLevelResult(atL3NoSaver, l3, r3Pass, false);
    expect(o3Pass.outcome).toBe('passed');
    expect(o3Pass.run.level).toBe(4);
    expect(o3Pass.run.saverAvailable).toBe(true);
  });

  it('refuses saver on curveball level when SAVER_ALLOWED_ON_CURVEBALL is false', () => {
    const l3 = buildLevel('2026-11-25', 3);
    const finals3 = applyCurveball(l3.map, l3.rabbits, l3.curveball!);
    const oneMiss = resolveLevel(l3, finals3.slice(0, finals3.length - 1));
    const run = { level: 3, saverAvailable: true, score: 7, status: 'playing' as const };
    const res = applyLevelResult(run, l3, oneMiss, true, false);
    expect(res.outcome).toBe('failed');
    expect(res.run.status).toBe('over');
  });
});
