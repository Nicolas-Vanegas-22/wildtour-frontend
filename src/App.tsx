import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './app/router';
import { ToastProvider } from './presentation/components/Toast';

// Crear QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <div className="App min-h-screen bg-gray-50">
            <main id="main-content">
              <AppRouter />
            </main>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;