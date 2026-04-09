import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Clock, Award } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LearningResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/resources/recommend`,
        {},
        { withCredentials: true }
      );
      setResources(response.data);
    } catch (error) {
      console.error('Error loading resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const mockResources = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      description: 'Master React with hooks, context, and advanced patterns',
      category: 'Frontend',
      difficulty: 'Intermediate',
      duration: '40 hours',
      provider: 'Udemy',
      url: 'https://udemy.com'
    },
    {
      id: '2',
      title: 'Node.js Microservices Architecture',
      description: 'Build scalable backend systems with Node.js',
      category: 'Backend',
      difficulty: 'Advanced',
      duration: '30 hours',
      provider: 'Pluralsight',
      url: 'https://pluralsight.com'
    },
    {
      id: '3',
      title: 'AWS Solutions Architect',
      description: 'Learn AWS cloud services and architecture',
      category: 'Cloud',
      difficulty: 'Intermediate',
      duration: '50 hours',
      provider: 'A Cloud Guru',
      url: 'https://acloudguru.com'
    }
  ];

  const displayResources = resources.length > 0 ? resources : mockResources;

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
            Learning Resources
          </h1>
          <p className="text-[#A1A1AA]">Curated courses recommended for your skill gaps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#00f2fe]/10 group-hover:bg-[#00f2fe]/20">
                  <BookOpen className="w-6 h-6 text-[#00f2fe]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                  {resource.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-[#A1A1AA] mb-4">{resource.description}</p>

              <div className="flex items-center gap-4 text-sm text-[#A1A1AA] mb-4">
                {resource.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {resource.duration}
                  </span>
                )}
                {resource.provider && (
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {resource.provider}
                  </span>
                )}
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningResources;