import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Link as LinkIcon, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = ({ onAnalysisComplete }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMode, setInputMode] = useState('url');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', acceptedFiles[0]);
          
          const response = await axios.post(`${API}/upload-resume`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          setResumeText(response.data.resume_text);
        } catch (error) {
          console.error('Error uploading resume:', error);
          alert('Failed to upload resume. Please try again.');
        } finally {
          setIsUploading(false);
        }
      }
    }
  });

  const handleScrapeJob = async () => {
    if (!jobUrl.trim()) return;
    
    setIsUploading(true);
    try {
      const response = await axios.post(`${API}/scrape-job`, { url: jobUrl });
      setJobDescription(response.data.description);
      setJobTitle(response.data.job_title);
    } catch (error) {
      console.error('Error scraping job:', error);
      alert('Failed to scrape job description. Try pasting the text directly.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await axios.post(`${API}/analyze-gap`, {
        resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle || null
      });
      
      onAnalysisComplete(response.data);
    } catch (error) {
      console.error('Error analyzing gap:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#00f2fe]" />
            <span className="text-sm font-mono text-[#A1A1AA]">Powered by Claude AI</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}
          >
            Bridge the
            <span className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent"> Skills Gap</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume, paste a job description, and discover exactly what skills you need to become industry-ready.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-3xl p-8 md:p-12 space-y-8"
        >
          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              Your Resume (PDF)
            </label>
            <div
              {...getRootProps()}
              data-testid="resume-upload-zone"
              className={`
                border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                backdrop-blur-md bg-black/50
                ${ isDragActive || resumeText 
                  ? 'border-[#00f2fe]/50 bg-[#00f2fe]/5' 
                  : 'border-white/10 hover:border-white/20'
                }
                transition-all duration-300
              `}
            >
              <input {...getInputProps()} />
              <Upload className={`w-10 h-10 mx-auto mb-3 ${ resumeText ? 'text-[#00f2fe]' : 'text-[#A1A1AA]' }`} />
              <p className="text-white font-medium mb-1">
                {isUploading ? 'Processing...' : resumeText ? '✓ Resume uploaded' : 'Drop your resume here'}
              </p>
              <p className="text-sm text-[#A1A1AA]">or click to browse (PDF only)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              Job Description
            </label>
            
            <div className="flex gap-2 mb-4">
              <button
                data-testid="toggle-url-mode"
                onClick={() => setInputMode('url')}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${inputMode === 'url' 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-[#A1A1AA] hover:text-white'
                  }
                `}
              >
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Paste URL
              </button>
              <button
                data-testid="toggle-text-mode"
                onClick={() => setInputMode('text')}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${inputMode === 'text' 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-[#A1A1AA] hover:text-white'
                  }
                `}
              >
                Paste Text
              </button>
            </div>

            {inputMode === 'url' ? (
              <div className="flex gap-3">
                <input
                  type="url"
                  data-testid="job-url-input"
                  placeholder="https://linkedin.com/jobs/..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all backdrop-blur-md"
                />
                <button
                  data-testid="scrape-job-button"
                  onClick={handleScrapeJob}
                  disabled={isUploading || !jobUrl.trim()}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Fetch
                </button>
              </div>
            ) : (
              <textarea
                data-testid="job-description-textarea"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all backdrop-blur-md resize-none"
              />
            )}

            {jobDescription && (
              <p className="text-sm text-[#10B981] mt-2">✓ Job description ready</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              Job Title (Optional)
            </label>
            <input
              type="text"
              data-testid="job-title-input"
              placeholder="e.g., Senior Data Scientist"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all backdrop-blur-md"
            />
          </div>

          <button
            data-testid="analyze-gap-button"
            onClick={handleAnalyze}
            disabled={!resumeText || !jobDescription || isAnalyzing}
            className="
              w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] 
              text-black font-semibold rounded-full px-8 py-4 
              hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] 
              transition-all duration-300 transform hover:-translate-y-1
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center justify-center gap-2
            ">
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                Analyze Skills Gap
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;