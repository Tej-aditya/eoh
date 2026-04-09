import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SimulationStage = ({ skill, onComplete, onBack }) => {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadSimulation();
  }, []);

  const loadSimulation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/simulation/generate`, skill);
      setTask(response.data);
      
      if (response.data.task_type === 'code' && response.data.initial_code) {
        setUserAnswer(response.data.initial_code);
      }
    } catch (error) {
      console.error('Error loading simulation:', error);
      alert('Failed to load simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const answer = task.task_type === 'logic' ? selectedOption : userAnswer;
    
    if (!answer.trim()) {
      alert('Please provide an answer before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/simulation/validate`, {
        task_id: task.id,
        user_answer: answer
      });
      
      setResult(response.data);
      
      setTimeout(() => {
        onComplete(response.data.score_improvement);
      }, 3000);
    } catch (error) {
      console.error('Error submitting simulation:', error);
      alert('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A1A1AA]">Generating your challenge...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-12 max-w-2xl text-center"
        >
          {result.is_correct ? (
            <CheckCircle className="w-20 h-20 text-[#10B981] mx-auto mb-6" />
          ) : (
            <XCircle className="w-20 h-20 text-[#F59E0B] mx-auto mb-6" />
          )}
          
          <h2 
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {result.is_correct ? 'Great Work!' : 'Good Attempt!'}
          </h2>
          
          <p className="text-[#A1A1AA] mb-4 leading-relaxed">
            {result.feedback}
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20">
            <span className="text-[#00f2fe] font-mono font-bold">
              +{result.score_improvement} points
            </span>
          </div>
          
          <p className="text-sm text-[#A1A1AA] mt-6">Returning to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        data-testid="back-button"
        onClick={onBack}
        className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Analysis
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl p-8"
        >
          <div className="mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20 uppercase tracking-wider">
              {skill.skill_name}
            </span>
          </div>
          
          <h1 
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {task.title}
          </h1>
          
          <p className="text-[#A1A1AA] mb-6 leading-relaxed">
            {task.description}
          </p>
          
          <div className="bg-black/50 rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-semibold mb-2 text-white">Instructions:</h3>
            <p className="text-sm text-[#A1A1AA] whitespace-pre-wrap">
              {task.instructions}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your Solution
          </h2>
          
          {task.task_type === 'code' ? (
            <div className="border border-white/10 rounded-xl overflow-hidden mb-6">
              <Editor
                height="400px"
                defaultLanguage="python"
                theme="vs-dark"
                value={userAnswer}
                onChange={(value) => setUserAnswer(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {task.options?.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                return (
                  <button
                    key={index}
                    data-testid={`option-${letter}`}
                    onClick={() => setSelectedOption(letter)}
                    className={`
                      w-full text-left p-4 rounded-xl border transition-all
                      ${selectedOption === letter
                        ? 'border-[#00f2fe] bg-[#00f2fe]/10'
                        : 'border-white/10 bg-black/30 hover:border-white/20'
                      }
                    `}
                  >
                    <span className="font-mono text-[#00f2fe] mr-3">{letter}.</span>
                    <span className="text-white">{option}</span>
                  </button>
                );
              })}
            </div>
          )}
          
          <button
            data-testid="submit-solution-button"
            onClick={handleSubmit}
            disabled={isSubmitting || (task.task_type === 'logic' && !selectedOption)}
            className="
              w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] 
              text-black font-semibold rounded-full px-8 py-4 
              hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] 
              transition-all duration-300 transform hover:-translate-y-1
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center justify-center gap-2
            ">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Submit Solution
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SimulationStage;
