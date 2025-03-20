import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { PracticeDashboard } from './components/PracticeDashboard';
import './index.css'; // Optional: Only if you kept index.css

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <PracticeDashboard />
    </ChakraProvider>
  </React.StrictMode>
);
