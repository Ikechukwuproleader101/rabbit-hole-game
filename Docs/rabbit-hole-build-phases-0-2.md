# Rabbit Hole: Build Spec for Phases 0 to 2

You are building a Reddit mobile game called **Rabbit Hole** on Devvit Web, with React and TypeScript.

This file covers **only three phases**:

- Phase 0: Skeleton and asset wiring
- Phase 1: Game logic (no UI)
- Phase 2: Static screens from the designs

Do them **in order**. Finish a phase and tick its "Done when" list before starting the next. **Do not build anything beyond these three phases** (see "Do not build yet" at the end).

The IDE and the Devvit platform are already set up. Do not redo that setup. Use the project structure the Devvit template created. If it differs from the folders named here, adapt to it and write the difference in `BUILD_NOTES.md`.

---

## 1. The game in brief

A daily puzzle game. A burrow map of holes joined by tunnels is shown. Rabbits flash briefly in some holes, then vanish. The player places carrot traps in the holes where they think the rabbits will come out. A carrot and a rabbit in the same hole counts as a catch. There is no tapping of rabbits.

- A run is a series of **levels** that continues until the player fails.
- Every **3 levels** form a **set** that shares one map. The first two levels teach the map. The **3rd level of each set has a curveball**: after the flash, one rule is revealed that moves one rabbit, and the player must work out where it ends up.
- The map and rabbit spawns change after every 3rd level.
- Every player gets the same puzzle on the same day (shared daily seed).
- A level is passed only if **every** rabbit is caught. The player gets one **saver** per set that forgives one missed rabbit.

Use the word **level**, never "wave". Use **set** for a group of 3 levels.

---

## 2. Project rules (apply to all phases)

**Stack:** React and TypeScript on the client, Devvit server in `index.ts`. In these three phases the server is **not touched**.

**Design assets**
- All building blocks and individual screens are in the folder named **`building block`** in the project root. This is the single source of truth for how things look.
- **First action in Phase 0:** list the contents of `building block` and record every file name in `BUILD_NOTES.md`. Never guess file names and never invent an asset that exists in that folder.
- The folder name contains a space. Reference files only through the asset manifest (see Phase 0) and URL-encode the paths.
- If the build cannot serve files straight from the root folder, copy the needed images into the client's public assets folder and point the manifest at the copies. Do not change the originals.
- If an asset you need is not in the folder, build a simple placeholder (CSS or inline SVG) and list it under "Missing assets" in `BUILD_NOTES.md`.

**Fonts:** do not load fonts from an external CDN. Use font files from the folder if there are any. Otherwise use a system fallback and note it in `BUILD_NOTES.md`.

**Mobile first:** design for a phone portrait screen, 360 to 430 px wide. All tappable elements must be at least 44 x 44 px. Real buttons must use `<button>`.

**Code style:** TypeScript strict mode. Small files. No unused code.

**Where logic lives:** all game rules are pure TypeScript in `src/shared/game/` with **no DOM and no Node-only APIs**, so they can be used by both server and client later. Add a comment at the top of `resolve.ts` and `curveballs.ts`: *"Answer logic. In production only the server may import this. Do not import into client code except through the local dev adapter."*

**Report back:** when finished, write `BUILD_NOTES.md` in the project root containing: the folder listing of `building block`, the asset manifest names and what they map to, missing assets, deviations from this spec, and any assumptions you made.

---

## Phase 0: Skeleton and asset wiring

**Goal:** an empty app that runs inside Reddit and can show any asset from the design folder.

### Tasks

1. Create (or confirm) these folders: `src/client`, `src/server`, `src/shared`, `src/shared/game`.
2. **Asset manifest** at `src/client/assets.ts`. Export one object that maps friendly names to paths. Build it from the real files you found. Expected names (use the real file for each, and add any extra assets you find):
   - `logo`
   - `rabbitVisible`, `rabbitInvisible`
   - `infoBar1`, `infoBar2`, `navBar`
   - `connectorStyle1` to `connectorStyle5`
   - `screenSplash`, `screenMap`, `screenNoTwist`, `screenTwist`, `screenMissed` (the full-screen designs, used only as visual references)
3. **Config** at `src/shared/config.ts` (see section "Config file" below).
4. **Theme tokens** in one CSS file (`src/client/theme.css`) as CSS variables. **Sample the real colors from the images** in `building block`. If you can't, use these approximate fallbacks and flag it in `BUILD_NOTES.md`:
   - `--bg`: bright yellow, about `#FFC900`
   - `--tunnel`: warm brown, about `#B5673F`
   - `--hole`: dark brown, about `#7A4128`
   - `--text-brand`: rust brown, about `#A8532E`
   - `--panel`: beige, about `#F0E0C8`
   - `--carrot`: orange, about `#F28C28`
5. **Screen switcher:** a minimal state-based switcher (no router library) with these screens: `splash`, `game`, `runOver`, plus a dev-only `gallery` screen. `runOver` stays an empty placeholder in these phases.
6. **Gallery access:** the `gallery` screen opens when the URL hash is `#gallery`, and a small dev-only bar lets you switch screens. Both must be hidden in production builds.
7. Base CSS: full-height page, `--bg` background, no page scrolling horizontally, `box-sizing: border-box`.

### Done when

- [ ] The app builds and opens inside the Devvit playtest.
- [ ] Each placeholder screen can be opened.
- [ ] One image from `building block` displays through the manifest.
- [ ] `BUILD_NOTES.md` contains the folder listing.

---

## Phase 1: Game logic (no UI)

**Goal:** the complete rules engine as pure TypeScript, with tests.

Put all of this in `src/shared/game/`. Use **Vitest** for tests (add it as a dev dependency and an `npm test` script if it isn't there).

### 1.1 Types (`types.ts`)

```ts
export type Cell = { row: number; col: number };           // 0 to 4 each
export type Link = [Cell, Cell];                            // undirected tunnel between orthogonal neighbours

export type GameMap = {
  size: 5;
  holes: Cell[];                // 12 to 16 active holes
  links: Link[];                // tunnels; every link joins two orthogonally adjacent holes
  connectorStyle: 1 | 2 | 3 | 4 | 5;
};

export type CurveballType = 'cranky' | 'mirror' | 'social' | 'cavein';

export type Curveball = {
  type: CurveballType;
  text: string;                 // shown to the player
  targetIndex: number;          // index into LevelData.rabbits of the rabbit that moves
};

export type LevelData = {
  level: number;                // 1-based
  setIndex: number;             // 0-based
  indexInSet: 1 | 2 | 3;
  map: GameMap;
  rabbits: Cell[];              // start positions (what the flash shows)
  carrots: number;              // how many carrots the player may place
  flashMs: number;
  curveball: Curveball | null;  // only when indexInSet === 3
};

export type LevelResult = {
  finalPositions: Cell[];
  caught: boolean[];            // per rabbit
  missed: number;
  passed: boolean;              // missed === 0
};

export type RunState = {
  level: number;
  saverAvailable: boolean;
  score: number;
  status: 'playing' | 'over';
};
```

### 1.2 Seeded random (`rng.ts`)

- `hashString(s: string): number` (any good 32-bit string hash, for example FNV-1a).
- `createRng(seed: number): () => number` using **mulberry32**. Returns a float in `[0, 1)`.
- Helpers: `randInt(rng, min, max)` (inclusive), `shuffle(rng, array)`, `pick(rng, array)`.

**Seed strings** (so every player gets the same puzzle on the same day):
- Map for a set: `` `${dateKey}:set:${setIndex}` ``
- Level content: `` `${dateKey}:level:${level}:attempt:${k}` ``

`dateKey` is `YYYY-MM-DD`.

### 1.3 Grid helpers (`grid.ts`)

- `GRID_SIZE = 5`
- `neighbours(cell)`: orthogonal neighbours inside the grid, returned **in this fixed priority order: UP (row - 1), RIGHT (col + 1), DOWN (row + 1), LEFT (col - 1)**.
- `cellKey(cell)`: `"row,col"`. `sameCell(a, b)`. `manhattan(a, b)`.

### 1.4 Map generator (`mapGen.ts`)

`generateMap(dateKey: string, setIndex: number): GameMap`

Algorithm:
1. Create the rng from the set seed.
2. Pick the hole count `N` with `randInt(rng, 12, 16)`.
3. Pick a random starting cell. Grow the set of holes: repeatedly pick a random **existing** hole, then a random orthogonal neighbour of it that isn't a hole yet, add it as a hole and add a link between the two. Repeat until there are `N` holes. This gives a connected tree.
4. Add **extra links** between pairs of orthogonally adjacent holes that aren't linked yet, each with probability `0.35`, so the network has loops.
5. Pick `connectorStyle` with `randInt(rng, 1, 5)`.

Guarantees: connected network, every link joins two orthogonal neighbours, no duplicate links, dead ends allowed.

### 1.5 Movement (`movement.ts`)

- `linkedNeighbours(map, cell)`: neighbours of `cell` that are joined to it by a link, in priority order up, right, down, left.
- `nextStep(map, at, previous | null)`: the first linked neighbour in priority order that is **not** `previous`. If there is none (dead end), return `previous`.
- `walk(map, start, steps)`: apply `nextStep` repeatedly, tracking the previous hole. A rabbit never backtracks unless it is at a dead end.
- `distancesFrom(map, target)`: breadth-first search over links, returning a distance for every reachable hole.
- `stepToward(map, from, target)`: of the linked neighbours of `from` whose distance to `target` is one less than `from`'s, return the first in priority order. If `from` equals `target`, return `from`.

### 1.6 Spawns (`spawn.ts`)

`pickSpawns(map, count, rng): Cell[]` returns `count` **distinct** holes. Never fill every hole: `count` must be at most `holes.length - 1`.

### 1.7 Curveballs (`curveballs.ts`)

**Rabbit selection** (these tie-break rules are exact):
- top-most: smallest `row`; ties go to the smallest `col`.
- bottom-most: largest `row`; ties go to the smallest `col`.
- left-most: smallest `col`; ties go to the smallest `row`.
- right-most: largest `col`; ties go to the smallest `row`.

**The four rules**

| Type | Text shown | Effect on the target rabbit |
|------|------------|-----------------------------|
| `cranky` | "The top-most rabbit got cranky and moved 3 steps along the tunnel." | Target is the top-most rabbit. `walk(map, start, 3)`. |
| `mirror` | "The bottom-most rabbit panicked and jumped to the horizontally mirrored hole." | Target is the bottom-most rabbit. Mirrored column is `4 - col` on the same row. If a hole exists there, go to it. If not, go to the nearest hole **on that row** by column distance to the mirrored column (tie: smaller `col`). |
| `social` | "The left-most rabbit got lonely and moved 1 step closer to the right-most rabbit along the shortest tunnel path." | Target is the left-most rabbit. `stepToward(map, start, rightMostRabbitStart)`. |
| `cavein` | "A tunnel collapsed! The right-most rabbit's hole is blocked, so it retreated 1 step toward the center of the board." | Target is the right-most rabbit. The "center hole" is the active hole with the smallest Manhattan distance to cell (2, 2) (ties: smaller `row`, then smaller `col`). `stepToward(map, start, centerHole)`. |

> Assumption to record in `BUILD_NOTES.md`: the Cave-In "center" is the nearest active hole to (2, 2), because (2, 2) may not be a hole.

Export:
- `selectTarget(type, rabbits): number` (index of the target rabbit).
- `applyCurveball(map, rabbits, curveball): Cell[]` returns the **final positions** of all rabbits (only the target moves).
- `curveballText(type): string`.

### 1.8 Difficulty (`difficulty.ts`)

`difficultyFor(level: number): { rabbits: number; carrots: number; flashMs: number }`

- Level 1: 3 rabbits, 3 carrots, 2000 ms.
- Level 2: 4 rabbits, 4 carrots, 1500 ms.
- Level 3: 4 rabbits, 4 carrots, 1500 ms.
- Level 4 and up (**placeholder values, keep them in `config.ts`**): rabbits grow by 1 every 3 levels (maximum 7), flash time drops 100 ms every 3 levels (minimum 800 ms). Carrots always equal rabbits.

Also export `setIndexFor(level)` = `Math.floor((level - 1) / 3)` and `indexInSetFor(level)` = `((level - 1) % 3) + 1`.

### 1.9 Level builder and resolver (`level.ts`, `resolve.ts`)

`buildLevel(dateKey: string, level: number): LevelData`

1. Work out `setIndex`, `indexInSet`, and generate the set's map with `generateMap`.
2. Get `rabbits`, `carrots`, `flashMs` from `difficultyFor`.
3. Try up to **100 attempts**, `k = 0..99`, each with its own rng from the level seed string:
   - Pick spawns with `pickSpawns`.
   - If `indexInSet !== 3`, accept the first attempt.
   - If `indexInSet === 3`, pick a curveball type from the four with the rng, compute the final positions, and **accept only if all of these hold**: the target rabbit ends on a different hole than it started; all final positions are distinct; for `social`, the left-most and right-most rabbits are different rabbits; for `cavein`, the target isn't already on the center hole.
4. If no attempt is valid, throw an error (this should never happen, and the tests must cover it).

`resolveLevel(level: LevelData, carrots: Cell[]): LevelResult`

- Final positions: start positions, with the curveball applied if there is one.
- `caught[i]` is true if any placed carrot is on `finalPositions[i]`.
- `missed` is the number of rabbits not caught. `passed` is `missed === 0`.
- Ignore duplicate carrot cells. Placing more carrots than allowed throws an error.

### 1.10 Run rules (`run.ts`)

- `newRun(): RunState`: level 1, `saverAvailable: true`, score 0, status `playing`.
- `applyLevelResult(run, levelData, result, spendSaver: boolean)` returns `{ run, outcome, nearMiss }`:
  - If `result.passed`: advance to the next level. `outcome = 'passed'`.
  - Else if `result.missed <= config.SAVER_MAX_MISSES` and `run.saverAvailable` and `spendSaver` and (it's not a curveball level, **or** `config.SAVER_ALLOWED_ON_CURVEBALL`): advance to the next level, set `saverAvailable = false`, `outcome = 'saved'`, `nearMiss = true`.
  - Otherwise: `status = 'over'`, `outcome = 'failed'`.
  - Whenever the **next** level is the first of a new set, set `saverAvailable = true` (the saver never carries over, whether used or not).
  - Score: placeholder of +1 per rabbit caught (keep the formula in `config.ts`; the real score formula is undecided).

### 1.11 Config file (`src/shared/config.ts`)

```ts
export const config = {
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
  SAVER_TIMING: 'after_miss' as 'before_result' | 'after_miss',
  REVEAL_MODE: 'run_ending_only' as 'every_level' | 'run_ending_only',
};
```

### 1.12 Tests (required)

Use dateKey `2026-11-25` and a few others.

- Same date and level give identical maps, spawns and curveballs on every call.
- Different dates give different maps (check several).
- For 200 seeds: every map has 12 to 16 holes, is fully connected, and every link joins two orthogonal neighbours with no duplicates.
- Movement: priority is up, right, down, left; a rabbit doesn't backtrack unless at a dead end; `walk` is deterministic.
- Each curveball type: returns a valid answer (target moves, final positions are distinct) for 200 seeds on level 3, 6 and 9.
- `resolveLevel`: all carrots on final positions gives `passed`; one missing gives `missed === 1`; duplicate carrot cells are ignored; too many carrots throws.
- Levels 1 to 3 match the table (3/3/2000, 4/4/1500, 4/4/1500). Level 3, 6, 9 have a curveball and levels 1, 2, 4, 5 do not. Levels in the same set share the same map; levels in different sets usually do not.
- Run rules: the saver forgives exactly one missed rabbit once per set; two missed rabbits fail; the saver does not carry to the next set; with `SAVER_ALLOWED_ON_CURVEBALL = false` it is refused on level 3.

### Done when

- [ ] `npm test` passes with every test above.
- [ ] No file in `src/shared/game/` imports from the DOM, React or Node-only modules.
- [ ] `config.ts` holds every tunable number.

---

## Phase 2: Static screens from the designs

**Goal:** every screen and component looks like the designs in `building block`, using **fake hard-coded data and no game logic**.

Open each design image in `building block` before building the matching component, and match its look closely: colors, shapes, spacing, text style.

### 2.1 Components (`src/client/components/`)

| Component | What it is | Props |
|-----------|------------|-------|
| `NavBar` | The top strip: **Carrot x/y**, **Level n**, **Saver** (carrot icon, shown dimmed when not available), **Score n** | `carrotsUsed`, `carrotsTotal`, `level`, `saverAvailable`, `score` |
| `Rabbit` | The rabbit picture | `visible: boolean` (visible or invisible block) |
| `Hole` | A dark burrow hole | `state: 'empty' \| 'carrot' \| 'rabbit' \| 'caught' \| 'escaped'` |
| `InfoBar` | The beige bar with text and an optional button (Info bar 1: "No Twist Yet" and a **Twist** button; the twist text version) | `text`, `buttonLabel?` |
| `SaverPrompt` | The "Missed a Hole?" box with a **Use Saver** button (Info bar 2) | `onUseSaver?`, `onDecline?` (only render a second button if `onDecline` is given) |
| `Splash` | The splash screen from the design (logo on yellow) | none |
| `PrimaryButton` | The rust-brown button used for Twist and Use Saver | `label`, `onClick?` |

Rules:
- `Hole` states: `empty` is the plain dark hole. `rabbit` shows the visible rabbit sitting in the hole. `carrot` shows a carrot in the hole. `caught` is a rabbit with a carrot. `escaped` is an empty hole with a small "gone" mark. **The designs don't include carrot, caught or escaped art.** Make simple inline SVG placeholders (orange carrot with a green top) and list them under "Missing assets".
- Buttons render with `<button>` and are at least 44 x 44 px. In this phase they do nothing when pressed.

### 2.2 Static map (`MapStatic.tsx`)

- A square 5 x 5 grid, full width of the screen, using CSS `aspect-ratio: 1 / 1`.
- Use a **hard-coded sample map** (about 14 holes) taken from the layout in the designs. Active holes use `Hole`. Non-hole cells stay as empty background.
- Draw the tunnels between linked holes as simple rounded brown bars (CSS) in `--tunnel`. **These are placeholders.** The real connector pieces (`connectorStyle1` to `5`) come in Phase 3, so do not use them in the map yet.

### 2.3 Game screen (`GameScreen.tsx`)

Layout, top to bottom (match the designs): `NavBar`, `MapStatic`, then the info area at the bottom.

It takes one prop, `variant`, that chooses a **fixed static state** (no real game state):

| Variant | What shows |
|---------|------------|
| `idle` | Map with empty holes, no info bar |
| `noTwist` | Map with empty holes, `InfoBar` with "No Twist Yet" and a **Twist** button |
| `twist` | Map with several visible rabbits, `InfoBar` with the text "the rabbit on the left has just moved 2 spaces downwards. Sneaky!" and a **Twist** button |
| `missed` | Same as `twist`, with `SaverPrompt` shown over the map |

Fake data for every variant: level 6, carrots 2/3, score 17, saver available.

### 2.4 Splash

Use the splash design: the Rabbit Hole logo on the yellow background, centered. Keep it static and light. **No Play button yet** (it comes later).

### 2.5 Dev gallery (`Gallery.tsx`, hash `#gallery`)

One scrolling page, hidden in production, showing:
- Every component in every state: `Rabbit` (both), `Hole` (all 5 states), `InfoBar` (both versions), `SaverPrompt` (with and without decline), `NavBar` (saver available and not), `PrimaryButton`.
- The five connector images (`connectorStyle1` to `5`) with labels. Display only; do not wire them into the map.
- All four `GameScreen` variants and the splash, each inside a 390 px wide phone-sized frame.

### 2.6 Visual checks

Compare each screen with its design image at about 390 px wide. Note any differences you chose to keep in `BUILD_NOTES.md`.

### Done when

- [ ] The gallery shows every component and state.
- [ ] The splash and all four `GameScreen` variants match the designs at phone size.
- [ ] No horizontal scrolling at 360 px wide.
- [ ] All buttons are real `<button>` elements, at least 44 x 44 px.
- [ ] Placeholders for the carrot, caught and escaped states are listed in `BUILD_NOTES.md`.

---

## Do not build yet

Leave all of this for later phases:

- Any timers, animation, or the level state machine (Ready, Flash, Twist, Place traps, Resolve)
- The map renderer that draws connector tiles from generated data
- Calls to the server, endpoints, or any use of storage
- Leaderboard, streak, stats, feed, share, sound
- The run over screen and the splash Play button
- Real game state in any React component

If something in the designs seems to need one of these, show it as a static picture and note it in `BUILD_NOTES.md`.
