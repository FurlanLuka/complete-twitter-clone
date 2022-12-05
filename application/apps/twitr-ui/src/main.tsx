import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { darkTheme } from './theme';
import { SessionContextProvider } from './app/authentication/session-context-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { API_URL } from './app/constants';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


export const queryClient: QueryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider
        defaultTheme="system"
        attribute="class"
        value={{ dark: darkTheme }}
      >
        <NextUIProvider>
          <SessionContextProvider
            apiUrl={API_URL}
            onLogout={() => console.log('logged out')}
          >
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools />
              <App />
            </QueryClientProvider>
          </SessionContextProvider>
        </NextUIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
