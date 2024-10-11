import React from 'react';

export default function ButtonGradient({ children, classButt, onClick, ...props }) {
  return (
    <div className="box-container-gradient">
      <button className={`gradientButton ${classButt}`} onClick={onClick} {...props}>
        {children}
      </button>
    </div>
  );
}
