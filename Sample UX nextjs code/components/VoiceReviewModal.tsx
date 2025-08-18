import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface VoiceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReviewState = 'question' | 'recording' | 'processing' | 'feedback';

export function VoiceReviewModal({ isOpen, onClose }: VoiceReviewModalProps) {
  const [currentState, setCurrentState] = useState<ReviewState>('question');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 12;
  
  // Mock questions data
  const questions = [
    {
      question: "What is the primary function of photosynthesis in plants?",
      context: "Biology - Plant Processes",
      feedback: "Good answer! You correctly identified that photosynthesis converts light energy into chemical energy (glucose). You also mentioned the role of chlorophyll and the production of oxygen as a byproduct, which shows a solid understanding of the process.",
      score: "Good (3)"
    },
    {
      question: "¿Cómo se dice 'Where is the bathroom?' en español?",
      context: "Spanish - Travel Phrases",
      feedback: "Perfect! '¿Dónde está el baño?' is exactly right. Your pronunciation was clear and you remembered the correct question structure with '¿Dónde está...?'",
      score: "Perfect (4)"
    },
    {
      question: "What is quantum entanglement?",
      context: "Physics - Quantum Mechanics",
      feedback: "Your explanation captured the key concept that entangled particles remain connected regardless of distance. You could improve by mentioning that measuring one particle instantly affects its partner.",
      score: "Okay (2)"
    }
  ];

  const currentQuestionData = questions[(currentQuestion - 1) % questions.length];

  const handleMicrophoneClick = () => {
    setCurrentState('recording');
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setCurrentState('processing');
      // Simulate processing for 2 seconds
      setTimeout(() => {
        setCurrentState('feedback');
      }, 2000);
    }, 3000);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentState('question');
    } else {
      // Show completion summary
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentState('question');
    setCurrentQuestion(1);
    onClose();
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentState('question');
      setCurrentQuestion(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-surface rounded-2xl shadow-custom w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-custom">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary">
              Question {currentQuestion}/{totalQuestions}
            </div>
            <button
              onClick={handleClose}
              className="text-secondary hover:text-primary-custom text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="w-full bg-border rounded-full h-2 mt-3">
            <motion.div 
              className="bg-primary-custom h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentState === 'question' && (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="mb-2">
                  <span className="text-xs bg-gray-100 text-secondary px-2 py-1 rounded-full">
                    {currentQuestionData.context}
                  </span>
                </div>
                <h2 className="mb-8 leading-relaxed px-2">{currentQuestionData.question}</h2>
                
                <motion.button
                  onClick={handleMicrophoneClick}
                  className="w-20 h-20 bg-primary-custom hover:bg-primary-custom/90 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-200 mx-auto mb-4 touch-manipulation shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎤
                </motion.button>
                
                <p className="text-sm text-secondary">
                  Tap the microphone to record your answer
                </p>
              </motion.div>
            )}

            {currentState === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="mb-2">
                  <span className="text-xs bg-gray-100 text-secondary px-2 py-1 rounded-full">
                    {currentQuestionData.context}
                  </span>
                </div>
                <h2 className="mb-8 leading-relaxed px-2">{currentQuestionData.question}</h2>
                
                <motion.button
                  onClick={() => setCurrentState('processing')}
                  className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-200 mx-auto mb-4 touch-manipulation shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔴
                </motion.button>
                
                <div className="flex justify-center items-center space-x-1 mb-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-red-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
                
                <p className="text-sm text-secondary">
                  Recording... Tap to stop
                </p>
              </motion.div>
            )}

            {currentState === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <h2 className="mb-8">Processing your answer...</h2>
                
                <div className="flex justify-center items-center space-x-2 mb-8">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-primary-custom rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                
                <p className="text-sm text-secondary">
                  Analyzing your response and generating feedback...
                </p>
              </motion.div>
            )}

            {currentState === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
                    className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4"
                  >
                    <span>✓</span>
                    <span>{currentQuestionData.score}</span>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 p-4 rounded-xl mb-6"
                >
                  <p className="text-sm leading-relaxed">{currentQuestionData.feedback}</p>
                </motion.div>
                
                <Button
                  onClick={handleNext}
                  className="w-full bg-primary-custom hover:bg-primary-custom/90 text-white h-12"
                >
                  {currentQuestion < totalQuestions ? (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Next Question</span>
                      <span>→</span>
                    </span>
                  ) : (
                    'Finish Review'
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}