import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Share2, Twitter, Linkedin, Download, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const ProofOfSkill = ({ score, jobTitle, completedSkills, onRestart }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#FFFFFF']
    });
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const shareText = `I just completed a skills gap analysis for ${jobTitle} and achieved a ${score}% readiness score on SkillSync AI!`;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Your Skill Journey
            <span className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent"> Validated</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#A1A1AA] text-lg"
          >
            Share your proof of skill with potential employers
          </motion.p>
        </div>

        <motion.div
          ref={cardRef}
          data-testid="proof-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="glass-panel rounded-3xl p-12 relative overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe]/20 via-transparent to-[#4facfe]/20 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-[#A1A1AA] mb-1">Career Readiness Certificate</p>
                <h2 
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {jobTitle}
                </h2>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-[#A1A1AA] mb-1">Readiness Score</p>
                <p 
                  className="text-5xl font-bold neon-text"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {score}%
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-[#A1A1AA] mb-3">Skills Assessed:</p>
              <div className="flex flex-wrap gap-2">
                {completedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20 uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] flex items-center justify-center">
                  <span className="text-black font-bold text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Verified by AI</p>
                  <p className="text-xs text-[#A1A1AA]">SkillSync AI · {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-[#A1A1AA]">Certificate ID</p>
                <p className="text-xs font-mono text-white">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-[#00f2fe]/20 to-[#4facfe]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-[#4facfe]/20 to-[#00f2fe]/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <button
            data-testid="share-twitter"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Twitter className="w-4 h-4" />
            Share on Twitter
          </button>
          
          <button
            data-testid="share-linkedin"
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
          </button>
          
          <button
            data-testid="download-certificate"
            onClick={() => alert('Download feature coming soon!')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <button
            data-testid="restart-button"
            onClick={onRestart}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <RotateCcw className="w-4 h-4" />
            Analyze Another Role
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProofOfSkill;
