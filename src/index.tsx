import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { App } from './app';
import theme from './config/theme';
import { ProvideAuth } from './hooks/useAuth';

/* import "./styles/styles.css"; */

if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ProvideAuth>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProvideAuth>
    </ChakraProvider>
  </React.StrictMode>,
);
