import React, { useState } from 'react'
import IconEN from '../../public/icons/eeuu.svg'
import IconES from '../../public/icons/spain.svg'
import Image from 'next/image'
import ImageSvg from '@/helpers/ImageSVG'
import { useAuth } from '@/Context/DataContext'
import Cloud from './Atoms/Cloud'
import Link from 'next/link'

export default function NavigationPages ({ title, children }) {
  const [isSpanish, setIsSpanish] = useState(false)
  const { session, setSession, empresa, setEmpresa, modalToken } = useAuth()

  const handleClickLanguaje = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }

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

          <button onClick={handleClickLanguaje} className='btn_circle '>
            <Image src={isSpanish ? IconES : IconEN} width='20px' alt='imglanguage' />
            {/* <p>{isSpanish ? 'Es' : 'En'}</p> */}
            {/* <ImageSvg name='Change' /> */}

          </button>

        </div>
      </div>

    </div>

  )
}
