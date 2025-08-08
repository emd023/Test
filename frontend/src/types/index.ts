export interface Draft {
  id: number;
  title: string;
  draft_data: string;
  file_type: string;
  team_names: string[];
  additional_info: string;
  created_at: string;
  updated_at?: string;
}

export interface Analysis {
  id: number;
  draft_id: number;
  analysis_text?: string;
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  share_token?: string;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
}

export interface DraftFormData {
  title: string;
  team_names: string[];
  additional_info: string;
  file?: File;
  manual_data?: string;
}

export interface SharedAnalysis {
  analysis_text: string;
  draft_title: string;
  created_at: string;
}