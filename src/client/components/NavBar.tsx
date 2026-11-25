type NavBarProps = {
  carrotsUsed: number;
  carrotsTotal: number;
  level: number;
  saverAvailable: boolean;
  score: number;
};

const SaverCarrotIcon = ({ available }: { available: boolean }) => (
  <svg
    viewBox="0 0 28 32"
    aria-label={available ? 'Saver available' : 'Saver used'}
    className={`w-6 h-7 shrink-0 transition-opacity ${
      available ? 'opacity-100' : 'opacity-30 grayscale'
    }`}
    fill="none"
  >
    <path
      d="M14 7 C12 3, 9 3, 10 7 M14 7 C14 2, 17 2, 16 7 M14 7 C17 4, 20 5, 17 8"
      stroke="#2f8f3a"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M9.5 10 C9.5 8, 18.5 8, 18.5 10 L15 28 C14.5 29.5, 13.5 29.5, 13 28 Z"
      fill="#f28c28"
      stroke="#c85c10"
      strokeWidth="1.2"
    />
  </svg>
);

export const NavBar = ({
  carrotsUsed,
  carrotsTotal,
  level,
  saverAvailable,
  score,
}: NavBarProps) => {
  return (
    <header className="w-full px-2 py-2 border-t-2 border-b-2 border-[var(--tunnel)] bg-[var(--bg)]">
      <div className="w-full max-w-[420px] mx-auto grid grid-cols-4 gap-1.5">
        <div className="bg-white border border-black/15 px-1.5 py-1 flex items-center justify-between gap-1 min-w-0">
          <span className="text-[11px] font-bold text-[var(--text-brand)] truncate">
            Carrot
          </span>
          <span className="bg-[var(--bg)] text-white font-extrabold text-xs px-1.5 py-0.5 leading-none shrink-0">
            {carrotsUsed}/{carrotsTotal}
          </span>
        </div>

        <div className="bg-white border border-black/15 px-1.5 py-1 flex items-center justify-between gap-1 min-w-0">
          <span className="text-[11px] font-bold text-[var(--text-brand)] truncate">
            Level
          </span>
          <span className="bg-[var(--bg)] text-white font-extrabold text-xs px-1.5 py-0.5 leading-none shrink-0">
            {level}
          </span>
        </div>

        <div className="bg-white border border-black/15 px-1.5 py-1 flex items-center justify-between gap-1 min-w-0">
          <span className="text-[11px] font-bold text-[var(--text-brand)] truncate">
            Saver
          </span>
          <SaverCarrotIcon available={saverAvailable} />
        </div>

        <div className="bg-white border border-black/15 px-1.5 py-1 flex items-center justify-between gap-1 min-w-0">
          <span className="text-[11px] font-bold text-[var(--text-brand)] truncate">
            Score
          </span>
          <span className="bg-[var(--bg)] text-white font-extrabold text-xs px-1.5 py-0.5 leading-none shrink-0">
            {score}
          </span>
        </div>
      </div>
    </header>
  );
};
