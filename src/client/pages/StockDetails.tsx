import { ArrowLeft } from "lucide-react";

interface StockDetailsProps {
  ticker: string;
  onBack: () => void;
}

function StockDetails({ ticker, onBack }: StockDetailsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-white mb-6 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Search
        </button>

        {/* Placeholder Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            ${ticker}
          </h1>
          <p className="text-blue-200">
            Stock details coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;