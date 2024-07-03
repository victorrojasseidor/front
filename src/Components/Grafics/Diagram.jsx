import { useEffect, useRef } from 'react';

const Diagram = () => {
  const commonContainerRef = useRef(null);

  useEffect(() => {
    const lines = document.querySelectorAll('.line');
    const commonContainerRect = commonContainerRef.current.getBoundingClientRect();
    const commonContainerY = commonContainerRect.y + commonContainerRect.height / 2;

    lines.forEach(line => {
      const path = line.querySelector('path');
      path.setAttribute('d', `M50 0 Q 50 ${commonContainerY} 50 ${commonContainerY}`);
    });
  }, []);

  return (
    <div className="diagram">
      <svg className="line" viewBox="0 0 100 200">
        <path d="" fill="transparent" stroke="#3498db" strokeWidth="2"/>
      </svg>
      <svg className="line" viewBox="0 0 100 200">
        <path d="" fill="transparent" stroke="#3498db" strokeWidth="2"/>
      </svg>
      <svg className="line" viewBox="0 0 100 200">
        <path d="" fill="transparent" stroke="#3498db" strokeWidth="2"/>
      </svg>
      <div className="commonContainer" ref={commonContainerRef}></div>
    </div>
  );
};

export default Diagram;
