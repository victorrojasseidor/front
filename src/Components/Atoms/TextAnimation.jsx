import React, { useState, useEffect } from 'react';

const TextAnimation = () => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const text = 'Better, faster, and more enduring results';
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLetters((prev) => prev + 1);
      if (visibleLetters === text.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [visibleLetters]);

  return (
    <div className="textAnimation">
      <h1 className="text">
        Digital Employees <span> </span>
        <span className="typing">{text.split('').slice(0, visibleLetters).join('')}s</span>
      </h1>
    </div>
  );
};

export default TextAnimation;
