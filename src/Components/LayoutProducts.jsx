import { useState, useEffect } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import logo from '../../public/img/logoseidor.png'
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

const LayoutProducts = ({ children, menu }) => {
  const [isMenuLateralOpen, setMenuLateralOpen] = useState(true)
  const [isSpanish, setIsSpanish] = useState(false)
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [margen, setMargen] = useState('0rem')
  const [titlePage, setTitlePage] = useState('')

  const toggleMenu = () => {
    setMenuLateralOpen(!isMenuLateralOpen)
  }

  const { session, setSession, empresa, setEmpresa, modalToken } = useAuth()

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
        setMargen('12.5rem')
      } else {
        setMargen('6rem')
      }
    }

    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)

    return () => {
      window.removeEventListener('resize', checkScreenWidth)
    }
  }, [isMobile, isMenuLateralOpen])

  const handleClickLanguaje = () => {
    setIsSpanish(!isSpanish)
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  }

  const handleLogout = () => {
    console.log('log out')
    setSession(null)
    localStorage.removeItem('session')
    localStorage.removeItem('selectedEmpresa')
    // router.push("/login");
  }

  const router = useRouter()
  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session])

  useEffect(() => {
    if ((menu == 'Product')) {
      setTitlePage('Digital Product')
    } else if ((menu == 'Reporting')) {
      setTitlePage(`Reporting to ${session?.jCompany.razon_social_company}`)
    } else if ((menu == 'Support')) {
      setTitlePage('Support')
    }
  }, [menu])

  return (
    <section className='layoutProducts'>
      <section className={`menu ${isMenuLateralOpen ? ' ' : 'menu-close '}`} style={{ top: isMobile ? '65px' : '0px', marginLeft: isMobile ? '0,5rem' : '0rem', borderRadius: isMobile ? '0 10px 10px 0' : '0px', display: isMobile ? (isOpenMobile ? 'block' : 'none') : 'block' }}>
        <div className='menu_Account'>
          <div className='imgPerfil'>
            <Image src={perfil} width={isMenuLateralOpen ? 100 : 80} alt='Robot' />
            <button onClick={toggleMenu}>
              <ImageSvg name={isMenuLateralOpen ? 'CloseMenu' : 'OpenMenu'} />
            </button>
          </div>

          <h5>
            <div className='box-correo'>
              <p className='company'>{session?.jCompany.razon_social_company}</p>
              <p>{session?.sCorreo}</p>
            </div>
          </h5>

        </div>

        <nav className='menu_nav'>
          <ul>
            <li className={menu === 'Product' ? 'active' : ''}>
              <ImageSvg name='Products' />
              <Link href='/product'>Digital employees</Link>
            </li>

            <li className={menu === 'Reporting' ? 'active' : ''}>
              <ImageSvg name='Dashboard' />
              <Link href='/reporting'>Reporting</Link>
            </li>
            <li style={{ display: 'none' }}>
              <ImageSvg name='APIS' />
              <Link href='/APIS'>APIS</Link>
            </li>

            <li style={{ display: 'none' }}>
              <ImageSvg name='Schedule' />
              <Link href='/Schedule'>Schedule </Link>
            </li>

          </ul>

          <div className='liner' />

          <ul>

            <li className={menu === 'Profile' ? 'active' : ''}>
              <ImageSvg name='Users' />
              <Link href='/profilestart'>Profile</Link>
            </li>

            <li className={menu === 'Support' ? 'active' : ''}>
              <ImageSvg name='Support' />
              <Link href='/Support'>Support </Link>
            </li>

          </ul>

          <div className='menu_logo'>
            <Image src={logo} width={isMenuLateralOpen ? 100 : 80} alt='logo' priority />
          </div>

          <div className='menu_navIcons' style={{ flexDirection: isMenuLateralOpen ? 'row' : 'column' }}>
            <li>

              <Cloud imgButton='Notifications' cloudText='Notifications' />
            </li>

            <li>
              <button onClick={handleClickLanguaje} className='btn_circle '>
                <Image src={isSpanish ? IconES : IconEN} width={isMenuLateralOpen ? '20px' : '10px'} alt='imglanguage' />
                {/* <p>{isSpanish ? 'Es' : 'En'}</p> */}
                {/* <ImageSvg name='Change' /> */}

              </button>

            </li>

            <li>
              <Cloud imgButton='SignOut' cloudText='Sign Out' onClick={handleLogout} />
            </li>

          </div>

        </nav>

      </section>

      <section className='menu_children' style={{ marginLeft: margen }}>
        <div className='childrenTilte'>
          <nav className='menu-header'>
            <ul>
              <li className='hamburgerMenu'>
                <button className='btn_icons hamburger' onClick={toggleMenuMobile}>
                  <ImageSvg name={isOpenMobile ? 'MenuClose' : 'MenuOpen'} />
                </button>
              </li>
            </ul>
          </nav>

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

        </div>

        <section className='children'>{children}</section>
      </section>

      <div>{modalToken && session && <RefreshToken />}</div>
    </section>
  )
}

export default LayoutProducts
