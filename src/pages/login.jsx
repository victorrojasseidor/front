import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
import '../../styles/styles.scss'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Image from 'next/image'
import logo from '../../public/img/logoseidor.png'
import { SignupSchemaEN } from '@/helpers/validateForms'
// import { useRouter } from 'next/navigation'

export default function Login () {
  // const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (values) => {
    // values.preventDefault()
    // // Realizar cualquier acción adicional que desees
    // // ...
    // // Navegar a una nueva página utilizando router.push()
    // router.push('/profilestart')

    console.log('Formulario válido', values)
  }

  return (
    <LayoutLogin>
      <nav className='navRegister'>
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
          validateOnBlur={false}
        >
          {({ isSubmitting }) => (
            <form className='formContainer'>
              <div>
                <Field type='email' name='corporateEmail' placeholder=' ' />
                <label htmlFor='corporateEmail'> Company email</label>
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
                  <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
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

              <Link href='/profilestart' className='containerButton'>
                <button
                  className='btn_primary'
                  type='submit'
                  disabled={isSubmitting}
                > LOG IN

                </button>
              </Link>

              <nav className='navRegister navLogin '>
                <ul className='iforget'>
                  <Link href='/changepassword'>
                    <li> I forgot my password</li>
                  </Link>
                </ul>
                <ul>
                  <li className='Question'>Have an account?</li>
                  <li className='link'>
                    <Link href='/register'>Sign up</Link>
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
