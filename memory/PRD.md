# SkillSync AI - Product Requirements Document

## Original Problem Statement
Build "SkillSync AI", a platform connecting academic learning with industry requirements. Features include a resume parser, job description gap analyzer (using Claude 4.5 LLM), real-time skills simulation tasks, and comprehensive career development sections. The user requested a stunning "glassmorphism" UI with dark mode and neon accents.

## User Preferences
- Single-page application with all modules/sections visible together
- Glassmorphism UI, dark mode, neon cyan/blue accents
- Simple email/password login (NOT Google OAuth)
- Stunning, creative sections beyond just the analyzer

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Auth:** JWT Bearer tokens (access + refresh), bcrypt password hashing
- **AI:** Claude Sonnet 4.5 via Emergent LLM Key
- **Token storage:** localStorage (access_token, refresh_token)
- **API auth:** Authorization: Bearer <token> header

## What's Been Implemented

### Core Features (DONE)
- AI Resume vs Job Gap Analysis (Claude Sonnet 4.5)
- Resume PDF upload + text extraction
- Job description URL scraping
- Skills simulation/challenge generation
- Proof of Skill certificates

### 12+ Public Sections (DONE)
- Skills Analyzer, AI Career Coach, Resume Builder
- Mock Interview, Career Roadmap, Salary Insights
- Trending Skills, Culture Match, Resources
- Job Board, Mentorship, Community

### Authentication (DONE - Fixed April 2026)
- JWT Bearer token auth (login, register, logout, /me)
- Tokens returned in JSON body, stored in localStorage
- Admin seed account: admin@skillsync.ai / Admin@123
- ProtectedRoute guards dashboard
- **Note:** Cookie-based auth was replaced with Bearer token auth due to Kubernetes proxy overriding CORS headers with wildcard `*`

### Dashboard (DONE)
- User dashboard with stats, profile editing
- Analysis history, simulation tracking
- Progress timeline

## P0 Issues — RESOLVED
- ~~Network Error on Login/Registration~~ — Fixed by switching from cookie-based to Bearer token auth

## P1 — Next Tasks
- Comprehensive testing of all 15 public/creative sections for full functionality
- Verify logged-in vs logged-out UI state management

## P2 — Future/Backlog
- Refactor server.py (split auth, AI, dashboard routes into separate files)
- Improve error handling in Login.js (distinguish CORS vs backend errors)
- Add token refresh logic when access token expires
- Mobile responsiveness polish
