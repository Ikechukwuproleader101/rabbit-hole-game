# Rabbit Hole — Build Notes (Phases 0 to 2)

## 1. `Building Blocks` Folder Listing

The design folder in the project root is named `Building Blocks` (capitalized, plural). Exact files found:

- `Banner.png`
- `Comments.png`
- `Connector01.png`
- `Connector02.png`
- `Connector03.png`
- `Connector04.png`
- `Connector05.png`
- `Info bar 1.png`
- `Invisible rabbit.png`
- `leaderboard.png`
- `Nav Bar.png`
- `News.png`
- `Rectangle 28.png`
- `Rectangle 29.png`
- `Rectangle 30.png`
- `Rectangle 31.png`
- `Rectangle 32.png`
- `Rectangle 33.png`
- `Rectangle 34.png`
- `Rectangle 35.png`
- `Rectangle 36.png`
- `Rectangle 37.png`
- `Rectangle 38.png`
- `Rectangle 39.png`
- `Rectangle 40.png`
- `Rectangle 41.png`
- `Screen1.png`
- `Screen2.png`
- `Screen3.png`
- `Screen4.png`
- `Screen5.png`
- `Visible Rabbit.png`

## 2. Asset Manifest (`src/client/assets.ts`)

Because Vite serves static files from `public/`, all files from `Building Blocks/` were copied (originals untouched) into `public/assets/` and referenced via URL-encoded paths:

| Manifest key | File in `public/assets/` | Purpose |
|---|---|---|
| `banner` | `/assets/Banner.png` | Splash screen Rabbit Hole logo & rabbit banner |
| `rabbitVisible` | `/assets/Visible%20Rabbit.png` | Visible rabbit illustration |
| `rabbitInvisible` | `/assets/Invisible%20rabbit.png` | Faded/hidden rabbit illustration |
| `infoBar1` | `/assets/Info%20bar%201.png` | Reference for InfoBar 1 |
| `navBar` | `/assets/Nav%20Bar.png` | Reference for top Reddit tab strip |
| `connectorStyle1`..`connectorStyle5` | `/assets/Connector01.png`..`Connector05.png` | Tunnel connector styles (gallery display only in Phase 2) |
| `screenSplash` | `/assets/Screen1.png` | Splash design reference |
| `screenMap` | `/assets/Screen2.png` | Idle map design reference |
| `screenNoTwist` | `/assets/Screen3.png` | No-twist screen design reference |
| `screenTwist` | `/assets/Screen4.png` | Twist screen design reference |
| `screenMissed` | `/assets/Screen5.png` | Missed-a-hole prompt design reference |
| `comments`, `leaderboard`, `news` | `/assets/Comments.png`, `leaderboard.png`, `News.png` | Extra assets found in `Building Blocks` |

## 3. Missing Assets & Placeholders

The following items were not present as standalone files in `Building Blocks` and were built as CSS or inline SVG placeholders:

- **`infoBar2` ("Missed a Hole?" prompt):** Only present inside `Screen5.png`. Built with CSS/HTML (`SaverPrompt.tsx`) and `PrimaryButton`.
- **`Hole` states (`carrot`, `caught`, `escaped`):** No standalone carrot, caught-rabbit, or escaped-hole art exists in `Building Blocks`. Built inline SVG placeholders in `Hole.tsx` (orange `#f28c28` carrot with green `#2f8f3a` top; `caught` overlays the carrot on the visible rabbit; `escaped` shows a light beige `×` mark).
- **`MapStatic` tunnels:** Built with SVG lines in `--tunnel` (`#b96844`) as specified for Phase 2 (connector tiles are deferred to Phase 3).

## 4. Theme Colors & Fonts

- **Colors sampled from `Screen4.png`, `Info bar 1.png`, `Connector01.png`** in `src/client/theme.css`:
  - `--bg: #fecb00`
  - `--tunnel: #b96844`
  - `--hole: #955033`
  - `--text-brand: #b96844`
  - `--panel: #f2e1ca`
  - `--carrot: #f28c28` (fallback/spec value)
- **Fonts:** No font files exist in `Building Blocks`. Using system sans-serif fallback (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) with no external CDN requests.

## 5. Deviations from Spec & Assumptions

- **Folder name:** Design folder is `Building Blocks` rather than `building block`.
- **Entrypoints:** Kept the Devvit template's `splash.html` (`src/client/splash.tsx`) and `game.html` (`src/client/game.tsx`) structure from `devvit.json`. `splash.tsx` renders `<Splash />` directly; `game.tsx` hosts the dev-only screen switcher (`splash`, `game`, `runOver`, `gallery`) and `#gallery` hash routing.
- **No type assertions:** Followed `AGENTS.md` ("Never cast typescript types") by typing `config` explicitly in `src/shared/config.ts` instead of using `as` casts.
- **Test runner scope:** Added `"test": "vitest run src"` to `package.json` so Vitest does not pick up compiled `.js` files emitted into `dist/types/` by `tsc --build`.
- **Cave-In center hole assumption:** As noted in the spec, `(2, 2)` may not be an active hole on a generated map, so `findCenterHole` picks the active hole with the smallest Manhattan distance to `(2, 2)` (tie-breaking smaller `row`, then smaller `col`).
- **`GameScreen` `idle` / `noTwist` NavBar:** `Screen2.png` and `Screen3.png` omit the game HUD `NavBar` in the raw mockups, whereas Section 2.3 specifies `NavBar` + `MapStatic` + info area for all four variants with fake data (`level 6`, `carrots 2/3`, `score 17`, `saver available`). Implemented per Section 2.3.
