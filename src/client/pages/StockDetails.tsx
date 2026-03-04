import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";

const mockStockData = {
  TSLA: {
    ticker: "TSLA",
    name: "Tesla Inc.",
    sentiment: 7.8,
    rating: "Bullish",
    prediction: "+5.2%",
    currentPrice: 242.84,
    mentions: 1247,
    posts: 89,
    comments: 1158,
    topKeywords: ["calls", "moon", "delivery numbers", "cybertruck"],
    summary:
      "Strong bullish sentiment driven by upcoming delivery numbers and Cybertruck hype. Community expects short-term gains.",
    historicalSentiment: [6.2, 6.8, 7.1, 7.5, 7.8],
  },
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    sentiment: 6.5,
    rating: "Moderately Bullish",
    prediction: "+2.1%",
    currentPrice: 189.95,
    mentions: 892,
    posts: 64,
    comments: 828,
    topKeywords: ["iPhone", "services", "dividend", "safe bet"],
    summary:
      "Steady positive sentiment with focus on service revenue growth and upcoming product launches.",
    historicalSentiment: [6.1, 6.3, 6.4, 6.5, 6.5],
  },
  GME: {
    ticker: "GME",
    name: "GameStop Corp.",
    sentiment: 8.9,
    rating: "Very Bullish",
    prediction: "+12.7%",
    currentPrice: 18.52,
    mentions: 2341,
    posts: 178,
    comments: 2163,
    topKeywords: ["diamond hands", "DRS", "to the moon", "Ryan Cohen"],
    summary:
      "Extremely bullish community sentiment. High engagement with focus on stock fundamentals and retail ownership.",
    historicalSentiment: [8.1, 8.4, 8.6, 8.7, 8.9],
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sentiment: 8.2,
    rating: "Bullish",
    prediction: "+6.8%",
    currentPrice: 495.22,
    mentions: 1534,
    posts: 112,
    comments: 1422,
    topKeywords: ["AI", "GPUs", "data center", "Jensen"],
    summary:
      "Strong bullish sentiment fueled by AI boom and data center demand. High confidence in continued growth.",
    historicalSentiment: [7.5, 7.8, 8.0, 8.1, 8.2],
  },
  AMC: {
    ticker: "AMC",
    name: "AMC Entertainment",
    sentiment: 7.1,
    rating: "Bullish",
    prediction: "+4.3%",
    currentPrice: 5.87,
    mentions: 1876,
    posts: 134,
    comments: 1742,
    topKeywords: ["apes", "short squeeze", "box office", "hold"],
    summary:
      "Bullish community with strong retail support. Focus on debt reduction and box office recovery.",
    historicalSentiment: [6.8, 6.9, 7.0, 7.0, 7.1],
  },
  SPY: {
    ticker: "SPY",
    name: "S&P 500 ETF",
    sentiment: 5.8,
    rating: "Slightly Bullish",
    prediction: "+1.2%",
    currentPrice: 456.73,
    mentions: 1123,
    posts: 89,
    comments: 1034,
    topKeywords: ["calls", "puts", "market direction", "Fed"],
    summary:
      "Mixed sentiment with cautious optimism. Traders watching Fed policy and economic indicators closely.",
    historicalSentiment: [5.5, 5.6, 5.7, 5.8, 5.8],
  },
  PLTR: {
    ticker: "PLTR",
    name: "Palantir Technologies",
    sentiment: 7.6,
    rating: "Bullish",
    prediction: "+5.9%",
    currentPrice: 28.41,
    mentions: 967,
    posts: 73,
    comments: 894,
    topKeywords: ["AI contracts", "government", "Karp", "growth"],
    summary:
      "Strong bullish sentiment driven by AI contract wins and revenue growth. Community confident in long-term prospects.",
    historicalSentiment: [6.9, 7.2, 7.4, 7.5, 7.6],
  },
  AMD: {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    sentiment: 6.9,
    rating: "Moderately Bullish",
    prediction: "+3.4%",
    currentPrice: 121.33,
    mentions: 734,
    posts: 56,
    comments: 678,
    topKeywords: ["chips", "data center", "Intel competitor", "AI"],
    summary:
      "Positive sentiment with focus on data center growth and AI chip development. Some caution on competition.",
    historicalSentiment: [6.5, 6.7, 6.8, 6.9, 6.9],
  },
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sentiment: 7.3,
    rating: "Bullish",
    prediction: "+3.8%",
    currentPrice: 378.91,
    mentions: 845,
    posts: 61,
    comments: 784,
    topKeywords: ["Azure", "OpenAI", "cloud", "enterprise"],
    summary:
      "Bullish sentiment supported by cloud growth and AI integration. Seen as stable growth play.",
    historicalSentiment: [7.0, 7.1, 7.2, 7.3, 7.3],
  },
  META: {
    ticker: "META",
    name: "Meta Platforms",
    sentiment: 6.2,
    rating: "Moderately Bullish",
    prediction: "+2.6%",
    currentPrice: 338.54,
    mentions: 612,
    posts: 47,
    comments: 565,
    topKeywords: ["VR", "ad revenue", "Zuckerberg", "metaverse"],
    summary:
      "Cautiously bullish with focus on ad revenue recovery and cost-cutting measures. Mixed views on metaverse.",
    historicalSentiment: [5.8, 5.9, 6.0, 6.1, 6.2],
  },
};

type StockData = {
  ticker: string;
  name: string;
  sentiment: number;
  rating: string;
  prediction: string;
  currentPrice: number;
  mentions: number;
  posts: number;
  comments: number;
  topKeywords: string[];
  summary: string;
  historicalSentiment: number[];
};

interface StockDetailsProps {
  ticker: string;
  onBack: () => void;
}

function StockDetails({ ticker, onBack }: StockDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [stock, setStock] = useState<StockData | null>(null);

  useEffect(() => {
    // Reset state when ticker changes
    setLoading(true);
    setLoadingStage(0);
    setStock(null);

    // Simulate loading stages
    const stages = [
      "Fetching Reddit posts...",
      "Analyzing sentiment...",
      "Calculating metrics...",
      "Generating insights...",
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      setLoadingStage(currentStage);

      if (currentStage >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
          const stockData = mockStockData[ticker.toUpperCase() as keyof typeof mockStockData];
          if (stockData) {
            setStock(stockData);
            setLoading(false);
          } else {
            // Stock not found, go back to home
            onBack();
          }
        }, 500);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [ticker, onBack]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 7) return "bullish";
    if (sentiment >= 5) return "neutral";
    return "bearish";
  };

  const sentimentValue = stock?.sentiment ?? 0;

  const SentimentIcon =
    sentimentValue >= 7
      ? TrendingUp
      : sentimentValue >= 5
      ? Minus
      : TrendingDown;

  if (loading) {
    const stages = [
      "Fetching Reddit posts...",
      "Analyzing sentiment...",
      "Calculating metrics...",
      "Generating insights...",
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          
          <h2 className="text-3xl font-bold text-white mb-8">
            Analyzing ${ticker}
          </h2>
          
          {/* Loading Stages */}
          <div className="flex flex-col gap-3">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition-all ${
                  idx < loadingStage
                    ? "bg-green-500/20 text-green-300"
                    : idx === loadingStage
                    ? "bg-blue-500/20 text-blue-300 animate-pulse"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {stage}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stock) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Search
          </button>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Live Analysis</p>
            <p className="text-blue-300 text-xs">Updated just now</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          {/* Stock Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                ${stock.ticker}
              </h1>
              <p className="text-xl text-gray-600 mb-2">{stock.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${stock.currentPrice}
              </p>
            </div>
            <div
              className={`p-6 rounded-lg ${
                getSentimentColor(stock.sentiment) === "bullish"
                  ? "bg-green-100"
                  : getSentimentColor(stock.sentiment) === "neutral"
                  ? "bg-blue-100"
                  : "bg-red-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <SentimentIcon
                  size={32}
                  className={
                    getSentimentColor(stock.sentiment) === "bullish"
                      ? "text-green-600"
                      : getSentimentColor(stock.sentiment) === "neutral"
                      ? "text-blue-600"
                      : "text-red-600"
                  }
                />
                <span
                  className={`text-4xl font-bold ${
                    getSentimentColor(stock.sentiment) === "bullish"
                      ? "text-green-600"
                      : getSentimentColor(stock.sentiment) === "neutral"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {stock.sentiment}
                </span>
              </div>
              <p className="text-sm text-gray-600">Sentiment Score</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Rating</p>
              <p
                className={`text-xl font-bold ${
                  getSentimentColor(stock.sentiment) === "bullish"
                    ? "text-green-600"
                    : getSentimentColor(stock.sentiment) === "neutral"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {stock.rating}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Prediction</p>
              <p
                className={`text-xl font-bold ${
                  stock.prediction.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stock.prediction}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Mentions</p>
              <p className="text-xl font-bold text-gray-900">
                {stock.mentions.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Posts</p>
              <p className="text-xl font-bold text-gray-900">{stock.posts}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Community Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{stock.summary}</p>
          </div>

          {/* Sentiment Trend */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sentiment Trend (5 Days)
            </h3>
            <div className="flex items-end gap-2 h-32">
              {stock.historicalSentiment.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full"
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      getSentimentColor(value) === "bullish"
                        ? "bg-green-500"
                        : getSentimentColor(value) === "neutral"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                    style={{ height: `${(value / 10) * 100}%` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Trending Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {stock.topKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg text-sm text-yellow-900">
          <strong>Disclaimer:</strong> This tool is NOT financial advice. Data
          represents sentiment from Reddit communities and should only be used
          as insights into niche stock enthusiast opinions.
        </div>
      </div>
    </div>
  );
}

export default StockDetails;