import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration: number; // in minutes
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60); // in seconds
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        setProgress((newTimeLeft / (duration * 60)) * 100);
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ width: '100%', marginBottom: '20px' }}>
      <div style={{
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '20px',
          backgroundColor: progress > 30 ? '#4CAF50' : '#f44336',
          transition: 'width 1s linear, background-color 0.3s'
        }}></div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '18px' }}>
        Time Remaining: {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default CountdownTimer;
