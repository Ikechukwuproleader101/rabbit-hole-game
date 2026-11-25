import { Rabbit } from './Rabbit';

export type HoleState = 'empty' | 'carrot' | 'rabbit' | 'caught' | 'escaped';

type HoleProps = {
  state: HoleState;
};

const CarrotIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    aria-label="Carrot"
    className={className}
    fill="none"
  >
    <path
      d="M16 7 C14 3, 11 3, 12 7 M16 7 C16 2, 19 2, 18 7 M16 7 C19 4, 22 5, 19 8"
      stroke="#2f8f3a"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M11 10 C11 8, 21 8, 21 10 L17 28 C16.5 29.5, 15.5 29.5, 15 28 Z"
      fill="#f28c28"
      stroke="#c85c10"
      strokeWidth="1.2"
    />
    <path
      d="M13.5 14 H17 M14.2 18.5 H17.2"
      stroke="#c85c10"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const Hole = ({ state }: HoleProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[82%] h-[82%] rounded-full bg-[var(--hole)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.35)]" />

      {state === 'rabbit' && (
        <Rabbit
          visible
          className="absolute -top-[18%] w-[115%] h-[115%]"
        />
      )}

      {state === 'carrot' && (
        <CarrotIcon className="absolute w-[64%] h-[64%] drop-shadow-sm" />
      )}

      {state === 'caught' && (
        <>
          <Rabbit
            visible
            className="absolute -top-[18%] w-[110%] h-[110%]"
          />
          <CarrotIcon className="absolute -bottom-[4%] -right-[4%] w-[48%] h-[48%] drop-shadow" />
        </>
      )}

      {state === 'escaped' && (
        <svg
          viewBox="0 0 32 32"
          aria-label="Escaped"
          className="absolute w-[52%] h-[52%] opacity-85"
          fill="none"
        >
          <path
            d="M9 9 L23 23 M23 9 L9 23"
            stroke="#f2e1ca"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
