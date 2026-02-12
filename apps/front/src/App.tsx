import { BrowserRouter } from 'react-router-dom';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Pages from './pages';
import ThemeProvider from './providers/ThemeProvider';
import { trpc, trpcClient } from './utils/trpc';
import { NotificationProvider } from './providers/NotificationProvider';
import { handleReactQueryError } from './utils/notification/notify';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error);
    },
  }),
  mutationCache: new MutationCache({ onError: handleReactQueryError }),

  defaultOptions: {
    queries: {
      gcTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
    },
    mutations: {
      gcTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ThemeProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Pages />
            </BrowserRouter>
          </NotificationProvider>
        </ThemeProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default App;
