import { PrimaryButton } from './PrimaryButton';

type InfoBarProps = {
  text: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

export const InfoBar = ({ text, buttonLabel, onButtonClick }: InfoBarProps) => {
  return (
    <div className="w-full px-4 pb-6">
      <div className="relative w-full max-w-[380px] mx-auto bg-[var(--panel)] px-5 pt-4 pb-8 text-center">
        <p className="m-0 text-[15px] leading-snug font-medium text-black">
          {text}
        </p>
        {buttonLabel && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-5">
            <PrimaryButton label={buttonLabel} onClick={onButtonClick} />
          </div>
        )}
      </div>
    </div>
  );
};
