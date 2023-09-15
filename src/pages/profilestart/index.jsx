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

export default function Profilestart () {
  const [isSpanish, setIsSpanish] = useState(false)
  const [user, setUser] = useState({})

  const { session, logout } = useAuth()
  console.log('😍profilestar', session)

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
    console.log('logout')
    logout()
  }

  return (
    <DataContextProvider>
      <section className='profilestart'>
        <section className='discover'>
          <Image src={logo} width={1000} alt='imgRegister' />
          <div className='box-descriptions'>
            <h3>Discover a new way to optimize your financial operations.</h3>
            <div>Innovation is the key to efficiency and speed in your financial processes. Our robots collaborate to provide you with the best service, so you don't have to worry about a thing.</div>
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
                  {isSpanish ? 'Es' : 'En'} <ImageSvg name='Change' />
                </button>
              </div>
              <button className='btn_icons' onClick={handleLogout}>
                <ImageSvg name='SignOut' />
              </button>
              {session &&
                <Link href='/product'>
                  <button className='btn_icons'>
                    <ImageSvg name='Products' />
                  </button>
                </Link>}

            </fieldset>
          </nav>
          <section className='formProfile'>
            <div>
              <h3>let's get started</h3>
              <p>Fill in the following fields to complete your profile</p>
            </div>

            <div>
              {/* <Tabs /> */}
              <ProgressRegister userData={session} />
            </div>
          </section>
        </section>
      </section>
    </DataContextProvider>
  )
}
