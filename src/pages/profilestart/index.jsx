import { DataContextProvider } from '@/Context/DataContext'
import React, { useState,useEffect } from 'react'
import '../../../styles/styles.scss'
import logo from '../../../public/img/logoseidor.png'
import imgProfilestart from '../../../public/img/profilestart.png'
import en from '../../../public/icons/eeuu.svg'
import es from '../../../public/icons/spain.svg'
import Image from 'next/image'
import ImageSvg from '@/helpers/ImageSVG'
import ProgressRegister from '@/Components/progressRegister'
import { useRouter } from 'next/navigation'
import Loading from '@/Components/Atoms/Loading'

export default function Profilestart ( ) {
  const [isSpanish, setIsSpanish] = useState(false)
  const [user, setUser] = useState({ });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  

 // Utiliza el estado para almacenar los datos recibidos de la API


 


//  useEffect(() => {
   
    
   
  


//   }, [ ]);

  

  setTimeout(() => {
    const localStorageData = JSON.parse(localStorage.getItem('user'));
    setUser(localStorageData);
    if(localStorageData){
        setIsLoading(false);
    }
  }, 1000);

 console.log("usuarioenlocalprofile",user);

  const handleLogout = () => {
  // Simulación de cierre de sesión.
  // setUser(null);

  // Eliminar la información del usuario del local storage al cerrar sesión.
  localStorage.removeItem('user');
  router.push('/login'); 
};

const handleClick = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }

  if (isLoading) {
    return (
      <Loading/>
    );
  }


  return (
    <DataContextProvider>
      <section className='profilestart'>
        <section className='discover'>
          <Image src={logo} width={1000} alt='imgRegister' />
          <div className='box-descriptions'>
          <h3>Discover a new way to optimize your financial operations.</h3>
          <div> 
            Innovation is the key to efficiency and speed in your financial processes.
          Our robots collaborate to provide you with the best service, so you don't have to worry about a thing.</div>

          </div>
         
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
              <ProgressRegister userData={user}/>
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
