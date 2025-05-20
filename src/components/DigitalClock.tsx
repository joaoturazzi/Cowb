
import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="text-center mb-6">
      <h1 className="text-5xl font-light tracking-wide">{formattedTime}</h1>
      <p className="text-muted-foreground mt-1">
        {time.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
    </div>
  );
};

export default DigitalClock;
