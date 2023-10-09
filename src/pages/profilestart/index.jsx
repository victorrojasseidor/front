import { DataContextProvider, useAuth } from '@/Context/DataContext'
import React, { useState, useEffect } from 'react'
import logo from '../../../public/img/logoseidor.png'
import imgProfilestart from '../../../public/img/profilestart.png'
import en from '../../../public/icons/eeuu.svg'
import es from '../../../public/icons/spain.svg'
import Image from 'next/image'
import ImageSvg from '@/helpers/ImageSVG'
import ProgressRegister from '@/Components/progressRegister'
import Loading from '@/Components/Atoms/Loading'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cloud from '@/Components/Atoms/Cloud'
import Lang from '@/Components/Atoms/Lang'

export default function Profilestart () {
  const [isSpanish, setIsSpanish] = useState(false)
  const [user, setUser] = useState({})

  const { session, logout } = useAuth()

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem('user'))
    setUser(localStorageData)
  }, [])

  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session])

  const handleClick = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <DataContextProvider>
      <section className='profilestart'>
        <section className='discover' />

        <section className='welcome'>

          <nav>

            <fieldset>
              {/* <div>
                <button onClick={handleClick} className='btn_icons'>
                  <Image src={isSpanish ? es : en} width={30} alt='imglanguage' />
                  {isSpanish ? 'Es' : 'En'} <ImageSvg name='Change' />
                </button>
              </div> */}
              <Image src={logo} width={95} alt='imgRegister' />
              <Cloud imgButton='SignOut' cloudText='Sign Out' onClick={handleLogout} />
              <Lang />

            </fieldset>
            <ul>

              <li>
                <h1>Welcome to ARI Seidor!</h1>
              </li>
              <li>
                <p> Robots and people work better together</p>
              </li>
            </ul>

          </nav>
          <section className='formProfile '>
            <div>
              <h2>let's get started</h2>
              <p>Fill in the following fields to complete your profile</p>
            </div>

            <div>
              <ProgressRegister userData={session} />
            </div>
          </section>
        </section>
      </section>
    </DataContextProvider>
  )
}
