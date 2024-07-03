import React from 'react'
import Cloud from './Atoms/Cloud'
import Lang from './Atoms/Lang'

export default function NavigationPages ({ title, children }) {
  return (
    <div className='navigation-box'>
      <div className='header-box'>
        <div className='titlePage'>

          <div className='navegation'>
            {children}
          </div>
          <div>
            <h2 className='navegation_title'>
              {title}
            </h2>
          </div>

        </div>

        <div className='languajes-box'>

          <Lang />

        </div>

      </div>

    </div>

  )
}
