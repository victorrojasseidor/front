import React from 'react'
import Cloud from './Atoms/Cloud'
import Lang from './Atoms/Lang'

export default function NavigationPages ({ title, children }) {
  return (
    <div className='navigation-box'>
      <div className='header-box'>
        <div className='titlePage'>
          <div>
            <h3>
              {title}
            </h3>
          </div>
          <div className='navegation'>
            {children}
          </div>

        </div>

        <div className='buttons'>

          <Cloud imgButton='Notifications' cloudText='Notifications' />

          <Lang />

        </div>
      </div>

    </div>

  )
}
