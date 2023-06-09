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

export default function changePassword () {
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
          <li className='Question'>Have an account?</li>
          <li className='link'>
            <Link href='/register'>Sign up</Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> Change my password  </h1>
        <p> Please enter your email. You will be sent a link to change your password</p>

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

              <button className='buttonPrimary' type='submit' disabled={isSubmitting}>
                SEND
              </button>
            </form>
          )}
        </Formik>
      </div>
    </LayoutLogin>
  )
}
