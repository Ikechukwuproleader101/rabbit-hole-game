# Rabbit Hole: Build Plan for Antigravity

Build the game **one phase at a time**. Finish a phase, check its "Done when" list, and only then start the next. Do not build ahead.

Read `rabbit-hole-game-concept.md` first. It holds every game rule and decision. This file only says how and in what order to build it.

---

## Project rules (apply to every phase)

**Stack:** Devvit Web, React with TypeScript on the client, the Devvit server in `index.ts`. Setup of the IDE and the Devvit platform is already done. Do not redo it.

**Design assets:**
- All building blocks and individual screens are in the folder `building block` in the project root. Treat it as the source of truth for how things look.
- Read assets through one manifest file (`src/client/assets.ts`) that maps friendly names (`rabbitVisible`, `rabbitInvisible`, `connectorStyle1`, ...) to file paths. The folder name contains a space, so keep paths in that one place and URL-encode them.
- If the build can't serve files straight from the root folder, copy the needed images into the client's public assets folder during Phase 0 and point the manifest there.

**User data:**
- All user data (run progress, best level, streak, leaderboard, feed and community stats) is stored on the Reddit platform, **through the server in `index.ts`**.
- The client never touches storage. It only calls endpoints on the server (for example `/api/level`, `/api/submit`).
- Use Reddit's built-in storage that Devvit provides to the server. Check the Devvit docs for the exact calls (the leaderboard will want a sorted-set style structure).

**Server decides the answers.** The daily seed, rabbit positions and curveball results are generated and checked on the server. The client gets what it needs to show the flash and the twist text, and gets the final rabbit positions only after the player locks in. This stops players reading the answer from the page.

**Wording:** use "level" (not "wave"). A "set" means 3 levels on one map.

**Tunable numbers** (flash times, rabbit counts, carrot counts) live in one file: `src/shared/config.ts`.

**Open decisions** (see the end of the concept doc) must sit behind simple flags in `config.ts` so they can be switched during testing. Do not hard-code them.

---

## Phase 0: Skeleton and asset wiring

**Goal:** an empty app that runs inside Reddit and can show any asset from the design folder.

**Tasks**
- Create the folders: `src/client`, `src/server`, `src/shared`.
- Create `assets.ts` (the manifest) and `config.ts`.
- Add theme tokens (the yellow background, brown tunnel color, text colors, font) in one CSS file.
- Add a simple screen switcher: Splash, Game, Run over (empty placeholders).

**Done when:** each placeholder screen opens, and one image from `building block` displays through the manifest.

---

## Phase 1: Game logic (no UI)

**Goal:** the whole rules engine as plain TypeScript with tests.

**Tasks (in `src/shared`, server-side use for answers)**
1. Seeded random numbers from the date key `YYYY-MM-DD`, with a set index, so every player gets the same puzzle.
2. Map generator: 5x5 grid, 12 to 16 active holes, joined by links between neighbouring holes into one connected network.
3. Rabbit spawner: picks spawn holes for a level.
4. Movement rules: tunnel steps use the priority up, right, down, left, and a rabbit never backtracks unless it hits a dead end.
5. Curveballs: Cranky Shift, Mirror Hop, Social Hop, Cave-In (details in the concept doc). The rotating-in of new rules comes later.
6. Difficulty function: level number to rabbit count, carrot count and flash time. Levels 1 to 3 start at 3/3/2.0s, 4/4/1.5s, 4/4/1.5s. Later levels use placeholder values in `config.ts`.
7. Level result: caught rabbits, pass or fail, and the saver rule (one per 3-level set, vanishes at the end of the set, player chooses to spend it).

**Tests to write**
- Same seed gives the same map, spawns and curveball every time.
- Every generated map is fully connected.
- Every curveball gives exactly one valid answer (no ties, nothing off the map).

**Done when:** all tests pass.

---

## Phase 2: Static screens from the designs

**Goal:** every screen and component looks like the designs, with fake data and no game logic.

**Tasks**
- Components: splash screen, nav bar (HUD), hole, rabbit (visible and invisible), info bar ("No Twist Yet"), the "Missed a Hole?" prompt, buttons.
- A dev-only gallery page that shows every component in every state.
- Missing states to add (not in the designs yet): hole with a carrot, caught rabbit, escaped rabbit.

**Done when:** the gallery matches the designs on a phone-sized screen.

---

## Phase 3: Map renderer

**Goal:** draw any generated map from data.

**Tasks**
- Render the 5x5 grid: holes, bushes and tunnels.
- Connector tiles: five styles as skins of the same connections, with rotation and flipping for extra variety. Missing piece types (straight, T-junction, cross, dead end) to be added in the same style.
- **Rule:** every drawn connector must join exactly the two neighbouring holes the logic links. The picture must never show a path the logic doesn't have.
- Pick a connector style per set of 3 levels, from the seed.

**Done when:** three different seeded maps render correctly, and a check confirms every drawn link matches the logic links.

---

## Phase 4: One playable level (local, no server)

**Goal:** the full loop for a single level, using a fake local data source.

**Tasks**
- Put the client behind a small `GameApi` interface with two versions: a local one (for now) and a server one (Phase 6).
- Level state machine: Ready, Flash, Twist (every 3rd level), Place traps, Resolve.
- Flash timing comes from the state machine, not from animation callbacks. The pop-in and pop-out must fit inside the flash time.
- Rabbit pop animation: each rabbit sits in a clipped container the size of the hole and slides up with a small overshoot, with a 80 to 120 ms stagger. Use transform and opacity only.
- Carrot placement, carrots-left count, lock in, and the Resolve animation.
- "Level N" text over the map between levels.

**Done when:** a level is playable start to finish on a phone-sized screen.

---

## Phase 5: Progression, saver and run over

**Goal:** the endless run.

**Tasks**
- Levels continue until the player fails.
- Map and spawns change after every 3rd level, and the curveball comes on every 3rd level.
- Saver: HUD icon, spend prompt, near miss message, gone at the end of the set.
- Run over screen: score, best level, retry.
- Place these behind flags in `config.ts`: saver timing (before the result or after a miss), saver allowed on curveball levels, and when the miss reveal shows.

**Done when:** a long run works, the map changes every third level, and the saver behaves as written.

---

## Phase 6: Server and storage (`index.ts`)

**Goal:** move the answers to the server and save everything on Reddit.

**Endpoints (suggested)**
- Get the current level: returns the map, rabbit start positions, carrot count, flash time and the twist text. Not the final rabbit positions.
- Submit carrots: the server computes the result and returns final positions, caught rabbits, pass or fail and the saver state.
- Start a run, end a run, and get the player's current run.

**Data to store (keys are a suggestion)**
- Run progress per player per day: level, set, saver state, score, status.
- Best level and streak per player.
- Leaderboard: one for today and one all-time.
- Community stats: counters per day and level (attempts, passes, how many solved the curveball).

**Tasks**
- Swap the local `GameApi` for the server one.
- Keep the curveball resolution in server code only.

**Done when:** a run can be played, closed and resumed, and refreshing the page doesn't change the puzzle or let a player replay a result.

---

## Phase 7: Leaderboard, stats and feed

**Goal:** the social layer.

**Tasks**
- Leaderboard screen: today and all-time, with the player's own rank.
- Personal best and daily streak on the splash and run over screens.
- Community stats (for example "31% got today's curveball right").
- Feed: a list of recent results from other players, read from the same server storage.

**Done when:** two different test accounts see each other on the leaderboard.

---

## Phase 8: Share and splash polish

**Tasks**
- Splash: logo, Play button, "Rabbit Hole #001", streak or best level. Keep it light and static.
- Share block: copies the spoiler-free emoji summary and shows how far the player got.

---

## Phase 9: Game feel and testing

**Tasks**
- Sound for the flash, carrot placement, catches and the near miss.
- Particle or burst effect for catches (CSS first; move only the map to Phaser if it can't be done well).
- Rotating curveball rules and the weekly special rule.
- Test the saver A/B versions (saver works on every level versus not on curveball levels). Track which level each saver is spent on and how long runs last.
- Performance check on a slow phone.

---

## Open decisions (carry through from the concept doc)

- Does the miss reveal show after every level or only after the run-ending miss?
- Saver timing: before the result, or a prompt after a miss?
- Does the grid size and shape change, or only the active holes?
- Difficulty numbers after level 3.
- One attempt per day or replays? (This changes how run data is stored in Phase 6.)
- How the HUD score is calculated, and what the Golden Carrot means in an endless run.
- Leaderboard scope: global, friends or per subreddit.
- What "feed" contains exactly.
