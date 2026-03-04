import './index.css';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import StockDetails from './pages/StockDetails';

export const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'stock'>('home');
  const [selectedTicker, setSelectedTicker] = useState<string>('');

  const navigateToStock = (ticker: string) => {
    setSelectedTicker(ticker);
    setCurrentPage('stock');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedTicker('');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && (
        <Home onStockSelect={navigateToStock} />
      )}
      {currentPage === 'stock' && (
        <StockDetails 
          ticker={selectedTicker} 
          onBack={navigateToHome} 
        />
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);