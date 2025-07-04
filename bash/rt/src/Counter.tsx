import React, { useState, useEffect } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setCount(prevCount => prevCount + 1);
      } else if (event.key === 'ArrowDown') {
        setCount(prevCount => prevCount - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '48px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>{count}</div>
      <div style={{
        fontSize: '16px',
        marginTop: '20px',
        color: '#666'
      }}>
        Use ↑ and ↓ arrow keys to change the number
      </div>
    </div>
  );
};

export default Counter; 