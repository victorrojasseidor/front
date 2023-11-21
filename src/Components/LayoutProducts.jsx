import { useState, useEffect } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
// import logo from '../../public/img/logoseidor.png'
import logo from '../../public/img/logoGift.gif'
import ari from '../../public/img/ari.gif'
import carita from '../../public/img/carita.png'
import Image from 'next/image'
import perfil from '../../public/img/perfil.jpg'
import IconEN from '../../public/icons/eeuu.svg'
import IconES from '../../public/icons/spain.svg'
import RefreshToken from './RefresToken'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/Context/DataContext'
import Cloud from './Atoms/Cloud'
import logoOscuro from '../../public/img/logoOscuro.png'
import Lang from './Atoms/Lang'

const LayoutProducts = ({ children, menu }) => {
  const [isMenuLateralOpen, setMenuLateralOpen] = useState(true)
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [margen, setMargen] = useState('0rem')
  const [titlePage, setTitlePage] = useState('')

  const toggleMenu = () => {
    setMenuLateralOpen(!isMenuLateralOpen)
  }

  const { session, modalToken, logout, l } = useAuth()

  const t = l.header

  const toggleMenuMobile = () => {
    setIsOpenMobile(!isOpenMobile)
  }

  // detectar que la pantalla estpa en modo
  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768)
  }

  useEffect(() => {
    if (isMobile) {
      setMargen('0rem')
    } else {
      if (isMenuLateralOpen) {
        setMargen('13rem')
      } else {
        setMargen('5rem')
      }
    }

    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)

    return () => {
      window.removeEventListener('resize', checkScreenWidth)
    }
  }, [isMobile, isMenuLateralOpen])

  const handleLogout = () => {
    logout()
  }

  const router = useRouter()
  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session])

  useEffect(() => {
    if ((menu == 'Product')) {
      setTitlePage(t['Digital employees'])
    } else {
      setTitlePage(t[menu])
    }
  }, [menu])

  return (
    <section className='layoutProducts'>
      <section className={`menu ${isMenuLateralOpen ? ' ' : 'menu-close '}`} style={{ visibility: isMobile ? (isOpenMobile ? 'visible' : 'hidden') : 'visible' }}>
        <div className='menu_Account'>
          <div className='imgPerfil'>
            <div className='imgPerfil_logo'>
              {isMenuLateralOpen
                ? <Image src={logo} width={500} alt='logo' priority />
                : <Image src={ari} width={80} alt='logo' priority />}
            </div>

          </div>

          <div className='box-name'>
            <div className='box-name_person'>

              <ImageSvg name='Person' />

            </div>
            <div className='box-name_name'>
              <p>{session?.sPerfilCode == 'ADMIN' ? session?.sPerfilCode : session?.jCompany.razon_social_company}</p>
              <span>{session?.sCorreo}</span>

            </div>

          </div>

          <div>
            <button className='action-open-close' onClick={toggleMenu}>
              <ImageSvg name={isMenuLateralOpen ? 'CloseMenu' : 'OpenMenu'} />
            </button>
          </div>

        </div>

        <nav className='menu_nav'>

          <ul>
            <li className={menu === 'Product' ? 'active' : ''}>

              <Link href='/product'>
                <ImageSvg name='Products' />
                <h5>
                  {t['Digital employees']}
                </h5>

              </Link>
            </li>

            <li className={menu === 'Reporting' ? 'active' : ''}>

              <Link href='/reporting'>
                <ImageSvg name='Reporting' />
                <h5> {t.Reporting}
                </h5>

              </Link>

            </li>
            <li className={menu === 'chatbot' ? 'active' : ''}>

              <Link href='https://seidor.mensajea.chat/'>
                <ImageSvg name='ChatBot' />
                <h5>
                  Chatbot
                </h5>

              </Link>
            </li>

            <li style={{ display: 'none' }}>

              <Link href='/APIS'>
                <ImageSvg name='APIS' />
                <h5>

                  APIS
                </h5>
              </Link>
            </li>

            <li style={{ display: 'none' }}>
              <Link href='/Schedule'>
                <ImageSvg name='Schedule' />
                <h5>
                  {t.Schedule}
                </h5>
              </Link>
            </li>

          </ul>

          <ul>

            <li className={menu === 'Profile' ? 'active' : ''}>
              <Link href='/profile'>
                <ImageSvg name='Users' />
                <h5>
                  {t.Profile}
                </h5>
              </Link>
            </li>

            <li className={menu === 'Support' ? 'active' : ''}>

              <Link href='/support'>
                <ImageSvg name='Support' /> <h5> {t.Support}
                </h5>
              </Link>
            </li>

          </ul>

        </nav>

        <nav className='menu_nav  menu_profile'>
          <div className='box-name '>
            <div className='box-name_person fondoPerfil'>

              <ImageSvg name='Users' />

            </div>
            <div className='box-name_name fondoPerfil_color'>
              <p>{session?.sUserName}</p>
              <span>{session?.sLastName}</span>

            </div>

          </div>

          <ul>
            <li>
              <button onClick={() => handleLogout()}>
                <ImageSvg name='SignOut' />
                <h5>
                  {t['Sign Out']}
                </h5>
              </button>
            </li>
          </ul>
        </nav>

      </section>

      <section className='menu_children' style={{ marginLeft: margen }}>
        <div className='childrenTilte'>

          <div className='titleMenu'>
            <div>
              <h3>{titlePage}</h3>
            </div>
            <div className='company'>

              {session?.jCompany.razon_social_company}

            </div>

          </div>
          <div className='logo-oscuro'>
            <Image src={logoOscuro} width='100' alt='logoOscuro' priority />

          </div>

          <div className='lang-box'>

            <Lang />

          </div>

          <nav className='menu-header'>
            <ul>
              <li className='hamburgerMenu'>
                <button className='btn_crud' onClick={toggleMenuMobile}>
                  <ImageSvg name={isOpenMobile ? 'MenuClose' : 'MenuOpen'} />
                </button>

              </li>

            </ul>
          </nav>

        </div>

        <section className={`children ${isOpenMobile ? 'children_after' : 'children'}`}>{children}</section>
      </section>

      <div>{modalToken && session && <RefreshToken />}</div>
    </section>
  )
}

export default LayoutProducts
