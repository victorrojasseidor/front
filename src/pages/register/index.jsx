import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
// import "../../../styles/_styles.scss";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from '../../../public/img/logoseidor.png'
import { validateFormRegister } from '@/helpers/validateForms'
import ImageSvg from '@/helpers/ImageSVG'

import { fetchNoTokenPost } from '@/helpers/fetch'
import Modal from '@/Components/Modal'
import Button from '@/Components/Atoms/Buttons'

export default function Register () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [data, setData] = useState(null)
  // const [error, setError] = useState(null);
  const [isEmailFieldEnabled, setEmailFieldEnabled] = useState(true)
  const [ShowM, setShowM] = useState(false)
  // const [infoModal,setInfomodal]= useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  async function handleSubmit (values, { setSubmitting, setStatus, resetForm }) {
    const dataRegister = {
      oResults: {
        sUserName: values.name,
        sEmail: values.corporateEmail,
        sPassword: values.confirmPassword
      }
    }

    try {
      const responseData = await fetchNoTokenPost('dev/General/?Accion=RegistrarUsuarioInit', dataRegister && dataRegister)
      //  const responseData = await response.json();

      console.log('resServidorcode', responseData)

      if (responseData.oAuditResponse?.iCode === 1) {
        setData(dataRegister)
        setShowM(true)
        setStatus(null)
        setTimeout(() => {
          resetForm()
        }, 10000)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setShowM(false)
        setStatus(errorMessage)
        setSubmitting(false)
        setEmailFieldEnabled(true)
        setTimeout(() => {
          resetForm()
        }, 100000)
      }
    } catch (error) {
      console.error('error', error)
      setStatus('Service error')
      setTimeout(() => {
        resetForm()
      }, 60000)
    }
  }

  useEffect(() => {
    if (ShowM) {
      // Lógica para mostrar el modal
      // ...
      console.log('data', data)
      setTimeout(() => {
        setShowM(false)
      }, 500000) // Cerrar el modal después de 50 segundos
    }
  }, [ShowM])

  return (
    <LayoutLogin>
      <nav className='navRegister'>
        <Image src={logo} width={120} alt='logoRegister' />
        <ul>
          <li className='Question'>Have an account?</li>
          <li className='link'>
            <Link href='/login'> Log in</Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> Sign up</h1>
        <p> Create your Account in ARI SEIDOR</p>

        <Formik
          initialValues={{
            corporateEmail: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
            name: ''
          }}
          // validationSchema={SignupSchemaEN}
          validateOnChange
          validate={validateFormRegister}
          onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
            // same shape as initial values
            handleSubmit(values, { setSubmitting, setStatus, resetForm })
          }}
          enableReinitialize
        >
          {({ isValid, isSubmitting, status }) => (
            <Form className='form-container'>
              <div className='input-box'>
                <Field type='text' id='name' name='name' placeholder=' ' autoComplete='off' disabled={isSubmitting} />
                <label htmlFor='name'>Name</label>
                <ErrorMessage className='errorMessage' name='name' component='span' />
              </div>

              <div className='input-box'>
                <Field type='email' name='corporateEmail' id='corporateEmail' placeholder=' ' disabled={!isEmailFieldEnabled || isSubmitting} />
                <label htmlFor='corporateEmail'>Company email</label>
                <ErrorMessage className='errorMessage' name='corporateEmail' component='span' />
              </div>

              <div className='input-box'>
                <span className='iconPassword' onClick={togglePasswordVisibility}>
                  <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                </span>
                <Field type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder=' ' disabled={isSubmitting} />
                <label htmlFor='password'> Password</label>
                <ErrorMessage className='errorMessage' name='password' component='span' />
              </div>

              <div className='input-box'>
                <span className='iconPassword' onClick={toggleConfirmPasswordVisibility}>
                  <ImageSvg name={showConfirmPassword ? 'ShowPassword' : 'ClosePassword'} />
                </span>
                <Field type={showConfirmPassword ? 'text' : 'password'} id='confirmPassword' name='confirmPassword' placeholder=' ' disabled={isSubmitting} />
                <label htmlFor='confirmPassword' placeholder=''>
                  Confirm password
                </label>
                <ErrorMessage className='errorMessage' name='confirmPassword' component='span' />
              </div>

              <div className='input-box'>
                <label className='checkbox'>
                  <Field className='checkboxId' id='acceptTerms' type='checkbox' name='acceptTerms' disabled={isSubmitting} />

                  <span> I accept</span>
                  <span> ARI SEIDOR Terms and Conditions and Privacy Policy</span>
                </label>
                <ErrorMessage className='errorMessage' name='acceptTerms' component='span' />
              </div>

              <Button className={isValid ? 'btn_primary' : 'btn_primary disabled'} onClick={() => setEmailFieldEnabled(true)} label={isSubmitting ? 'Send...' : 'Sign Up Now'} disabled={isSubmitting || !isEmailFieldEnabled} />

              <div className='contentError'>
                <div className='errorMessage'>{status}</div>
              </div>
            </Form>
          )}
        </Formik>

        {ShowM && data && (
          <Modal close={() => setShowM(false)}>
            <ImageSvg name='Check' />
            <div>
              <p> We´ve sent a verification link to</p>
              <h2> {data.oResults.sEmail} </h2>
              <p>Please enter your email to confirm registration</p>
            </div>

          </Modal>
        )}
      </div>
    </LayoutLogin>
  )
}
