'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">About Football Predictions</h1>
          <p className="mt-4 text-lg text-gray-600">
            Your trusted source for AI-powered football match predictions
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                We&apos;re dedicated to providing football fans with accurate, data-driven predictions using advanced AI technology. Our goal is to enhance your football experience by offering insights and analysis that help you better understand upcoming matches.
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 mb-6">
                Our AI system analyzes various factors including team form, head-to-head records, player statistics, and historical data to generate comprehensive match predictions. We provide multiple prediction types to give you a complete view of what to expect in each match.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prediction Types</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Match Winner (Home Win, Draw, Away Win)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Both Teams to Score (BTTS)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Over/Under Goals
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Correct Score
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Half-Time/Full-Time Result
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  First Team to Score
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Corner Count
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Cards (Yellow/Red)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Technology</h2>
          <p className="text-gray-600 mb-6">
            We utilize state-of-the-art AI models and machine learning algorithms to process vast amounts of football data. Our system continuously learns and improves from match outcomes to provide increasingly accurate predictions.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Real-time Updates</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Leagues Covered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">AI</div>
              <p className="text-gray-600">Powered Predictions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 