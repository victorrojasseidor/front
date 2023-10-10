import React from 'react'
import Lang from './Atoms/Lang'
export default function LayoutLogin ({ children }) {
  return (

    <section className='layoutLogin'>
      <div className='container-lang-destok'>
        <Lang />
      </div>
      <div className='layoutLogin_image' />

      <section>
        <div className='container-lang-movil'>
          <Lang />
        </div>
        {children}

      </section>

    </section>

  )
}
