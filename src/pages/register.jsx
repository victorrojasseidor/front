import Link from "next/link";
import { DataContextProvider } from "@/Context/DataContext";
import LayoutLogin from "@/Components/LayoutLogin";
import "../../styles/styles.scss";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import logo from "../../public/img/logoseidor.png";
import { SignupSchemaEN,SignupSchemaES } from "@/helpers/validateForms";
import { useContext } from "react";
import { DataContext } from "@/Context/DataContext";


export default function Register() {
  // const { dataClient} = useContext(DataContext);
  // console.log("conx",dataClient);


   const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // checked
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  //visualizar contraseña

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  //enviar formulario

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };


  return (
        <LayoutLogin>
      <nav>
          <Image src={logo} width={120} alt="imgRegister"></Image>
          <ul>
            <li className="Question">
           
               Have an account?
            
            </li>
            <li className="link">
              <Link href="/register">
               log in 
              </Link>
            </li>
          </ul>
        </nav>

        <div className="register">
          <h1>Sign up</h1>
          <p> Create your account in SEIDOR BPaas</p>
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
              corporateEmail: "",
            }}
            validationSchema={SignupSchemaEN}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <form className="form">
                <div>
                  <label htmlFor="name">Username</label>
                  <Field type="text" name="name" />
                  <ErrorMessage
                    className="errorMessage"
                    name="name"
                    component="div"
                  />
                </div>
                <div>
                  <label htmlFor="corporateEmail">Company email</label>
                  <Field type="email" name="corporateEmail" />
                  <ErrorMessage
                    className="errorMessage"
                    name="corporateEmail"
                    component="div"
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" />
                  <ErrorMessage
                    className="errorMessage"
                    name="password"
                    component="div"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm password:</label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <FontAwesomeIcon 
                  className="iconPassword"
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                  />
                  <ErrorMessage
                    className="errorMessage"
                    name="confirmPassword"
                    component="div"
                  />
                </div>

                <div>
                  <label htmlFor="checkboxId">
                    <input
                      className="checkboxId"
                      type="checkbox"
                      id="checkboxId"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />{" "}
                    <span>I accept </span>
                    <span>
                      {" "}
                      SEIDOR BPaaS Terms and Conditions and Privacy Policy
                    </span>
                  </label>
                  {/*              
              <ErrorMessage className="errorMessage" name="confirmPassword" component="div" /> */}
                </div>

                <button
                  className="buttonPrimary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  SIGN UP NOW
                </button>
              </form>
            )}
          </Formik>
        </div>
      </LayoutLogin>
   
  );
}
