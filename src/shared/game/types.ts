export type Cell = { row: number; col: number };
export type Link = [Cell, Cell];
export type ConnectorStyle = 1 | 2 | 3 | 4 | 5;

export type GameMap = {
  size: 5;
  holes: Cell[];
  links: Link[];
  connectorStyle: ConnectorStyle;
};

export type CurveballType = 'cranky' | 'mirror' | 'social' | 'cavein';

export type Curveball = {
  type: CurveballType;
  text: string;
  targetIndex: number;
};

export type LevelData = {
  level: number;
  setIndex: number;
  indexInSet: 1 | 2 | 3;
  map: GameMap;
  rabbits: Cell[];
  carrots: number;
  flashMs: number;
  curveball: Curveball | null;
};

export type LevelResult = {
  finalPositions: Cell[];
  caught: boolean[];
  missed: number;
  passed: boolean;
};

export type RunState = {
  level: number;
  saverAvailable: boolean;
  score: number;
  status: 'playing' | 'over';
};
