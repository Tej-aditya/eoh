import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap, ArrowRight, Award } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const AnalysisDashboard = ({ data, onStartSimulation, onFinish }) => {
  const chartData = [
    {
      name: 'Readiness',
      value: data.readiness_score,
      fill: 'url(#gradient)'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getImportanceColor = (importance) => {
    const colors = {
      'Critical': '#EF4444',
      'High': '#F59E0B',
      'Medium': '#10B981'
    };
    return colors[importance] || '#00f2fe';
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Skills Gap Analysis
        </h1>
        <p className="text-[#A1A1AA]">Your personalized roadmap to {data.job_title}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          data-testid="readiness-score-card"
          className="md:col-span-1 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe]/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <Target className="w-8 h-8 text-[#00f2fe] mx-auto mb-4" />
            <p className="text-sm text-[#A1A1AA] mb-2">Readiness Score</p>
            
            <div className="relative w-48 h-48 mx-auto">
              <RadialBarChart 
                width={192} 
                height={192} 
                data={chartData}
                startAngle={90}
                endAngle={-270}
                innerRadius={70}
                outerRadius={90}
              >
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#4facfe" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar 
                  background={{ fill: 'rgba(255,255,255,0.05)' }} 
                  dataKey="value" 
                  cornerRadius={10}
                  filter="url(#glow)"
                />
              </RadialBarChart>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p 
                    className="text-5xl font-bold"
                    style={{ 
                      fontFamily: 'JetBrains Mono, monospace',
                      color: getScoreColor(data.readiness_score)
                    }}
                  >
                    {data.readiness_score}
                  </p>
                  <p className="text-sm text-[#A1A1AA]">/ 100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 glass-panel rounded-3xl p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/20">
              <Award className="w-6 h-6 text-[#00f2fe]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {data.job_title}
              </h2>
              <p className="text-[#A1A1AA]">Career Readiness Analysis</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-semibold text-white">Your Strengths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((strength, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-sm font-semibold text-white">Quick Wins</h3>
            </div>
            <ul className="space-y-2">
              {data.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="text-sm text-[#A1A1AA] flex items-start gap-2">
                  <span className="text-[#00f2fe] mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Skills to Master
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.missing_skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              data-testid={`skill-card-${index}`}
              className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{skill.skill_name}</h3>
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-mono uppercase tracking-wider"
                    style={{ 
                      backgroundColor: `${getImportanceColor(skill.importance)}20`,
                      color: getImportanceColor(skill.importance),
                      border: `1px solid ${getImportanceColor(skill.importance)}40`
                    }}
                  >
                    {skill.importance}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-[#A1A1AA] mb-6 leading-relaxed">
                {skill.description}
              </p>
              
              <button
                data-testid={`start-simulation-${index}`}
                onClick={() => onStartSimulation(skill)}
                className="
                  w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] 
                  text-black font-semibold rounded-full px-6 py-3 
                  hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] 
                  transition-all duration-300 transform hover:-translate-y-1
                  flex items-center justify-center gap-2
                ">
                Start Challenge
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <button
          data-testid="view-proof-button"
          onClick={onFinish}
          className="
            bg-white/5 border border-white/10 text-white rounded-full 
            px-8 py-3 hover:bg-white/10 transition-colors backdrop-blur-md
          ">
          View My Proof of Skill →
        </button>
      </motion.div>
    </div>
  );
};

export default AnalysisDashboard;
