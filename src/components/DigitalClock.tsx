
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { user } = useAuth();
  
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
  
  const formattedDate = time.toLocaleDateString(undefined, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };
  
  // Fix: Access email property from user object safely, fallback to empty string
  const userName = user?.email?.split('@')[0] || '';

  return (
    <div className="text-center md:text-left">
      <h1 className="text-5xl font-light tracking-wide bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {formattedTime}
      </h1>
      <p className="text-muted-foreground mt-1">
        {formattedDate}
      </p>
      {userName && (
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          {getGreeting()}, <span className="text-primary">{userName}</span>
        </p>
      )}
    </div>
  );
};

export default DigitalClock;
