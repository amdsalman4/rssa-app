import './index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TrendingUp, BarChart3, MessageSquare } from 'lucide-react';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      {/* Logo/Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
        <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20">
          <TrendingUp className="text-blue-300" size={48} />
        </div>
      </div>

      {/* Title Section */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Reddit Stock Sentiment
        </h1>
        <p className="text-lg text-blue-200 max-w-md">
          AI-Powered Analysis of r/wallstreetbets
        </p>
        <p className="text-sm text-blue-300">
          Real-time sentiment tracking • Community insights • Price predictions
        </p>
      </div>

      {/* Features */}
      <div className="flex gap-6 mt-4">
        <div className="flex flex-col items-center gap-2 text-blue-200">
          <MessageSquare size={24} />
          <span className="text-xs">Live Posts</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-blue-200">
          <BarChart3 size={24} />
          <span className="text-xs">AI Analysis</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-blue-200">
          <TrendingUp size={24} />
          <span className="text-xs">Predictions</span>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex flex-col items-center justify-center mt-6 gap-3">
        <button
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-full cursor-pointer transition-all px-8 shadow-lg hover:shadow-xl hover:scale-105"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Start Analyzing Stocks
        </button>
        <p className="text-xs text-blue-400">
          Welcome, {context.username ?? 'user'}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-md px-4">
        <p className="text-xs text-center text-blue-300/70">
          Not financial advice. For educational purposes only.
        </p>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);