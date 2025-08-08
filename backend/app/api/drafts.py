from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import aiofiles
import os
from ..core.database import get_db
from ..models.draft import Draft, Analysis
from ..schemas.draft import (
    DraftCreate, DraftResponse, AnalysisCreate, 
    AnalysisResponse, ShareAnalysisResponse
)
from ..services.ai_service import ai_service
from ..core.config import settings

router = APIRouter()


@router.post("/drafts/", response_model=DraftResponse)
async def create_draft(
    title: str = Form(...),
    team_names: str = Form(""),  # JSON string of team names
    additional_info: str = Form(""),
    file: Optional[UploadFile] = File(None),
    manual_data: str = Form(""),
    db: Session = Depends(get_db)
):
    """
    Create a new draft with either file upload or manual data entry
    """
    try:
        # Process team names
        import json
        team_names_list = []
        if team_names:
            try:
                team_names_list = json.loads(team_names)
            except:
                team_names_list = [name.strip() for name in team_names.split(",") if name.strip()]
        
        # Handle file upload or manual data
        draft_data = ""
        file_type = "manual"
        
        if file and file.filename:
            # Validate file size
            content = await file.read()
            if len(content) > settings.max_file_size:
                raise HTTPException(
                    status_code=413, 
                    detail=f"File size exceeds limit of {settings.max_file_size} bytes"
                )
            
            # Determine file type
            if file.filename.endswith('.csv'):
                file_type = "csv"
            else:
                file_type = "text"
            
            # Save file and get content
            file_path = os.path.join(settings.upload_dir, f"{uuid.uuid4()}_{file.filename}")
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
            
            draft_data = content.decode('utf-8')
            
        elif manual_data:
            draft_data = manual_data
            file_type = "manual"
        else:
            raise HTTPException(status_code=400, detail="Either file or manual data must be provided")
        
        # Create draft record
        db_draft = Draft(
            title=title,
            draft_data=draft_data,
            file_type=file_type,
            team_names=team_names_list,
            additional_info=additional_info
        )
        db.add(db_draft)
        db.commit()
        db.refresh(db_draft)
        
        return db_draft
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/drafts/", response_model=List[DraftResponse])
async def get_drafts(db: Session = Depends(get_db)):
    """
    Get all drafts
    """
    drafts = db.query(Draft).order_by(Draft.created_at.desc()).all()
    return drafts


@router.get("/drafts/{draft_id}", response_model=DraftResponse)
async def get_draft(draft_id: int, db: Session = Depends(get_db)):
    """
    Get a specific draft by ID
    """
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft


@router.post("/drafts/{draft_id}/analyze", response_model=AnalysisResponse)
async def analyze_draft(draft_id: int, db: Session = Depends(get_db)):
    """
    Analyze a draft using AI
    """
    # Get the draft
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    try:
        # Create analysis record
        analysis = Analysis(
            draft_id=draft_id,
            status="pending",
            share_token=str(uuid.uuid4())
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        # Perform AI analysis
        analysis_text = ai_service.analyze_draft(
            draft_data=draft.draft_data,
            file_type=draft.file_type,
            team_names=draft.team_names or [],
            additional_info=draft.additional_info or ""
        )
        
        # Update analysis with results
        analysis.analysis_text = analysis_text
        analysis.status = "completed"
        db.commit()
        db.refresh(analysis)
        
        return analysis
        
    except Exception as e:
        # Update analysis with error
        if 'analysis' in locals():
            analysis.status = "failed"
            analysis.error_message = str(e)
            db.commit()
        
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """
    Get analysis by ID
    """
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


@router.get("/drafts/{draft_id}/analyses", response_model=List[AnalysisResponse])
async def get_draft_analyses(draft_id: int, db: Session = Depends(get_db)):
    """
    Get all analyses for a specific draft
    """
    analyses = db.query(Analysis).filter(Analysis.draft_id == draft_id).order_by(Analysis.created_at.desc()).all()
    return analyses


@router.post("/analyses/{analysis_id}/share")
async def share_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """
    Make an analysis publicly shareable
    """
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis.is_public = True
    db.commit()
    
    return {"share_url": f"/share/{analysis.share_token}"}


@router.get("/share/{share_token}", response_model=ShareAnalysisResponse)
async def get_shared_analysis(share_token: str, db: Session = Depends(get_db)):
    """
    Get a publicly shared analysis
    """
    analysis = db.query(Analysis).filter(
        Analysis.share_token == share_token,
        Analysis.is_public == True,
        Analysis.status == "completed"
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Shared analysis not found")
    
    # Get associated draft
    draft = db.query(Draft).filter(Draft.id == analysis.draft_id).first()
    
    return ShareAnalysisResponse(
        analysis_text=analysis.analysis_text,
        draft_title=draft.title if draft else "Unknown Draft",
        created_at=analysis.created_at
    )