import { motion } from 'framer-motion';
import { MessageSquare, User, Send, Download, Play, Target, Zap, TrendingUp, Lock, CheckCircle, Clock, Award, BookOpen, ExternalLink, Briefcase, MapPin, Star, Heart, Users } from 'lucide-react';

// AI Career Coach
export const PublicAICoach = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      AI Career Coach
    </h1>
    <p className="text-[#A1A1AA] mb-8">Get personalized career advice powered by AI</p>

    <div className="glass-panel rounded-3xl p-8">
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
              Hello! I'm your AI Career Coach. I can help you with career planning, skill development, resume tips, interview preparation, and salary negotiation. What would you like to know?
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <div className="flex-1 max-w-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/20 rounded-2xl p-4">
            <p className="text-white text-right">
              How can I transition from web development to AI/ML engineering?
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
              Great question! Here's your personalized roadmap:
            </p>
            <ol className="space-y-2 text-sm text-[#A1A1AA] list-decimal list-inside">
              <li>Master Python & essential math (linear algebra, calculus, statistics)</li>
              <li>Learn ML fundamentals through online courses (Coursera, fast.ai)</li>
              <li>Study key algorithms: regression, classification, neural networks</li>
              <li>Build portfolio projects using real datasets (Kaggle competitions)</li>
              <li>Get familiar with frameworks: TensorFlow, PyTorch, Scikit-learn</li>
              <li>Contribute to open-source ML projects on GitHub</li>
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
);

// Resume Builder
export const PublicResumeBuilder = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      AI Resume Builder
    </h1>
    <p className="text-[#A1A1AA] mb-8">Create an ATS-optimized resume in minutes</p>

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
            <label className="block text-sm font-semibold mb-2">Key Skills</label>
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
            <h3 className="text-2xl font-bold mb-2">Your Name</h3>
            <p className="text-gray-600 mb-1">Senior Software Engineer</p>
            <p className="text-sm text-gray-500">email@example.com | +1234567890</p>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-2">Professional Summary</h4>
            <p className="text-sm text-gray-700">
              Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, user experience, and continuous learning.
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
                <li>Led team of 5 developers on microservices project</li>
                <li>Improved system performance by 40%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Mock Interview
export const PublicMockInterview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      AI Mock Interview
    </h1>
    <p className="text-[#A1A1AA] mb-8">Practice with AI and get instant feedback</p>

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
              "Design a scalable URL shortener service like bit.ly. What technologies and architecture would you use?"
            </p>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="text-sm font-semibold mb-2 text-[#00f2fe]">Behavioral Question</p>
            <p className="text-sm text-[#A1A1AA]">
              "Tell me about a time you had a conflict with a team member. How did you resolve it?"
            </p>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="text-sm font-semibold mb-2 text-[#00f2fe]">System Design</p>
            <p className="text-sm text-[#A1A1AA]">
              "How would you design Instagram? Consider scalability, data storage, and real-time features."
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl">
          <p className="text-xs text-[#10B981]">
            💡 Tip: Practice speaking out loud. AI will analyze your responses and provide detailed feedback!
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Career Roadmap
export const PublicCareerRoadmap = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Career Roadmap
    </h1>
    <p className="text-[#A1A1AA] mb-8">Your personalized journey to career growth</p>

    <div className="glass-panel rounded-3xl p-8">
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
            { phase: 'Phase 1: Foundations', status: 'completed', skills: ['Python', 'SQL', 'Git'], months: '0-3', desc: 'Master programming fundamentals' },
            { phase: 'Phase 2: Web Development', status: 'current', skills: ['React', 'Node.js', 'REST APIs'], months: '4-9', desc: 'Build full-stack applications' },
            { phase: 'Phase 3: System Design', status: 'locked', skills: ['Microservices', 'Databases', 'Caching'], months: '10-15', desc: 'Design scalable systems' },
            { phase: 'Phase 4: Leadership', status: 'locked', skills: ['Team Management', 'Architecture', 'Mentoring'], months: '16-24', desc: 'Lead teams and projects' },
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
                    <p className="text-sm text-[#A1A1AA] mb-2">Months {item.months} • {item.desc}</p>
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
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-white border border-white/10">
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
);

// Salary Insights
export const PublicSalaryInsights = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Salary Insights
    </h1>
    <p className="text-[#A1A1AA] mb-8">Know your market value</p>

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
      <h2 className="text-xl font-bold mb-6">Salary Impact by Skill</h2>

      <div className="space-y-4">
        {[
          { skill: 'React', impact: '+$12K', level: 90, color: '#00f2fe' },
          { skill: 'Python', impact: '+$10K', level: 80, color: '#10B981' },
          { skill: 'AWS', impact: '+$15K', level: 95, color: '#F59E0B' },
          { skill: 'System Design', impact: '+$18K', level: 70, color: '#8B5CF6' },
          { skill: 'Leadership', impact: '+$20K', level: 60, color: '#EF4444' },
        ].map((item, index) => (
          <div key={index} className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">{item.skill}</span>
              <span className="font-mono" style={{ color: item.color }}>{item.impact}</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{ width: `${item.level}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Trending Skills
export const PublicTrendingSkills = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Trending Skills 2026
    </h1>
    <p className="text-[#A1A1AA] mb-8">What's hot in the job market</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { skill: 'AI/ML Engineering', growth: '+285%', demand: 'CRITICAL', color: '#EF4444', jobs: '12.5K new jobs' },
        { skill: 'Rust Programming', growth: '+180%', demand: 'HIGH', color: '#F59E0B', jobs: '8.2K new jobs' },
        { skill: 'Web3 Development', growth: '+165%', demand: 'HIGH', color: '#00f2fe', jobs: '7.8K new jobs' },
        { skill: 'Edge Computing', growth: '+142%', demand: 'MEDIUM', color: '#10B981', jobs: '5.4K new jobs' },
        { skill: 'Quantum Computing', growth: '+98%', demand: 'MEDIUM', color: '#8B5CF6', jobs: '3.2K new jobs' },
        { skill: 'Cybersecurity', growth: '+95%', demand: 'CRITICAL', color: '#EC4899', jobs: '15.1K new jobs' },
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
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold" style={{
              backgroundColor: `${item.color}20`,
              color: item.color
            }}>
              {item.demand}
            </span>
          </div>

          <h3 className="text-lg font-bold mb-2">{item.skill}</h3>
          <p className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.growth}</p>
          <p className="text-sm text-[#A1A1AA] mb-4">Growth in job postings</p>
          <p className="text-xs text-[#A1A1AA]">{item.jobs}</p>

          <button className="w-full mt-4 bg-white/5 border border-white/10 text-white rounded-full px-4 py-2 hover:bg-white/10 transition-all text-sm">
            Learn This Skill
          </button>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Culture Match
export const PublicCultureMatch = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Company Culture Match
    </h1>
    <p className="text-[#A1A1AA] mb-8">Find companies that fit your work style</p>

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
          { company: 'TechFlow AI', match: 95, culture: ['Remote-first', 'Learning culture', 'Work-life balance'], logo: '🚀' },
          { company: 'DataSync Corp', match: 88, culture: ['Hybrid work', 'Innovation focus', 'Collaborative'], logo: '📊' },
          { company: 'CloudVerse Inc', match: 82, culture: ['Flexible hours', 'Tech-forward', 'Global team'], logo: '☁️' },
        ].map((item, index) => (
          <div key={index} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{item.logo}</div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.company}</h3>
                  <p className="text-sm text-[#A1A1AA]">Based on your preferences</p>
                </div>
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
);

// Resources
export const PublicResources = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Learning Resources
    </h1>
    <p className="text-[#A1A1AA] mb-8">Curated courses to accelerate your growth</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: 'Complete React Developer', provider: 'Udemy', difficulty: 'Intermediate', duration: '40 hours', rating: 4.8 },
        { title: 'Node.js Microservices', provider: 'Pluralsight', difficulty: 'Advanced', duration: '30 hours', rating: 4.7 },
        { title: 'AWS Solutions Architect', provider: 'A Cloud Guru', difficulty: 'Intermediate', duration: '50 hours', rating: 4.9 },
        { title: 'Python for Data Science', provider: 'Coursera', difficulty: 'Beginner', duration: '35 hours', rating: 4.6 },
        { title: 'System Design Interview', provider: 'Educative', difficulty: 'Advanced', duration: '25 hours', rating: 4.8 },
        { title: 'Docker & Kubernetes', provider: 'Udemy', difficulty: 'Intermediate', duration: '20 hours', rating: 4.7 },
      ].map((resource, index) => (
        <div key={index} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-[#00f2fe]/10">
              <BookOpen className="w-6 h-6 text-[#00f2fe]" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#F59E0B]/10 text-[#F59E0B]">
              {resource.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-[#A1A1AA] mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resource.duration}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              {resource.rating}
            </span>
          </div>

          <p className="text-sm text-[#A1A1AA] mb-4">{resource.provider}</p>

          <button className="w-full bg-white/5 border border-white/10 text-white rounded-full px-6 py-3 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            View Course
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </motion.div>
);

// Jobs
export const PublicJobs = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Job Board
    </h1>
    <p className="text-[#A1A1AA] mb-8">Latest opportunities matching your skills</p>

    <div className="space-y-6">
      {[
        { title: 'Senior Full Stack Engineer', company: 'TechCorp Inc', location: 'San Francisco, CA', type: 'Full-time', salary: '$120k - $180k', skills: ['React', 'Node.js', 'AWS'] },
        { title: 'React Developer', company: 'StartupXYZ', location: 'Remote', type: 'Contract', salary: '$80k - $120k', skills: ['React', 'TypeScript', 'Redux'] },
        { title: 'Data Scientist', company: 'AI Solutions', location: 'New York, NY', type: 'Full-time', salary: '$130k - $200k', skills: ['Python', 'TensorFlow', 'SQL'] },
        { title: 'DevOps Engineer', company: 'CloudTech', location: 'Austin, TX', type: 'Full-time', salary: '$110k - $160k', skills: ['AWS', 'Docker', 'Kubernetes'] },
      ].map((job, index) => (
        <div key={index} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
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
                  {job.type}
                </span>
                <span>{job.salary}</span>
              </div>
            </div>
            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20">
                {skill}
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
);

// Mentorship
export const PublicMentorship = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Find a Mentor
    </h1>
    <p className="text-[#A1A1AA] mb-8">Connect with industry experts</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { name: 'Sarah Johnson', expertise: ['React', 'Node.js', 'System Design'], years: 8, bio: 'Senior Engineer at Google', rating: 4.9, sessions: 45 },
        { name: 'Michael Chen', expertise: ['Python', 'ML', 'AWS'], years: 10, bio: 'ML Engineer at Meta', rating: 4.8, sessions: 38 },
        { name: 'Emily Rodriguez', expertise: ['TypeScript', 'GraphQL', 'Microservices'], years: 6, bio: 'Tech Lead at Stripe', rating: 5.0, sessions: 52 },
      ].map((mentor, index) => (
        <div key={index} className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
              <p className="text-sm text-[#A1A1AA]">{mentor.years} years experience</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-sm font-mono">{mentor.rating}</span>
                <span className="text-xs text-[#A1A1AA] ml-1">({mentor.sessions} sessions)</span>
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
);

// Community
export const PublicCommunity = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto"
  >
    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      Community Feed
    </h1>
    <p className="text-[#A1A1AA] mb-8">Share your journey and connect with others</p>

    <div className="glass-panel rounded-2xl p-6 mb-8">
      <textarea
        placeholder="Share your learning journey..."
        rows={3}
        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] resize-none mb-3"
      />
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-2 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center gap-2">
          <Send className="w-4 h-4" />
          Post
        </button>
      </div>
    </div>

    <div className="space-y-6">
      {[
        { user: 'Alex M.', time: '2 hours ago', content: 'Just completed my first full-stack project! Built a real-time chat app with React and Node.js. Feeling accomplished! 🚀', likes: 24, comments: 5 },
        { user: 'Jamie K.', time: '5 hours ago', content: 'Passed my AWS Solutions Architect certification! Thanks to this amazing community for all the support and resources. Next up: Kubernetes!', likes: 42, comments: 8 },
        { user: 'Chris P.', time: '1 day ago', content: 'Finally landed my dream job as a Senior Developer! The mock interview practice here was invaluable. Don\'t give up, everyone! 💪', likes: 87, comments: 15 },
      ].map((post, index) => (
        <div key={index} className="glass-panel rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">{post.user}</p>
              <p className="text-sm text-[#A1A1AA]">{post.time}</p>
            </div>
          </div>

          <p className="text-white mb-4">{post.content}</p>

          <div className="flex items-center gap-6 text-sm text-[#A1A1AA]">
            <button className="flex items-center gap-2 hover:text-[#EF4444] transition-colors">
              <Heart className="w-5 h-5" />
              {post.likes}
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
              {post.comments}
            </button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);
