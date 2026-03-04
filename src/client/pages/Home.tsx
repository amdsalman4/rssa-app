import React, { useState } from "react";
import { Search, MessageSquare, BarChart3, Users } from "lucide-react";

interface HomeProps {
  onStockSelect: (ticker: string) => void;
}

function Home({ onStockSelect }: HomeProps) {
  const [ticker, setTicker] = useState("");

  const handleSearch = () => {
    if (ticker.trim()) {
      onStockSelect(ticker.toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestedTicker = (suggestedTicker: string) => {
    onStockSelect(suggestedTicker);
  };

  const suggestedTickers = ['TSLA', 'AAPL', 'GME', 'NVDA', 'AMC', 'SPY', 'PLTR', 'AMD', 'MSFT', 'META'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Reddit Stock Sentiment
          </h1>
          <p className="text-xl text-blue-200 mb-2">
            Analyze what Reddit thinks about your favorite stocks
          </p>
          <p className="text-sm text-blue-300 mt-2">
            Powered by r/wallstreetbets and community insights
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter stock ticker (e.g., TSLA, AAPL, GME)"
              className="w-full px-6 py-4 text-lg rounded-full border-2 border-blue-400 bg-white/95 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/50 transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors flex items-center justify-center"
            >
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-blue-200">
            <MessageSquare className="mx-auto mb-2" size={24} />
            <p className="text-sm">Real Posts</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-blue-200">
            <BarChart3 className="mx-auto mb-2" size={24} />
            <p className="text-sm">AI Analysis</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-blue-200">
            <Users className="mx-auto mb-2" size={24} />
            <p className="text-sm">Community</p>
          </div>
        </div>

        {/* Suggested Tickers */}
        <div className="mt-8">
          <p className="text-sm text-blue-300 mb-3">Try popular stocks:</p>
          <div className="flex gap-2 flex-wrap justify-center max-w-2xl mx-auto">
            {suggestedTickers.map((t) => (
              <button
                key={t}
                onClick={() => handleSuggestedTicker(t)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-blue-400/30 rounded-lg cursor-pointer text-sm text-blue-100 transition-all hover:scale-105"
              >
                ${t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;