import { useState } from "react";
import "@/App.css";
import LandingPage from "./components/LandingPage";
import AnalysisDashboard from "./components/AnalysisDashboard";
import SimulationStage from "./components/SimulationStage";
import ProofOfSkill from "./components/ProofOfSkill";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [stage, setStage] = useState("landing"); // landing, analysis, simulation, proof
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.div key="landing" {...pageTransition}>
            <LandingPage 
              onAnalysisComplete={(data) => {
                setAnalysisData(data);
                setFinalScore(data.readiness_score);
                setStage("analysis");
              }}
            />
          </motion.div>
        )}
        
        {stage === "analysis" && analysisData && (
          <motion.div key="analysis" {...pageTransition}>
            <AnalysisDashboard 
              data={analysisData}
              onStartSimulation={(skill) => {
                setSelectedSkill(skill);
                setStage("simulation");
              }}
              onFinish={() => setStage("proof")}
            />
          </motion.div>
        )}
        
        {stage === "simulation" && selectedSkill && (
          <motion.div key="simulation" {...pageTransition}>
            <SimulationStage 
              skill={selectedSkill}
              onComplete={(scoreImprovement) => {
                setFinalScore(prev => Math.min(100, prev + scoreImprovement));
                setStage("analysis");
              }}
              onBack={() => setStage("analysis")}
            />
          </motion.div>
        )}
        
        {stage === "proof" && (
          <motion.div key="proof" {...pageTransition}>
            <ProofOfSkill 
              score={finalScore}
              jobTitle={analysisData?.job_title}
              completedSkills={analysisData?.missing_skills.map(s => s.skill_name) || []}
              onRestart={() => {
                setStage("landing");
                setAnalysisData(null);
                setSelectedSkill(null);
                setFinalScore(0);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;