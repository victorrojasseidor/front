import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import logo from '../../../public/img/logoseidor.png'
// import { SignupSchemaEN } from '@/helpers/validateForms'

export default function UpdatePassword () {
  // const { t } = useContext(DataContext)

  // console.log('t', t)

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
          <li className='Question'>Have an account?</li>
          <li className='link'>
            <Link href='/login'>Log in</Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> Update password </h1>
        <p>
          {' '}
          Please enter your email. You will be sent a link to change your
          password{' '}
        </p>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            acceptTerms: false
          }}
          // validationSchema={SignupSchemaEN}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <form className='form-container'>
              <div className="input-box">
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
                <label htmlFor='password'>Password</label>
                <ErrorMessage
                  className='errorMessage'
                  name='password'
                  component='span'
                />
              </div>

              <div className="input-box">
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
                  Confirm password
                </label>
                <ErrorMessage
                  className='errorMessage'
                  name='confirmPassword'
                  component='span'
                />
              </div>

              <button
                className='btn_primary'
                type='submit'
                disabled={isSubmitting}
              >
                UPDATE
              </button>
            </form>
          )}
        </Formik>
      </div>
    </LayoutLogin>
  )
}
