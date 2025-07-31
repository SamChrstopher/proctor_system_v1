import React, { useEffect, useState } from 'react';

interface AlertsProps {
  message: string;
}

const Alerts: React.FC<AlertsProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isVisible) return null;

  const backgroundColor = message.startsWith('✅')
    ? '#ddffdd'
    : message.startsWith('⚠️')
    ? '#fff3cd'
    : '#ffdddd';

  const borderColor = message.startsWith('✅')
    ? '#4CAF50'
    : message.startsWith('⚠️')
    ? '#FFC107'
    : '#f44336';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor,
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        maxWidth: '300px',
        fontSize: '14px',
        animation: 'fadeIn 0.5s',
        borderLeft: `5px solid ${borderColor}`,
      }}
    >
      <p>{message}</p>
    </div>
  );
};

export default Alerts;
