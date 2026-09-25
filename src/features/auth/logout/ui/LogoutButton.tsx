import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { LogoutModal } from './LogoutModal';

interface LogoutButtonProps {
  className?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const LogoutButton = ({ className, label = 'Выйти', variant = 'ghost' }: LogoutButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={variant} onClick={() => setIsOpen(true)} className={className}>
        {label}
      </Button>
      <LogoutModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

