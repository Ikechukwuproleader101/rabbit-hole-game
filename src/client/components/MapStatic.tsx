import { Hole } from './Hole';
import type { HoleState } from './Hole';

type Coord = { row: number; col: number };

const SAMPLE_HOLES: readonly Coord[] = [
  { row: 0, col: 0 },
  { row: 0, col: 2 },
  { row: 0, col: 4 },
  { row: 1, col: 1 },
  { row: 1, col: 3 },
  { row: 2, col: 0 },
  { row: 2, col: 2 },
  { row: 2, col: 4 },
  { row: 3, col: 1 },
  { row: 3, col: 3 },
  { row: 4, col: 0 },
  { row: 4, col: 2 },
  { row: 4, col: 4 },
];

const SAMPLE_SEGMENTS: ReadonlyArray<readonly [Coord, Coord]> = [
  [{ row: 0, col: 0 }, { row: 0, col: 4 }],
  [{ row: 0, col: 0 }, { row: 4, col: 0 }],
  [{ row: 0, col: 2 }, { row: 4, col: 2 }],
  [{ row: 0, col: 4 }, { row: 4, col: 4 }],
  [{ row: 1, col: 1 }, { row: 1, col: 3 }],
  [{ row: 1, col: 1 }, { row: 3, col: 1 }],
  [{ row: 1, col: 3 }, { row: 3, col: 3 }],
  [{ row: 2, col: 0 }, { row: 2, col: 4 }],
  [{ row: 3, col: 1 }, { row: 3, col: 3 }],
  [{ row: 4, col: 2 }, { row: 4, col: 4 }],
  [{ row: 4, col: 0 }, { row: 4, col: 1 }],
  [{ row: 3, col: 1 }, { row: 4, col: 1 }],
];

function coordKey(c: Coord): string {
  return `${c.row},${c.col}`;
}

const HOLE_KEY_SET = new Set(SAMPLE_HOLES.map(coordKey));

type MapStaticProps = {
  holeStates?: Record<string, HoleState>;
};

export const MapStatic = ({ holeStates = {} }: MapStaticProps) => {
  const cells: Coord[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      cells.push({ row, col });
    }
  }

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto p-3 select-none">
      {/* Placeholder CSS/SVG brown tunnel bars (connector tiles come in Phase 3) */}
      <svg
        viewBox="0 0 500 500"
        aria-hidden="true"
        className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] pointer-events-none"
      >
        {SAMPLE_SEGMENTS.map(([a, b], idx) => (
          <line
            key={idx}
            x1={a.col * 100 + 50}
            y1={a.row * 100 + 50}
            x2={b.col * 100 + 50}
            y2={b.row * 100 + 50}
            stroke="var(--tunnel)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      <div className="relative z-10 grid grid-cols-5 grid-rows-5 w-full h-full">
        {cells.map((cell) => {
          const key = coordKey(cell);
          const isHole = HOLE_KEY_SET.has(key);
          const state = holeStates[key] ?? 'empty';
          return (
            <div key={key} className="w-full h-full p-0.5">
              {isHole ? <Hole state={state} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
