import Image from 'next/image'

// icons react icons
import { FiMenu,FiChevronsRight,FiChevronsLeft } from 'react-icons/fi'
import { IoClose, IoNotificationsOutline } from 'react-icons/io5'
import { HiOutlineUsers } from 'react-icons/hi'
import { MdOutlineDashboard, MdModeEditOutline } from 'react-icons/md'
import { GiProcessor } from 'react-icons/gi'
import { AiOutlineInbox, AiOutlineSchedule } from 'react-icons/ai'
import { FaExchangeAlt, FaSignOutAlt, FaEye, FaEyeSlash,FaSearch } from 'react-icons/fa'
import { BiSupport } from 'react-icons/bi'
import { CgTimer } from 'react-icons/cg';



// icons of bpass

import Iconspain from '../../public/icons/spain.svg'
import Iconeeuu from '../../public/icons/eeuu.svg'
// import Iconrobot from '../../public/img/robot.PNG'


const ImageSvg = ({ name }) => {
  const icons = {
    // crud
    Edit: <MdModeEditOutline />,
    Menu: <FiMenu />,
    Close: <IoClose />,
    Notifications: <IoNotificationsOutline />,

    Change: <FaExchangeAlt />,
    SignOut: <FaSignOutAlt />,
    ShowPassword: <FaEye />,
    ClosePassword: <FaEyeSlash />,
    Search: <FaSearch />,
    Time: <CgTimer/>,

    // menú icons
    Products: <AiOutlineInbox />,
    Users: <HiOutlineUsers />,
    Dashboard: <MdOutlineDashboard />,
    APIS: <GiProcessor />,
    Schedule: <AiOutlineSchedule />,
    Support: <BiSupport />,
    OpenMenu: <FiChevronsRight />,
    CloseMenu: <FiChevronsLeft />,

    // imgs svg
    Spain: <Image src={Iconspain} width={100} alt='Spain' />,
    EEUU: <Image src={Iconeeuu} width={100} alt='Spain' />,
    // Robot: <Image src={Iconrobot} width={100} alt='Robot' />
  }

  return icons[name] ? icons[name] : 'x'
}

export default ImageSvg
