import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText, Brain, Loader2 } from 'lucide-react';
import { Draft, Analysis } from '../types';
import { draftApi } from '../utils/api';
import AnalysisDisplay from '../components/AnalysisDisplay';

const DraftDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchDraftData(parseInt(id));
    }
  }, [id]);

  const fetchDraftData = async (draftId: number) => {
    try {
      setLoading(true);
      const [draftData, analysesData] = await Promise.all([
        draftApi.getDraft(draftId),
        draftApi.getDraftAnalyses(draftId),
      ]);
      setDraft(draftData);
      setAnalyses(analysesData);
    } catch (error) {
      setError('Failed to load draft data');
      console.error('Error fetching draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!draft) return;

    setAnalyzing(true);
    try {
      const newAnalysis = await draftApi.analyzeDraft(draft.id);
      setAnalyses([newAnalysis, ...analyses]);
    } catch (error) {
      console.error('Failed to analyze draft:', error);
      setError('Failed to analyze draft');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Draft not found'}
          </h2>
          <Link
            to="/drafts"
            className="text-primary-600 hover:text-primary-800"
          >
            Back to drafts
          </Link>
        </div>
      </div>
    );
  }

  const latestAnalysis = analyses.find(a => a.status === 'completed') || analyses[0];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/drafts"
          className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Drafts
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {draft.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="capitalize">{draft.file_type} upload</span>
                </div>
                
                {draft.team_names && draft.team_names.length > 0 && (
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{draft.team_names.length} teams</span>
                  </div>
                )}
              </div>

              {draft.team_names && draft.team_names.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Team Owners:</h3>
                  <div className="flex flex-wrap gap-2">
                    {draft.team_names.map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {draft.additional_info && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Context:</h3>
                  <p className="text-gray-600 text-sm">{draft.additional_info}</p>
                </div>
              )}
            </div>

            {!latestAnalysis && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Draft
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {latestAnalysis ? (
        <div className="mb-6">
          <AnalysisDisplay analysis={latestAnalysis} draftTitle={draft.title} />
        </div>
      ) : analyzing ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analyzing Your Draft
              </h3>
              <p className="text-gray-600">
                This usually takes 30-60 seconds...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready for AI Analysis
            </h3>
            <p className="text-gray-600 mb-6">
              Get comprehensive insights about your draft performance, team grades, and strategic recommendations.
            </p>
            <button
              onClick={handleAnalyze}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              Start Analysis
            </button>
          </div>
        </div>
      )}

      {/* Draft Data Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Draft Data</h3>
        <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {draft.draft_data}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DraftDetail;