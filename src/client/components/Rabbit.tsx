import { assets } from '../assets';

type RabbitProps = {
  visible: boolean;
  className?: string;
};

export const Rabbit = ({ visible, className = '' }: RabbitProps) => {
  return (
    <img
      src={visible ? assets.rabbitVisible : assets.rabbitInvisible}
      alt={visible ? 'Visible rabbit' : 'Invisible rabbit'}
      className={`select-none pointer-events-none object-contain ${className}`}
      draggable={false}
    />
  );
};
