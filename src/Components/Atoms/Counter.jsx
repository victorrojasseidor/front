import React, { useState, useEffect } from 'react';

function Counter({ initialValue, finalValue }) {
  const [count, setCount] = useState(initialValue);
  
  useEffect(() => {
    const increment = () => {
      setCount(prevCount => {
        if (prevCount < finalValue) {
          return prevCount + 1;
        } else {
          return prevCount;
        }
      });
    };

    const interval = setInterval(increment, 100); // Cambia la velocidad de conteo según sea necesario

    return () => clearInterval(interval);
  }, [finalValue]);

  return <div>{count}</div>;
}

export default Counter;