import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import { useRouter } from 'next/router';
import { validateFormAddAccount } from '@/helpers/validateForms';
import ModalForm from '@/Components/Atoms/ModalForm';

const FormAccounts = ({ onAgregar, initialVal, setIinitialEdit, handleEditListAccount, setShowForm, showForm, showcomponent }) => {
  const [fileTypeOptions, setFileTypeOptions] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(initialVal?.moneda);

  const router = useRouter();
  // const id = router.query.iId
  const iIdProdEnv = router.query.iIdProdEnv;

  const { session, setModalToken, l, idCountry } = useAuth();
  const t = l.Download;

  useEffect(() => {
    if (session) {
      getExtrBancToFile();
    }
  }, [session, iIdProdEnv, showForm, initialVal, l]);

  async function getExtrBancToFile() {
    const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdPais: idCountry,
      },
    };
    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetExtBancario', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults.oTipoArchivo;
        setFileTypeOptions(
          data.map((file) => ({
            value: file.id_tipo_archivo,
            label: file.nombre,
          }))
        );
        setModalToken(false);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        console.error('error, ', errorMessage);
      }
    } catch (error) {
      console.error('error', error);
    }
  }

  const initialValues = {
    Account: initialVal?.cuenta || '',
    DesAccount: initialVal?.descripcion_cuenta || '', // Usamos los valores iniciales si están disponibles
    Company: initialVal?.empresa || '',
    DesCompany: initialVal?.descripcion_empresa || '',
    Ruc: initialVal?.ruc || '',
    Coin: selectedCoin,
    DesCoin: initialVal?.descripcion_moneda || '',
    TypeFile: null,
    state: initialVal && initialVal.estado == '23' ? 'Active' : initialVal ? 'Disabled' : 'Active',
  };

  const coinOptions = session?.oMoneda.map((coin) => ({
    value: coin.codigo_moneda,
    label: coin.codigo_moneda,
  }));

  return (
    <ModalForm
      close={() => {
        setIinitialEdit(null);
        setShowForm(false);
      }}
    >
      <div className="Form-listCredential">
        <h2 className="box">{initialVal ? t['Edit record'] : t['Add account']}</h2>
        <Formik
          initialValues={initialValues}
          validate={(values) => validateFormAddAccount(values, initialVal, showcomponent)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditListAccount(values);
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
                  <h5 className="sub"> 1. {t['Register your Account']} </h5>
                </div>

                <div className="group">
                  {showcomponent?.bAccount && (
                    <div className="input-box">
                      <Field type="text" name="Account" placeholder=" " />
                      <label htmlFor="Account">{t['Account Alias']}</label>
                      <ErrorMessage name="Account" component="span" className="errorMessage" />
                    </div>
                  )}
                  {showcomponent?.bAccountDescription && (
                    <div className="input-box">
                      <Field type="text" name="DesAccount" placeholder=" " />
                      <label htmlFor="DesAccount">{showcomponent.sAccountDescription}</label>
                      <ErrorMessage name="DesAccount" component="span" className="errorMessage" />
                    </div>
                  )}
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 2. {t['Register company']} </h5>
                  {/* <p className='description'>
                  Add all your accounts to automate
                  </p> */}
                </div>
                <div className="group">
                  {showcomponent?.bCompany && (
                    <div className="input-box">
                      <Field type="text" name="Company" placeholder=" " />
                      <label htmlFor="Company">{showcomponent.sCompany}</label>
                      <ErrorMessage name="Company" component="span" className="errorMessage" />
                    </div>
                  )}
                  {showcomponent?.bCompanyDescription && (
                    <div className="input-box">
                      <Field type="text" name="DesCompany" placeholder=" " />
                      <label htmlFor="DesCompany"> {showcomponent.sCompanyDescription}</label>
                      <ErrorMessage name="DesCompany" component="span" className="errorMessage" />
                    </div>
                  )}
                  {showcomponent?.bRuc && (
                    <div className="input-box">
                      <Field type="number" name="Ruc" placeholder=" " />
                      <label htmlFor="Ruc">{showcomponent.sRuc}</label>
                      <ErrorMessage name="Ruc" component="span" className="errorMessage" />
                    </div>
                  )}
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 3. {t['Register currency']} </h5>
                  {/* <p className='description'>
                    Add all your accounts to automate
                  </p> */}
                </div>
                <div className="group">
                  {showcomponent?.bCoin && (
                    <div className="bank-box">
                      <label htmlFor="coin">{t.Currency} </label>
                      <Select
                        options={coinOptions}
                        name="Coin"
                        placeholder={t['Select the currency']}
                        isClearable
                        value={coinOptions.find((option) => option.value === selectedCoin)}
                        onChange={(selectedOption) => {
                          const newValue = selectedOption?.value || null;
                          setSelectedCoin(newValue);
                          setFieldValue('Coin', newValue);
                        }}
                      />

                      <ErrorMessage name="Coin" component="span" className="errorMessage" />
                    </div>
                  )}
                  {showcomponent?.bCoinDescription && (
                    <div className="input-box">
                      <Field type="text" name="DesCoin" placeholder=" " />
                      <label htmlFor="DesCoin">{showcomponent.sCoinDescription}</label>
                      <ErrorMessage name="DesCoin" component="span" className="errorMessage" />
                    </div>
                  )}
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 4. {t['How do you want recibir tu information?']} </h5>
                  {/* <p className='description'>
                  Add all your accounts to automate
                  </p> */}
                </div>
                <div className="group">
                  {showcomponent?.bType && (
                    <div className="bank-box">
                      <label htmlFor="bank">{t.File}</label>
                      <Select
                        options={fileTypeOptions}
                        name="TypeFile"
                        placeholder={t['Select a type of file']}
                        isClearable
                        // value={(initialVal && fileTypeOptions && TypeFile===null )?fileTypeOptions.find(option => option.value === initialVal.id_tipo_archivo) : values.TypeFile}
                        value={initialVal && fileTypeOptions && !values.TypeFile ? fileTypeOptions.find((option) => option.value === initialVal.id_tipo_archivo) : values.TypeFile}
                        onChange={(selectedOption) => {
                          setFieldValue('TypeFile', selectedOption);
                        }}
                      />

                      <ErrorMessage name="TypeFile" component="span" className="errorMessage" />
                    </div>
                  )}
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 5. {t.State} </h5>
                  <p className="description">{t['Activate or deactivate your Account']}</p>
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
                  {initialVal ? t.Update : t.Add}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ModalForm>
  );
};

export default FormAccounts;
