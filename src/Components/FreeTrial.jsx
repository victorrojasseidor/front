import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Formik, Field, ErrorMessage, Form } from 'formik'
// import { validateFormRegister } from '@/helpers/validateForms'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import Modal from './Modal'
import ImageSvg from '@/helpers/ImageSVG'
import { useRouter } from 'next/router'
import imgfree from '../../public/img/contactanos.png'

function FreeTrial ({ sProduct, nameProduct, iIdProd }) {
  const [error, SetError] = useState(null)
  const [confirm, SetConfirm] = useState(false)
  const { session, setModalToken, l } = useAuth()

  const t = l.freeTrial

  const productName = nameProduct || 'Downlaod automated Bank Statements'
  const router = useRouter()

  // send frretrial

  async function handleSubmit (values, { setSubmitting, resetForm }) {
    const body = {
      oResults: {

        sProd: 'EXT_BANC',
        iIdProdEnv: iIdProd,
        sCorreo: values.corporateEmail,
        sTitle: values.title,
        sPhoneNumber: values.phoneNumber,
        sMessage: values.message

      }
    }

    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=SolicitarProducto', body, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        // const data= responseData.oResults;
        SetError(null)
        setModalToken(false)
        SetConfirm(true)

        setTimeout(() => {
          resetForm()
        }, 1000)// Adjust the delay time as needed
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)
        setModalToken(true)
        setSubmitting(false)
        SetConfirm(false)
        SetError(errorMessage)
      }
    } catch (error) {
      console.error('error', error)
      SetConfirm(false)
      SetError(error)
      setSubmitting(false)
    }
  }

  return (
    <div className='freetrial'>

      <div className='freetrial_description'>
        <h1> {t['Free trial']} </h1>

        <div>
          {/* <h4> Your satisfaction is our top priority!</h4> */}
          <p>
            {t['To be able to request the digital employee']}
          </p>
          <p> <span> {nameProduct} </span>{t['use the following form,']}
          </p>

        </div>

        <Image src={imgfree} width={600} alt='imgfreetrial' />

      </div>

      <div className='freetrial_contact'>
        <Formik
          initialValues={{
            corporateEmail: session.sCorreo,
            title: `I am interested in ${productName}`,
            phoneNumber: session.sPhoneNumber ? session.sPhoneNumber : 51,
            message: ''

          }}
          // validationSchema={validateFormRegister}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className='form-container'>
              <div className='input-box'>
                <Field type='email' name='corporateEmail' placeholder='' readOnly />
                <label htmlFor='corporateEmail'>{t['Company email']}</label>
                <ErrorMessage className='errorMessage' name='corporateEmail' component='div' />
              </div>

              <div className='input-box'>
                <Field type='text' name='title' placeholder='' readOnly />
                <label htmlFor='title'> {t.Title} </label>
                <ErrorMessage className='errorMessage' name='title' component='div' />
              </div>

              <div className='input-box'>
                <Field type='tel' id='phoneNumber' name='phoneNumber' placeholder='' />
                <label htmlFor='phoneNumber'>{t['Phone Number']}</label>
                <ErrorMessage className='errorMessage' name='phoneNumber' component='div' />
              </div>

              <div className='input-box'>

                <textarea
              // value={email}
              // onChange={handleChange}
                  placeholder=''
                  rows={4}
                  cols={40}
                  style={{ height: 'auto', minHeight: '4rem' }}

                />
                <label htmlFor='message'> {t.Message}</label>
                <ErrorMessage className='errorMessage' name='message' component='div' />
              </div>

              <div className='containerButton'>
                <button className='btn_primary ' type='submit' disabled={isSubmitting}>
                  {t.Send}
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
              {t['Your request was sent successfully']}
            </h2>

            <p> {t['We will contact you soon']} </p>

            <div className='box-buttons'>
              <button
                type='button'
                className='btn_primary small'
                onClick={() => { router.push('/product'); SetConfirm(false) }}
              >
                {t['Return to DE']}
              </button>
            </div>

          </Modal>
        )}

      </div>

    </div>
  )
}

export default FreeTrial
