import React from 'react'
import '../../styles/styles.scss'
import { FaCheck } from 'react-icons/fa'
import Link from 'next/link';


function Modal ({ children,open, path="/login"}) {
  const [showModal, setShowModal] = React.useState(open)
  // const router = useRouter();

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // const handleNext = () => {
  //   handleCloseModal();
  //   // router.push('/login'); // Redirecciona a la página 'login'
  //   window.location.href = '/login'; // Redirecciona a la página 'login'
  // };

  

  return (
    <div>
         {showModal && (
        <div className='modal'>
          <div className='content'>
            <div className='close'>
              <button onClick={handleCloseModal}> X </button>
            </div>
            <div className='message'>
              <FaCheck /> 
              <div>{children}</div>
            </div>

            <div className='actions'>
              
              {/* <button className='btn_primary small' onClick={handleNext} >NEXT</button> */}
              <Link href={path} passHref>
                {/* <a className='btn_primary small'>NEXT</a> */}
                <div className='btn_primary small'>NEXT</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

Modal.propTypes = {}

export default Modal
