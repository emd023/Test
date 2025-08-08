from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from ..core.database import Base


class Draft(Base):
    __tablename__ = "drafts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    draft_data = Column(Text)  # Raw draft data (text or CSV content)
    file_type = Column(String)  # 'text', 'csv', or 'manual'
    team_names = Column(JSON)  # List of team owner names
    additional_info = Column(Text)  # Additional context for AI analysis
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    draft_id = Column(Integer, index=True)  # Foreign key to Draft
    analysis_text = Column(Text)
    status = Column(String, default="pending")  # 'pending', 'completed', 'failed'
    error_message = Column(Text)
    share_token = Column(String, unique=True, index=True)  # For sharing functionality
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())