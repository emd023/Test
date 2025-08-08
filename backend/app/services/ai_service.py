import openai
from typing import List, Optional
import pandas as pd
import io
from ..core.config import settings


class AIAnalysisService:
    def __init__(self):
        openai.api_key = settings.openai_api_key
    
    def analyze_draft(
        self, 
        draft_data: str, 
        file_type: str, 
        team_names: List[str], 
        additional_info: str = ""
    ) -> str:
        """
        Analyze fantasy football draft data using OpenAI
        """
        try:
            # Process the draft data based on file type
            processed_data = self._process_draft_data(draft_data, file_type)
            
            # Create the analysis prompt
            prompt = self._create_analysis_prompt(
                processed_data, team_names, additional_info
            )
            
            # Get analysis from OpenAI
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert fantasy football analyst. Provide detailed, insightful analysis of draft results including strengths, weaknesses, sleepers, reaches, and overall draft grades for each team."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=3000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"AI analysis failed: {str(e)}")
    
    def _process_draft_data(self, draft_data: str, file_type: str) -> str:
        """
        Process and format draft data for analysis
        """
        if file_type == "csv":
            try:
                # Try to parse as CSV
                df = pd.read_csv(io.StringIO(draft_data))
                return df.to_string(index=False)
            except Exception:
                # If CSV parsing fails, treat as text
                return draft_data
        else:
            return draft_data
    
    def _create_analysis_prompt(
        self, 
        draft_data: str, 
        team_names: List[str], 
        additional_info: str
    ) -> str:
        """
        Create a comprehensive prompt for draft analysis
        """
        prompt = f"""
Please analyze this fantasy football draft and provide a comprehensive report.

DRAFT DATA:
{draft_data}

TEAM OWNERS:
{', '.join(team_names) if team_names else 'Team names not provided'}

ADDITIONAL CONTEXT:
{additional_info if additional_info else 'No additional context provided'}

Please provide analysis covering:

1. **Overall Draft Summary**: Brief overview of the draft trends and notable picks

2. **Team-by-Team Analysis**: 
   - Draft grade (A-F)
   - Key strengths and weaknesses
   - Best picks and potential reaches
   - Roster construction strategy

3. **Draft Insights**:
   - Biggest steals and reaches
   - Position run analysis
   - Sleeper picks to watch
   - Injury concerns or risk factors

4. **Predictions**:
   - Teams most likely to succeed
   - Dark horse candidates
   - Players who could bust or boom

5. **Overall Recommendations**: 
   - Waiver wire targets based on draft holes
   - Trade opportunities
   - Season outlook

Format the response with clear headers and bullet points for easy reading.
        """
        
        return prompt.strip()


ai_service = AIAnalysisService()