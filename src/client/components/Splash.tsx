import type { MouseEventHandler } from 'react';
import { assets } from '../assets';
import { PrimaryButton } from './PrimaryButton';

type SplashProps = {
  onPlay?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export const Splash = ({ onPlay }: SplashProps) => {
  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center gap-8 bg-[var(--bg)] px-6">
      <img
        src={assets.banner}
        alt="Rabbit Hole"
        className="w-[86%] max-w-[320px] h-auto object-contain select-none"
        draggable={false}
      />
      <PrimaryButton label="PLAY" onClick={onPlay} />
    </div>
  );
};
