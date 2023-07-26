import Link from 'next/link'
import LayoutLogin from '@/Components/LayoutLogin'
import '../../../styles/styles.scss'
import { Formik, Field, ErrorMessage,Form } from 'formik'
import React, { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import Image from 'next/image'
import logo from '../../../public/img/logoseidor.png'
import { validateFormLogin } from '@/helpers/validateForms'
import { fetchNoTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/navigation'

export default function Login () {
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailFieldEnabled, setEmailFieldEnabled] = useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const router = useRouter()

  async function handleSubmit(values, { setSubmitting, setStatus, resetForm }) {
    let dataRegister = {
      oResults: {
        sEmail: values.corporateEmail,
        sPassword: values.password,
      },
    };
 

    try {
      let responseData = await fetchNoTokenPost("dev/BPasS/?Accion=ConsultaUsuario", dataRegister && dataRegister);
           
      if (responseData.oAuditResponse?.iCode === 1) {
          
               
        setStatus(null);

        const userData = responseData.oResults;
        // console.log("datadel usuario en login",userData);
        setUser(userData);
      
        // Guardar la información del usuario en el local storage.
        localStorage.setItem('user', JSON.stringify(userData));

        if(responseData.oResults.iEstado==28){
          router.push('/profilestart'); 
        }else{
          router.push('/product'); 
        }


        //reseteo formulario 
        setTimeout(() => {
          resetForm();
        }, 10000);
     
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : "Error in sending the form";
       
        // if(responseData.oAuditResponse?.iCode === 32){
        //   setStatus("The user does not exist, register to access");
        // }else{
        //   setStatus(errorMessage);
        // }

        setStatus(errorMessage);
        setSubmitting(false);
        setEmailFieldEnabled(true);
        setTimeout(() => {
          resetForm();
        }, 200000);
      
      }
    } catch (error) {
      console.error("error", error);
        setStatus("Service error");
      setTimeout(() => {
        resetForm();
      }, 60000);
        }
  }

// detectar que usuario ingresón
const [user, setUser] = useState(null);

// useEffect(() => {
  
//   // Ejemplo de cómo guardar la información del usuario en el local storage (se mantendrá después de recargar la página):
//   const savedUser = localStorage.getItem('user');
//   if (savedUser) {
//     setUser(JSON.parse(savedUser));
//   }
// }, []);


// const handleLogin = () => {
//   // Simulación de inicio de sesión exitoso.
//   const user = { id: 1, username: 'exampleUser' };
//   setUser(user);

//   // Guardar la información del usuario en el local storage.
//   localStorage.setItem('user', JSON.stringify(user));
// };




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
            corporateEmail: '',
            password: '',
          }}
          validateOnChange
          validate={validateFormLogin}
          onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
            console.log(values);
                    handleSubmit(values, { setSubmitting, setStatus, resetForm });
          }}
          enableReinitialize={true}
        >
          {({ isValid, isSubmitting, status }) => (
            <Form className='form-container'>
             <div className="input-box">
                <Field type="email" name="corporateEmail" id="corporateEmail" placeholder=" " disabled={!isEmailFieldEnabled || isSubmitting} />
                <label htmlFor="corporateEmail">Company email</label>
                <ErrorMessage className="errorMessage" name="corporateEmail" component="span" />
              </div>

              <div className="input-box">
                <span className="iconPassword" onClick={togglePasswordVisibility}>
                  <ImageSvg name={showPassword ? "ShowPassword" : "ClosePassword"} />
                </span>
                <Field type={showPassword ? "text" : "password"} id="password" name="password" placeholder=" " disabled={isSubmitting} />
                <label htmlFor="password"> Password</label>
                <ErrorMessage className="errorMessage" name="password" component="span" />
              </div>

              {/* <Link href='/profilestart' className='containerButton'> */}
                
              <button type="submit" disabled={isSubmitting || !isEmailFieldEnabled} className={isValid ? "btn_primary" : "btn_primary disabled"} onClick={() => setEmailFieldEnabled(true)}>
                {isSubmitting ? "Login..." : "Login in"}
              </button> 
              {/* </Link> */}

              <div className="contentError">
                <div className="errorMessage">{status}</div>
                </div>
             </Form>
          )}
        </Formik>
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
              
      </div>
    </LayoutLogin>
  )
}
