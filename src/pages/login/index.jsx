import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
// import "../../../styles/styles.scss";
import { Formik, Field, ErrorMessage, Form } from 'formik'
import React, { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Image from 'next/image'
import logo from '../../../public/img/logoGift.gif'
import { validateFormLogin } from '@/helpers/validateForms'
import { fetchNoTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import { useAuth } from '@/Context/DataContext'
import Lang from '@/Components/Atoms/Lang'

export default function Login () {
  const { setSession, l, setdataProfileStart } = useAuth()

  const t = l.login

  const [showPassword, setShowPassword] = useState(false)
  const [isEmailFieldEnabled, setEmailFieldEnabled] = useState(true)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  // pruba nuevo repo 2

  const router = useRouter()

  async function handleSubmit (values, { setSubmitting, setStatus, resetForm }) {
    const dataRegister = {
      oResults: {
        sEmail: values.corporateEmail,
        sPassword: values.password
      }
    }

    try {
      const responseData = await fetchNoTokenPost('dev/BPasS/?Accion=ConsultaUsuario', dataRegister && dataRegister)
      if (responseData.oAuditResponse?.iCode === 1) {
        localStorage.setItem('Credential', JSON.stringify(dataRegister.oResults))
        setStatus(null)
        const userData = responseData.oResults
        if (responseData.oResults.iEstado == 28) {
          setdataProfileStart(userData)
          router.push('/profilestart')
        } else {
          router.push('/product')
          setSession(userData)
        }

        // reseteo formulario
        setTimeout(() => {
          resetForm()
        }, 10000)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'

        setStatus(errorMessage)
        setSubmitting(false)
        setEmailFieldEnabled(true)
        setTimeout(() => {
          resetForm()
          setStatus(errorMessage)
        }, 200000)
      }
    } catch (error) {
      console.error('error', error)
      setStatus('Service error')
      setTimeout(() => {
        resetForm()
      }, 60000)
    }
  }

  // detectar que usuario ingresón

  return (
    <LayoutLogin>

      <nav className='navRegister'>
        <div className='navRegister_head'>
          <div className='container-lang'>      <Lang /> </div>
          <div className='navRegister_logo'>

            <Image src={logo} width={100} alt='imgRegister' />

          </div>
        </div>

      </nav>

      <div className='register'>
        <h1> {t['Log in']}</h1>
        <p>{t['Log in Digital Employees']}  </p>

        <Formik
          initialValues={{
            corporateEmail: '',
            password: ''
          }}
          validateOnChange
          validate={(values) => validateFormLogin(values, l.validation)}
          onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
            handleSubmit(values, { setSubmitting, setStatus, resetForm })
          }}
          enableReinitialize

        >
          {({ isValid, isSubmitting, status }) => (
            <Form className='form-container'>
              <div className='input-box'>
                <Field type='email' name='corporateEmail' id='corporateEmail' placeholder=' ' disabled={!isEmailFieldEnabled || isSubmitting} />
                <label htmlFor='corporateEmail'>{t['Company email']}</label>
                <ErrorMessage className='errorMessage' name='corporateEmail' component='span' />
              </div>

              <div className='input-box'>
                <span className='iconPassword' onClick={togglePasswordVisibility}>
                  <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                </span>
                <Field type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder=' ' disabled={isSubmitting} />
                <label htmlFor='password'>  {t.Password}</label>
                <ErrorMessage className='errorMessage' name='password' component='span' />
              </div>

              <button type='submit' disabled={isSubmitting || !isEmailFieldEnabled} className={isValid ? 'btn_primary' : 'btn_primary disabled'} onClick={() => setEmailFieldEnabled(true)}>
                {isSubmitting ? `${t['Log in']}${'....'}` : t['Log in']}
              </button>

              <div className='contentError'>
                <div className='errorMessage'>{status}</div>
              </div>
            </Form>
          )}
        </Formik>
        <nav className='navRegister navLogin '>
          {/* <ul className='iforget'>
            <Link href='/changepassword'>
              <li> {t['I forgot my password']}</li>
            </Link>
          </ul> */}
          <ul className='navRegister_question'>
            <li className='Question'>{t['Have not an account?']}</li>
            <li className='link'>
              <Link href='/register'>{t['Sign up']}</Link>
            </li>
          </ul>
        </nav>
      </div>

    </LayoutLogin>
  )
}
