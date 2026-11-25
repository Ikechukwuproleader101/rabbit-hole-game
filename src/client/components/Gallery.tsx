import { assets } from '../assets';
import { GameScreen } from './GameScreen';
import type { GameScreenVariant } from './GameScreen';
import { Hole } from './Hole';
import type { HoleState } from './Hole';
import { InfoBar } from './InfoBar';
import { NavBar } from './NavBar';
import { PrimaryButton } from './PrimaryButton';
import { Rabbit } from './Rabbit';
import { SaverPrompt } from './SaverPrompt';
import { Splash } from './Splash';

const HOLE_STATES: readonly HoleState[] = [
  'empty',
  'carrot',
  'rabbit',
  'caught',
  'escaped',
];

const CONNECTORS = [
  { label: 'connectorStyle1', src: assets.connectorStyle1 },
  { label: 'connectorStyle2', src: assets.connectorStyle2 },
  { label: 'connectorStyle3', src: assets.connectorStyle3 },
  { label: 'connectorStyle4', src: assets.connectorStyle4 },
  { label: 'connectorStyle5', src: assets.connectorStyle5 },
] as const;

const GAME_VARIANTS: readonly GameScreenVariant[] = [
  'idle',
  'noTwist',
  'twist',
  'missed',
];

export const Gallery = () => {
  return (
    <div className="w-full min-h-dvh bg-[var(--bg)] p-4 flex flex-col gap-8">
      <h1 className="m-0 text-2xl font-black text-[var(--text-brand)]">
        Rabbit Hole — Component Gallery
      </h1>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">Rabbit</h2>
        <div className="flex gap-6 items-center bg-white/60 p-4 rounded">
          <div className="flex flex-col items-center gap-1">
            <Rabbit visible className="w-16 h-16" />
            <span className="text-xs font-medium">visible</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Rabbit visible={false} className="w-16 h-16" />
            <span className="text-xs font-medium">invisible</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">Hole (all 5 states)</h2>
        <div className="flex flex-wrap gap-4 bg-white/60 p-4 rounded">
          {HOLE_STATES.map((state) => (
            <div key={state} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16">
                <Hole state={state} />
              </div>
              <span className="text-xs font-medium">{state}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">PrimaryButton</h2>
        <div className="flex gap-4 bg-white/60 p-4 rounded">
          <PrimaryButton label="TWIST" />
          <PrimaryButton label="USE SAVER" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">NavBar</h2>
        <div className="flex flex-col gap-3 max-w-[390px]">
          <NavBar
            carrotsUsed={2}
            carrotsTotal={3}
            level={6}
            saverAvailable
            score={17}
          />
          <NavBar
            carrotsUsed={3}
            carrotsTotal={4}
            level={7}
            saverAvailable={false}
            score={21}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">InfoBar</h2>
        <div className="flex flex-col gap-4 max-w-[390px]">
          <InfoBar text="No Twist Yet" buttonLabel="TWIST" />
          <InfoBar
            text="the rabbit on the left has just moved 2 spaces downwards. Sneaky!"
            buttonLabel="TWIST"
          />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">SaverPrompt</h2>
        <div className="flex flex-wrap gap-6">
          <SaverPrompt />
          <SaverPrompt onDecline={() => {}} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-bold text-black">
          Connector Styles (Display Only)
        </h2>
        <div className="flex flex-wrap gap-4 bg-white/60 p-4 rounded">
          {CONNECTORS.map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-1">
              <img
                src={c.src}
                alt={c.label}
                className="w-20 h-20 object-contain"
              />
              <span className="text-xs font-medium">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-lg font-bold text-black">
          Screens (390px Phone Frames)
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase">Splash</span>
            <div className="w-[390px] max-w-full border-2 border-black/30 overflow-hidden shadow">
              <Splash />
            </div>
          </div>
          {GAME_VARIANTS.map((v) => (
            <div key={v} className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase">
                GameScreen: {v}
              </span>
              <div className="w-[390px] max-w-full border-2 border-black/30 overflow-hidden shadow">
                <GameScreen variant={v} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
