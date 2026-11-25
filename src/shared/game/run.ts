import { config } from '../config';
import { indexInSetFor } from './difficulty';
import type { LevelData, LevelResult, RunState } from './types';

export type ApplyLevelOutcome = {
  run: RunState;
  outcome: 'passed' | 'saved' | 'failed';
  nearMiss: boolean;
};

export function newRun(): RunState {
  return {
    level: 1,
    saverAvailable: true,
    score: 0,
    status: 'playing',
  };
}

export function applyLevelResult(
  run: RunState,
  levelData: LevelData,
  result: LevelResult,
  spendSaver: boolean,
  saverAllowedOnCurveball = config.SAVER_ALLOWED_ON_CURVEBALL
): ApplyLevelOutcome {
  const caughtCount = result.caught.filter(Boolean).length;
  const gainedScore = caughtCount * config.SCORE_PER_RABBIT;

  if (result.passed) {
    const nextLevel = run.level + 1;
    const isNewSet = indexInSetFor(nextLevel) === 1;
    return {
      run: {
        level: nextLevel,
        saverAvailable: isNewSet ? true : run.saverAvailable,
        score: run.score + gainedScore,
        status: 'playing',
      },
      outcome: 'passed',
      nearMiss: false,
    };
  }

  const isCurveball = levelData.curveball !== null;
  const canSave =
    result.missed <= config.SAVER_MAX_MISSES &&
    run.saverAvailable &&
    spendSaver &&
    (!isCurveball || saverAllowedOnCurveball);

  if (canSave) {
    const nextLevel = run.level + 1;
    const isNewSet = indexInSetFor(nextLevel) === 1;
    return {
      run: {
        level: nextLevel,
        saverAvailable: isNewSet ? true : false,
        score: run.score + gainedScore,
        status: 'playing',
      },
      outcome: 'saved',
      nearMiss: true,
    };
  }

  return {
    run: {
      level: run.level,
      saverAvailable: run.saverAvailable,
      score: run.score + gainedScore,
      status: 'over',
    },
    outcome: 'failed',
    nearMiss: false,
  };
}
