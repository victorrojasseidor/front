import Image from 'next/image'

// icons react icons
import { FiMenu, FiChevronsRight, FiChevronsLeft } from 'react-icons/fi'
import { IoClose, IoNotificationsOutline, IoRefreshCircle } from 'react-icons/io5'
import { HiOutlineUsers } from 'react-icons/hi'
import { MdOutlineDashboard } from 'react-icons/md'
import { GiProcessor } from 'react-icons/gi'
import { AiOutlineInbox, AiOutlineSchedule } from 'react-icons/ai'
import { FaExchangeAlt, FaSignOutAlt, FaEye, FaEyeSlash, FaSearch, FaWeixin } from 'react-icons/fa'
import { BiSupport, BiBot } from 'react-icons/bi'
import { CgTimer } from 'react-icons/cg'
import { IoMdCloseCircle, IoIosArrowForward } from 'react-icons/io'
import { FcMultipleInputs, FcDebt, FcLock, FcAcceptDatabase } from 'react-icons/fc'
import { BsCheckCircle, BsDownload, BsSortNumericUpAlt, BsSortNumericDown, BsSortAlphaDownAlt, BsSortAlphaDown, BsCheckCircleFill, BsFillQuestionCircleFill } from 'react-icons/bs'
import { RiMenu3Line, RiCloseLine, RiRobot2Fill } from 'react-icons/ri'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import { GrFormPrevious, GrFormNext, GrConfigure } from 'react-icons/gr'

// icons of bpass

import Iconspain from '../../public/icons/spain.svg'
import Iconeeuu from '../../public/icons/eeuu.svg'
import IconoChatbot from '../../public/img/chatbot.svg'
import editSVG from '../../public/img/edit.svg'
import deleteSVG from '../../public/img/delete.svg'
// import Iconrobot from '../../public/img/robot.PNG'

const ImageSvg = ({ name }) => {
  const gradientStyle = {

    color: '#3c2cd1',
    // Hace que el texto sea transparente
    fontSize: '40px' // Tamaño del icono
  }

  const icons = {
    // crud
    // Edit: <TiPencil />,
    Edit: <Image src={editSVG} width={80} alt='Spain' />,
    Menu: <FiMenu />,
    Close: <IoClose />,
    Notifications: <IoNotificationsOutline />,
    Check: <BsCheckCircle />,
    Change: <FaExchangeAlt />,
    SignOut: <FaSignOutAlt />,
    ShowPassword: <FaEye />,
    ClosePassword: <FaEyeSlash />,
    Search: <FaSearch />,
    Time: <CgTimer />,
    Back: <GrFormPrevious />,
    Next: <GrFormNext />,
    Delete: <Image src={deleteSVG} width={80} alt='Spain' />,
    Refresh: <IoRefreshCircle />,
    Question: <BsFillQuestionCircleFill />,
    // Delete: <FiTrash2 />,
    Download: <BsDownload />,
    Admin: <GrConfigure />,
    OrderDown: <BsSortNumericDown />,
    OrderUP: <BsSortNumericUpAlt />,
    OrderZA: <BsSortAlphaDownAlt />,
    OrderAZ: <BsSortAlphaDown />,

    // menú icons
    MenuOpen: <RiMenu3Line />,
    MenuClose: <RiCloseLine />,
    Products: <BiBot />,
    Users: <HiOutlineUsers />,
    Dashboard: <MdOutlineDashboard />,
    APIS: <GiProcessor />,
    Schedule: <AiOutlineSchedule />,
    ChatBot: <FaWeixin size={30} />,
    Support: <BiSupport />,
    OpenMenu: <FiChevronsRight />,
    CloseMenu: <FiChevronsLeft />,
    ErrorMessage: <IoMdCloseCircle size={48} color='red' />,
    Navegación: <IoIosArrowForward />,

    // icons crurrency
    Benefit1: <FcMultipleInputs />,
    Benefit2: <FcDebt />,
    Benefit3: <FcAcceptDatabase />,
    Benefit4: <FcLock />,
    // imgs svg
    Spain: <Image src={Iconspain} width={100} alt='Spain' />,
    EEUU: <Image src={Iconeeuu} width={100} alt='Spain' />
    // ChatBot: <Image src={IconoChatbot} width={25} alt='ChatBot' />
    // Robot: <Image src={Iconrobot} width={100} alt='Robot' />

  }

  return icons[name] ? icons[name] : 'x'
}

export default ImageSvg
