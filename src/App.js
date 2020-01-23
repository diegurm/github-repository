import React from 'react';
import { SnackbarProvider } from 'notistack';
import Routes from './routes';

import GlobalStyle from './styles/global';

function App() {
  return (
    <>
      <SnackbarProvider>
        <Routes />
      </SnackbarProvider>
      <GlobalStyle />
    </>
  );
}

export default App;
