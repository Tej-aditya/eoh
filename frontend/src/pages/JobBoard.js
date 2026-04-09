import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Bookmark } from 'lucide-react';

const JobBoard = () => {
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Full Stack Engineer',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA',
      job_type: 'Full-time',
      salary_range: '$120k - $180k',
      description: 'We are looking for an experienced full stack engineer...',
      requirements: ['React', 'Node.js', 'AWS'],
      posted_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      job_type: 'Contract',
      salary_range: '$80k - $120k',
      description: 'Join our team to build amazing user interfaces...',
      requirements: ['React', 'TypeScript', 'Redux'],
      posted_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Data Scientist',
      company: 'AI Solutions',
      location: 'New York, NY',
      job_type: 'Full-time',
      salary_range: '$130k - $200k',
      description: 'Apply ML/AI to solve business problems...',
      requirements: ['Python', 'TensorFlow', 'SQL'],
      posted_at: new Date().toISOString()
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
            Job Board
          </h1>
          <p className="text-[#A1A1AA]">Opportunities matching your skill level</p>
        </motion.div>

        <div className="space-y-6">
          {mockJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`job-card-${index}`}
              className="glass-panel rounded-2xl p-6 hover:glass-panel-active transition-all"
            >
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
                    {job.salary_range && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary_range}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(job.posted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  data-testid={`save-job-${index}`}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-[#A1A1AA] mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20"
                  >
                    {req}
                  </span>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-semibold rounded-full px-6 py-3 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;