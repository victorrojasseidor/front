import { DataContextProvider } from '@/Context/DataContext'
import React, { useState } from 'react'
import '../../styles/styles.scss'
import logo from '../../public/img/logoseidor.png'
import imgProfilestart from '../../public/img/profilestart.png'
import en from '../../public/icons/eeuu.svg'
import es from '../../public/icons/spain.svg'
import Image from 'next/image'
// import { FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa'
import Link from 'next/link'
// import Tabs from '../Components/Tabs'
import ImageSvg from '@/helpers/ImageSVG'
import ProgressRegister from '@/Components/progressRegister'
import { useRouter } from 'next/navigation'

export default function Profilestart ({ apiData }) {
  const [isSpanish, setIsSpanish] = useState(false)
  const router = useRouter()

 // Utiliza el estado para almacenar los datos recibidos de la API
 const [dataFromApi, setDataFromApi] = useState(apiData);

 console.log(dataFromApi);
 




  const handleClick = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }


  const handleLogout = () => {
  // Simulación de cierre de sesión.
  // setUser(null);

  // Eliminar la información del usuario del local storage al cerrar sesión.
  localStorage.removeItem('user');
  router.push('/login'); 
};

  return (
    <DataContextProvider>
      <section className='profilestart'>
        <section className='discover'>
          <Image src={logo} width={1000} alt='imgRegister' />
          <h3>Discover a new way to optimize your financial operations.</h3>
          <p> Innovation is the key to efficiency and speed in your financial processes.</p>
          <p> Our robots collaborate to provide you with the best service, so you don't have to worry about a thing.</p>

          <Image src={imgProfilestart} width={280} alt='imgProfilestart' />
        </section>

        <section className='welcome'>
          <nav>
            <ul>
              <li>
                <h1>Welcome to Seidor BPaaS!</h1>
              </li>
              <li>
                <p>BPaaS: Robots and people work better together</p>
              </li>
            </ul>
            <fieldset>
              <div>

                <button onClick={handleClick} className='btn_icons'>
                  <Image src={isSpanish ? es : en} width={30} alt='imglanguage' />
                  {isSpanish ? 'Español' : 'English'} <ImageSvg name='Change' />
                </button>
              </div>
              <button className='btn_icons'  onClick={handleLogout}>
              
                  <ImageSvg name='SignOut' />
               
              </button>
            </fieldset> 
          </nav>
          <section className='formProfile'>
            <div>
              <h2>let's get started</h2>
              <p>Fill in the following fields to complete your profile</p>
            </div>

            <div>
              {/* <Tabs /> */}
              <ProgressRegister/>
            </div>
          </section>
        </section>
      </section>
    </DataContextProvider>
  )
}


export async function getStaticProps() {
  let apiData = {};

  // Verificar si estamos en el navegador (cliente) antes de intentar acceder a localStorage
  if (typeof window !== 'undefined') {
    const localStorageData = localStorage.getItem('user');
    apiData = JSON.parse(localStorageData) || {};
  }

  return {
    props: {
      apiData,
    },
  };
}
