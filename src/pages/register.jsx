import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
import '../../styles/styles.scss'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import logo from '../../public/img/logoseidor.png'
import { SignupSchemaEN, SignupSchemaES } from '@/helpers/validateForms'
import { DataContext } from '@/Context/DataContext'

export default function Register () {
  const { t, locale } = useContext(DataContext)
  console.log('t', t)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = (values) => {
    // Realizar acción cuando el formulario es válido
    console.log('Formulario válido', values)
  }

  return (
    <LayoutLogin>
      <nav className='navRegister'>
        <Image src={logo} width={120} alt='imgRegister' />
        <ul>
          <li className='Question'>{t.signup['Have an account?']}</li>
          <li className='link'>
            <Link href='/login'> {t.signup['Log in']}</Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> {t.signup['Sign up']}</h1>
        <p> {t.signup['Create your account in SEIDOR BPaas']}</p>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            acceptTerms: false
          }}
          validationSchema={locale === 'es' ? SignupSchemaES : SignupSchemaEN}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <form className='formContainer'>
              <div>
                <Field type='text' name='name' placeholder=' ' />
                <label htmlFor='name'>{t.signup.Username}</label>
                <ErrorMessage
                  className='errorMessage'
                  name='name'
                  component='div'
                />
              </div>

              <div>
                <Field type='email' name='corporateEmail' placeholder=' ' />
                <label htmlFor='corporateEmail'>
                  {' '}
                  {t.signup['Company email']}
                </label>
                <ErrorMessage
                  className='errorMessage'
                  name='corporateEmail'
                  component='div'
                />
              </div>

              <div>
                <span
                  className='iconPassword'
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  placeholder=' '
                />
                <label htmlFor='password'>{t.signup.Password}</label>
                <ErrorMessage
                  className='errorMessage'
                  name='password'
                  component='span'
                />
              </div>

              <div>
                <span
                  className='iconPassword'
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </span>
                <Field
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  placeholder=' '
                />
                <label htmlFor='confirmPassword' placeholder=''>
                  {t.signup['Confirm password']}
                </label>
                <ErrorMessage
                  className='errorMessage'
                  name='confirmPassword'
                  component='span'
                />
              </div>

              <div>
                <label className='checkbox'>
                  <Field
                    className='checkboxId'
                    type='checkbox'
                    name='acceptTerms'
                  />

                  <span>{t.signup['I accept']}</span>
                  <span>
                    {' '}
                    {
                      t.signup[
                        'SEIDOR BPaaS Terms and Conditions and Privacy Policy'
                      ]
                    }
                  </span>
                </label>
                <ErrorMessage
                  className='errorMessage'
                  name='acceptTerms'
                  component='span'
                />
              </div>

              <button
                className='buttonPrimary'
                type='submit'
                disabled={isSubmitting}
              >
                {t.signup['SIGN UP NOW']}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </LayoutLogin>
  )
}
