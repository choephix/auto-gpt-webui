import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
