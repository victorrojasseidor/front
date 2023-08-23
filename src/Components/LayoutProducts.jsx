import { useState, useEffect } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
// import "../../styles/_styles.scss";
import logo from '../../public/img/logoseidor.png'
import carita from '../../public/img/carita.png'
import Image from 'next/image'
import perfil from '../../public/img/perfil.jpg'
import IconEN from '../../public/icons/eeuu.svg'
import IconES from '../../public/icons/spain.svg'
import RefreshToken from './RefresToken'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/Context/DataContext'

const LayoutProducts = ({ children }) => {
  const [isMenuLateralOpen, setMenuLateralOpen] = useState(true)
  const [isSpanish, setIsSpanish] = useState(false)
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [margen, setMargen] = useState('0rem')

  const toggleMenu = () => {
    setMenuLateralOpen(!isMenuLateralOpen)
  }

  const { session, setSession, empresa, setEmpresa, modalToken } = useAuth()

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    const DataEmpresa = session.oEmpresa.find((empres) => empres.razon_social_empresa === selectedValue)

    if (DataEmpresa) {
      const selectedEmpresa = {
        id_empresa: DataEmpresa.id_empresa,
        razon_social_empresa: DataEmpresa.razon_social_empresa,
        ruc_empresa: DataEmpresa.ruc_empresa
      }
      localStorage.removeItem('selectedEmpresa')
      // Guardar la empresa seleccionada en el localStorage
      localStorage.setItem('selectedEmpresa', JSON.stringify(selectedEmpresa))

      // Actualizar el estado de la empresa
      setEmpresa(selectedEmpresa)

      // Realizar la redirección
      router.push('/product')
    }
  }

  const savedEmpresaJSON = localStorage.getItem('selectedEmpresa')

  useEffect(() => {
    if (savedEmpresaJSON) {
      try {
        const savedEmpresa = JSON.parse(savedEmpresaJSON)
        console.log('savedEmpresa', savedEmpresa)
        setEmpresa(savedEmpresa)
      } catch (error) {
        console.error('Error parsing savedEmpresa JSON:', error)
      }
    } else if (!empresa && session?.oEmpresa.length > 0) {
      setEmpresa(session.oEmpresa[0])
    }
  }, [])

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

  return (
    <section className='layoutProducts'>
      <section className={`menu ${isMenuLateralOpen ? ' ' : 'menu-close '}`} style={{ top: isMobile ? '43px' : '0px', marginLeft: isMobile ? '0,5rem' : '0rem', borderRadius: isMobile ? '0 10px 10px 0' : '0px', display: isMobile ? (isOpenMobile ? 'block' : 'none') : 'block' }}>
        <div className='menu_Account'>
          <div className='imgPerfil'>
            <Image src={perfil} width={100} alt='Robot' />
            <button onClick={toggleMenu}>
              <ImageSvg name={isMenuLateralOpen ? 'CloseMenu' : 'OpenMenu'} />
            </button>
          </div>
          {/* <p className='username'>
              {session?.sUserName}
              </p> */}

          <h5>
            <div className='box-correo'>
              <p className='company'>{session?.jCompany.razon_social_company}</p>
              <p>{session?.sCorreo}</p>
            </div>

          </h5>
          {/* <button>
            <ImageSvg name='Edit' />
            <h5> Edit profile</h5>
          </button> */}
        </div>

        <nav className='menu_nav'>
          <ul>
            <li className='active'>
              <ImageSvg name='Products' />
              <Link href='/product'>Digital employees</Link>
            </li>
            <li>
              <ImageSvg name='Users' />
              <Link href='/profilestart'>Profile</Link>
            </li>
            <li>
              <ImageSvg name='Dashboard' />
              <Link href='/Reporting'>Reporting</Link>
            </li>
            <li style={{ display: 'none' }}>
              <ImageSvg name='APIS' />
              <Link href='/APIS'>APIS</Link>
            </li>

            <li style={{ display: 'none' }}>
              <ImageSvg name='Schedule' />
              <Link href='/Schedule'>Schedule </Link>
            </li>

            <li>
              <ImageSvg name='Support' />
              <Link href='/Support'>Support </Link>
            </li>
          </ul>

          <div className='menu_navIcons'>
            <li>
              <button className='btn_icons'>
                <ImageSvg name='Notifications' />
              </button>
            </li>

            <li>
              <button onClick={handleClickLanguaje} className='btn_icons languaje'>
                <Image src={isSpanish ? IconES : IconEN} width={30} alt='imglanguage' />
                <h5>{isSpanish ? 'EN' : 'ES'}</h5>
                {/* <ImageSvg name='Change' /> */}
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className='btn_icons'>
                <ImageSvg name='SignOut' />
              </button>
            </li>
          </div>

        </nav>

        <div className='menu_logo'>
          <Image src={logo} width={isMenuLateralOpen ? 100 : 80} alt='logo' priority />
        </div>
      </section>

      <section className='menu_children' style={{ marginLeft: margen }}>

        <div className='childrenTilte'>
          <nav className='menu-header'>
            <ul>
              <li className='hamburgerMenu'>
                <button className='btn_icons hamburger' onClick={toggleMenuMobile}>
                  <ImageSvg name={isOpenMobile ? 'MenuClose' : 'MenuOpen'} />
                </button>

                {/* <button className='btn_icons' onClick={toggleMenuMobile} >
          <ImageSvg name={isMenuOpen? "MenuOpen":"MenuClose"} />
        </button> */}
              </li>
              {/* <li>
              <button className='btn_icons'>
                <ImageSvg name='Notifications' />
              </button>
            </li>

            <li>
              <button onClick={handleClickLanguaje} className='btn_icons'>
                <Image src={isSpanish ? IconES : IconEN} width={30} alt='imglanguage' />
                <h5>{isSpanish ? 'EN' : 'ES'}</h5>
                <ImageSvg name='Change' />
              </button>
            </li>
            <li>
              <button className='btn_icons' onClick={handleLogout}>
                <ImageSvg name='SignOut' />
              </button>
            </li> */}
            </ul>
          </nav>
          <div className='title'>
            <h3>Digital employees</h3>

          </div>

          <div className='perfil-select'>
            <p>
              Welcome, 👋

              <Image src={carita} width={20} alt='carita' />

            </p>
            <select value={empresa?.razon_social_empresa || ''} onChange={handleSelectChange}>
              {/* <option value="">Seleccione una empresa</option> */}
              {session?.oEmpresa.map((empres) => (
                <option key={empres.id_empresa} value={empres.razon_social_empresa}>
                  {empres.razon_social_empresa}
                </option>
              ))}
            </select>

          </div>

        </div>

        <section className='children'>
          {children}

        </section>

      </section>

      <div>{modalToken && session && <RefreshToken />}</div>
    </section>
  )
}

export default LayoutProducts
