from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class DraftCreate(BaseModel):
    title: str
    draft_data: str
    file_type: str
    team_names: Optional[List[str]] = []
    additional_info: Optional[str] = ""


class DraftResponse(BaseModel):
    id: int
    title: str
    draft_data: str
    file_type: str
    team_names: List[str]
    additional_info: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AnalysisCreate(BaseModel):
    draft_id: int


class AnalysisResponse(BaseModel):
    id: int
    draft_id: int
    analysis_text: Optional[str]
    status: str
    error_message: Optional[str]
    share_token: Optional[str]
    is_public: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ShareAnalysisResponse(BaseModel):
    analysis_text: str
    draft_title: str
    created_at: datetime