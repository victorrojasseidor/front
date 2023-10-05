import React, { useState, useEffect } from 'react'
import imgfree from '../../../public/img/freetrial.png'
import Image from 'next/image'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import Loading from '@/Components/Atoms/Loading'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import NavigationPages from '@/Components/NavigationPages'
import Link from 'next/link'
import Modal from '@/Components/Modal'

function Support () {
  const [error, SetError] = useState(null)
  const [confirm, SetConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { session, empresa, setModalToken, logout } = useAuth()

  async function handleSubmit (values, { setSubmitting, resetForm }) {
    const body = {
      oResults: {
        sEmailOrigen: values.corporateEmail,
        sTitulo: values.title,
        sTelefono: values.phoneNumber ? values.phoneNumber : '999999999',
        sMensaje: values.message

      }
    }

    try {
      const token = session?.sToken

      setIsLoading(true)
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=EnvioCorreoSoporteSmtp', body, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        SetError(null)
        setModalToken(false)
        SetConfirm(true)
        setSubmitting(true)
        setTimeout(() => {
          SetConfirm(false)
          resetForm()
        }, 3000)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)
        setSubmitting(false)
        SetConfirm(false)
        SetError(errorMessage)
        setTimeout(() => {
          SetError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      SetConfirm(false)
      SetError(error)
      setTimeout(() => {
        SetError(null)
      }, 1000)
      setSubmitting(false)
    } finally {
      setIsLoading(false) // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  return (

    <LayoutProducts menu='Product'>

      <NavigationPages title='Digital employees'>

        <Link href='/product'>
          <ImageSvg name='Products' />
          <p>
            {empresa?.razon_social_empresa}
          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href='/support'>
          Support
        </Link>

      </NavigationPages>

      {isLoading && <Loading />}

      <div className='freetrial'>
        <div className='freetrial_description'>
          <div>
            The fastest and
            <span> safest </span>
            way to have the exchange rate registered in your ERP
            <span> every day </span>

          </div>
          <p>An expert will contact you</p>

          <Image src={imgfree} width={900} alt='imgfreetrial' />
        </div>
        <div className='freetrial_contact'>
          <Formik
            initialValues={{
              corporateEmail: session.sCorreo,
              title: '',
              phoneNumber: session.sPhoneNumber ? session.sPhoneNumber : '',
              message: ''

            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className='form-container'>
                <div className='input-box'>
                  <Field type='email' name='corporateEmail' placeholder='' readOnly />
                  <label htmlFor='corporateEmail'>Company email</label>
                  <ErrorMessage className='errorMessage' name='corporateEmail' component='div' />
                </div>

                <div className='input-box'>
                  <Field type='text' name='title' placeholder='' />
                  <label htmlFor='title'> Title </label>
                  <ErrorMessage className='errorMessage' name='title' component='div' />
                </div>

                <div className='input-box'>
                  <Field type='tel' id='phoneNumber' name='phoneNumber' placeholder='' />
                  <label htmlFor='phoneNumber'>Phone Number</label>
                  <ErrorMessage className='errorMessage' name='phoneNumber' component='div' />
                </div>

                <div className='input-box'>

                  <Field
                    as='textarea' // Usa "textarea" como tipo de campo
                    id='message'
                    name='message' // Asegúrate de que el atributo "name" coincida con initialValues
                    placeholder=''
                    rows={4}
                    cols={40}
                  />

                  <label htmlFor='message'> Message</label>
                  <ErrorMessage className='errorMessage' name='message' component='div' />
                </div>

                <div className='containerButton'>
                  <button
                    className={`btn_primary ${(values.message && values.title) ? '' : 'disabled'}`} type='submit'
                    disabled={!values.message || !values.title}
                  >

                    SEND
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {error && <p className='errorMessage'>{error} </p>}

          {confirm && (
            <Modal close={() => { SetConfirm(false) }}>

              <ImageSvg name='Check' />

              <h2>
                Your request was sent successfully
              </h2>

              <p> We will contact you soon </p>

            </Modal>
          )}

        </div>

      </div>

    </LayoutProducts>
  )
}

export default Support
