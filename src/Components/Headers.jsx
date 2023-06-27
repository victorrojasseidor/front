import Image from 'next/image'
import IconEN from '../../public/icons/eeuu.svg'
import IconES from '../../public/icons/spain.svg'
import ImageSvg from '@/helpers/ImageSVG'
import React, { useState } from 'react'
import Link from 'next/link'

export default function Headers () {
  const [isSpanish, setIsSpanish] = useState(false)

  const handleClick = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }

  return (
    <nav className='header'>
      <ul>
        <li>
          <button className='btn_icons'>
            <ImageSvg name='Notifications' />
          </button>

        </li>
        <li>

          <button onClick={handleClick} className='btn_icons'>
            <Image src={isSpanish ? IconES : IconEN} width={30} alt='imglanguage' />
            {isSpanish ? 'EN' : 'ES'} <ImageSvg name='Change' />
          </button>

        </li>
        <li>
          <button className='btn_icons'>
            <Link href='/login'>
              <ImageSvg name='SignOut' />
            </Link>
          </button>
        </li>
      </ul>

    </nav>
  )
}
