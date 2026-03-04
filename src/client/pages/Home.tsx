import React, { useState } from "react";
import { Search, MessageSquare, BarChart3, Users, Loader2 } from "lucide-react";

interface HomeProps {
  onStockSelect: (ticker: string) => void;
}

function Home({ onStockSelect }: HomeProps) {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testRedditAPI = async (tickerSymbol: string) => {
    setLoading(true);
    setError(null);
    setTestResults(null);

    try {
      console.log('Testing Reddit API for ticker:', tickerSymbol);
      
      // Call YOUR backend, which then calls Reddit
      const response = await fetch('/api/reddit/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: tickerSymbol }),
      });

      const data = await response.json();
      
      console.log('Reddit API Response:', data);
      
      if (data.success) {
        setTestResults(data);
        console.log(`✅ Found ${data.count} posts about $${data.ticker}`);
      } else {
        setError(data.error || 'Failed to fetch posts');
        console.error('❌ Error:', data.error);
      }
    } catch (err) {
      console.error('Error calling Reddit API:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (ticker.trim()) {
      await testRedditAPI(ticker.toUpperCase());
      // Uncomment to navigate after successful test:
      // onStockSelect(ticker.toUpperCase());
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
  };

  const handleSuggestedTicker = async (suggestedTicker: string) => {
    setTicker(suggestedTicker);
    await testRedditAPI(suggestedTicker);
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
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3 rounded-full transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
            </button>
          </div>
        </div>

        {/* Test Results Display */}
        {testResults && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-left">
            <h3 className="text-green-300 font-bold mb-2">✅ API Test Successful!</h3>
            <p className="text-sm text-green-200">
              Found <strong>{testResults.count}</strong> posts about <strong>${testResults.ticker}</strong>
            </p>
            <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
              {testResults.data?.slice(0, 3).map((post: any) => (
                <div key={post.id} className="text-xs text-green-100 bg-green-900/20 p-2 rounded">
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-green-300">👍 {post.score} • 💬 {post.numComments} • u/{post.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-left">
            <h3 className="text-red-300 font-bold mb-2">❌ API Test Failed</h3>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

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
                disabled={loading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed backdrop-blur-sm border border-blue-400/30 rounded-lg cursor-pointer text-sm text-blue-100 transition-all hover:scale-105"
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