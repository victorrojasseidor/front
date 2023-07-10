import React from 'react'
import '../../styles/styles.scss'
import { FaCheck } from 'react-icons/fa'

function Modal ({ children,open}) {
  const [showModal, setShowModal] = React.useState(open)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div>
      <h1>My modal </h1>
      <button onClick={handleOpenModal}>Open Modal</button>
      {showModal && (
        <div className='modal'>
          <div className='content'>
            <div className='close'>
              <button onClick={handleCloseModal}> X </button>
            </div>
            <div className='message'>
              <FaCheck /> {/* Utiliza el icono de check */}
              <div>{children}</div>
            </div>

            <div className='actions'>
              
              <button className='btn_primary small' onClick={handleCloseModal} >NEXT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

Modal.propTypes = {}

export default Modal
