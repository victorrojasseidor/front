import React from 'react'
import Lang from './Atoms/Lang'
import Image from 'next/image'
import logoOscuro from '../../public/img/logoOscuro.png'
import TextAnimation from './Atoms/TextAnimation'

export default function LayoutLogin ({ children }) {
  return (

    <section className='layoutLogin'>

      <div className='layoutLogin_image'>

        <Image src={logoOscuro} width={200} alt='logo' priority />
        {/* <TextAnimation /> */}

      </div>

      <section className='layoutLogin_form'>
        {/* <div className='container-lang-movil'>

          <Lang />
        </div> */}
        <div className='layout-children'>
          {children}
        </div>

      </section>

    </section>

  )
}
