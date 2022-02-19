import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';

import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, UiProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig 
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <AuthProvider>
        <CartProvider>
          <UiProvider>
            <ThemeProvider theme={ lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
          </UiProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
  )
}

export default MyApp
