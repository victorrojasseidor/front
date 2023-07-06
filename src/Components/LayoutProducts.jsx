import { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import '../../styles/styles.scss'
import Headers from './Headers'
import logo from '../../public/img/logoseidor.png'
import Image from 'next/image'
import perfil from '../../public/img/perfil.jpg'

const LayoutProducts = ({ children }) => {
  // abrir y cerrar menu lateral
  const [isMenuOpen, setMenuOpen] = useState(true)

  // console.log('menu', isMenuOpen)

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  const [selectedOption, setSelectedOption] = useState('')

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value)
  }

  // select
  return (
    <section className='layoutProducts'>
      <section className={`menu ${isMenuOpen ? ' ' : 'menu-close '}`}>

        <div className='menu_Account'>
          <div className='imgPerfil'>
             <Image src={perfil} width={100} alt='Robot' />
            <button onClick={toggleMenu}>
              <ImageSvg name={isMenuOpen ? 'CloseMenu' : 'OpenMenu'} />
            </button>
          </div>

          <div className='gradientSelect'>
            <select value={selectedOption} onChange={handleSelectChange}>
              <option value=''>Innovativa S.A.C</option>
              <option value='opcion1'>Opción 1</option>
              <option value='opcion2'>Opción 2</option>
              <option value='opcion3'>Opción 3</option>
            </select>
          </div>

          <h5>SEIDOR PERÚ S.A</h5>
          <button>
            <ImageSvg name='Edit' />
            <h5> Edit profile</h5>
          </button>
        </div>

        <nav className='menu_nav'>
          <ul>
            <li>
              <ImageSvg name='Products' />
              <Link href='/Products'>Products</Link>
            </li>
            <li>
              <ImageSvg name='Users' />
              <Link href='/Users'>Users</Link>
            </li>
            <li>
              <ImageSvg name='Dashboard' />
              <Link href='/Dashboard'>Dashboard</Link>
            </li>
            <li>
              <ImageSvg name='APIS' />
              <Link href='/APIS'>APIS</Link>
            </li>

            <li>
              <ImageSvg name='Schedule' />
              <Link href='/Schedule'>Schedule </Link>
            </li>

            <li>
              <ImageSvg name='Support' />
              <Link href='/Support'>Support </Link>
            </li>
            
 
          
            
          </ul>
        </nav>

        <div className='menu_logo'>
          <Image src={logo} width={isMenuOpen ? 100 : 70} alt='logo' />
        </div>
      </section>

    <section className='menu_children'>
    <div className='Section_Headers'>
     <Headers />

    </div>
    
    <div className='childrenTilte' >
    <h2>Products</h2>
        <p>
          Welcome, <span> Innovativa S.A.C 👋 </span>{" "}
        </p>
    </div>

    {children}
    </section>
     

    </section>
  )
}

export default LayoutProducts
