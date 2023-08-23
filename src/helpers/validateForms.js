export const validateFormRegister = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'The name is required'
  } else if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.name)) {
    errors.name = 'Your name must not contain numbers or other special characters,allow up to 2 names'
  }

  // if (!values.lastName) {
  //   errors.lastName = 'Last Name is required';
  // } else if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.lastName)) {
  //   errors.lastName = 'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames';
  // }

  if (values.lastName && values.lastName.trim() !== '' && !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.lastName)) {
    errors.lastName = 'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
  }

  if (!values.corporateEmail) {
    errors.corporateEmail = 'Corporate email is required'
  } else if (!/^(?!.*@(?:hotmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(values.corporateEmail)) {
    errors.corporateEmail = 'The email must be from the company'
  }

  // if (!values.phoneNumber) {
  //   errors.phoneNumber = 'Phone number is required';
  // } else if (!/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(values.phoneNumber)) {
  //   errors.phoneNumber = 'Phone phone must contain numbers';
  // }

  if (values.phoneNumber && !/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone phone must contain numbers'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password)) {
    errors.password = 'The password must have more than 8 characters between uppercase'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Password confirmation is required'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions.'
  }

  return errors
}

export const validateFormLogin = (values) => {
  const errors = {}

  if (!values.corporateEmail) {
    errors.corporateEmail = 'Corporate email is required'
  } else if (!/^(?!.*@(?:hotmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(values.corporateEmail)) {
    errors.corporateEmail = 'The email must be from the company'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password)) {
    errors.password = 'The password must have more than 8 characters between uppercase'
  }

  return errors
}

export const validateFormprofilestart = (values) => {
  const errors = {}

  if (!values.lastName) {
    errors.lastName = 'Last Name is required'
  } else if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.lastName)) {
    errors.lastName = 'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
  }

  if (values.lastName && values.lastName.trim() !== '' && !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(values.lastName)) {
    errors.lastName = 'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone phone must contain numbers'
  }

  if (values.phoneNumber && !/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone phone must contain numbers'
  }

  return errors
}

export const validateFormAddListBank = (values, initialValues) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Name is required'
  }

  if (!values.principalCredential) {
    errors.principalCredential = 'Principal Credential is required'
  }

  if (!initialValues) {
    if (!values.bank) {
      errors.bank = 'Bank is required'
    }

    if (!values.country) {
      errors.country = 'Country is required'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    }
  }

  return errors
}

export const validateFormAddAccount = (values, initialValues) => {
  const errors = {}

  // if (!values.Company) {
  //   errors.Company = 'Company is required'
  // }

  // if (!values.Ruc) {
  //   errors.Ruc = 'Ruc is required'
  // }

  // if (!values.Coin) {
  //   errors.Coin = 'Coin is required'
  // }

  // if (!values.TypeFile) {
  //   errors.TypeFile = 'Type of file is required'
  // }

  if (!values.Account) {
    errors.Account = 'Account is required'
  }

  return errors
}
