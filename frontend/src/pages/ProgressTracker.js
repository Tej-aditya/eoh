import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProgressTracker = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/progress`, {
        withCredentials: true
      });
      setTimeline(response.data.timeline || []);
    } catch (error) {
      console.error('Error loading progress:', error);
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
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Progress Tracker
          </h1>
          <p className="text-[#A1A1AA]">Your skill development journey</p>
        </motion.div>

        {timeline.length > 0 ? (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00f2fe] to-[#4facfe]" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  <div className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                    {item.type === 'analysis' ? (
                      <Target className="w-6 h-6 text-black" />
                    ) : (
                      <Award className="w-6 h-6 text-black" />
                    )}
                  </div>

                  <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.type === 'analysis'
                            ? `Analysis: ${item.job_title}`
                            : `Completed: ${item.skill}`}
                        </h3>
                        <p className="text-sm text-[#A1A1AA]">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      {item.type === 'analysis' && (
                        <span
                          className="text-2xl font-bold font-mono"
                          style={{
                            color:
                              item.score >= 80
                                ? '#10B981'
                                : item.score >= 60
                                ? '#F59E0B'
                                : '#EF4444',
                          }}
                        >
                          {item.score}%
                        </span>
                      )}
                      {item.type === 'simulation' && (
                        <span className="text-lg font-bold text-[#00f2fe] font-mono">
                          +{item.score_gained}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <TrendingUp className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
            <p className="text-[#A1A1AA] mb-4">No progress data yet</p>
            <p className="text-sm text-[#A1A1AA]">
              Start analyzing your skills to see your progress here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;