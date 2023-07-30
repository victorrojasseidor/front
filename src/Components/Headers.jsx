import Image from 'next/image'
import IconEN from '../../public/icons/eeuu.svg'
import IconES from '../../public/icons/spain.svg'
import ImageSvg from '@/helpers/ImageSVG'
import React, { useState } from 'react'


export default function Headers () {
  const [isSpanish, setIsSpanish] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleClick = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }

  const handleLogout = () => {
    // setSession(null);
    console.log("log out")
    if(!session){
      // router.push('/login'); 
    }

    

  };

  

  return (
    <nav className='header'>
      <ul>
      <li>
        <button className='btn_icons' onClick={toggleMenu} >
          <ImageSvg name={isOpen ? "MenuClose":"MenuOpen"} />
        </button>
     
        </li>


        <li>
          <button className='btn_icons'>
            <ImageSvg name='Notifications' />
          </button>

        </li>


        <li>

          <button onClick={handleClick} className='btn_icons'>
            <Image src={isSpanish ? IconES : IconEN} width={30} alt='imglanguage' />
            <h5>
              {isSpanish ? 'EN' : 'ES'} 
            </h5>
            
            <ImageSvg name='Change' />
          </button>

        </li>
        <li>
          <button className='btn_icons'  onClick={handleLogout}>
         
              <ImageSvg name='SignOut' />
     
          </button>
        </li>
      </ul>

    </nav>
  )
}
