import React from 'react'
import Lang from './Atoms/Lang'
export default function LayoutLogin ({ children }) {
  return (

    <section className='layoutLogin'>

      <div className='layoutLogin_image' />

      <section>

        {children}
        <div className='container-lang'>
          <Lang />
        </div>

      </section>

    </section>

  )
}
