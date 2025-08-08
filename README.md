# Fantasy Football Draft Analyzer

A production-ready web application that uses AI to analyze fantasy football draft results and provide comprehensive insights, team grades, and strategic recommendations.

## Features

- **File Upload & Manual Entry**: Upload draft results via CSV/TXT files or enter data manually
- **AI-Powered Analysis**: Get detailed draft analysis using OpenAI's GPT-4
- **Team Management**: Add team owner names for personalized analysis
- **Export & Sharing**: Export analysis as text files or share publicly via links
- **Responsive Design**: Modern, mobile-friendly interface built with React and Tailwind CSS
- **RESTful API**: FastAPI backend with automatic documentation

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **PostgreSQL/SQLite**: Database storage
- **OpenAI API**: AI analysis powered by GPT-4
- **Pydantic**: Data validation and settings

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fantasy-football-draft-analyzer
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
cd backend
python run.py
```

The backend will be available at `http://localhost:8000`

### 4. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the development server
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Docker Deployment

For production deployment using Docker:

### 1. Build and Run with Docker Compose
```bash
# Make sure you have .env file with OPENAI_API_KEY
docker-compose up --build
```

### 2. Access the Application
- Application: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## API Documentation

The API documentation is automatically generated and available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

- `POST /api/drafts/` - Upload draft data
- `GET /api/drafts/` - List all drafts
- `GET /api/drafts/{id}` - Get specific draft
- `POST /api/drafts/{id}/analyze` - Analyze draft with AI
- `POST /api/analyses/{id}/share` - Share analysis publicly
- `GET /api/share/{token}` - View shared analysis

## Usage Guide

### 1. Upload Draft Data
- Click "Upload Draft" in the navigation
- Choose between file upload (CSV/TXT) or manual entry
- Add team owner names (optional)
- Provide additional context (league settings, scoring format, etc.)

### 2. AI Analysis
- After uploading, click "Analyze Draft" on the draft detail page
- AI analysis typically takes 30-60 seconds
- Get comprehensive insights including:
  - Team-by-team grades and analysis
  - Draft trends and position runs
  - Sleeper picks and potential reaches
  - Trade recommendations and waiver targets

### 3. Share Results
- Click "Share" on any completed analysis
- Get a public link to share with league members
- Export analysis as text file for offline viewing

## Development

### Project Structure
```
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Configuration and database
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   └── run.py           # Development server
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── package.json
├── Dockerfile           # Production container
├── docker-compose.yml   # Development environment
└── requirements.txt     # Python dependencies
```

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests (if implemented)
cd frontend
npm test
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | SQLite file |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `SECRET_KEY` | JWT secret key | Change in production |
| `CORS_ORIGINS` | Allowed CORS origins | localhost |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | 10MB |
| `DEBUG` | Enable debug mode | True |

### Database

The application supports both SQLite (development) and PostgreSQL (production):

- **SQLite**: Default for development, file-based database
- **PostgreSQL**: Recommended for production, set `DATABASE_URL` accordingly

## Production Deployment

### Docker (Recommended)
```bash
# Build production image
docker build -t fantasy-draft-analyzer .

# Run with environment variables
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=your_key \
  -e DATABASE_URL=your_db_url \
  fantasy-draft-analyzer
```

### Manual Deployment
1. Set up PostgreSQL database
2. Install Python dependencies: `pip install -r requirements.txt`
3. Build frontend: `cd frontend && npm run build`
4. Set production environment variables
5. Run with: `uvicorn backend.app.main:app --host 0.0.0.0 --port 8000`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [API documentation](http://localhost:8000/docs)
2. Review the application logs
3. Open an issue on GitHub

## Roadmap

- [ ] User authentication and accounts
- [ ] Historical draft comparison
- [ ] Integration with fantasy platforms (ESPN, Yahoo, etc.)
- [ ] Advanced analytics and visualizations
- [ ] Mobile app
- [ ] Webhook notifications
