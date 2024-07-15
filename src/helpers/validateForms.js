import en from '../../lang/en.json';
import es from '../../lang/es.json';

export const validateFormRegister = (values) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.name) {
    errors.name = t['The name is required'];
  } else if (
    !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(
      values.name
    )
  ) {
    errors.name =
      t[
        'Your name must not contain numbers or other special characters,allow up to 2 names'
      ];
  }

  if (
    values.lastName &&
    values.lastName.trim() !== '' &&
    !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(
      values.lastName
    )
  ) {
    errors.lastName =
      t[
        'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
      ];
  }

  if (!values.corporateEmail) {
    errors.corporateEmail = t['Corporate email is required'];
  } else if (
    !/^(?!.*@(?:hotmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(
      values.corporateEmail
    )
  ) {
    errors.corporateEmail = t['The email must be from the company'];
  }

  if (
    values.phoneNumber &&
    !/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      values.phoneNumber
    )
  ) {
    errors.phoneNumber = t['Phone phone must contain numbers'];
  }

  if (!values.password) {
    errors.password = t['Password is required'];
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password)) {
    errors.password =
      t['The password must have more than 8 characters between uppercase'];
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = t['Password confirmation is required'];
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = t['Passwords do not match'];
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = t['You must accept the terms and conditions'];
  }

  return errors;
};

export const validateFormLogin = (values) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.corporateEmail) {
    errors.corporateEmail = t['Corporate email is required'];
  } else if (
    !/^(?!.*@(?:hotmail\.com|yahoo\.com |outlook\.com)$)([\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(
      values.corporateEmail
    )
  ) {
    errors.corporateEmail = t['The email must be from the company'];
  }

  if (!values.password) {
    errors.password = t['Password is required'];
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.password)) {
    errors.password =
      t['The password must have more than 8 characters between uppercase'];
  }

  return errors;
};

export const validateFormUpdatePassword = (values) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.passwordold) {
    errors.passwordold = t['Password is required'];
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.passwordold)
  ) {
    errors.passwordold =
      t['The password must have more than 8 characters between uppercase'];
  }

  if (!values.passwordnew) {
    errors.passwornew = t['Password is required'];
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.passwordnew)
  ) {
    errors.passwordnew =
      t['The password must have more than 8 characters between uppercase'];
  }

  return errors;
};

export const validateFormprofilestart = (values) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.lastName) {
    errors.lastName = t['Last Name is required'];
  } else if (
    !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(
      values.lastName
    )
  ) {
    errors.lastName =
      t[
        'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
      ];
  }

  if (
    values.lastName &&
    values.lastName.trim() !== '' &&
    !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,}( [A-Za-záéíóúÁÉÍÓÚüÜñÑ]{2,})?$/.test(
      values.lastName
    )
  ) {
    errors.lastName =
      t[
        'Your Surnames must not contain numbers or other special characters, allow up to 2 surnames'
      ];
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = t['Phone number is required'];
  } else if (
    !/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      values.phoneNumber
    )
  ) {
    errors.phoneNumber = t['Phone phone must contain numbers'];
  }

  if (
    values.phoneNumber &&
    !/^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      values.phoneNumber
    )
  ) {
    errors.phoneNumber = t['Phone phone must contain numbers'];
  }

  return errors;
};

export const validateFormAddListBank = (values, initialVal, showcomponent) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.name) {
    errors.name = t['Name is required'];
  }

  if (!values.bank && !initialVal) {
    errors.bank = t['Bank is required'];
  }

  if (!initialVal && !values.password) {
    errors.password = t['Password is required'];
  }

  if (!values.principalCredential && showcomponent?.bCredencial1) {
    errors.principalCredential = t['This credential is required'];
  }

  if (!values.credential2 && showcomponent?.bCredencial2) {
    errors.credential2 = t['This credential is required'];
  }

  if (!values.credential3 && showcomponent?.bCredencial3) {
    errors.credential3 = t['This credential is required'];
  }

  if (!values.credential4 && showcomponent?.bCredencial4) {
    errors.credential4 = t['This credential is required'];
  }

  return errors;
};

export const validateFormAddAccount = (values, initialVal, showcomponent) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.Account && showcomponent.bAccount) {
    errors.Account = t['Account is required'];
  }

  if (!values.Company && showcomponent.bCompany) {
    errors.Company = t['Company is required'];
  }

  if (!values.Ruc && showcomponent.bRuc) {
    errors.Ruc = t['Ruc is required'];
  }

  if (!values.Coin && showcomponent.bCoin) {
    errors.Coin = t['Coin is required'];
  }

  if (!values.TypeFile && showcomponent.bType && !initialVal) {
    errors.TypeFile = t['Type of file is required'];
  }

  return errors;
};

export const validateFormCurrency = (values) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.country) {
    errors.country = t['There is no country'];
  }
  if (!values.fuente) {
    errors.fuente = t['Select source'];
  }
  if (!values.coinOrigin) {
    errors.coinOrigin = t['Select origin currency'];
  }
  if (!values.coinDestiny) {
    errors.coinDestiny = t['Select destination currency'];
  }

  if (values.coinDestiny === values.coinOrigin) {
    errors.coinDestiny = t['Currency cannot be equeal'];
    errors.coinOrigin = t['Select a different currency'];
  }

  return errors;
};

export const validateCaptcha = (values) => {
  const localeSpanish = window.location.href;
  const localeES = localeSpanish.includes('/es/');
  const l = localeES ? es : en;
  const t = l.validation;

  const errors = {};

  if (!values.api) {
    errors.api = t['This value is required'];
  }

  if (!values.user) {
    errors.user = t['This value is required'];
  }

  return errors;
};
