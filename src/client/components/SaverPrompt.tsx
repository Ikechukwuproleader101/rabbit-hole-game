import { PrimaryButton } from './PrimaryButton';

type SaverPromptProps = {
  onUseSaver?: () => void;
  onDecline?: () => void;
};

export const SaverPrompt = ({ onUseSaver, onDecline }: SaverPromptProps) => {
  return (
    <div className="w-[88%] max-w-[340px] bg-white px-5 py-6 shadow-[0_6px_18px_rgba(0,0,0,0.28)] flex flex-col items-center gap-4 text-center">
      <h2 className="m-0 text-2xl font-extrabold text-[var(--text-brand)] tracking-tight">
        Missed a Hole?
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton label="USE SAVER" onClick={onUseSaver} />
        {onDecline && (
          <button
            type="button"
            onClick={onDecline}
            className="min-h-[44px] min-w-[44px] px-4 py-2 border-2 border-[var(--tunnel)] text-[var(--text-brand)] font-bold uppercase text-sm rounded-sm cursor-pointer bg-white"
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
};
