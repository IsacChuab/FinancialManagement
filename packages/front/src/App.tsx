import { BrowserRouter } from 'react-router-dom';
import Pages from './pages';
import ThemeProvider from './providers/ThemeProvider';
import ThemeButton from './components/ThemeButton';
import LogoutButton from './components/LogoutButton';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './utils/trpc';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error);
    },
  }),

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
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <ThemeButton />
            <LogoutButton />

            <Pages />
          </BrowserRouter>
        </ThemeProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default App;
