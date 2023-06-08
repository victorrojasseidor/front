import LayoutLogin from "@/Components/LayoutLogin";
import "../../styles/styles.scss";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Form } from "formik";




const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('El correo electrónico no es válido.')
    .required('El correo electrónico es requerido.'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .required('La contraseña es requerida.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden.')
    .required('Debes confirmar la contraseña.'),
  name: Yup.string().required('Los nombres son requeridos.'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones.')
    .required('Debes aceptar los términos y condiciones.'),
});

const MyForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (values) => {
    // Realizar acción cuando el formulario es válido
    console.log('Formulario válido', values);
  };


  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        acceptTerms: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component="span" className="error" />
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <div className="password-input">
            <Field
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-icon"
              />
            </span>
          </div>
          <ErrorMessage name="password" component="span" className="error" />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <div className="password-input">
            <Field
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
            />
            <span
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="password-icon"
              />
            </span>
          </div>
          <ErrorMessage
            name="confirmPassword"
            component="span"
            className="error"
          />
        </div>

        <div>
          <label htmlFor="name">Nombres:</label>
          <Field type="text" id="name" name="name" />
          <ErrorMessage name="name" component="span" className="error" />
        </div>

        <div>
          <label>
            <Field type="checkbox" name="acceptTerms" />
            Acepto los términos y condiciones
          </label>
          <ErrorMessage
            name="acceptTerms"
            component="span"
            className="error"
          />
        </div>

        <button type="submit">Enviar</button>
      </Form>
    </Formik>
  );
};

export default MyForm;