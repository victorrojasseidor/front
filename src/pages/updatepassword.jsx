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

export default function UpdatePassword() {
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
          <h1>Update password</h1>
          <p> create your new password </p>
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
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


                <button
                  className="buttonPrimary"
                  type="submit"
                  disabled={isSubmitting}
                >
                UPDATE
                </button>
              </form>
            )}
          </Formik>
        </div>
      </LayoutLogin>
    </DataContextProvider>
  );
}
