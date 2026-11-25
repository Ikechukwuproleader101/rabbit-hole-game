export type SaverTiming = 'before_result' | 'after_miss';
export type RevealMode = 'every_level' | 'run_ending_only';

export type GameConfig = {
  GRID_SIZE: number;
  HOLES_MIN: number;
  HOLES_MAX: number;
  EXTRA_LINK_CHANCE: number;
  LEVELS_PER_SET: number;
  LEVEL_TABLE: ReadonlyArray<{
    rabbits: number;
    carrots: number;
    flashMs: number;
  }>;
  RABBITS_PER_SET_GROWTH: number;
  RABBITS_MAX: number;
  FLASH_DROP_MS_PER_SET: number;
  FLASH_MIN_MS: number;
  SAVER_MAX_MISSES: number;
  SAVER_ALLOWED_ON_CURVEBALL: boolean;
  SAVER_TIMING: SaverTiming;
  REVEAL_MODE: RevealMode;
  SCORE_PER_RABBIT: number;
};

export const config: GameConfig = {
  GRID_SIZE: 5,
  HOLES_MIN: 12,
  HOLES_MAX: 16,
  EXTRA_LINK_CHANCE: 0.35,
  LEVELS_PER_SET: 3,
  LEVEL_TABLE: [
    { rabbits: 3, carrots: 3, flashMs: 2000 },
    { rabbits: 4, carrots: 4, flashMs: 1500 },
    { rabbits: 4, carrots: 4, flashMs: 1500 },
  ],
  // placeholders for level 4 and up
  RABBITS_PER_SET_GROWTH: 1,
  RABBITS_MAX: 7,
  FLASH_DROP_MS_PER_SET: 100,
  FLASH_MIN_MS: 800,
  // saver
  SAVER_MAX_MISSES: 1,
  // open decisions, switchable for testing
  SAVER_ALLOWED_ON_CURVEBALL: true,
  SAVER_TIMING: 'after_miss',
  REVEAL_MODE: 'run_ending_only',
  // score placeholder
  SCORE_PER_RABBIT: 1,
};
