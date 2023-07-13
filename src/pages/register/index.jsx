import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
import '../../../styles/styles.scss'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState, useEffect} from 'react'
import Image from 'next/image'
import logo from '../../../public/img/logoseidor.png'
import { SignupSchemaEN } from '@/helpers/validateForms'
import ImageSvg from '@/helpers/ImageSVG'
// import { DataContext } from '@/Context/DataContext'
export default function Register () {
  // const { t, locale } = useContext(DataContext)
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

    console.log("values",values);
    // try {

    //   if (!isValid) {
    //     console.log("no válido");
    //     return;
    //   }
     
  
    //   // const response = await axios.post('/api/auth/signup', values);
    //   // console.log(response.data);
    // } catch (error) {
    //   console.error(error);
    //   // setErrors({ submit: 'Error al registrar al usuario' });
    //   setSubmitting(false);
    // }
  
    
  };


  // useEffect(() => {
  //   const formValues = {
  //         name: 'natalia',
  //           corporateEmail: 'natalia@seidor.es',
  //           password: 'Ninoska12$',
  //           confirmPassword: 'Ninoska12$',
  //           acceptTerms: false
  //   };

  //   handleSubmit(formValues, true);
  // }, []);



  return (
    <LayoutLogin>
      <nav className='navRegister'>
        <Image src={logo} width={120} alt='imgRegister' />
        <ul>
          <li className='Question'>Have an account?</li>
          <li className='link'>
            <Link href='/login'> Log in</Link>
          </li>
        </ul>
      </nav>

      <div className='register'>
        <h1> Sign up</h1>
        <p> Create your account in SEIDOR BPaas</p>

        <Formik
          initialValues={{
            name: '',
            corporateEmail: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
          }}
          validationSchema={SignupSchemaEN}
          // onSubmit={handleSubmit}
          onSubmit={ (values) => {
            handleSubmit(values);
        }}
        >
          {({ isSubmitting}) => (
            <form className='formContainer'>
              <div>
                <Field type='text' id='name' name='name' placeholder=' ' />
                <label htmlFor='name'>Username</label>
                <ErrorMessage
                  className='errorMessage'
                  name='name'
                  component='div'
                />
              </div>

              <div>
                <Field type='email' name='corporateEmail' id='corporateEmail' placeholder=' ' />
                <label htmlFor='corporateEmail'>
                  Company email
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
                  <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                </span>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  placeholder=' '
                />
                <label htmlFor='password'> Password</label>
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

                  <ImageSvg name={showConfirmPassword ? 'ShowPassword' : 'ClosePassword'} />
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

              <div>
                <label className='checkbox'>
                  <Field
                    className='checkboxId'
                    id='acceptTerms'
                    type='checkbox'
                    name='acceptTerms'
                  />

                  <span> I accept</span>
                  <span>   SEIDOR BPaaS Terms and Conditions and Privacy Policy
                  </span>
                </label>
                <ErrorMessage
                  className='errorMessage'
                  name='acceptTerms'
                  component='span'
                />
              </div>

              <button
                className='btn_primary'
                type='submit'
                disabled={isSubmitting}
              >
                SIGN UP NOW
              </button>
            </form>
          )}
        </Formik>
      </div>
    </LayoutLogin>
  )
}
