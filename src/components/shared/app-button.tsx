import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface IAppButton {
  className?: string;
  content: string | ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset'; // ✅ add type
}

export const AppButton = ({
  className,
  content,
  disabled,
  type = 'button',
}: IAppButton) => {
  return (
    <Button
      type={type}
      disabled={disabled}
      className={`p-6 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 ${className}`}
    >
      {content}
    </Button>
  );
};
