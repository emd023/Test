import axios from 'axios';
import { Draft, Analysis, DraftFormData, SharedAnalysis } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const draftApi = {
  // Create a new draft
  createDraft: async (data: DraftFormData): Promise<Draft> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('team_names', JSON.stringify(data.team_names));
    formData.append('additional_info', data.additional_info);
    
    if (data.file) {
      formData.append('file', data.file);
    }
    
    if (data.manual_data) {
      formData.append('manual_data', data.manual_data);
    }

    const response = await api.post('/drafts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all drafts
  getDrafts: async (): Promise<Draft[]> => {
    const response = await api.get('/drafts/');
    return response.data;
  },

  // Get a specific draft
  getDraft: async (id: number): Promise<Draft> => {
    const response = await api.get(`/drafts/${id}`);
    return response.data;
  },

  // Analyze a draft
  analyzeDraft: async (draftId: number): Promise<Analysis> => {
    const response = await api.post(`/drafts/${draftId}/analyze`);
    return response.data;
  },

  // Get analysis
  getAnalysis: async (analysisId: number): Promise<Analysis> => {
    const response = await api.get(`/analyses/${analysisId}`);
    return response.data;
  },

  // Get draft analyses
  getDraftAnalyses: async (draftId: number): Promise<Analysis[]> => {
    const response = await api.get(`/drafts/${draftId}/analyses`);
    return response.data;
  },

  // Share analysis
  shareAnalysis: async (analysisId: number): Promise<{ share_url: string }> => {
    const response = await api.post(`/analyses/${analysisId}/share`);
    return response.data;
  },

  // Get shared analysis
  getSharedAnalysis: async (shareToken: string): Promise<SharedAnalysis> => {
    const response = await api.get(`/share/${shareToken}`);
    return response.data;
  },
};

export default api;