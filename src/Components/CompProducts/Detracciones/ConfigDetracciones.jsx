/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import EmailsForm from '../DowloandCurrency/EmailsForm';
import ImageSvg from '@/helpers/ImageSVG';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import { useRouter } from 'next/router';
import Modal from '@/Components/Modal';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { formatDate } from '@/helpers/report';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import FormPatters from './FormPatters';

export default function ConfigDetracciones() {
  const [initialEdit, setIinitialEdit] = useState(null);
  const [dataDetracciones, setDataDetracciones] = useState(null);
  const [dataCardProduct, setdataCardProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [completeEmails, setcompleteEmails] = useState(false); //poner en false
  const [completeDetracciones, setcompleteDetracciones] = useState(false); //debe ser falso
  const [updateEmails, setUpdateEmails] = useState(true);
  const [confirmedConfigured, setConfirmedConfigured] = useState(false);
  const [get, setGet] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const router = useRouter();
  const iIdProdEnv = router.query.iIdProdEnv;
  const iId = router.query.iId;
  const idEmpresa = router.query.idEmpresa;

  const { session, setModalToken, logout, l, idCountry, getProducts } = useAuth();

  const t = l.Detractions;

  async function handleCommonCodes(response) {
    if (response.oAuditResponse?.iCode === 27) {
      setModalToken(true);
    } else if (response.oAuditResponse?.iCode === 4) {
      await logout();
    } else {
      const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in delete ';
      console.log('errok, ', errorMessage);
      setModalToken(false);
      setRequestError(errorMessage);
      setTimeout(() => {
        setRequestError(null); // Limpiar el mensaje después de 3 segundos
      }, 5000);
    }
  }

  async function handleAgregar(values) {
    setIsLoadingComponent(true);

    const body = {
      oResults: {
        iIdProducto: parseInt(iIdProdEnv),
        sRuc: values.RUC,
        sUser: values.User,
        sPassword: values.password,
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=RegistrarDetraccion', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        // const data = responseData.oResults
        setTimeout(() => {
          setModalToken(false);
          setShowForm(false);
          setGet(!get);
          setRequestError(null);
        }, 1000);
      } else {
        await handleCommonCodes(responseData);
        setShowForm(true);
      }
    } catch (error) {
      console.error('error', error);

      setShowForm(true);
      setRequestError(error);
    } finally {
      setIsLoadingComponent(false);
    }
  }

  useEffect(() => {
    if (session) {
      getDetracciones();
    }
  }, [updateEmails, get]);

  useEffect(() => {
    getDataProduct();
  }, [idEmpresa, updateEmails]);

  async function getDataProduct() {
    setIsLoadingComponent(true);
    try {
      const token = session.sToken;
      const responseData = await getProducts(idEmpresa, token, idCountry);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const data = responseData.oResults;
        const selectedProduct = data.find((p) => p.iId === parseInt(iId));
        setdataCardProduct(selectedProduct);
        // setGet(!get)
      } else {
        await handleCommonCodes(responseData);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingComponent(false);
    }
  }

  async function getDetracciones() {
    setIsLoadingComponent(true);
    const body = {
      oResults: {
        iIdProducto: iIdProdEnv, // [1]
        iIdPais: idCountry || dataCardProduct?.iCountry,
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=ObtenerDetraccion', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const dataRes = responseData.oResults;
        setDataDetracciones(dataRes);
        setIinitialEdit(dataRes.oDetracciones[0]);

        if (dataRes.oCorreo.length > 0) {
          setcompleteEmails(true);
        }

        if (dataRes.oDetracciones.length > 0) {
          setcompleteDetracciones(true);
        }
      } else {
        await handleCommonCodes(responseData);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingComponent(false);
    }
  }

  const initialValues = {
    RUC: initialEdit?.sRuc || '',
    User: initialEdit?.sUsuario || '',
    password: initialEdit?.sPassword || '',
  };

  return (
    <div className="pattern-configuration">
      <div className="Tabsumenu">
        <div className="Tabsumenu-header ">
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name="Check" />
            <h4> {l.Download['Status and emails']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 1 ? 'activeST' : ''} ${completeDetracciones ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}>
            <ImageSvg name="Check" />
            <h4> {t.Credentials} </h4>
          </button>
        </div>

        <div className="Tabsumenu-content">
          {activeTab === 0 && (
            <div className="container-status">
              {isLoadingComponent && <LoadingComponent />}

              {requestError && <p className="error-message">{requestError}</p>}

              <EmailsForm dataEmails={dataDetracciones?.oCorreo} setUpdateEmails={setUpdateEmails} sProduct={dataCardProduct?.sProd} get={get} setGet={setGet} />

              <div className="box-buttons">
                <button type="button" className={`btn_secundary small ${completeEmails ? ' ' : 'disabled'}`} onClick={() => handleTabClick(1)} disabled={!completeEmails}>
                  {l.Download.Next}
                  <ImageSvg name="Next" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <>
              <div className="container-detraccions">
                <div className="box-title">
                  <div>
                    <h3 className="sub"> {t['Credentials for entry to SUNAT']} </h3>
                    <p>{t['Enter credentials from the Tax Obligation Payment System (SPOT)']}</p>
                  </div>

                  <button
                    className="btn_black"
                    style={{
                      visibility: showForm && completeDetracciones ? 'hidden' : 'visible',
                    }}
                    onClick={() => {
                      toggleForm();
                    }}
                  >
                    {initialEdit ? t.Edit : t.Add}
                  </button>
                </div>

                <Formik
                  initialValues={initialValues}
                  enableReinitialize={true} // Esto permite que Formik se reinicie con nuevos valores
                  onSubmit={(values, { resetForm }) => {
                    handleAgregar(values);

                    resetForm();
                  }}
                >
                  {({ values, isValid, setFieldValue, isSubmitting, resetForm }) => (
                    <Form className="form-container formCredential">
                      <div className="content">
                        <div className="subtitle"></div>

                        <div className="input-box">
                          <Field type="number" name="RUC" placeholder=" " disabled={!showForm || isSubmitting} />
                          <label htmlFor="RUC">{t['RUC']}</label>
                          <ErrorMessage name="RUC" component="span" className="errorMessage" />
                        </div>

                        <div className="group">
                          <div className="input-box">
                            <Field type="text" name="User" placeholder=" " disabled={!showForm || isSubmitting} />
                            <label htmlFor="User">{t['User']}</label>
                            <ErrorMessage name="User" component="span" className="errorMessage" />
                          </div>

                          <div className="input-box">
                            <span className="iconPassword" onClick={togglePasswordVisibility}>
                              <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                            </span>
                            <Field type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder=" " disabled={!showForm || isSubmitting} />
                            <label htmlFor="password"> {t.Password}</label>
                            <ErrorMessage className="errorMessage" name="password" component="span" />
                          </div>
                        </div>
                      </div>

                      {showForm && (
                        <div className="submit-box">
                          <button
                            type="button"
                            className="btn_secundary small"
                            onClick={() => {
                              setShowForm(false);
                              resetForm();
                            }}
                          >
                            {t.Cancel}
                          </button>

                          <button type="submit" className={`btn_primary small ${!values ? 'disabled' : ''}`}>
                            {t.Save}
                          </button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>

              {completeDetracciones && !showForm ? (
                <div className="box-buttons">
                  <button type="button" className="btn_secundary small" onClick={() => handleTabClick(0)}>
                    <ImageSvg name="Back" />

                    {t.Back}
                  </button>
                  <button className={`btn_secundary small  ${completeDetracciones ? ' ' : 'disabled'}`} onClick={() => setConfirmedConfigured(true)} disabled={!completeDetracciones}>
                    {t.Finish}
                    <ImageSvg name="Next" />
                  </button>
                </div>
              ) : (
                ' '
              )}
            </>
          )}
        </div>

        {confirmedConfigured && (
          <Modal
            close={() => {
              setConfirmedConfigured(false);
            }}
          >
            <ImageSvg name="Check" />

            <div>
              <h3>{t['Setup Completed']}</h3>

              <div className="box-buttons">
                <button
                  type="button"
                  className="btn_primary small"
                  onClick={() => {
                    router.push('/product');
                    setConfirmedConfigured(false);
                  }}
                >
                  {l.Download['Return a home']}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
