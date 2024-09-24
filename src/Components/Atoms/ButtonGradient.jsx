
import React from 'react'

export default function ButtonGradient( { children, classButt, ...props }) {
  return (
    <div className="box-container-gradient">
        
        <button className= {`gradientButton ${classButt}`}> {children}</button>
      </div>
  )
}
