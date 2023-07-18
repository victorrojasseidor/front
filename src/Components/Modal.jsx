import '../../styles/styles.scss'
import Link from 'next/link';
import React, { useEffect } from 'react';
function Modal ({ children,open}) {
  const [showModal, setShowModal] = React.useState(open)
  // const router = useRouter();

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }


  return (
    <div>
         {showModal && (
        <div className='modal'>
          <div className='content'>
            <div className='close'>
              <button onClick={handleCloseModal}> X </button>
            </div>

            <div className='message'>
          
              {children}
             </div>
                 
          </div>
        </div>
      )}
    </div>
  )
}

Modal.propTypes = {}

export default Modal
