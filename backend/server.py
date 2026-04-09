from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import PyPDF2
import io
import json
import re
import requests
from bs4 import BeautifulSoup

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    job_title: Optional[str] = None

class SkillGap(BaseModel):
    skill_name: str
    importance: str
    description: str

class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    readiness_score: int
    job_title: str
    missing_skills: List[SkillGap]
    strengths: List[str]
    recommendations: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SimulationTask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    skill_name: str
    task_type: str  # 'code' or 'logic'
    title: str
    description: str
    instructions: str
    initial_code: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    correct_answer: Optional[str] = None
    options: Optional[List[str]] = None

class SimulationSubmission(BaseModel):
    task_id: str
    user_answer: str

class SimulationResult(BaseModel):
    is_correct: bool
    feedback: str
    score_improvement: int

class JobUrlRequest(BaseModel):
    url: str

# Helper Functions
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting PDF text: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

def scrape_job_description(url: str) -> Dict[str, str]:
    """Scrape job description from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Try to extract title
        title = soup.find('title')
        job_title = title.string if title else "Job Position"
        
        return {
            "job_title": job_title,
            "description": text[:5000]  # Limit to 5000 chars
        }
    except Exception as e:
        logger.error(f"Error scraping URL: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to scrape job description: {str(e)}")

async def analyze_with_claude(resume_text: str, job_description: str, job_title: Optional[str]) -> AnalysisResult:
    """Use Claude to analyze resume vs job description"""
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"analysis-{uuid.uuid4()}",
            system_message="You are an expert career coach and skills gap analyst. Analyze resumes against job descriptions and provide actionable insights."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""Analyze this resume against the job description and provide a detailed skills gap analysis.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{job_description[:3000]}

Provide your analysis in the following JSON format:
{{
  "readiness_score": <number between 0-100>,
  "job_title": "{job_title or 'Professional Role'}",
  "missing_skills": [
    {{
      "skill_name": "Skill name",
      "importance": "Critical/High/Medium",
      "description": "Why this skill matters"
    }}
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}}

Provide exactly 3 missing skills, 3-5 strengths, and 3-5 recommendations. Return ONLY valid JSON, no markdown formatting."""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            json_str = json_match.group()
            data = json.loads(json_str)
            
            # Create AnalysisResult
            result = AnalysisResult(
                readiness_score=data.get('readiness_score', 50),
                job_title=data.get('job_title', job_title or 'Professional Role'),
                missing_skills=[SkillGap(**skill) for skill in data.get('missing_skills', [])[:3]],
                strengths=data.get('strengths', [])[:5],
                recommendations=data.get('recommendations', [])[:5]
            )
            
            # Save to database
            doc = result.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.analyses.insert_one(doc)
            
            return result
        else:
            raise ValueError("Invalid JSON response from Claude")
            
    except Exception as e:
        logger.error(f"Error in Claude analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def generate_simulation_with_claude(skill_name: str, skill_description: str) -> SimulationTask:
    """Generate a simulation task for a specific skill"""
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"simulation-{uuid.uuid4()}",
            system_message="You are an expert at creating practical, hands-on skill assessment tasks."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        # Randomly choose between code and logic task
        import random
        task_type = random.choice(['code', 'logic'])
        
        if task_type == 'code':
            prompt = f"""Create a coding challenge to test the skill: {skill_name}

Skill context: {skill_description}

Provide your response in the following JSON format:
{{
  "title": "Challenge title",
  "description": "What the candidate needs to do",
  "instructions": "Step by step instructions",
  "initial_code": "# Starting code template\n\ndef solution():\n    pass",
  "test_cases": [
    {{"input": "test input", "expected_output": "expected result"}}
  ],
  "correct_answer": "The correct solution code"
}}

Return ONLY valid JSON, no markdown."""
        else:
            prompt = f"""Create a logic puzzle or multiple-choice question to test the skill: {skill_name}

Skill context: {skill_description}

Provide your response in the following JSON format:
{{
  "title": "Question title",
  "description": "The problem scenario",
  "instructions": "What to solve",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "The correct option letter (A/B/C/D) with brief explanation"
}}

Return ONLY valid JSON, no markdown."""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            json_str = json_match.group()
            data = json.loads(json_str)
            
            task = SimulationTask(
                skill_name=skill_name,
                task_type=task_type,
                title=data.get('title', f'{skill_name} Challenge'),
                description=data.get('description', ''),
                instructions=data.get('instructions', ''),
                initial_code=data.get('initial_code'),
                test_cases=data.get('test_cases'),
                correct_answer=data.get('correct_answer'),
                options=data.get('options')
            )
            
            # Save to database
            doc = task.model_dump()
            await db.simulations.insert_one(doc)
            
            return task
        else:
            raise ValueError("Invalid JSON response from Claude")
            
    except Exception as e:
        logger.error(f"Error generating simulation: {e}")
        raise HTTPException(status_code=500, detail=f"Simulation generation failed: {str(e)}")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "SkillSync AI API"}

@api_router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Extract text from uploaded PDF resume"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    text = extract_text_from_pdf(content)
    
    return {"resume_text": text}

@api_router.post("/scrape-job")
async def scrape_job(request: JobUrlRequest):
    """Scrape job description from URL"""
    result = scrape_job_description(request.url)
    return result

@api_router.post("/analyze-gap", response_model=AnalysisResult)
async def analyze_gap(request: AnalysisRequest):
    """Analyze skills gap between resume and job description"""
    result = await analyze_with_claude(
        request.resume_text,
        request.job_description,
        request.job_title
    )
    return result

@api_router.post("/simulation/generate", response_model=SimulationTask)
async def generate_simulation(skill_gap: SkillGap):
    """Generate a simulation task for a specific skill"""
    task = await generate_simulation_with_claude(
        skill_gap.skill_name,
        skill_gap.description
    )
    return task

@api_router.post("/simulation/validate", response_model=SimulationResult)
async def validate_simulation(submission: SimulationSubmission):
    """Validate a simulation submission"""
    try:
        # Get the simulation task
        task_doc = await db.simulations.find_one({"id": submission.task_id}, {"_id": 0})
        if not task_doc:
            raise HTTPException(status_code=404, detail="Simulation task not found")
        
        task = SimulationTask(**task_doc)
        
        # Use Claude to evaluate the answer
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"validation-{uuid.uuid4()}",
            system_message="You are an expert at evaluating code and logic solutions."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        if task.task_type == 'code':
            prompt = f"""Evaluate this code solution:

TASK: {task.title}
INSTRUCTIONS: {task.instructions}
EXPECTED SOLUTION: {task.correct_answer}
USER SOLUTION: {submission.user_answer}

Provide evaluation in JSON format:
{{
  "is_correct": true/false,
  "feedback": "Detailed feedback",
  "score_improvement": <number 0-15>
}}

Return ONLY valid JSON."""
        else:
            prompt = f"""Evaluate this answer:

QUESTION: {task.description}
CORRECT ANSWER: {task.correct_answer}
USER ANSWER: {submission.user_answer}

Provide evaluation in JSON format:
{{
  "is_correct": true/false,
  "feedback": "Explanation",
  "score_improvement": <number 0-15>
}}

Return ONLY valid JSON."""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            json_str = json_match.group()
            data = json.loads(json_str)
            return SimulationResult(**data)
        else:
            raise ValueError("Invalid JSON response")
            
    except Exception as e:
        logger.error(f"Error validating simulation: {e}")
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()