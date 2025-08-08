import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Brain, Share2, FileText, Trophy, Target } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Upload draft results via CSV/TXT files or paste directly into the app.',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Get comprehensive draft analysis powered by advanced AI technology.',
    },
    {
      icon: Share2,
      title: 'Share Results',
      description: 'Share your analysis with league members or export for later reference.',
    },
    {
      icon: Target,
      title: 'Team Insights',
      description: 'Get detailed team-by-team breakdown with grades and recommendations.',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex justify-center mb-6">
          <Trophy className="h-16 w-16 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fantasy Football Draft Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get AI-powered insights on your fantasy football draft. Upload your draft results and receive 
          comprehensive analysis, team grades, and strategic recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Draft
          </Link>
          <Link
            to="/drafts"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            View Previous Drafts
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Analyze Your Draft?
        </h2>
        <p className="text-gray-600 mb-6">
          Upload your draft results and get detailed insights in seconds.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;