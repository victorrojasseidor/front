// import '../../styles/_styles.scss'
import React, {useState} from 'react';

function Modal ({ children}) {
  const [showModal, setShowModal] = useState(true)
 
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
