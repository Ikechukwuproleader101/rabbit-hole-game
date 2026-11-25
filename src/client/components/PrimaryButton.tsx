import type { MouseEventHandler } from 'react';

type PrimaryButtonProps = {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export const PrimaryButton = ({ label, onClick }: PrimaryButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] min-w-[44px] px-5 py-2 bg-[var(--tunnel)] text-white font-extrabold uppercase tracking-wide text-base rounded-sm shadow-[0_3px_4px_rgba(0,0,0,0.35)] cursor-pointer active:translate-y-px transition-transform"
    >
      {label}
    </button>
  );
};
