# Rabbit Hole: Game Concept (updated to the designs)

**Platform:** Reddit (mobile first, daily community game), built with Devvit Web and React
**Genre:** Daily spatial memory and deduction puzzle
**Status:** Concept settled. Open decisions are listed at the end.

> **The designs in the `building block` folder are the source of truth for the look and layout.** Where any older note disagrees with them, the designs win. The game rules below are unchanged.

---

## 1. Core idea

Rabbits flash briefly in a burrow map, then disappear. The player places carrot traps in the holes where they think the rabbits will come out. There is no tapping of rabbits: the game is pure trap placement, memory and deduction.

On every 3rd level, after the flash, a **curveball** (the twist) is revealed. It is a rule that moves one rabbit, so the player has to remember the snapshot and work out the new position in their head.

**Run structure:** play until you fail. The goal is to beat your own high score and rank on the leaderboard by surviving for many levels.

---

## 2. Game flow (with the UI)

Everything happens on one game screen. The flow below follows the designs.

| Step | What the player sees | What happens |
|------|----------------------|--------------|
| **Splash** | The Rabbit Hole logo on the yellow background | The player enters the game (how is not in the designs yet) |
| **Ready** | Nav bar at the top (**Carrot x/y**, **Level**, **Saver**, **Score**), the burrow map with tunnels, and a "Level N" text over the map | A new level begins |
| **Flash** | Rabbits appear in their holes (visible rabbit), then disappear (invisible rabbit). The info bar is not shown yet | The memory moment, 2.0s or 1.5s on the early levels |
| **Twist bar** | An info bar below the map with a **Twist** button | Levels without a curveball show **"No Twist Yet"**. Every 3rd level (3, 6, 9 and so on) shows the twist rule text instead |
| **Place carrots** | The player taps holes on the map. The Carrot counter in the nav bar goes up | The player commits their carrots. The designs have no carrot tray and no Lock in button |
| **Resolve** | Rabbits emerge at their true positions, carrots catch or miss | A rabbit and a carrot in the same hole is a catch |
| **Outcome** | See below | |

**Outcomes after Resolve**
- **Every rabbit caught:** the level is passed. A "Level N+1" text appears over the map. After every 3rd level the map and rabbit spawns change.
- **A rabbit missed:** the **"Missed a Hole?"** prompt appears over the map with a **Use Saver** button. If the saver is used, the player moves on to the next level. If there's no saver left, the run ends.

---

## 3. Levels and maps

- Levels run on one screen. Passing a level shows a "Level N+1" text over the map, with no separate level screen.
- **Each map lasts 3 levels** (a set). Levels 1 and 2 let the player learn the tunnels. Level 3 adds the curveball.
- **The curveball comes on every 3rd level** (3, 6, 9, and so on).
- **The map and rabbit spawn positions change after every 3rd level.** The game then starts the next 3-level set on the new map.
- Layout: a 5x5 grid with 12 to 16 active burrow holes joined by fixed tunnel paths.
- Maps, spawn positions and curveballs come from a shared daily seed (date key `YYYY-MM-DD`), so every player faces the same puzzle.

### Tunnel connectors

The designs include five brown connector styles. They are the different shapes and styles that the maze edges and patterns can take on different runs.

**Rule:** every drawn connector must join exactly the same two neighbouring holes that the game logic links. The picture must never show a path the logic doesn't have, because the curveball depends on those paths.

### Map generator requirements

The mechanism that changes the maze and spawn positions must guarantee:

- The tunnels form one connected network with no stranded holes.
- Spawn positions are chosen so the curveball always has a single, valid answer (no ties, no paths running off the map).
- Difficulty settings scale with how far the player has got.
- Everything is derived from the daily seed.

### Starting difficulty

| Level | Rabbits | Carrots | Flash time | Curveball |
|-------|---------|---------|------------|-----------|
| 1 | 3 | 3 | 2.0s | None |
| 2 | 4 | 4 | 1.5s | None |
| 3 | 4 | 4 | 1.5s | Yes |

After level 3 the difficulty keeps rising. The designer likes raising or lowering the rabbit count as a difficulty and strategy lever.

---

## 4. Movement rules

- Tunnels are fixed pathways between adjacent holes.
- When a curveball moves a rabbit along a tunnel, intersections resolve in strict priority order so every puzzle is solvable by logic:
  1. Up (row - 1)
  2. Right (col + 1)
  3. Down (row + 1)
  4. Left (col - 1)
- Rabbits never backtrack into the hole they just left, unless they hit a dead end.

---

## 5. Curveball rules

Rules reference clear spatial positions (not names or colors). Ties are broken left to right, then top to bottom.

| Rule | Text shown | Effect |
|------|------------|--------|
| The Cranky Shift | "The top-most rabbit got cranky and moved 3 steps along the tunnel." | Advances 3 connected holes using the direction priority. |
| The Mirror Hop | "The bottom-most rabbit panicked and jumped to the horizontally mirrored hole." | Flips the column on the same row (col becomes 4 - col). If there's no hole there, it slides to the nearest active hole on that row. |
| The Social Hop | "The left-most rabbit got lonely and moved 1 step closer to the right-most rabbit along the shortest tunnel path." | Moves 1 hole along the shortest tunnel path toward the right-most rabbit's starting hole. |
| The Cave-In | "A tunnel collapsed! The right-most rabbit's hole is blocked, so it retreated 1 step toward the center of the board." | Steps 1 connected hole toward the center position (2, 2). |

**Rotation over time:** new curveball rules are rotated in over time, and a weekly special rule is planned, to keep curveball levels fresh.

**From the designs:** the twist bar in the designs shows a rule written as "the rabbit on the left has just moved 2 spaces downwards. Sneaky!" This is not one of the four rules above (see the open decisions).

---

## 6. Failing and the saver

- A level fails if even one rabbit is missed, unless the saver is used.
- **The saver (near miss system):**
  - Each 3-level set gives the player one saver.
  - It is offered through the **"Missed a Hole?"** prompt after a miss. The player chooses whether to use it.
  - A saver forgives the miss so the player moves on to the next level instead of ending the run.
  - **No banking:** the saver vanishes at the end of the 3 levels whether used or not, and each new set grants a new one.
  - A "near miss" message plays when it's used.
- The nav bar shows a Saver icon so players always know if they still have it.

**Testing plan:** keep the saver and use user-testing feedback to judge it. Possible A/B versions:

- Version A: the saver works on every level.
- Version B: the saver doesn't work on curveball levels.

Track which level each saver is spent on, and how long runs last. Warning signs are most savers being spent on curveball levels, or runs getting too long to be competitive.

---

## 7. Retention features (chosen)

- **Game feel:** quick, satisfying animation and sound for the flash, carrot placement and rabbits popping out.
- **Streaks and stats:** daily streak counter, personal best level, and community stats (for example "only 31% got today's Cranky Shift right").
- **New curveball rules over time,** including a weekly special rule.
- **Leaderboard:** players compete by how far they get.
- **Shareable result:** a compact, spoiler-free emoji summary for the daily Reddit thread.

Example share block (to be updated to show how far the player got):

```
Rabbit Hole #001
Level 1: 🟩🟩🟩
Level 2: 🟩🟩🟩🟩
Level 3 (Cranky Shift): 🟩🟩🟩🟩
Best level: 3
```

---

## 8. UI components (from the designs)

### Building blocks
- **Nav bar:** Carrot x/y (carrots placed out of the total), Level, Saver, Score
- **Rabbit:** visible and invisible versions
- **Info bar 1:** "No Twist Yet" with a Twist button (also used for the twist rule text)
- **Info bar 2:** "Missed a Hole?" with a Use Saver button, shown over the map
- **Splash:** logo on the yellow background
- **Tunnel connectors:** five styles
- **Burrow map:** holes joined by brown tunnels

Not in the designs yet and needing art: a hole with a carrot, a caught rabbit and an escaped rabbit.

### By step

| Step | Components |
|------|------------|
| Splash | Logo |
| Ready | Nav bar, burrow map, "Level N" text |
| Flash | Visible rabbits, then invisible rabbits |
| Twist bar | Info bar with "No Twist Yet" or the twist rule text, and a Twist button |
| Place carrots | Tappable holes, Carrot counter |
| Resolve | Rabbits emerging, catch and miss feedback |
| Missed a rabbit | "Missed a Hole?" prompt with Use Saver |
| Next level | "Level N+1" text, map change after every 3rd level |
| Run over | Score, best level, daily streak, share, leaderboard, retry |

### Animations
- **Flash:** rabbits pop up from their holes and drop back down, with a short sound.
- **Level text:** "Level N" fades in and out over the map.
- **Twist:** the info bar text changes to the twist rule.
- **Placing carrots:** a carrot drops into the hole with a small bounce, and the Carrot counter goes up.
- **Saver:** the Saver icon fades when spent, with the near miss message.
- **Resolve:** rabbits emerge one by one, caught rabbits get a burst, escaped rabbits hop away.
- **Map change (after every 3rd level):** a short transition into the new layout.
- **Run over:** the score counts up, and the share button copies the emoji block.

### Mobile layout (top to bottom)
1. Nav bar
2. Burrow map (square 5x5 grid, holes and tunnels)
3. Info bar below the map (twist status and Twist button)

The "Missed a Hole?" prompt appears over the map.

---

## 9. Visual direction (from the designs)

- Bright **yellow** background
- **Brown** tunnels and dark brown holes
- Beige info bar, rust-brown buttons and heading text
- Cute illustrated rabbits that stand out against the dark holes
- Orange for carrots
- Exact colors are to be sampled from the design files, not guessed.

---

## 10. Platform and data

- Built for Reddit with Devvit Web, using React.
- All design assets and screens are in the `building block` folder in the project root.
- **All user data (leaderboard, feed, run progress, stats) is stored on the Reddit platform through the server in `index.ts`.** The client never touches storage.
- The server generates and checks the answers (daily seed, rabbit positions, curveball results).

---

## 11. Open decisions

1. **What the Twist button does,** and when the player can press it.
2. **How a level moves on after the last carrot is placed.** The designs have no Lock in button.
3. **How the player gets from the splash into the game** (the designs have no Play button).
4. **The saver and more than one missed rabbit:** does the saver forgive exactly one missed rabbit (the current assumption), or a whole level however many were missed?
5. **The twist text in the designs** ("the rabbit on the left has just moved 2 spaces downwards"): does it become a fifth curveball rule?
6. **The "Missed a Hole?" prompt** only has a Use Saver button in the design. Is there a way to decline, and what does the player see when no saver is left?
7. **Post-miss reveal:** the designer wants a reveal of where the rabbits really ended up, built so it doesn't break the addictive loop. Not yet decided whether it shows after every level or only after the run-ending miss.
8. **Saver on curveball levels:** allowed or not (the A/B test in section 6).
9. **Grid size and shape:** the concept uses a fixed 5x5 grid, while the original idea had mazes of different sizes and shapes.
10. **Difficulty curve after level 3:** exact rabbit counts, flash times and map sizes for later levels.
11. **One attempt per day or replays.**
12. **Leaderboard scope** (global, friends, per subreddit) and what the **feed** contains.
13. **Score and Golden Carrot:** how the Score is calculated, and what the Golden Carrot means now that runs are endless.
14. **Share block format:** update to show how far the player got.
