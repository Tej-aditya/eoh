from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
import requests
from datetime import datetime, timezone, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
import PyPDF2
import io
import json
import re
from bs4 import BeautifulSoup

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    bio: Optional[str] = None
    career_goal: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = None
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_token: str
    user_id: str
    expires_at: datetime
    created_at: datetime

class SessionIDRequest(BaseModel):
    session_id: str

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
    user_id: Optional[str] = None
    readiness_score: int
    job_title: str
    missing_skills: List[SkillGap]
    strengths: List[str]
    recommendations: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SimulationTask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    skill_name: str
    task_type: str
    title: str
    description: str
    instructions: str
    initial_code: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    correct_answer: Optional[str] = None
    options: Optional[List[str]] = None
    completed: bool = False
    score_gained: int = 0

class SimulationSubmission(BaseModel):
    task_id: str
    user_answer: str

class SimulationResult(BaseModel):
    is_correct: bool
    feedback: str
    score_improvement: int

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    career_goal: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = None

class LearningResource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    url: str
    category: str
    difficulty: str
    duration: Optional[str] = None
    provider: Optional[str] = None

class JobPosting(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    location: str
    description: str
    requirements: List[str]
    salary_range: Optional[str] = None
    job_type: str
    posted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SavedJob(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    job_id: str
    saved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MentorProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    expertise: List[str]
    experience_years: int
    bio: str
    availability: str
    rating: float = 0.0
    sessions_completed: int = 0

class MentorshipRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    mentor_id: str
    message: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunityPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    content: str
    image_url: Optional[str] = None
    likes: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class JobUrlRequest(BaseModel):
    url: str

# ==================== AUTH HELPER ====================

async def get_current_user(request: Request) -> User:
    """Get current user from session token (cookie or header)"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        await db.user_sessions.delete_one({"session_token": session_token})
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    
    return User(**user_doc)

async def get_optional_user(request: Request) -> Optional[User]:
    """Get user if authenticated, None otherwise"""
    try:
        return await get_current_user(request)
    except:
        return None

# ==================== HELPER FUNCTIONS ====================

def extract_text_from_pdf(file_content: bytes) -> str:
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
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        for script in soup(["script", "style"]):
            script.decompose()
        
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        title = soup.find('title')
        job_title = title.string if title else "Job Position"
        
        return {"job_title": job_title, "description": text[:5000]}
    except Exception as e:
        logger.error(f"Error scraping URL: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to scrape job description: {str(e)}")

async def analyze_with_claude(resume_text: str, job_description: str, job_title: Optional[str]) -> Dict:
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"analysis-{uuid.uuid4()}",
            system_message="You are an expert career coach and skills gap analyst."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""Analyze this resume against the job description.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{job_description[:3000]}

Provide JSON:
{{
  "readiness_score": <0-100>,
  "job_title": "{job_title or 'Professional Role'}",
  "missing_skills": [{{"skill_name": "...", "importance": "Critical/High/Medium", "description": "..."}}],
  "strengths": ["...", "..."],
  "recommendations": ["...", "..."]
}}

Exactly 3 missing skills, 3-5 strengths, 3-5 recommendations. Return ONLY valid JSON."""
        
        response = await chat.send_message(UserMessage(text=prompt))
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            return json.loads(json_match.group())
        raise ValueError("Invalid JSON")
    except Exception as e:
        logger.error(f"Error in Claude analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def generate_simulation_with_claude(skill_name: str, skill_description: str) -> Dict:
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"simulation-{uuid.uuid4()}",
            system_message="You are an expert at creating skill assessment tasks."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        import random
        task_type = random.choice(['code', 'logic'])
        
        if task_type == 'code':
            prompt = f"""Create a coding challenge for: {skill_name}

Context: {skill_description}

JSON format:
{{"title": "...", "description": "...", "instructions": "...", "initial_code": "# ...", "test_cases": [...], "correct_answer": "..."}}

Return ONLY JSON."""
        else:
            prompt = f"""Create a logic question for: {skill_name}

Context: {skill_description}

JSON format:
{{"title": "...", "description": "...", "instructions": "...", "options": ["A", "B", "C", "D"], "correct_answer": "..."}}

Return ONLY JSON."""
        
        response = await chat.send_message(UserMessage(text=prompt))
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            data = json.loads(json_match.group())
            data['task_type'] = task_type
            return data
        raise ValueError("Invalid JSON")
    except Exception as e:
        logger.error(f"Error generating simulation: {e}")
        raise HTTPException(status_code=500, detail=f"Simulation generation failed: {str(e)}")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def exchange_session(session_req: SessionIDRequest, response: Response):
    """Exchange session_id for session_token"""
    try:
        # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        emergent_response = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_req.session_id},
            timeout=10
        )
        
        if emergent_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        data = emergent_response.json()
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        
        existing_user = await db.users.find_one({"email": data["email"]}, {"_id": 0})
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {"name": data["name"], "picture": data.get("picture")}}
            )
        else:
            await db.users.insert_one({
                "user_id": user_id,
                "email": data["email"],
                "name": data["name"],
                "picture": data.get("picture"),
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        
        session_token = data["session_token"]
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        await db.user_sessions.insert_one({
            "session_token": session_token,
            "user_id": user_id,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7*24*60*60
        )
        
        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        if isinstance(user_doc.get("created_at"), str):
            user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
        
        return User(**user_doc)
    except Exception as e:
        logger.error(f"Session exchange error: {e}")
        raise HTTPException(status_code=500, detail="Session exchange failed")

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== ANALYSIS ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "SkillSync AI API"}

@api_router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files supported")
    content = await file.read()
    text = extract_text_from_pdf(content)
    return {"resume_text": text}

@api_router.post("/scrape-job")
async def scrape_job(req: JobUrlRequest):
    result = scrape_job_description(req.url)
    return result

@api_router.post("/analyze-gap", response_model=AnalysisResult)
async def analyze_gap(request: Request, analysis_req: AnalysisRequest):
    user = await get_optional_user(request)
    data = await analyze_with_claude(
        analysis_req.resume_text,
        analysis_req.job_description,
        analysis_req.job_title
    )
    
    result = AnalysisResult(
        user_id=user.user_id if user else None,
        readiness_score=data.get('readiness_score', 50),
        job_title=data.get('job_title', analysis_req.job_title or 'Professional Role'),
        missing_skills=[SkillGap(**s) for s in data.get('missing_skills', [])[:3]],
        strengths=data.get('strengths', [])[:5],
        recommendations=data.get('recommendations', [])[:5]
    )
    
    doc = result.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.analyses.insert_one(doc)
    
    return result

@api_router.post("/simulation/generate", response_model=SimulationTask)
async def generate_simulation(request: Request, skill_gap: SkillGap):
    user = await get_optional_user(request)
    data = await generate_simulation_with_claude(skill_gap.skill_name, skill_gap.description)
    
    task = SimulationTask(
        user_id=user.user_id if user else None,
        skill_name=skill_gap.skill_name,
        task_type=data['task_type'],
        title=data.get('title', f'{skill_gap.skill_name} Challenge'),
        description=data.get('description', ''),
        instructions=data.get('instructions', ''),
        initial_code=data.get('initial_code'),
        test_cases=data.get('test_cases'),
        correct_answer=data.get('correct_answer'),
        options=data.get('options')
    )
    
    await db.simulations.insert_one(task.model_dump())
    return task

@api_router.post("/simulation/validate", response_model=SimulationResult)
async def validate_simulation(submission: SimulationSubmission):
    task_doc = await db.simulations.find_one({"id": submission.task_id}, {"_id": 0})
    if not task_doc:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = SimulationTask(**task_doc)
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    chat = LlmChat(
        api_key=api_key,
        session_id=f"validation-{uuid.uuid4()}",
        system_message="You are an expert at evaluating solutions."
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")
    
    prompt = f"""Evaluate:
TASK: {task.title}
EXPECTED: {task.correct_answer}
USER: {submission.user_answer}

JSON: {{"is_correct": true/false, "feedback": "...", "score_improvement": 0-15}}"""
    
    response = await chat.send_message(UserMessage(text=prompt))
    json_match = re.search(r'\{[\s\S]*\}', response)
    if json_match:
        data = json.loads(json_match.group())
        await db.simulations.update_one(
            {"id": submission.task_id},
            {"$set": {"completed": True, "score_gained": data.get("score_improvement", 0)}}
        )
        return SimulationResult(**data)
    raise HTTPException(status_code=500, detail="Validation failed")

# ==================== DASHBOARD ROUTES ====================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(request: Request):
    user = await get_current_user(request)
    
    analyses = await db.analyses.find({"user_id": user.user_id}, {"_id": 0}).to_list(None)
    simulations = await db.simulations.find({"user_id": user.user_id, "completed": True}, {"_id": 0}).to_list(None)
    
    total_score_gain = sum(s.get("score_gained", 0) for s in simulations)
    avg_readiness = sum(a.get("readiness_score", 0) for a in analyses) / len(analyses) if analyses else 0
    
    return {
        "total_analyses": len(analyses),
        "total_simulations": len(simulations),
        "total_score_gain": total_score_gain,
        "average_readiness": round(avg_readiness, 1),
        "recent_analyses": analyses[:5]
    }

@api_router.get("/dashboard/analyses")
async def get_user_analyses(request: Request):
    user = await get_current_user(request)
    analyses = await db.analyses.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(None)
    return analyses

# ==================== PROFILE ROUTES ====================

@api_router.get("/profile")
async def get_profile(request: Request):
    user = await get_current_user(request)
    return user

@api_router.put("/profile")
async def update_profile(request: Request, update: UserProfileUpdate):
    user = await get_current_user(request)
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        await db.users.update_one({"user_id": user.user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    if isinstance(updated_user.get("created_at"), str):
        updated_user["created_at"] = datetime.fromisoformat(updated_user["created_at"])
    return User(**updated_user)

# ==================== LEARNING RESOURCES ROUTES ====================

@api_router.get("/resources")
async def get_learning_resources(category: Optional[str] = None):
    query = {"category": category} if category else {}
    resources = await db.learning_resources.find(query, {"_id": 0}).limit(20).to_list(None)
    return resources

@api_router.post("/resources/recommend")
async def recommend_resources(request: Request):
    user = await get_current_user(request)
    analyses = await db.analyses.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1).limit(1).to_list(None)
    
    if not analyses:
        return []
    
    latest = analyses[0]
    skills = [s["skill_name"] for s in latest.get("missing_skills", [])]
    
    resources = []
    for skill in skills:
        skill_resources = await db.learning_resources.find(
            {"$text": {"$search": skill}},
            {"_id": 0}
        ).limit(3).to_list(None)
        resources.extend(skill_resources)
    
    return resources[:10]

# ==================== JOB BOARD ROUTES ====================

@api_router.get("/jobs")
async def get_jobs(job_type: Optional[str] = None):
    query = {"job_type": job_type} if job_type else {}
    jobs = await db.job_postings.find(query, {"_id": 0}).sort("posted_at", -1).limit(20).to_list(None)
    return jobs

@api_router.post("/jobs/{job_id}/save")
async def save_job(request: Request, job_id: str):
    user = await get_current_user(request)
    
    existing = await db.saved_jobs.find_one({"user_id": user.user_id, "job_id": job_id}, {"_id": 0})
    if existing:
        return {"message": "Job already saved"}
    
    saved = SavedJob(user_id=user.user_id, job_id=job_id)
    await db.saved_jobs.insert_one(saved.model_dump())
    return {"message": "Job saved successfully"}

@api_router.get("/jobs/saved")
async def get_saved_jobs(request: Request):
    user = await get_current_user(request)
    saved = await db.saved_jobs.find({"user_id": user.user_id}, {"_id": 0}).to_list(None)
    return saved

# ==================== PROGRESS TRACKER ROUTES ====================

@api_router.get("/progress")
async def get_progress(request: Request):
    user = await get_current_user(request)
    
    analyses = await db.analyses.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", 1).to_list(None)
    simulations = await db.simulations.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", 1).to_list(None)
    
    timeline = []
    for analysis in analyses:
        timeline.append({
            "type": "analysis",
            "date": analysis.get("created_at"),
            "score": analysis.get("readiness_score"),
            "job_title": analysis.get("job_title")
        })
    
    for sim in simulations:
        if sim.get("completed"):
            timeline.append({
                "type": "simulation",
                "date": sim.get("created_at", datetime.now(timezone.utc).isoformat()),
                "skill": sim.get("skill_name"),
                "score_gained": sim.get("score_gained", 0)
            })
    
    timeline.sort(key=lambda x: x["date"])
    return {"timeline": timeline}

# ==================== MENTORSHIP ROUTES ====================

@api_router.get("/mentors")
async def get_mentors():
    mentors = await db.mentor_profiles.find({}, {"_id": 0}).sort("rating", -1).limit(20).to_list(None)
    return mentors

@api_router.post("/mentorship/request")
async def request_mentorship(request: Request, mentor_id: str, message: str):
    user = await get_current_user(request)
    
    req = MentorshipRequest(
        student_id=user.user_id,
        mentor_id=mentor_id,
        message=message
    )
    
    doc = req.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.mentorship_requests.insert_one(doc)
    
    return {"message": "Request sent successfully"}

@api_router.get("/mentorship/requests")
async def get_my_requests(request: Request):
    user = await get_current_user(request)
    requests_list = await db.mentorship_requests.find(
        {"student_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(None)
    return requests_list

# ==================== COMMUNITY ROUTES ====================

@api_router.get("/community/posts")
async def get_community_posts():
    posts = await db.community_posts.find({}, {"_id": 0}).sort("created_at", -1).limit(50).to_list(None)
    return posts

@api_router.post("/community/posts")
async def create_post(request: Request, content: str, image_url: Optional[str] = None):
    user = await get_current_user(request)
    
    post = CommunityPost(
        user_id=user.user_id,
        content=content,
        image_url=image_url
    )
    
    doc = post.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.community_posts.insert_one(doc)
    
    return post

@api_router.post("/community/posts/{post_id}/like")
async def like_post(request: Request, post_id: str):
    user = await get_current_user(request)
    await db.community_posts.update_one({"id": post_id}, {"$inc": {"likes": 1}})
    return {"message": "Post liked"}

# Include router
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
