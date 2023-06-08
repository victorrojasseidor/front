import * as Yup from "yup";

export const SignupSchemaEN = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "The password must have more than 8 characters between uppercase, lowercase and numbers")
    .required("The password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  corporateEmail: Yup.string()
    .email("Invalid corporate email")
    .matches(/^(?!.*@(?:hotmail\.com|gmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/, "The email must be from the company")
    .required("Corporate email is required"),
  acceptTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions.").required("You must accept the terms and conditions.")
});

export const SignupSchemaES = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "El número de teléfono debe tener 10 dígitos")
    .required("El número de teléfono es requerido"),
  password: Yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "La contraseña debe tener más de 8 caracteres entre mayúsculas, minúsculas y números")
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("La confirmación de contraseña es requerida"),
  corporateEmail: Yup.string()
    .email("Correo electrónico corporativo inválido")
    .matches(/^(?!.*@(?:hotmail\.com|gmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/, "El correo electrónico debe ser de la empresa")
    .required("El correo electrónico corporativo es requerido"),
  acceptTerms: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones.").required("Debes aceptar los términos y condiciones.")
});

