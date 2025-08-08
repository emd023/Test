import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Brain, Upload, Loader2 } from 'lucide-react';
import { Draft } from '../types';
import { draftApi } from '../utils/api';

const DraftsList: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const data = await draftApi.getDrafts();
      setDrafts(data);
    } catch (error) {
      setError('Failed to load drafts');
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <button
            onClick={fetchDrafts}
            className="text-primary-600 hover:text-primary-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Drafts</h1>
            <p className="text-gray-600 mt-2">
              Manage and analyze your fantasy football drafts
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Draft
          </Link>
        </div>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No drafts yet
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your first fantasy football draft to get started with AI analysis.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Draft
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <Link
              key={draft.id}
              to={`/drafts/${draft.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {draft.title}
                </h3>
                <div className="flex-shrink-0 ml-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    draft.file_type === 'csv' 
                      ? 'bg-green-100 text-green-800'
                      : draft.file_type === 'manual'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {draft.file_type}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>

                {draft.team_names && draft.team_names.length > 0 && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{draft.team_names.length} teams</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600 text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="truncate">
                    {draft.draft_data.length} characters
                  </span>
                </div>
              </div>

              {draft.team_names && draft.team_names.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {draft.team_names.slice(0, 3).map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {name}
                      </span>
                    ))}
                    {draft.team_names.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        +{draft.team_names.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-primary-600 text-sm font-medium">
                  View Details
                </span>
                <Brain className="h-4 w-4 text-primary-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftsList;