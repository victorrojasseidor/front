// import '../../styles/_styles.scss'

function Modal ({ close, children }) {
  const handleCloseModal = () => {
    close()
  }

  return (
    <div>
      <div className='modal'>
        <div className='content'>
          <div className='close'>
            <button className='btn_circle' onClick={handleCloseModal}> X </button>
          </div>

          <div className='message'>

            {children}
          </div>

        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {}

export default Modal
