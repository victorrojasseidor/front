import * as Yup from 'yup'

export const SignupSchemaEN = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/,
      'Your name must not contain numbers or other special characters,allow up to 2 names'
    )
    .required('The name is required'),
  lastName: Yup.string()
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/,
      'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
    )
    .required('Last Name is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      , 'Phone phone must contain numbers')
    .required('Phone number is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'The password must have more than 8 characters between uppercase, lowercase and numbers'
    )
    .required('The password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
    corporateEmail: Yup.string()
    .email('Invalid corporate email')
    .matches(
      /^(?!.*@(?:hotmail\.com|gmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/,
      'The email must be from the company'
    )
    .required('Corporate email is required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions.')
    .required('You must accept the terms and conditions.')
})

export const SignupSchemaES = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/,
      'Tu nombre no debe contener números u otros caracteres especiales, permite hasta 2 nombres'
    )
    .required('El nombre es requerido'),

  // lastName: Yup.string()
  //   .matches(
  //     /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/,
  //     'Tus Apellidos no debe contener números u otros caracteres especiales, permite hasta 2 apellidos'
  //   )
  //   .required('El Apellido es requerido'),

  // phoneNumber: Yup.string()
  //   .matches(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/, 'El número de teléfono debe tener solo números y espacios')
  //   .required('El número de teléfono es requerido'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'La contraseña debe tener más de 8 caracteres entre mayúsculas, minúsculas y números'
    )
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('La confirmación de contraseña es requerida'),
    corporateEmail: Yup.string()
    .email('Correo electrónico corporativo inválido')
    .matches(
      /^(?!.*@(?:hotmail\.com|gmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/,
      'El correo electrónico debe ser de una la empresa'
    )
    .required('El correo electrónico corporativo es requerido'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones.')
    .required('Debes aceptar los términos y condiciones.')
})


export const validateForm = (values) => {
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