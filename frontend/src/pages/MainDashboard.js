import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { 
  Home, User, BookOpen, Briefcase, TrendingUp, Users, MessageSquare, 
  Settings as SettingsIcon, LogOut, Target, Zap, Award, Clock, Plus,
  MapPin, Save, ExternalLink, Star, Send, Heart, Bell, Shield, Lock,
  Download, Play, CheckCircle
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MainDashboard = () => {
  const { user, setUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    career_goal: user?.career_goal || '',
    location: user?.location || '',
    experience_years: user?.experience_years || 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`, {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/profile`,
        formData,
        { withCredentials: true }
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const sections = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'ai-coach', icon: MessageSquare, label: 'AI Coach' },
    { id: 'resume-builder', icon: Award, label: 'Resume Builder' },
    { id: 'mock-interview', icon: Target, label: 'Mock Interview' },
    { id: 'roadmap', icon: TrendingUp, label: 'Career Roadmap' },
    { id: 'salary', icon: Zap, label: 'Salary Insights' },
    { id: 'resources', icon: BookOpen, label: 'Resources' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs' },
    { id: 'trending', icon: Star, label: 'Trending Skills' },
    { id: 'culture', icon: Heart, label: 'Culture Match' },
    { id: 'progress', icon: Clock, label: 'Progress' },
    { id: 'mentorship', icon: Users, label: 'Mentorship' },
    { id: 'community', icon: MessageSquare, label: 'Community' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const mockJobs = [
    {
      id: '1',
      title: 'Senior Full Stack Engineer',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA',
      job_type: 'Full-time',
      salary_range: '$120k - $180k',
      requirements: ['React', 'Node.js', 'AWS']
    },
    {
      id: '2',
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      job_type: 'Contract',
      salary_range: '$80k - $120k',
      requirements: ['React', 'TypeScript', 'Redux']
    }
  ];

  const mockResources = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      description: 'Master React with hooks, context, and advanced patterns',
      difficulty: 'Intermediate',
      duration: '40 hours',
      provider: 'Udemy',
      url: 'https://udemy.com'
    },
    {
      id: '2',
      title: 'Node.js Microservices Architecture',
      description: 'Build scalable backend systems with Node.js',
      difficulty: 'Advanced',
      duration: '30 hours',
      provider: 'Pluralsight',
      url: 'https://pluralsight.com'
    }
  ];

  const mockMentors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      expertise: ['React', 'Node.js', 'System Design'],
      experience_years: 8,
      bio: 'Senior Engineer at Google. Passionate about helping developers grow.',
      rating: 4.9,
      sessions_completed: 45
    },
    {
      id: '2',
      name: 'Michael Chen',
      expertise: ['Python', 'Machine Learning', 'AWS'],
      experience_years: 10,
      bio: 'ML Engineer specializing in production systems.',
      rating: 4.8,
      sessions_completed: 38
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe]" />
            <span className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              SkillSync AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe]" />
              )}
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full text-[#A1A1AA] hover:text-[#EF4444] transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 w-64 glass-panel border-r border-white/10 p-6 overflow-y-auto">
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  data-testid={`section-${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${activeSection === section.id
                      ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black'
                      : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 p-8">
          <AnimatePresence mode="wait">
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Welcome back, {user?.name?.split(' ')[0]}!
                  </h1>
                  <p className="text-[#A1A1AA]">Track your skills journey and progress</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-[#00f2fe]/10">
                        <Target className="w-6 h-6 text-[#00f2fe]" />
                      </div>
                      <span className="text-2xl font-bold font-mono">{stats?.total_analyses || 0}</span>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">Total Analyses</p>
                  </div>

                  <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-[#10B981]/10">
                        <Zap className="w-6 h-6 text-[#10B981]" />
                      </div>
                      <span className="text-2xl font-bold font-mono">{stats?.total_simulations || 0}</span>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">Challenges Completed</p>
                  </div>

                  <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-[#F59E0B]/10">
                        <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                      </div>
                      <span className="text-2xl font-bold font-mono">{stats?.average_readiness || 0}%</span>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">Avg Readiness Score</p>
                  </div>

                  <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-[#8B5CF6]/10">
                        <Award className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                      <span className="text-2xl font-bold font-mono">+{stats?.total_score_gain || 0}</span>
                    </div>
                    <p className="text-sm text-[#A1A1AA]">Total Score Gained</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Recent Analyses
                    </h2>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      New Analysis
                    </button>
                  </div>

                  {stats?.recent_analyses?.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recent_analyses.map((analysis, index) => (
                        <div key={index} className="glass-panel rounded-xl p-4 hover:bg-white/5 transition-all">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold mb-1">{analysis.job_title}</h3>
                              <p className="text-sm text-[#A1A1AA]">
                                {new Date(analysis.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-3xl font-bold font-mono" style={{
                              color: analysis.readiness_score >= 80 ? '#10B981' : 
                                     analysis.readiness_score >= 60 ? '#F59E0B' : '#EF4444'
                            }}>
                              {analysis.readiness_score}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                      <p className="text-[#A1A1AA] mb-4">No analyses yet</p>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
                      >
                        Start Your First Analysis
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* AI CAREER COACH SECTION */}
            {activeSection === 'ai-coach' && (
              <motion.div
                key="ai-coach"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AI Career Coach
                </h1>

                <div className="glass-panel rounded-3xl p-8 max-w-4xl">
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#00f2fe]/10 to-[#4facfe]/10 rounded-2xl border border-[#00f2fe]/20">
                    <p className="text-sm text-[#A1A1AA]">
                      💬 Ask me anything about your career, skills, or job search!
                    </p>
                  </div>

                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1 glass-panel rounded-2xl p-4">
                        <p className="text-white">
                          Hello! I'm your AI Career Coach. I can help you with career planning, skill development, resume tips, interview preparation, and more. What would you like to know?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                      <div className="flex-1 max-w-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/20 rounded-2xl p-4">
                        <p className="text-white text-right">
                          How can I transition into a data science role?
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1 glass-panel rounded-2xl p-4">
                        <p className="text-white mb-3">
                          Great question! Here's a roadmap for transitioning into data science:
                        </p>
                        <ol className="space-y-2 text-sm text-[#A1A1AA] list-decimal list-inside">
                          <li>Master Python & SQL fundamentals</li>
                          <li>Learn statistics & probability</li>
                          <li>Study machine learning algorithms</li>
                          <li>Build portfolio projects with real datasets</li>
                          <li>Get familiar with tools like Pandas, NumPy, Scikit-learn</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Ask your career question..."
                      className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#00f2fe] transition-all"
                    />
                    <button className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESUME BUILDER SECTION */}
            {activeSection === 'resume-builder' && (
              <motion.div
                key="resume-builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AI Resume Builder
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-panel rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6">Build Your Resume</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Target Role</label>
                        <input
                          type="text"
                          placeholder="e.g., Senior Software Engineer"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Years of Experience</label>
                        <input
                          type="number"
                          placeholder="5"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Key Skills (comma separated)</label>
                        <textarea
                          placeholder="React, Node.js, Python, AWS..."
                          rows={3}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Work Experience</label>
                        <textarea
                          placeholder="Briefly describe your roles and achievements..."
                          rows={5}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] resize-none"
                        />
                      </div>

                      <button className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all">
                        Generate AI-Optimized Resume
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Preview</h2>
                      <button className="text-sm text-[#00f2fe] hover:text-white transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>

                    <div className="bg-white text-black rounded-2xl p-8 min-h-96">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-2">John Doe</h3>
                        <p className="text-gray-600 mb-1">Senior Software Engineer</p>
                        <p className="text-sm text-gray-500">john.doe@email.com | +1234567890</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-2">Professional Summary</h4>
                        <p className="text-sm text-gray-700">
                          Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {['React', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-2">Experience</h4>
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold">Senior Developer</p>
                          <p className="text-gray-500 mb-2">Tech Company | 2020 - Present</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Led team of 5 developers</li>
                            <li>Built microservices architecture</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MOCK INTERVIEW SECTION */}
            {activeSection === 'mock-interview' && (
              <motion.div
                key="mock-interview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AI Mock Interview
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-panel rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6">Interview Setup</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-3">Select Interview Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button className="glass-panel rounded-xl p-4 hover:glass-panel-active transition-all">
                            <Target className="w-8 h-8 text-[#00f2fe] mx-auto mb-2" />
                            <p className="text-sm font-medium">Technical</p>
                          </button>
                          <button className="glass-panel rounded-xl p-4 hover:bg-white/5 transition-all">
                            <Users className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
                            <p className="text-sm font-medium text-[#A1A1AA]">Behavioral</p>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Job Role</label>
                        <input
                          type="text"
                          placeholder="e.g., Full Stack Developer"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
                        <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe]">
                          <option>Junior</option>
                          <option>Mid-Level</option>
                          <option>Senior</option>
                        </select>
                      </div>

                      <button className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2">
                        <Play className="w-5 h-5" />
                        Start Interview
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6">Sample Questions</h2>

                    <div className="space-y-4">
                      <div className="glass-panel rounded-xl p-4">
                        <p className="text-sm font-semibold mb-2 text-[#00f2fe]">Technical Question 1</p>
                        <p className="text-sm text-[#A1A1AA]">
                          "Explain the difference between authentication and authorization. How would you implement both in a web application?"
                        </p>
                      </div>

                      <div className="glass-panel rounded-xl p-4">
                        <p className="text-sm font-semibold mb-2 text-[#00f2fe]">Technical Question 2</p>
                        <p className="text-sm text-[#A1A1AA]">
                          "Design a scalable URL shortener service like bit.ly. What technologies would you use?"
                        </p>
                      </div>

                      <div className="glass-panel rounded-xl p-4">
                        <p className="text-sm font-semibold mb-2 text-[#00f2fe]">Behavioral Question</p>
                        <p className="text-sm text-[#A1A1AA]">
                          "Tell me about a time you had a conflict with a team member. How did you resolve it?"
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl">
                      <p className="text-xs text-[#10B981]">
                        💡 Tip: Practice speaking out loud. AI will analyze your responses and provide feedback!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CAREER ROADMAP SECTION */}
            {activeSection === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Career Roadmap
                </h1>

                <div className="glass-panel rounded-3xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Your Journey: Junior → Senior Engineer</h2>
                      <p className="text-[#A1A1AA]">Estimated time: 18-24 months</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#A1A1AA] mb-1">Current Progress</p>
                      <p className="text-4xl font-bold text-[#00f2fe]">35%</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00f2fe] to-[#4facfe]" />

                    <div className="space-y-8">
                      {[
                        { phase: 'Phase 1: Foundations', status: 'completed', skills: ['Python', 'SQL', 'Git'], months: '0-3' },
                        { phase: 'Phase 2: Web Development', status: 'current', skills: ['React', 'Node.js', 'REST APIs'], months: '4-9' },
                        { phase: 'Phase 3: System Design', status: 'locked', skills: ['Microservices', 'Databases', 'Caching'], months: '10-15' },
                        { phase: 'Phase 4: Leadership', status: 'locked', skills: ['Team Management', 'Architecture', 'Mentoring'], months: '16-24' },
                      ].map((item, index) => (
                        <div key={index} className="relative pl-16">
                          <div className={`
                            absolute left-0 w-12 h-12 rounded-full flex items-center justify-center
                            ${item.status === 'completed' ? 'bg-[#10B981]' :
                              item.status === 'current' ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] animate-pulse' :
                              'bg-white/10'}
                          `}>
                            {item.status === 'completed' ? (
                              <CheckCircle className="w-6 h-6 text-black" />
                            ) : item.status === 'current' ? (
                              <Zap className="w-6 h-6 text-black" />
                            ) : (
                              <Lock className="w-6 h-6 text-[#A1A1AA]" />
                            )}
                          </div>

                          <div className={`glass-panel rounded-2xl p-6 ${item.status === 'current' ? 'border-2 border-[#00f2fe]' : ''}`}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-bold mb-1">{item.phase}</h3>
                                <p className="text-sm text-[#A1A1AA]">Months {item.months}</p>
                              </div>
                              {item.status === 'completed' && (
                                <span className="px-3 py-1 rounded-full text-xs bg-[#10B981]/10 text-[#10B981]">
                                  Completed
                                </span>
                              )}
                              {item.status === 'current' && (
                                <span className="px-3 py-1 rounded-full text-xs bg-[#00f2fe]/10 text-[#00f2fe]">
                                  In Progress
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {item.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-white">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SALARY INSIGHTS SECTION */}
            {activeSection === 'salary' && (
              <motion.div
                key="salary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Salary Insights
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="glass-panel rounded-2xl p-6">
                    <p className="text-sm text-[#A1A1AA] mb-2">Your Estimated Value</p>
                    <p className="text-4xl font-bold text-[#00f2fe] mb-2">$95K</p>
                    <p className="text-sm text-[#10B981]">↑ 15% above average</p>
                  </div>

                  <div className="glass-panel rounded-2xl p-6">
                    <p className="text-sm text-[#A1A1AA] mb-2">Market Average</p>
                    <p className="text-4xl font-bold text-white mb-2">$82K</p>
                    <p className="text-sm text-[#A1A1AA]">For your role & location</p>
                  </div>

                  <div className="glass-panel rounded-2xl p-6">
                    <p className="text-sm text-[#A1A1AA] mb-2">Potential at Next Level</p>
                    <p className="text-4xl font-bold text-[#F59E0B] mb-2">$130K</p>
                    <p className="text-sm text-[#A1A1AA]">Senior position</p>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-8">
                  <h2 className="text-xl font-bold mb-6">Salary Breakdown by Skill</h2>

                  <div className="space-y-4">
                    {[
                      { skill: 'React', impact: '+$12K', level: 90 },
                      { skill: 'Python', impact: '+$10K', level: 80 },
                      { skill: 'AWS', impact: '+$15K', level: 95 },
                      { skill: 'System Design', impact: '+$18K', level: 70 },
                      { skill: 'Leadership', impact: '+$20K', level: 60 },
                    ].map((item, index) => (
                      <div key={index} className="glass-panel rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold">{item.skill}</span>
                          <span className="text-[#00f2fe] font-mono">{item.impact}</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] h-2 rounded-full"
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TRENDING SKILLS SECTION */}
            {activeSection === 'trending' && (
              <motion.div
                key="trending"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Trending Skills 2026
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { skill: 'AI/ML Engineering', growth: '+285%', demand: 'critical', color: '#EF4444' },
                    { skill: 'Rust Programming', growth: '+180%', demand: 'high', color: '#F59E0B' },
                    { skill: 'Web3 Development', growth: '+165%', demand: 'high', color: '#00f2fe' },
                    { skill: 'Edge Computing', growth: '+142%', demand: 'medium', color: '#10B981' },
                    { skill: 'Quantum Computing', growth: '+98%', demand: 'medium', color: '#8B5CF6' },
                    { skill: 'Cybersecurity', growth: '+95%', demand: 'critical', color: '#EF4444' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${item.color}20` }}>
                          <TrendingUp className="w-6 h-6" style={{ color: item.color }} />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono" style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color
                        }}>
                          {item.demand.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2">{item.skill}</h3>
                      <p className="text-2xl font-bold mb-2" style={{ color: item.color }}>{item.growth}</p>
                      <p className="text-sm text-[#A1A1AA]">Growth in job postings</p>

                      <button className="w-full mt-4 bg-white/5 border border-white/10 text-white rounded-full px-4 py-2 hover:bg-white/10 transition-all text-sm">
                        Learn More
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CULTURE MATCH SECTION */}
            {activeSection === 'culture' && (
              <motion.div
                key="culture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Company Culture Match
                </h1>

                <div className="glass-panel rounded-3xl p-8 mb-8">
                  <h2 className="text-xl font-bold mb-6">Your Work Style Preferences</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel rounded-xl p-4">
                      <p className="text-sm text-[#A1A1AA] mb-2">Work Environment</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black rounded-lg px-4 py-2 text-sm font-medium">
                          Remote
                        </button>
                        <button className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 text-sm">
                          Hybrid
                        </button>
                        <button className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 text-sm">
                          Office
                        </button>
                      </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4">
                      <p className="text-sm text-[#A1A1AA] mb-2">Team Size</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 text-sm">
                          Startup
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black rounded-lg px-4 py-2 text-sm font-medium">
                          Mid-size
                        </button>
                        <button className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 text-sm">
                          Enterprise
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-6">Companies Matching Your Profile</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { company: 'TechFlow AI', match: 95, culture: ['Remote-first', 'Learning culture', 'Work-life balance'] },
                      { company: 'DataSync Corp', match: 88, culture: ['Hybrid work', 'Innovation focus', 'Collaborative'] },
                      { company: 'CloudVerse Inc', match: 82, culture: ['Flexible hours', 'Tech-forward', 'Global team'] },
                    ].map((item, index) => (
                      <div key={index} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{item.company}</h3>
                            <p className="text-sm text-[#A1A1AA]">Based on your preferences</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-[#00f2fe]">{item.match}%</p>
                            <p className="text-xs text-[#A1A1AA]">Match</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.culture.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-xs bg-[#00f2fe]/10 text-[#00f2fe]">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-3 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all">
                          View Open Roles
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROFILE SECTION */}
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  My Profile
                </h1>

                <div className="glass-panel rounded-3xl p-8 max-w-4xl">
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-[#00f2fe]/20" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                        <User className="w-12 h-12 text-black" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                      <p className="text-[#A1A1AA]">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Career Goal</label>
                      <input
                        type="text"
                        value={formData.career_goal}
                        onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                        disabled={!isEditing}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                        placeholder="e.g., Senior Data Scientist"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Experience (Years)</label>
                        <input
                          type="number"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                          disabled={!isEditing}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-white/5 border border-white/10 text-white rounded-full px-8 py-4 hover:bg-white/10 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-8 py-4 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESOURCES SECTION */}
            {activeSection === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Learning Resources
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockResources.map((resource) => (
                    <div key={resource.id} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-[#00f2fe]/10">
                          <BookOpen className="w-6 h-6 text-[#00f2fe]" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#F59E0B]/10 text-[#F59E0B]">
                          {resource.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className="text-sm text-[#A1A1AA] mb-4">{resource.description}</p>

                      <div className="flex items-center gap-4 text-sm text-[#A1A1AA] mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {resource.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {resource.provider}
                        </span>
                      </div>

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 text-white rounded-full px-6 py-3 hover:bg-white/10 transition-all"
                      >
                        View Course
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* JOBS SECTION */}
            {activeSection === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Job Board
                </h1>

                <div className="space-y-6">
                  {mockJobs.map((job) => (
                    <div key={job.id} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                          <p className="text-[#A1A1AA] mb-3">{job.company}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A1A1AA]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.job_type}
                            </span>
                            <span>{job.salary_range}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.map((req, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20">
                            {req}
                          </span>
                        ))}
                      </div>

                      <button className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-3 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all">
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PROGRESS SECTION */}
            {activeSection === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Progress Tracker
                </h1>

                <div className="glass-panel rounded-2xl p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                  <p className="text-[#A1A1AA] mb-4">No progress data yet</p>
                  <p className="text-sm text-[#A1A1AA]">
                    Start analyzing your skills to see your progress here
                  </p>
                </div>
              </motion.div>
            )}

            {/* MENTORSHIP SECTION */}
            {activeSection === 'mentorship' && (
              <motion.div
                key="mentorship"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Find a Mentor
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockMentors.map((mentor) => (
                    <div key={mentor.id} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe]" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
                          <p className="text-sm text-[#A1A1AA]">{mentor.experience_years} years experience</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                            <span className="text-sm font-mono">{mentor.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-[#A1A1AA] mb-4">{mentor.bio}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.expertise.map((skill, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe]">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-3 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Request Session
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMMUNITY SECTION */}
            {activeSection === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Community Feed
                </h1>

                <div className="glass-panel rounded-2xl p-6 mb-8">
                  <textarea
                    placeholder="Share your learning journey..."
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-2 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                  <p className="text-[#A1A1AA]">No posts yet. Be the first to share!</p>
                </div>
              </motion.div>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Settings
                </h1>

                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-[#00f2fe]/10">
                      <Bell className="w-6 h-6 text-[#00f2fe]" />
                    </div>
                    <h2 className="text-xl font-bold">Notifications</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                      <span>Email notifications</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                      <span>New job matches</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-[#10B981]/10">
                      <Shield className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <h2 className="text-xl font-bold">Privacy</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                      <span>Public profile</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-all">
                      <span>Show progress on community</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
