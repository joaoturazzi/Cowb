
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [prevMinute, setPrevMinute] = useState<number>(time.getMinutes());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setPrevMinute(time.getMinutes());
      setTime(newTime);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [time]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const weekday = time.toLocaleDateString(undefined, { weekday: 'long' });
  const day = time.getDate();
  const month = time.toLocaleDateString(undefined, { month: 'long' });
  
  // Check if minute changed for animation
  const minuteChanged = prevMinute !== time.getMinutes();

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className="flex justify-center items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl sm:text-5xl font-light tracking-tight flex">
          <div className="flex">
            <AnimatePresence mode="popLayout">
              {hours.split('').map((digit, i) => (
                <motion.span
                  key={`h-${i}-${digit}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block w-[0.6em] text-center"
                >
                  {digit}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <span className="text-primary/80">:</span>
          <div className="flex">
            <AnimatePresence mode="popLayout">
              {minutes.split('').map((digit, i) => (
                <motion.span
                  key={`m-${i}-${digit}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block w-[0.6em] text-center"
                >
                  {digit}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="flex items-center justify-center text-muted-foreground text-sm mt-1 bg-primary/5 px-3 py-1 rounded-full"
        animate={{ 
          opacity: minuteChanged ? [0.5, 1] : 1,
          scale: minuteChanged ? [0.98, 1] : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <span className="capitalize">{weekday}, </span>
        <span className="ml-1">{day} de {month}</span>
      </motion.div>
    </div>
  );
};

export default DigitalClock;
