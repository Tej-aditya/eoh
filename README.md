# SkillSync AI

**An AI-powered platform that bridges the gap between academic learning and industry hiring requirements by analyzing resumes against job descriptions, identifying skill gaps, and generating real-time coding/logic challenges to close those gaps.**

![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Stack](https://img.shields.io/badge/stack-FastAPI%20%7C%20React-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## Problem Statement

Students and early-career professionals often struggle to understand what specific skills employers are looking for and how their current skillset measures up. Traditional job boards show requirements but offer no way to assess readiness or practice missing skills. Resume reviews are manual, slow, and subjective. There is no single platform that takes a candidate's resume, compares it against a real job description, quantifies the gap with a readiness score, and then provides hands-on challenges to close that gap in one continuous workflow. SkillSync AI solves this by combining AI-driven gap analysis with interactive skill simulation, turning passive job browsing into active career development.

---

## Features

| Feature | Description |
|---|---|
| **Resume PDF Upload & Parsing** | Upload a PDF resume; the backend extracts text using PyPDF2 for analysis. |
| **Job Description URL Scraper** | Paste a job listing URL; BeautifulSoup scrapes and extracts the job requirements text automatically. |
| **AI Gap Analysis (Claude 4.5)** | Sends resume text + job description to Claude Sonnet 4.5, returns a readiness score (0-100), missing skills, strengths, and recommendations. |
| **Real-Time Skill Simulations** | For each missing skill, Claude generates a coding challenge or logic question. Users solve it in-browser and get AI-evaluated feedback with a score improvement. |
| **Proof of Skill Certificate** | After completing simulations, generates a visual certificate showing final readiness score and completed skills. |
| **JWT Email/Password Auth** | Secure registration and login with bcrypt password hashing, JWT access tokens (15 min), and refresh tokens (7 days). |
| **User Dashboard** | Authenticated users see total analyses, completed challenges, average readiness score, score gained, and recent analysis history. |
| **Profile Management** | Edit name, bio, career goal, location, and experience years from the dashboard. |
| **Progress Tracker** | Timeline view of all analyses and completed simulations sorted chronologically. |
| **AI Career Coach** | Interactive UI section with career transition guidance and personalized roadmap advice. |
| **Resume Builder** | Structured resume creation section with professional templates and real-time preview. |
| **Mock Interview** | Behavioral and technical interview practice with sample questions and AI-suggested answers. |
| **Career Roadmap** | Visual step-by-step career progression paths for different tech roles. |
| **Salary Insights** | Market salary data by role, experience level, and location for negotiation guidance. |
| **Trending Skills** | Current industry skill trends with demand indicators and growth trajectories. |
| **Culture Match** | Workplace culture assessment to align job preferences with company values. |
| **Learning Resources** | Curated courses and materials organized by category and difficulty level. |
| **Job Board** | Job listings with save functionality, filterable by type. |
| **Mentorship Hub** | Mentor profiles with expertise, rating, and session request system. |
| **Community Forum** | Post creation, liking, and discussion feed for peer interaction. |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Tailwind CSS 3 | Utility-first styling |
| Shadcn/UI (Radix) | Accessible component primitives |
| Framer Motion | Page transitions and micro-animations |
| Axios | HTTP client for API calls |
| React Router DOM 7 | Client-side routing |
| Lucide React | Icon library |
| Recharts | Data visualization charts |
| React Dropzone | Drag-and-drop file upload |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Async Python API framework |
| Motor (async MongoDB) | Non-blocking database driver |
| PyJWT | JSON Web Token generation and validation |
| bcrypt | Password hashing |
| PyPDF2 | PDF text extraction |
| BeautifulSoup4 | HTML scraping for job descriptions |
| emergentintegrations | Claude Sonnet 4.5 LLM integration |
| Pydantic v2 | Request/response validation |
| Uvicorn | ASGI server |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB | Document database for users, analyses, simulations |
| Kubernetes | Container orchestration (deployment) |
| Nginx | Reverse proxy routing `/api` to backend |

---

## Project Structure

```
skillsync-ai/
├── backend/
│   ├── server.py              # FastAPI app: auth, AI analysis, dashboard, CRUD routes
│   ├── requirements.txt       # Python dependencies (pip freeze)
│   ├── .env                   # MONGO_URL, JWT_SECRET, EMERGENT_LLM_KEY
│   └── tests/
│       └── test_auth_bearer.py # Pytest suite for JWT auth endpoints
├── frontend/
│   ├── src/
│   │   ├── App.js             # Root component: AuthContext, routing, auth state
│   │   ├── App.css            # Global styles, glassmorphism classes
│   │   ├── pages/
│   │   │   ├── Login.js       # Email/password login and registration form
│   │   │   └── MainDashboard.js # Authenticated dashboard with 12 sidebar sections
│   │   ├── components/
│   │   │   ├── LandingPage.js      # Resume upload + job URL input + analysis trigger
│   │   │   ├── AnalysisDashboard.js # Gap analysis results display with skill cards
│   │   │   ├── SimulationStage.js   # Interactive coding/logic challenge interface
│   │   │   ├── ProofOfSkill.js      # Certificate generation after simulation
│   │   │   ├── PublicSections.js    # 11 public feature sections (AI Coach, Jobs, etc.)
│   │   │   ├── ProtectedRoute.js    # JWT token verification guard for /dashboard
│   │   │   └── ui/                  # Shadcn/UI component library
│   │   ├── hooks/
│   │   │   └── use-toast.js   # Toast notification hook
│   │   └── lib/
│   │       └── utils.js       # Tailwind class merge utility
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind theme configuration
│   └── .env                   # REACT_APP_BACKEND_URL
├── memory/
│   ├── PRD.md                 # Product requirements document
│   └── test_credentials.md    # Test account credentials
├── LICENSE                    # Apache 2.0
└── README.md                  # This file
```

---

## Installation & Setup

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- MongoDB running locally on port 27017
- An Emergent LLM API key (for Claude Sonnet 4.5)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/skillsync-ai.git
cd skillsync-ai
```

### 2. Backend setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=skillsync_db
JWT_SECRET=your-random-64-char-secret-key-here
EMERGENT_LLM_KEY=your-emergent-llm-key
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@skillsync.ai
ADMIN_PASSWORD=Admin@123
EOF

# Start the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend setup
```bash
cd frontend

# Install dependencies
yarn install

# Create .env file
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# Start the development server
yarn start
```

### 4. Create the admin account
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skillsync.ai","password":"Admin@123","name":"Admin User"}'
```

### 5. Open the app
Navigate to `http://localhost:3000` in your browser.

---

## How It Works

### Flow 1: Resume vs Job Gap Analysis
1. **Input**: User uploads a PDF resume (or pastes text) and provides a job listing URL (or pastes the description).
2. **PDF Parsing**: Backend reads the PDF with PyPDF2, extracting raw text from all pages.
3. **URL Scraping**: Backend fetches the job URL with `requests`, parses HTML with BeautifulSoup, strips scripts/styles, and extracts clean text (capped at 5000 chars).
4. **AI Analysis**: Both texts are sent to Claude Sonnet 4.5 via the emergentintegrations SDK with a structured prompt requesting JSON output containing readiness score, missing skills, strengths, and recommendations.
5. **Response Parsing**: Backend extracts JSON from Claude's response using regex, validates it against Pydantic models, stores the result in MongoDB, and returns it to the frontend.
6. **Display**: Frontend renders a radial score gauge, skill gap cards with importance levels, strength badges, and recommendation bullets.

### Flow 2: Skill Simulation
1. **Input**: User clicks "Practice" on a missing skill card from the gap analysis results.
2. **Task Generation**: Backend sends the skill name and description to Claude, requesting either a coding challenge (with initial code and test cases) or a multiple-choice logic question.
3. **User Interaction**: Frontend renders a code editor or option selector. User writes their solution and submits.
4. **AI Evaluation**: Backend sends the task, expected answer, and user's answer to Claude for evaluation. Claude returns correctness, feedback text, and a score improvement (0-15 points).
5. **Score Update**: The simulation record is marked as completed in MongoDB. The frontend adds the score improvement to the user's running readiness score.

### Flow 3: Authentication
1. **Register**: Frontend sends email, password, and name to `/api/auth/register`. Backend hashes the password with bcrypt (12 rounds), stores the user in MongoDB, and returns JWT access + refresh tokens in the response body.
2. **Login**: Frontend sends credentials to `/api/auth/login`. Backend finds the user by email, verifies the password hash with bcrypt, and returns new JWT tokens.
3. **Token Storage**: Frontend stores both tokens in localStorage. All subsequent API calls include the access token in the `Authorization: Bearer` header.
4. **Session Check**: On app load, frontend calls `/api/auth/me` with the stored token. If valid, the user context is populated and the user is redirected to the dashboard.

---

## Scalability

1. **Stateless Backend with JWT**: Authentication uses stateless JWT tokens instead of server-side sessions. This means any backend instance can validate any request without shared session storage, enabling horizontal scaling behind a load balancer with zero session affinity requirements.

2. **Async I/O Throughout**: FastAPI with Motor (async MongoDB driver) ensures all database queries and external API calls are non-blocking. A single backend process can handle hundreds of concurrent connections while waiting on Claude API responses or MongoDB reads, rather than blocking a thread per request.

3. **MongoDB Document Model**: MongoDB's schema-flexible document model allows analyses, simulations, and user profiles to evolve without migrations. For high data volume, MongoDB supports sharding by `user_id` to distribute data across multiple nodes, and compound indexes on `{user_id, created_at}` for efficient dashboard queries.

4. **Containerized Deployment**: The application runs in Docker containers orchestrated by Kubernetes, enabling auto-scaling based on CPU/memory thresholds. The frontend can be served from a CDN as static assets, reducing backend load to API-only traffic.

5. **LLM Call Optimization**: Claude API calls are the primary bottleneck (1-5 seconds per request). This can be mitigated by caching analysis results for identical resume+job pairs, implementing a job queue (Celery/Redis) for async analysis processing, and adding rate limiting per user to prevent abuse.

---

## Feasibility

1. **Proven Technology Stack**: Every component uses production-grade, widely-adopted tools. React and FastAPI are battle-tested frameworks with extensive documentation. MongoDB Atlas provides managed database hosting with automatic backups. The entire stack can run on a single $5/month VPS for initial deployment.

2. **Minimal Infrastructure Dependencies**: The application requires only three services: a Node.js server (frontend), a Python server (backend), and a MongoDB instance. No message queues, no caching layers, no specialized hardware. This reduces operational complexity and makes deployment straightforward with Docker Compose or any PaaS (Railway, Render, Fly.io).

3. **LLM API Availability**: The Claude Sonnet 4.5 integration uses a managed API key through the Emergent integrations library, abstracting away rate limits and failover. For production, switching to direct Anthropic API access requires only changing the API key and model string -- no code restructuring needed.

4. **Production Readiness Path**: Moving to production requires adding HTTPS (handled by reverse proxy), setting strong JWT secrets, enabling MongoDB authentication, and adding rate limiting middleware. All of these are configuration changes, not architectural rewrites. The Pydantic validation layer already handles input sanitization.

---

## Novelty

Most career platforms fall into two categories: resume analyzers that score your resume's formatting and keyword density (without understanding the actual job), or job boards that list requirements without any assessment. SkillSync AI fills the gap between analysis and action by combining three capabilities that don't exist together:

1. **Contextual Gap Analysis**: Unlike generic resume scorers, SkillSync compares your specific resume against a specific job description using an LLM that understands context, not just keyword matching. It identifies nuanced gaps like "has Python experience but lacks async programming patterns required for this role."

2. **Immediate Skill Practice**: After identifying gaps, the platform generates tailored coding challenges and logic questions for each missing skill using the same LLM. This closes the feedback loop -- you don't just learn what's missing, you practice it immediately with AI-evaluated exercises.

3. **Quantified Readiness**: The readiness score evolves as you complete simulations. Starting at 45% readiness for a role and reaching 72% after three challenges gives a tangible, motivating measure of progress that traditional platforms don't offer.

---

## Feature Depth

### Gap Analysis Engine
- Handles PDF resumes of any length (text extracted from all pages, capped at 3000 chars for LLM context efficiency)
- Scrapes job descriptions from any public URL, stripping JavaScript, CSS, and navigation elements to extract clean requirements text
- Returns structured output: exactly 3 missing skills with importance ratings (Critical/High/Medium), 3-5 strengths, and 3-5 actionable recommendations
- Analysis results are persisted in MongoDB and accessible from the user dashboard for historical comparison

### Simulation System
- Two task types generated dynamically: coding challenges (with starter code, test cases, and expected output) and multiple-choice logic questions
- AI evaluation compares user submissions against expected answers and provides specific feedback explaining what was correct or incorrect
- Score improvements are capped at 0-15 points per challenge to prevent gaming
- All simulation attempts are tracked per user for progress visualization

### Authentication & Security
- Passwords hashed with bcrypt (12 salt rounds) -- never stored in plaintext
- JWT access tokens expire after 15 minutes; refresh tokens after 7 days
- Bearer token auth via Authorization header (not cookies) to avoid CORS complications in cross-origin deployments
- Protected routes verify token validity on every request; expired tokens return 401 with explicit error messages
- Accounts without password hashes (migrated from OAuth) are handled gracefully without server errors

### Dashboard
- Real-time aggregation of total analyses, completed simulations, average readiness score, and cumulative score gained
- Recent analyses displayed with job title, readiness score, and timestamp
- Profile editing with inline form that persists changes to MongoDB immediately
- Progress timeline combining analyses and simulation completions in chronological order

---

## Ethical Use & Disclaimer

- **AI-Generated Content**: All gap analyses, skill recommendations, simulation tasks, and evaluation feedback are generated by Claude Sonnet 4.5 (Anthropic). Results are probabilistic and should be treated as guidance, not definitive career advice. Users should verify recommendations against actual job requirements and consult human career advisors for important decisions.

- **Resume Data Handling**: Uploaded resumes are processed in-memory for text extraction and sent to the Claude API for analysis. Resume text is stored in MongoDB as part of analysis records. Users should be aware that their resume content is transmitted to a third-party LLM provider (Anthropic) for processing.

- **Web Scraping**: Job description scraping respects `robots.txt` implicitly through standard HTTP requests. The scraper only extracts visible text content and does not bypass authentication or access restricted areas. Users should ensure they have the right to access and process the job listings they submit.

- **No Employment Guarantees**: Readiness scores and skill assessments are AI-generated estimates. A high readiness score does not guarantee employment, and a low score does not reflect a candidate's actual capabilities. The platform is a supplementary tool for self-assessment and skill development.

---

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for the full text.

---

## Author

**Tej Aditya**
- Email: tejaditya49@gmail.com
- GitHub: [github.com/tejaditya](https://github.com/tejaditya)
