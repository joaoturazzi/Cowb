
import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompletionMessageProps {
  isComplete: boolean;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({ isComplete }) => {
  if (!isComplete) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 flex items-center justify-center gap-1 bg-primary/10 p-2 rounded-lg z-10 relative"
    >
      <Award className="h-3 w-3 text-primary" />
      <span className="text-xs text-primary font-medium">Todos os hábitos concluídos!</span>
    </motion.div>
  );
};

export default CompletionMessage;
