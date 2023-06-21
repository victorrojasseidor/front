import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'
import '../../styles/styles.scss'

const LayoutProducts = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='menu'>
      <button className='menuButton' onClick={toggleMenu}>
        {isOpen ? <IoClose /> : <FiMenu />}
      </button>
      <nav className={`'menuItems' ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link href='/'>Products</Link>
          </li>
          <li>
            <Link href='/acerca'>Users</Link>
          </li>
          <li>
            <Link href='/servicios'>Dashboard</Link>
          </li>
          <li>
            <Link href='/contacto'>APIS</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default LayoutProducts
