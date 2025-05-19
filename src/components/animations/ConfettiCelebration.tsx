
import React, { useState, useEffect } from 'react';
import './confetti.css';

interface ConfettiCelebrationProps {
  show: boolean;
  milestone?: number;
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ show, milestone }) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    size: number;
  }>>([]);

  useEffect(() => {
    if (!show) return;
    
    // Create confetti pieces
    const pieces = [];
    const colors = ['#FFC700', '#FF0099', '#00C3FF', '#53D75F', '#FF7C65'];
    const pieceCount = milestone ? Math.min(milestone, 100) : 50;
    
    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // position as percentage of viewport
        y: -20 - Math.random() * 30, // start above viewport
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: 5 + Math.random() * 10
      });
    }
    
    setConfettiPieces(pieces);
    
    // Clear confetti after animation
    const timer = setTimeout(() => {
      setConfettiPieces([]);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [show, milestone]);

  if (!show || confettiPieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size * 0.5}px`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiCelebration;
