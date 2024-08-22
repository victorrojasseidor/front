import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select';
import { validateFormAddListBank } from '@/helpers/validateForms';
import ModalForm from '@/Components/Atoms/ModalForm';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';

const FormCredentials = ({ onAgregar, initialVal, setIinitialEdit, dataUser, handleEditListBank, setShowForm }) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [country, setCountry] = useState(null);
  const [showcomponent, setShowComponent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { l } = useAuth();
  const t = l.Download;

  const countryData = dataUser?.oPaisBanco;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Cargar las opciones del país en el estado usando useEffect
    setCountryOptions(
      countryData?.map((country) => ({
        value: country.value,
        label: country.label,
      }))
    );

    // Si hay un valor preseleccionado en initialValues.country o no estás en modo de edición, seleccionar el país
    if (initialVal && initialVal.country) {
      const selectedCountryData = countryData.find((c) => c.value === initialVal.country);
      setCountry(selectedCountryData);
    } else {
      setCountry(countryData[0]); // Seleccionar el primer país por defecto
    }

    // Cargar las opciones de banco según el país seleccionado
    if (country) {
      const selectedCountryData = countryData.find((c) => c.value === country.value);
      setBankOptions(selectedCountryData.banks);
    } else {
      setBankOptions([]);
    }
  }, [countryData, initialVal, country]);

  const initialValues = {
    name: initialVal?.nombre || '', // Usamos los valores iniciales si están disponibles
    password: '', // parq ue no se vea el passwoard
    principalCredential: initialVal?.usuario || '',
    credential2: initialVal?.usuario_a || '',
    credential3: initialVal?.usuario_b || '',
    credential4: initialVal?.usuario_c || '',
    bank: initialVal?.bank || null,
    country: initialVal?.country || null,
    state: initialVal && initialVal.estado_c == '23' ? 'Active' : initialVal ? 'Disabled' : 'Active',
  };

  useEffect(() => {
    if (initialVal && bankOptions) {
      const bankinintial = bankOptions.find((option) => option.id === initialVal.id_banco);
      if (bankinintial) {
        setShowComponent(bankinintial?.jConfCredencial);
      }
    }
  }, [bankOptions, initialVal]);

  return (
    <ModalForm
      close={() => {
        setIinitialEdit(null);
        setShowForm(false);
      }}
    >
      <div className="Form-listCredential">
        <h2 className="box">{initialVal ? t['Edit credential'] : t['Add credential']}</h2>
        <Formik
          initialValues={initialValues}
          // validate={initialVal === null ? validateFormAddListBank : undefined}
          // validate={validateFormAddListBank}
          validate={(values) => validateFormAddListBank(values, initialVal, showcomponent)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditListBank(values);
            } else {
              onAgregar(values);
            }
            resetForm();
          }}
        >
          {({ values, isValid, setFieldValue }) => (
            <Form className="form-container formCredential">
              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 1. {t['Register your bank']} </h5>
                  <p className="description">{t['Add the bank']}</p>
                </div>
                <div className="group">
                  <div className="input-box">
                    <Field type="text" name="name" placeholder=" " />
                    <label htmlFor="name">{t['Name of Bank Credential']}</label>
                    <ErrorMessage name="name" component="span" className="errorMessage" />
                  </div>

                  <div className="country-box">
                    <label htmlFor="country">{t['Select a country']}</label>
                    <Select
                      options={countryOptions}
                      name="country"
                      placeholder={t['Select a country']}
                      isClearable
                      value={countryOptions[0]}
                      isDisabled={!!initialVal?.oListCuentas.length > 0}
                      // value={country}
                      onChange={(selectedOption) => {
                        setCountry(selectedOption);
                        setFieldValue('country', selectedOption);
                        setFieldValue('bank', null); // Resetear el banco seleccionado cuando se cambia el país
                      }}
                    />
                  </div>

                  <div className="bank-box">
                    <label htmlFor="bank">{t['Select a bank']}</label>
                    <Select
                      options={bankOptions}
                      name="bank"
                      placeholder={t['Select a bank']}
                      isClearable
                      value={values.bank || (initialVal && bankOptions.find((option) => option.id === initialVal.id_banco))}
                      onChange={(selectedOption) => {
                        setShowComponent(selectedOption?.jConfCredencial);
                        setFieldValue('bank', selectedOption);
                      }}
                      isDisabled={initialVal?.oListCuentas.length > 0 ? true : !country}
                    />
                  </div>

                  <div className="input-box">
                    <span className="iconPassword" onClick={togglePasswordVisibility}>
                      <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                    </span>
                    <Field type={showPassword ? 'text' : 'password'} name="password" placeholder="" />
                    <label htmlFor="password">{initialVal ? t['Update old password'] : t.Password}</label>
                    <ErrorMessage name="password" component="span" className="errorMessage" />
                  </div>
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 2. {t['Add Credential']} </h5>
                  <p className="description">{t['Register your credentials']}</p>
                </div>

                <div className="group">
                  {showcomponent?.bCredencial1 && (
                    <div className="input-box">
                      <Field type="text" name="principalCredential" placeholder=" " />
                      <label htmlFor="principalCredential">{showcomponent?.sCredencial1}</label>
                      <ErrorMessage name="principalCredential" component="span" className="errorMessage" />
                    </div>
                  )}

                  {showcomponent?.bCredencial2 && (
                    <div className="input-box">
                      <Field type="text" name="credential2" placeholder=" " />
                      <label htmlFor="credential2">{showcomponent?.sCredencial2}</label>
                      <ErrorMessage name="credential2" component="span" className="errorMessage" />
                    </div>
                  )}

                  {showcomponent?.bCredencial3 && (
                    <div className="input-box">
                      <Field type="text" name="credential3" placeholder=" " />
                      <label htmlFor="credential3">{showcomponent?.sCredencial3}</label>
                      <ErrorMessage name="credential3" component="span" className="errorMessage" />
                    </div>
                  )}

                  {showcomponent?.bCredencial4 && (
                    <div className="input-box">
                      <Field type="text" name="credential4" placeholder=" " />
                      <label htmlFor="credential4">{showcomponent?.sCredencial4}</label>
                      <ErrorMessage name="credential4" component="span" className="errorMessage" />
                    </div>
                  )}
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 3. {t.State} </h5>
                  <p className="description">{t['Activate or deactivate the download of bank statements for this credential']}</p>
                </div>
                <div className="state-box">
                  <label>{t.State}: </label>
                  <div className="content">
                    <label>
                      <Field type="radio" name="state" value="Active" />
                      {t.Active}
                    </label>
                    <label>
                      <Field type="radio" name="state" value="Disabled" />
                      {t.Disabled}
                    </label>
                  </div>
                </div>
              </div>
              <div className="submit-box">
                <button
                  type="submit"
                  className="btn_secundary small"
                  onClick={() => {
                    setIinitialEdit(null);
                    setShowForm(false);
                  }}
                >
                  {t.Close}
                </button>

                <button type="submit" className={`btn_primary small ${!isValid ? 'disabled' : ''}`} disabled={!isValid}>
                  {initialVal ? t['Update']: t['Add']}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ModalForm>
  );
};

export default FormCredentials;
