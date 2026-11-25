import { config } from '../config';
import { cellKey, GRID_SIZE, neighbours } from './grid';
import { createRng, hashString, pick, randInt, setSeedString } from './rng';
import type { Cell, ConnectorStyle, GameMap, Link } from './types';

const CONNECTOR_STYLES: readonly ConnectorStyle[] = [1, 2, 3, 4, 5];

function linkKey(a: Cell, b: Cell): string {
  const ka = cellKey(a);
  const kb = cellKey(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

export function generateMap(dateKey: string, setIndex: number): GameMap {
  const rng = createRng(hashString(setSeedString(dateKey, setIndex)));
  const targetHoles = randInt(rng, config.HOLES_MIN, config.HOLES_MAX);

  const start: Cell = {
    row: randInt(rng, 0, GRID_SIZE - 1),
    col: randInt(rng, 0, GRID_SIZE - 1),
  };

  const holes: Cell[] = [start];
  const holeSet = new Set<string>([cellKey(start)]);
  const links: Link[] = [];
  const linkSet = new Set<string>();

  while (holes.length < targetHoles) {
    const base = pick(rng, holes);
    const candidates = neighbours(base).filter((n) => !holeSet.has(cellKey(n)));
    if (candidates.length === 0) continue;

    const next = pick(rng, candidates);
    holes.push(next);
    holeSet.add(cellKey(next));
    links.push([base, next]);
    linkSet.add(linkKey(base, next));
  }

  for (const hole of holes) {
    for (const adj of neighbours(hole)) {
      if (!holeSet.has(cellKey(adj))) continue;
      // Only consider canonical direction (right or down) so each pair is tested once
      if (adj.row < hole.row || adj.col < hole.col) continue;

      const lk = linkKey(hole, adj);
      if (linkSet.has(lk)) continue;

      if (rng() < config.EXTRA_LINK_CHANCE) {
        links.push([hole, adj]);
        linkSet.add(lk);
      }
    }
  }

  const connectorStyle = pick(rng, CONNECTOR_STYLES);

  return {
    size: 5,
    holes,
    links,
    connectorStyle,
  };
}
