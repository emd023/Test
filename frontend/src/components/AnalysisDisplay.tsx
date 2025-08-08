import React, { useState } from 'react';
import { Share2, Download, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Analysis } from '../types';
import { draftApi } from '../utils/api';
import { cn } from '../utils/cn';

interface AnalysisDisplayProps {
  analysis: Analysis;
  draftTitle: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, draftTitle }) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    if (shareUrl) {
      // If already shared, just copy the URL
      copyToClipboard(shareUrl);
      return;
    }

    setIsSharing(true);
    try {
      const result = await draftApi.shareAnalysis(analysis.id);
      const fullUrl = `${window.location.origin}${result.share_url}`;
      setShareUrl(fullUrl);
      copyToClipboard(fullUrl);
    } catch (error) {
      console.error('Failed to share analysis:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const exportAsText = () => {
    const content = `${draftTitle} - Analysis\n\n${analysis.analysis_text}\n\nGenerated on: ${new Date(analysis.created_at).toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draftTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (analysis.status === 'pending') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analyzing Your Draft
            </h3>
            <p className="text-gray-600">
              Our AI is currently analyzing your draft. This usually takes 30-60 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analysis Failed
            </h3>
            <p className="text-gray-600 mb-4">
              {analysis.error_message || 'An error occurred while analyzing your draft.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Draft Analysis</h2>
            <p className="text-sm text-gray-600">
              Generated on {new Date(analysis.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportAsText}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className={cn(
                'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                copySuccess
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              )}
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : copySuccess ? (
                <CheckCircle className="h-4 w-4 mr-1" />
              ) : (
                <Share2 className="h-4 w-4 mr-1" />
              )}
              {copySuccess ? 'Copied!' : shareUrl ? 'Copy Link' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="p-6">
        <div 
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: `<p class="mb-4">${formatAnalysisText(analysis.analysis_text || '')}</p>` 
          }}
        />
      </div>
    </div>
  );
};

export default AnalysisDisplay;