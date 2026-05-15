import { useAuth } from '@/shared/auth';
import { Button } from '@/shared/ui/Button';

interface LogoutButtonProps {
  className?: string;
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { logout } = useAuth();
  return (
    <Button variant="ghost" onClick={() => void logout()} className={className}>
      Выйти
    </Button>
  );
};
