import React, { useState } from 'react'
import Modal from '@/Components/Modal'
import Login from '..'
import ImageSvg from '@/helpers/ImageSVG'
import { useRouter } from 'next/router'
import { fetchConTokenPost } from '@/helpers/fetch'
import Loading from '@/Components/Atoms/Loading'
import { refresToken } from '@/helpers/auth'

function LoginConfirmed () {
  const router = useRouter()

  // Capturar el valor del token desde la ruta actual
  const [isEmail, setIsEmail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isconfirmed, setIsconfirmed] = useState(false)
  const [error, setError] = useState(null)
  const [show, setShow] = useState(true)

  async function handleSubmit (email, token) {
    const body = {
      oResults: {
        sEmail: email
      }
    }

    try {
      const responseData = await fetchConTokenPost('dev/General/?Accion=RegistrarUsuarioPendConf', body, token)

      // console.log("💻", responseData.oAuditResponse);

      if (responseData.oAuditResponse.iCode == 29 || responseData.oAuditResponse.iCode == 1) {
        setIsconfirmed(true)
        setError(null)
        setTimeout(() => {
          setShow(false)
        }, 10000)
      } else {
        const message = responseData?.oAuditResponse.sMessage
        // const mensajeAntesDeComa = message.substring(0, message.indexOf(","));
        setError(message)
        const refresh = await refresToken(token)
        return refresh
      }
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Hubo un error en la operación asincrónica.')
    }
  }

  if (show) {
    setTimeout(() => {
      const tok = router.query.token
      const correo = router.query.correo
      if (correo && tok) {
        setIsLoading(false)
        setIsEmail(correo)
      }

      handleSubmit(correo, tok)
    }, 1000)
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  const handleCloseModal = () => {
    setShow(!show)
  }

  return (
    <section>
      <Login />
      {show && <Modal close={() => setShow(false)}>
        {isconfirmed
          ? (
            <div>
              <ImageSvg name='Check' />

              <p>Your email</p>
              <h2>{isEmail}</h2>
              <p>
                was verified <span>&nbsp;successfully</span>
              </p>

              <div className='actions'>
                <button className='btn_primary small' onClick={handleCloseModal}>
                  NEXT
                </button>
              </div>
            </div>
            )
          : (
            <div>
              <ImageSvg name='ErrorMessage' />
              <p className='errorMessage'>{error}</p>
            </div>
            )}
               </Modal>}

    </section>
  )
}

export default LoginConfirmed
