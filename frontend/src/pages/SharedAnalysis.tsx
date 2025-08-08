import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Share2, Loader2, AlertCircle } from 'lucide-react';
import { SharedAnalysis as SharedAnalysisType } from '../types';
import { draftApi } from '../utils/api';

const SharedAnalysis: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [analysis, setAnalysis] = useState<SharedAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (token) {
      fetchSharedAnalysis(token);
    }
  }, [token]);

  const fetchSharedAnalysis = async (shareToken: string) => {
    try {
      setLoading(true);
      const data = await draftApi.getSharedAnalysis(shareToken);
      setAnalysis(data);
    } catch (error) {
      setError('Analysis not found or not publicly shared');
      console.error('Error fetching shared analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysisText = (text: string) => {
    // Convert markdown-style formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^\n/gm, '')
      .replace(/\n$/gm, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shared analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Analysis Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The shared analysis you\'re looking for doesn\'t exist or is no longer available.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Share2 className="h-4 w-4" />
                <span>Shared Draft Analysis</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {analysis.draft_title}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Analyzed on {new Date(analysis.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Powered by
              </div>
              <div className="text-lg font-bold text-primary-600">
                Fantasy Draft Analyzer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-4">${formatAnalysisText(analysis.analysis_text)}</p>` 
            }}
          />
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-primary-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Want to analyze your own draft?
          </h3>
          <p className="text-gray-600 mb-4">
            Upload your fantasy football draft and get AI-powered insights in seconds.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharedAnalysis;