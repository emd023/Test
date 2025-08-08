from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.database import engine, Base
from .api.drafts import router as drafts_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="AI-powered fantasy football draft analysis tool",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(drafts_router, prefix="/api", tags=["drafts"])

# Serve uploaded files
try:
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
except Exception:
    pass  # Directory might not exist yet


@app.get("/")
async def root():
    return {"message": "Fantasy Football Draft Analyzer API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}