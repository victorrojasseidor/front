import React, { useState, useEffect } from 'react'
import imgfree from '../../public/img/freetrial.png'
import Image from 'next/image'
import { Formik, Field, ErrorMessage, Form } from 'formik'
// import { validateFormRegister } from '@/helpers/validateForms'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import Modal from './Modal'

function FreeTrial ({ sProduct, nameProduct, iIdProd }) {
  const [error, SetError] = useState(null)
  const [confirm, SetConfirm] = useState(false)
  const { session, setModalToken } = useAuth()

  const productName = nameProduct || 'Downlaod automated Bank Statements'

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
          window.location.reload()
        }, 1000)// Adjust the delay time as needed
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.error('errok, ', errorMessage)
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
                <label htmlFor='corporateEmail'>Company email</label>
                <ErrorMessage className='errorMessage' name='corporateEmail' component='div' />
              </div>

              <div className='input-box'>
                <Field type='text' name='title' placeholder='' readOnly />
                <label htmlFor='title'> Title </label>
                <ErrorMessage className='errorMessage' name='title' component='div' />
              </div>

              <div className='input-box'>
                <Field type='tel' id='phoneNumber' name='phoneNumber' placeholder='' />
                <label htmlFor='phoneNumber'>Phone Number</label>
                <ErrorMessage className='errorMessage' name='phoneNumber' component='div' />
              </div>

              <div className='input-box'>

                <textarea
              // value={email}
              // onChange={handleChange}
                  placeholder=''
                  rows={4}
                  cols={40}
                />
                <label htmlFor='message'> Message</label>
                <ErrorMessage className='errorMessage' name='message' component='div' />
              </div>

              <div className='containerButton'>
                <button className='btn_primary ' type='submit' disabled={isSubmitting}>
                  SEND
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {error && <p className='errorMessage'>{error} </p>}

        {confirm && (
          <Modal close={() => { SetConfirm(false) }}>
            <div>
              <h2>
                Your request was sent successfully
              </h2>

              <p> We will contact you soon </p>
            </div>
          </Modal>
        )}

      </div>

    </div>
  )
}

export default FreeTrial
