import { useState, useEffect, createContext, useContext } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AnalysisDashboard from './components/AnalysisDashboard';
import SimulationStage from './components/SimulationStage';
import ProofOfSkill from './components/ProofOfSkill';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LearningResources from './pages/LearningResources';
import JobBoard from './pages/JobBoard';
import ProgressTracker from './pages/ProgressTracker';
import Mentorship from './pages/Mentorship';
import Community from './pages/Community';
import Settings from './pages/Settings';
import AuthCallback from './components/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><LearningResources /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
      <Route path="/mentorship" element={<ProtectedRoute><Mentorship /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}

function LandingHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const [stage, setStage] = useState('landing');
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <AnimatePresence mode="wait">
      {stage === 'landing' && (
        <motion.div key="landing" {...pageTransition}>
          <LandingPage 
            onAnalysisComplete={(data) => {
              setAnalysisData(data);
              setFinalScore(data.readiness_score);
              setStage('analysis');
            }}
          />
        </motion.div>
      )}
      
      {stage === 'analysis' && analysisData && (
        <motion.div key="analysis" {...pageTransition}>
          <AnalysisDashboard 
            data={analysisData}
            onStartSimulation={(skill) => {
              setSelectedSkill(skill);
              setStage('simulation');
            }}
            onFinish={() => setStage('proof')}
          />
        </motion.div>
      )}
      
      {stage === 'simulation' && selectedSkill && (
        <motion.div key="simulation" {...pageTransition}>
          <SimulationStage 
            skill={selectedSkill}
            onComplete={(scoreImprovement) => {
              setFinalScore(prev => Math.min(100, prev + scoreImprovement));
              setStage('analysis');
            }}
            onBack={() => setStage('analysis')}
          />
        </motion.div>
      )}
      
      {stage === 'proof' && (
        <motion.div key="proof" {...pageTransition}>
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
        </motion.div>
      )}
    </AnimatePresence>
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