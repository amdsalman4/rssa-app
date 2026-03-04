//MAIN ENTRY POINT FOR APP

import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { navigateTo } from '@devvit/web/client';
import { useCounter } from './hooks/useCounter';

export const App = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-white dark:bg-gray-900">
    
      <div className="flex flex-col items-center gap-2">
        <h1>This is our reddit stock sentiment analysis app</h1>
        
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
