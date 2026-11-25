import type { HoleState } from './Hole';
import { InfoBar } from './InfoBar';
import { MapStatic } from './MapStatic';
import { NavBar } from './NavBar';
import { SaverPrompt } from './SaverPrompt';

export type GameScreenVariant = 'idle' | 'noTwist' | 'twist' | 'missed';

type GameScreenProps = {
  variant: GameScreenVariant;
};

const TWIST_RABBIT_HOLES: Record<string, HoleState> = {
  '0,0': 'rabbit',
  '0,2': 'rabbit',
  '0,4': 'rabbit',
  '1,3': 'rabbit',
  '2,0': 'rabbit',
  '2,2': 'rabbit',
  '3,1': 'rabbit',
  '4,0': 'rabbit',
};

export const GameScreen = ({ variant }: GameScreenProps) => {
  const showRabbits = variant === 'twist' || variant === 'missed';

  return (
    <div className="w-full min-h-dvh flex flex-col bg-[var(--bg)]">
      <NavBar
        carrotsUsed={2}
        carrotsTotal={3}
        level={6}
        saverAvailable
        score={17}
      />

      <div className="relative w-full flex-1 flex flex-col justify-between pb-4">
        <div className="relative w-full border-b-2 border-[var(--tunnel)] py-2">
          <MapStatic holeStates={showRabbits ? TWIST_RABBIT_HOLES : {}} />
          {variant === 'missed' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <SaverPrompt />
            </div>
          )}
        </div>

        <div className="pt-4 min-h-[120px] flex items-start justify-center">
          {variant === 'noTwist' && (
            <InfoBar text="No Twist Yet" buttonLabel="TWIST" />
          )}
          {(variant === 'twist' || variant === 'missed') && (
            <InfoBar
              text="the rabbit on the left has just moved 2 spaces downwards. Sneaky!"
              buttonLabel="TWIST"
            />
          )}
        </div>
      </div>
    </div>
  );
};
