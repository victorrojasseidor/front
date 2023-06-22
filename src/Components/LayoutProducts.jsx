import { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import '../../styles/styles.scss'
import Image from 'next/image'
import robot from '../../public/img/robot.png'

const LayoutProducts = () => {
  // const [isOpen, setIsOpen] = useState(false)

  // // const toggleMenu = () => {
  // //   setIsOpen(!isOpen)
  // // }

  const [selectedOption, setSelectedOption] = useState('')

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value)
  }

  // select

  return (
    <div className='menu'>
      <div className='menu_Account'>
        <ImageSvg name='Robot' />
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

      {/* <button className='menuButton' onClick={toggleMenu}>
        {isOpen ? <IoClose /> : <FiMenu />}
      </button> */}

      <nav>
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
    </div>
  )
}

export default LayoutProducts
