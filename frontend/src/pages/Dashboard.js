import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { Target, Zap, Award, TrendingUp, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-[#A1A1AA]">Track your skills journey and progress</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#00f2fe]/10">
                <Target className="w-6 h-6 text-[#00f2fe]" />
              </div>
              <span className="text-2xl font-bold font-mono">
                {stats?.total_analyses || 0}
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA]">Total Analyses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#10B981]/10">
                <Zap className="w-6 h-6 text-[#10B981]" />
              </div>
              <span className="text-2xl font-bold font-mono">
                {stats?.total_simulations || 0}
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA]">Challenges Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F59E0B]/10">
                <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <span className="text-2xl font-bold font-mono">
                {stats?.average_readiness || 0}%
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA]">Avg Readiness Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#8B5CF6]/10">
                <Award className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <span className="text-2xl font-bold font-mono">
                +{stats?.total_score_gain || 0}
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA]">Total Score Gained</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Recent Analyses
              </h2>
              <button
                data-testid="new-analysis-button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
              >
                <Plus className="w-4 h-4" />
                New Analysis
              </button>
            </div>

            <div className="space-y-4">
              {stats?.recent_analyses?.length > 0 ? (
                stats.recent_analyses.map((analysis, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {analysis.job_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {analysis.readiness_score}% Ready
                          </span>
                        </div>
                      </div>
                      <div
                        className="text-3xl font-bold font-mono"
                        style={{
                          color:
                            analysis.readiness_score >= 80
                              ? '#10B981'
                              : analysis.readiness_score >= 60
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      >
                        {analysis.readiness_score}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="glass-panel rounded-2xl p-12 text-center">
                  <Target className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                  <p className="text-[#A1A1AA] mb-4">No analyses yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
                  >
                    Start Your First Analysis
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Quick Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/resources')}
                className="w-full glass-panel rounded-2xl p-6 text-left hover:glass-panel-active transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#00f2fe]/10 group-hover:bg-[#00f2fe]/20">
                    <Award className="w-6 h-6 text-[#00f2fe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Learning Resources</h3>
                    <p className="text-sm text-[#A1A1AA]">
                      Explore recommended courses
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/jobs')}
                className="w-full glass-panel rounded-2xl p-6 text-left hover:glass-panel-active transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#10B981]/10 group-hover:bg-[#10B981]/20">
                    <TrendingUp className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Job Board</h3>
                    <p className="text-sm text-[#A1A1AA]">
                      Find relevant opportunities
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/mentorship')}
                className="w-full glass-panel rounded-2xl p-6 text-left hover:glass-panel-active transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#F59E0B]/10 group-hover:bg-[#F59E0B]/20">
                    <Target className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Find a Mentor</h3>
                    <p className="text-sm text-[#A1A1AA]">
                      Connect with experts
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
