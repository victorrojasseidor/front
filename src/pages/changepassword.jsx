import Link from "next/link";
import { DataContextProvider } from "@/Context/DataContext";
import LayoutLogin from "@/Components/LayoutLogin";
import "../../styles/styles.scss";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("The password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  corporateEmail: Yup.string()
    .email("Invalid corporate email")
    .matches(/^(?!.*@(?:hotmail\.com|gmail\.com|yahoo\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/, "The email must be from the company")
    .required("Corporate email is required"),
});

export default function ChangePassword() {
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
    <DataContextProvider>
      <LayoutLogin>
        <div className="register">
          <h1>Change my password</h1>
          <p> Please enter your email. You will be sent a link to change your password</p>
          <Formik
            initialValues={{
              name: "",
              email: "",
              
              password: "",
              confirmPassword: "",
              corporateEmail: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <form className="form">
                
                <div>
                  <label htmlFor="corporateEmail">Company email</label>
                  <Field type="email" name="corporateEmail" />
                  <ErrorMessage
                    className="errorMessage"
                    name="corporateEmail"
                    component="div"
                  />
                </div>
                          
                <button
                  className="buttonPrimary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  SEND
                </button>
              </form>
            )}
          </Formik>
        </div>
      </LayoutLogin>
    </DataContextProvider>
  );
}
