/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
import '../../styles/styles.scss'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import Image from 'next/image'
import logo from '../../public/img/logoseidor.png'

export default function changePassword () {


  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // eslint-disable-next-line no-unused-vars
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // const toggleConfirmPasswordVisibility = () => {
  //   setShowConfirmPassword(!showConfirmPassword)
  // }

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
            <Link href='/register'>Sign up</Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> Change my password </h1>
        <p>
          {' '}
          Please enter your email. You will be sent a link to change your
          password
        </p>

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
            <form className='form-container'>
              <div className="input-box">
                <Field type='email' name='corporateEmail' placeholder=' ' />
                <label htmlFor='corporateEmail'> Company email</label>
                <ErrorMessage
                  className='errorMessage'
                  name='corporateEmail'
                  component='div'
                />
              </div>

              <button
                className='btn_primary'
                type='submit'
                disabled={isSubmitting}
              >
                SEND
              </button>
            </form>
          )}
        </Formik>

        {/* <h4> modal example </h4> */}
      </div>
      {/* <Modal>
        <p>Automation of currency exchange rates for Daily Exchange Rate</p>
        <p>was successfully configured!</p>

      </Modal> */}
    </LayoutLogin>
  )
}
