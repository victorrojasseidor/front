import Link from "next/link";
import LayoutLogin from "@/Components/LayoutLogin";
import "../../../styles/styles.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/img/logoseidor.png";
import { SignupSchemaEN } from "@/helpers/validateForms";
import ImageSvg from "@/helpers/ImageSVG";
// import { DataContext } from '@/Context/DataContext'
import { fetchNoTokenPost } from "@/helpers/fetch";
import Modal from "@/Components/Modal";

export default function Register() {
  // const { t, locale } = useContext(DataContext)
  // console.log('t', t)

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState(null);
  // const [error, setError] = useState(null);
  const [isEmailFieldEnabled, setEmailFieldEnabled] = useState(true);
  const [ShowM, setShowM] = useState(false);
  // const [infoModal,setInfomodal]= useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  async function handleSubmit(values, { setSubmitting, setStatus, resetForm }) {
    let dataRegister = {
      oResults: {
        sUserName: values.name,
        sEmail: values.corporateEmail,
        sPassword: values.confirmPassword,
      },
    };

    try {
      let response = await fetchNoTokenPost("RegistrarUsuarioInit", dataRegister);
      // const responseData = await response.json();
      const responseData = await response.json();
      console.log("res", responseData);
      console.log("res", responseData, responseData.oAuditResponse.iCode);

      if (responseData.oAuditResponse && responseData.oAuditResponse.hasOwnProperty("iCode") && responseData.oAuditResponse.iCode === 1) {
        // const data = await response.json();
        setData(dataRegister);
        // console.log(" correct",responseData, setShowM);
        setStatus(null);
        setShowM(true); // Mostrar el modal
        resetForm();

        // setError(null);
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : "Error in sending the form";
        setShowM(false);
        setStatus(errorMessage);

        setSubmitting(false);
        setEmailFieldEnabled(true);
      }
    } catch (error) {
      console.error("error", error);
      // setStatus("service error");
      setStatus("service error");
    }
  }

  useEffect(() => {
    if (ShowM) {
      // Lógica para mostrar el modal
      // ...
      console.log("data", data);
      setTimeout(() => {
        setShowM(false);
      }, 100000); // Cerrar el modal después de 10 segundos
    }
  }, [ShowM]);

  const validateForm = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "The name is required";
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.name)) {
      errors.name = "Your name must not contain numbers or other special characters,allow up to 2 names";
    }

    // if (!values.lastName) {
    //   errors.lastName = 'Last Name is required';
    // } else if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.lastName)) {
    //   errors.lastName = 'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames';
    // }

    if (values.lastName && values.lastName.trim() !== "" && !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.lastName)) {
      errors.lastName = "Your Surnames must not contain numbers or other special characters, allow up to 2 surnames";
    }

    if (!values.corporateEmail) {
      errors.corporateEmail = "Corporate email is required";
    } else if (!/^(?!.*@(?:hotmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(values.corporateEmail)) {
      errors.corporateEmail = "The email must be from the company";
    }

    // if (!values.phoneNumber) {
    //   errors.phoneNumber = 'Phone number is required';
    // } else if (!/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(values.phoneNumber)) {
    //   errors.phoneNumber = 'Phone phone must contain numbers';
    // }

    if (values.phoneNumber && !/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(values.phoneNumber)) {
      errors.phoneNumber = "Phone phone must contain numbers";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password)) {
      errors.password = "The password must have more than 8 characters between uppercase";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Password confirmation is required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!values.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions.";
    }

    return errors;
  };

  return (
    <LayoutLogin>
      <nav className="navRegister">
        <Image src={logo} width={120} alt="imgRegister" />
        <ul>
          <li className="Question">Have an account?</li>
          <li className="link">
            <Link href="/login"> Log in</Link>
          </li>
        </ul>
      </nav>

      <div className="register">
        <h1> Sign up</h1>
        <p> Create your account in SEIDOR BPaas</p>

        <Formik
          initialValues={{
            corporateEmail: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
            name: "",
          }}
          // validationSchema={SignupSchemaEN}
          validateOnChange
          validate={validateForm}
          onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
            // same shape as initial values
            console.log(values);
            handleSubmit(values, { setSubmitting, setStatus, resetForm });
          }}
          enableReinitialize={true}
        >
          {({ isValid, isSubmitting, status }) => (
            <Form className="formContainer">
              <div>
                <Field type="text" id="name" name="name" placeholder=" " autoComplete="off" disabled={isSubmitting} />
                <label htmlFor="name">Name</label>
                <ErrorMessage className="errorMessage" name="name" component="span" />
              </div>

              <div>
                <Field type="email" name="corporateEmail" id="corporateEmail" placeholder=" " disabled={!isEmailFieldEnabled || isSubmitting} />
                <label htmlFor="corporateEmail">Company email</label>
                <ErrorMessage className="errorMessage" name="corporateEmail" component="span" />
              </div>

              <div>
                <span className="iconPassword" onClick={togglePasswordVisibility}>
                  <ImageSvg name={showPassword ? "ShowPassword" : "ClosePassword"} />
                </span>
                <Field type={showPassword ? "text" : "password"} id="password" name="password" placeholder=" " disabled={isSubmitting} />
                <label htmlFor="password"> Password</label>
                <ErrorMessage className="errorMessage" name="password" component="span" />
              </div>

              <div>
                <span className="iconPassword" onClick={toggleConfirmPasswordVisibility}>
                  <ImageSvg name={showConfirmPassword ? "ShowPassword" : "ClosePassword"} />
                </span>
                <Field type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder=" " disabled={isSubmitting} />
                <label htmlFor="confirmPassword" placeholder="">
                  Confirm password
                </label>
                <ErrorMessage className="errorMessage" name="confirmPassword" component="span" />
              </div>

              <div>
                <label className="checkbox">
                  <Field className="checkboxId" id="acceptTerms" type="checkbox" name="acceptTerms" disabled={isSubmitting} />

                  <span> I accept</span>
                  <span> SEIDOR BPaaS Terms and Conditions and Privacy Policy</span>
                </label>
                <ErrorMessage className="errorMessage" name="acceptTerms" component="span" />
              </div>

              <button type="submit" disabled={isSubmitting || !isEmailFieldEnabled} className={isValid ? "btn_primary" : "btn_primary disabled"} onClick={() => setEmailFieldEnabled(true)}>
                {isSubmitting ? "Send..." : "Sign Up Now"}
              </button>

              <div className="contentError">
                <div className="errorMessage">{status}</div>
                {/* {data?.oAuditResponse.sMessage !== "OK" && <div className="errorMessage">{data?.oAuditResponse.sMessage}</div>} */}
              </div>
            </Form>
          )}
        </Formik>

        {ShowM && data && (
          <Modal open={true}>
            <div className="contentError">
              <p> We´ve sent a verefication link to</p>
              <h2> {data.oResults.sEmail} </h2>
              <p>Please enter your email to confirm registration</p>
              
            </div>
          </Modal>
        )}
      </div>
    </LayoutLogin>
  );
}
