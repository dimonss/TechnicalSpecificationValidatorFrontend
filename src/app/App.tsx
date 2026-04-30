import { ValidatorPage } from '@/pages/validator';
import { QueryProvider } from './providers/QueryProvider';

export const App = () => {
  return (
    <QueryProvider>
      <ValidatorPage />
    </QueryProvider>
  );
};
