import { motion } from 'framer-motion';
import { Users, Star, MessageSquare, Send } from 'lucide-react';

const Mentorship = () => {
  const mockMentors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      expertise: ['React', 'Node.js', 'System Design'],
      experience_years: 8,
      bio: 'Senior Engineer at Google. Passionate about helping developers grow.',
      rating: 4.9,
      sessions_completed: 45,
      picture: 'https://via.placeholder.com/100'
    },
    {
      id: '2',
      name: 'Michael Chen',
      expertise: ['Python', 'Machine Learning', 'AWS'],
      experience_years: 10,
      bio: 'ML Engineer specializing in production systems.',
      rating: 4.8,
      sessions_completed: 38,
      picture: 'https://via.placeholder.com/100'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      expertise: ['TypeScript', 'GraphQL', 'Microservices'],
      experience_years: 6,
      bio: 'Tech Lead with a passion for mentoring junior developers.',
      rating: 5.0,
      sessions_completed: 52,
      picture: 'https://via.placeholder.com/100'
    }
  ];

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
            Find a Mentor
          </h1>
          <p className="text-[#A1A1AA]">Connect with industry experts</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`mentor-card-${index}`}
              className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={mentor.picture}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full border-2 border-[#00f2fe]/20"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
                  <p className="text-sm text-[#A1A1AA]">
                    {mentor.experience_years} years experience
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-sm font-mono">{mentor.rating}</span>
                    <span className="text-xs text-[#A1A1AA] ml-1">
                      ({mentor.sessions_completed} sessions)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#A1A1AA] mb-4">{mentor.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.expertise.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                data-testid={`request-mentor-${index}`}
                className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-3 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Request Session
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mentorship;