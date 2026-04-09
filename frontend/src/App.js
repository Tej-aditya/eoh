import { useState, useEffect, createContext, useContext } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AnalysisDashboard from './components/AnalysisDashboard';
import SimulationStage from './components/SimulationStage';
import ProofOfSkill from './components/ProofOfSkill';
import Login from './pages/Login';
import MainDashboard from './pages/MainDashboard';
import AuthCallback from './components/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PublicAICoach,
  PublicResumeBuilder,
  PublicMockInterview,
  PublicCareerRoadmap,
  PublicSalaryInsights,
  PublicTrendingSkills,
  PublicCultureMatch,
  PublicResources,
  PublicJobs,
  PublicMentorship,
  PublicCommunity
} from './components/PublicSections';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AppRouter() {
  const location = useLocation();
  
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<LandingHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

function LandingHome() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('analyzer');
  
  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);
  
  const [stage, setStage] = useState('landing');
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const sections = [
    { id: 'analyzer', label: 'Skills Analyzer', icon: '🎯' },
    { id: 'ai-coach', label: 'AI Career Coach', icon: '🤖' },
    { id: 'resume-builder', label: 'Resume Builder', icon: '📄' },
    { id: 'mock-interview', label: 'Mock Interview', icon: '🎤' },
    { id: 'roadmap', label: 'Career Roadmap', icon: '🗺️' },
    { id: 'salary', label: 'Salary Insights', icon: '💰' },
    { id: 'trending', label: 'Trending Skills', icon: '📈' },
    { id: 'culture', label: 'Culture Match', icon: '🏢' },
    { id: 'resources', label: 'Resources', icon: '📚' },
    { id: 'jobs', label: 'Job Board', icon: '💼' },
    { id: 'mentorship', label: 'Mentorship', icon: '👥' },
    { id: 'community', label: 'Community', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe]" />
            <span className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              SkillSync AI
            </span>
          </div>
          <a
            href="/login"
            className="px-6 py-2 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
          >
            Login
          </a>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Left Sidebar - Horizontal scroll on mobile */}
        <div className="fixed left-0 top-16 bottom-0 w-64 glass-panel border-r border-white/10 p-4 overflow-y-auto hidden md:block">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
                  ${activeSection === section.id
                    ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black'
                    : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed top-16 left-0 right-0 glass-panel border-b border-white/10 p-2 overflow-x-auto flex gap-2 z-40">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                ${activeSection === section.id
                  ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black'
                  : 'bg-white/5 text-[#A1A1AA]'
                }
              `}
            >
              <span>{section.icon}</span>
              <span className="text-xs font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="md:ml-64 flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <AnimatePresence mode="wait">
            {activeSection === 'analyzer' && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stage === 'landing' && (
                  <LandingPage 
                    onAnalysisComplete={(data) => {
                      setAnalysisData(data);
                      setFinalScore(data.readiness_score);
                      setStage('analysis');
                    }}
                  />
                )}
                {stage === 'analysis' && analysisData && (
                  <AnalysisDashboard 
                    data={analysisData}
                    onStartSimulation={(skill) => {
                      setSelectedSkill(skill);
                      setStage('simulation');
                    }}
                    onFinish={() => setStage('proof')}
                  />
                )}
                {stage === 'simulation' && selectedSkill && (
                  <SimulationStage 
                    skill={selectedSkill}
                    onComplete={(scoreImprovement) => {
                      setFinalScore(prev => Math.min(100, prev + scoreImprovement));
                      setStage('analysis');
                    }}
                    onBack={() => setStage('analysis')}
                  />
                )}
                {stage === 'proof' && (
                  <ProofOfSkill 
                    score={finalScore}
                    jobTitle={analysisData?.job_title}
                    completedSkills={analysisData?.missing_skills.map(s => s.skill_name) || []}
                    onRestart={() => {
                      setStage('landing');
                      setAnalysisData(null);
                      setSelectedSkill(null);
                      setFinalScore(0);
                    }}
                  />
                )}
              </motion.div>
            )}

            {activeSection === 'ai-coach' && (
              <PublicAICoach key="ai-coach" />
            )}

            {activeSection === 'resume-builder' && (
              <PublicResumeBuilder key="resume" />
            )}

            {activeSection === 'mock-interview' && (
              <PublicMockInterview key="interview" />
            )}

            {activeSection === 'roadmap' && (
              <PublicCareerRoadmap key="roadmap" />
            )}

            {activeSection === 'salary' && (
              <PublicSalaryInsights key="salary" />
            )}

            {activeSection === 'trending' && (
              <PublicTrendingSkills key="trending" />
            )}

            {activeSection === 'culture' && (
              <PublicCultureMatch key="culture" />
            )}

            {activeSection === 'resources' && (
              <PublicResources key="resources" />
            )}

            {activeSection === 'jobs' && (
              <PublicJobs key="jobs" />
            )}

            {activeSection === 'mentorship' && (
              <PublicMentorship key="mentorship" />
            )}

            {activeSection === 'community' && (
              <PublicCommunity key="community" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="App min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkAuth }}>
      <div className="App">
        <BrowserRouter>
          {user && <Navbar />}
          <AppRouter />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;