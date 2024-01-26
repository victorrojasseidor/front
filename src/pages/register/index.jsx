import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
// import "../../../styles/_styles.scss";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from '../../../public/img/logoGift.gif'
import { validateFormRegister } from '@/helpers/validateForms'
import ImageSvg from '@/helpers/ImageSVG'
import { useAuth } from '@/Context/DataContext'
import { fetchNoTokenPost } from '@/helpers/fetch'
import Modal from '@/Components/Modal'
import Lang from '@/Components/Atoms/Lang'
import Button from '@/Components/Atoms/Buttons'
import ModalForm from '@/Components/Atoms/ModalForm'

export default function Register () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [data, setData] = useState(null)
  // const [error, setError] = useState(null);
  const [isEmailFieldEnabled, setEmailFieldEnabled] = useState(true)
  const [ShowM, setShowM] = useState(false)
  const [conditions, setConditions] = useState(false)

  const { l } = useAuth()

  const t = l.signup

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
      const responseData = await fetchNoTokenPost('General/?Accion=RegistrarUsuarioInit', dataRegister && dataRegister)
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

      setTimeout(() => {
        setShowM(false)
      }, 500000) // Cerrar el modal después de 50 segundos
    }
  }, [ShowM])

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
        <h1> {t['Sign up']}</h1>
        <p> {t['Create your Account in ARI SEIDOR']}</p>

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
          validate={(values) => validateFormRegister(values, l.validation)}
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
                <label htmlFor='name'>{t.Name}</label>
                <ErrorMessage className='errorMessage' name='name' component='span' />
              </div>

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
                <label htmlFor='password'> {t.Password}</label>
                <ErrorMessage className='errorMessage' name='password' component='span' />
              </div>

              <div className='input-box'>
                <span className='iconPassword' onClick={toggleConfirmPasswordVisibility}>
                  <ImageSvg name={showConfirmPassword ? 'ShowPassword' : 'ClosePassword'} />
                </span>
                <Field type={showConfirmPassword ? 'text' : 'password'} id='confirmPassword' name='confirmPassword' placeholder=' ' disabled={isSubmitting} />
                <label htmlFor='confirmPassword' placeholder=''>
                  {t['Confirm password']}
                </label>
                <ErrorMessage className='errorMessage' name='confirmPassword' component='span' />
              </div>

              <div className='input-box'>
                <label className='checkbox'>
                  <div className='box-term'>
                    <Field className='checkboxId' id='acceptTerms' type='checkbox' name='acceptTerms' disabled={isSubmitting} />
                    <button className='button-conditions' onClick={() => setConditions(!conditions)}>
                      {t['I accept']}
                      {t['ARI SEIDOR Terms and Conditions and Privacy Policy']}
                    </button>
                  </div>

                </label>
                <ErrorMessage className='errorMessage' name='acceptTerms' component='span' />
              </div>

              <Button className={isValid ? 'btn_primary' : 'btn_primary disabled'} onClick={() => setEmailFieldEnabled(true)} label={isSubmitting ? `${t['Sign up']}${'....'}` : t['Sign Up Now']} disabled={isSubmitting || !isEmailFieldEnabled} />

              <div className='contentError'>
                <div className='errorMessage'>{status}</div>
              </div>
            </Form>
          )}
        </Formik>

        {ShowM && data && (
          <Modal close={() => setShowM(false)}>
            <ImageSvg name='Check' />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>

              {t['Please enter your email']}
              <h2> {data.oResults.sEmail}</h2>

              {t['to confirm registration']}

            </div>

          </Modal>
        )}

        {conditions && (

          <div className='Conditions'>

            <ModalForm close={() => setConditions(false)}>
              {/* <ImageSvg name='Check' /> */}

              <div className='Conditions-list'>
                <h3>1. {t['Conditions of User']}</h3>
                <p>{t['By accessing the site, the user agrees to all provisions of the Legal Notice, including the Privacy Policy.']}</p>

                <h3>2. {t.Privacy}</h3>
                <p>{t['All data provided to Seidor will be treated with respect for confidentiality, according to the Privacy Policy.']}</p>

                <h3>3. {t['Industrial and Intellectual Property']}</h3>
                <p>{t['Seidor owns the intellectual and industrial property rights of the site, and any unauthorized use is prohibited.']}</p>

                <h3>4. {t.Responsibility}</h3>
                <p>{t['Seidor does not guarantee the continuous availability of the site and is not responsible for damages arising from access and use.']}</p>

                <h3>5. {t['User Restrictions']}</h3>
                <p>{t['Users agree not to use the site for illegal purposes and not to take actions that violate the terms.']}</p>

                <h3>6. {t['Third-Party Links']}</h3>
                <p>{t['Seidor does not control or is responsible for the content of third parties accessed through links on the site.']}</p>

                <h3>7. {t.Modifications}</h3>
                <p>{t['Seidor may modify legal texts without prior notice, and such modifications will be effective when published on the site. Additionally, Seidor may terminate or suspend portal services, with notice when possible.']}</p>
              </div>

            </ModalForm>
          </div>
        )}

        <ul className='navRegister_question'>
          <li className='Question'>{t['Have an account?']}</li>
          <li className='link'>
            <Link href='/login'> {t['Log in']}</Link>
          </li>

        </ul>

      </div>

    </LayoutLogin>
  )
}
