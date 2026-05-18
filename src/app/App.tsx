import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '@/shared/auth';
import { env } from '@/shared/config/env';
import { LoginPage } from '@/pages/login';
import { ValidatorPage } from '@/pages/validator';
import { QueryProvider } from './providers/QueryProvider';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <ValidatorPage /> : <LoginPage />;
};

export const App = () => {
  return (
    <QueryProvider>
      <GoogleOAuthProvider clientId={env.googleClientId}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryProvider>
  );
};
