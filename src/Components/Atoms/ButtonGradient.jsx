import React from 'react';

export default function ButtonGradient({ children, classButt, type ,disabled, onClick, ...props}) {
  return (
    <div className="box-container-gradient">
      <button className={`gradientButton ${classButt}`} onClick={onClick} {...props} type={type} disabled={disabled}>
        {children}
      </button>
    </div>
  );
}
