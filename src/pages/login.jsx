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

export default function Login () {
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
      <nav>
        <Image src={logo} width={120} alt='imgRegister' />
        <ul>
          <li className='Question'> </li>
          <li className='link'>
            <Link href='/login'> </Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> Log in </h1>
        <p> Log in on the Business Process as a service </p>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            acceptTerms: false
          }}
          validationSchema={SignupSchemaEN}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <form className='formContainer'>

              <div>

                <Field type='email' name='corporateEmail' placeholder=' ' />
                <label htmlFor='corporateEmail'> Company email</label>
                <ErrorMessage className='errorMessage' name='corporateEmail' component='div' />
              </div>

              <div>

                <span className='iconPassword' onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
                <Field type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder=' ' />
                <label htmlFor='password'>Password</label>
                <ErrorMessage className='errorMessage' name='password' component='span' />
              </div>

              <button className='buttonPrimary' type='submit' disabled={isSubmitting}>
                LOG IN
              </button>

              <nav>

                <ul>
                  <li> I forgot my password</li>
                </ul>

                <ul>

                  <li className='Question'>Have an account?</li>
                  <li className='link'>
                    <Link href='/login'>Log in</Link>
                  </li>
                </ul>
              </nav>

            </form>

          )}
        </Formik>
      </div>
    </LayoutLogin>
  )
}
