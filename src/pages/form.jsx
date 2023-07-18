import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect} from 'react'
import Image from 'next/image'
import logo from '../../public/img/logoseidor.png'
import { SignupSchemaEN } from '@/helpers/validateForms'
import ImageSvg from '@/helpers/ImageSVG';
import LayoutLogin from '@/Components/LayoutLogin'
import Link from 'next/link'
import '../../styles/styles.scss'
import { fetchNoTokenPost } from '@/helpers/fetch';





const ValidationSchemaExample = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }
  
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword)
    }



    async function handleSubmit(values) {
      let dataRegister = {
        oResults: {
          sUserName: values.name,
          sEmail: values.corporateEmail,
          sPassword: values.confirmPassword,
        },
      };
       
            let response = await fetchNoTokenPost("RegistrarUsuarioInit", dataRegister);
            console.log("resServidorcode", response);
       
        };
      
    



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
    //   validationSchema={SignupSchemaEN}
    //   initialValues={{
    //     firstName: '',
    //     lastName: '',
    //     email: '',
    //   }}
    //   validationSchema={SignupSchema}
      onSubmit={values => {
        // same shape as initial values
        console.log(values);
        handleSubmit(values);

      }}
    >
      {({ errors, touched }) => (
        <Form className='formContainer'>
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
                // disabled={isSubmitting}
              >
                SIGN UP NOW
              </button>
            </Form>
    
      )}
    </Formik>
  </div>
  </LayoutLogin>
)
      };

export default ValidationSchemaExample