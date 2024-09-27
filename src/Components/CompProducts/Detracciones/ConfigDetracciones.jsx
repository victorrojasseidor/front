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
  const [isEditing] = useState(null);

  const [dataDetracciones, setDataDetracciones] = useState(null);
  const [dataCardProduct, setdataCardProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [completeEmails, setcompleteEmails] = useState(false);
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

  //   async function handleAgregar(values) {
  //     setIsLoadingComponent(true);

  //     const body = {
  //       oResults: {
  //         oPadrones: [
  //           {
  //             iIdPadrones: parseInt(iIdProdEnv),
  //             iIdDocumento: values.Pattern,
  //             iIdPais: values.country,
  //             bEstado: true,
  //             // bEstado: values.state === 'Active'
  //           },
  //         ],
  //       },
  //     };

  //     try {
  //       const token = session.sToken;
  //       const responseData = await fetchConTokenPost('BPasS/?Accion=RegistrarPadrones', body, token);

  //       if (responseData.oAuditResponse?.iCode === 1) {
  //         // const data = responseData.oResults
  //         setTimeout(() => {
  //           setModalToken(false);
  //           setShowForm(false);
  //           setGet(!get);
  //           setRequestError(null);
  //         }, 1000);
  //       } else {
  //         await handleCommonCodes(responseData);
  //         setShowForm(true);
  //       }
  //     } catch (error) {
  //       console.error('error', error);

  //       setShowForm(true);
  //       setRequestError(error);
  //     } finally {
  //       setIsLoadingComponent(false);
  //     }
  //   }

  useEffect(() => {
    if (session) {
      getPadrones();
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
        console.log('data', data);
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

  async function getPadrones() {
    setIsLoadingComponent(true);
    const body = {
      oResults: {
        iIdPadrones: iIdProdEnv, // [1]
        iIdPais: idCountry || dataCardProduct?.iCountry,
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetPadrones', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const dataRes = responseData.oResults;
        setDataDetracciones(dataRes);
        if (dataRes.oCorreo.length > 0) {
          setcompleteEmails(true);
        }
        if (dataRes.oPadrones.length > 0) {
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
    RUC: dataDetracciones?.ruc || '',
    User: dataDetracciones?.user || '',
    password: dataDetracciones?.password || '',
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
              <div className="status-config">
                <h3 className="title-Config"> {l.Download.State} </h3>
                <ul>
                  <li>
                    <p>{l.Download['Digital employees']}</p>
                    <p>:</p>
                    {/* <p className="name-blue">{dataCardProduct?.sName}</p> */}

                    <p>Detracciones </p>
                  </li>
                  <li>
                    <p>{l.Download['Start service:']}</p>
                    <p>:</p>
                    <p> {formatDate(dataCardProduct?.sDateInit)}</p>
                  </li>
                  <li>
                    <p>{l.Download['End service:']}</p>
                    <p>:</p>
                    <p> {formatDate(dataCardProduct?.sDateEnd)} </p>
                  </li>
                  <li>
                    <p>{l.Download.Country} </p>
                    <p>:</p>
                    <p>{dataCardProduct?.sCountry}</p>
                  </li>
                  <li>
                    <p>{l.Download.State} </p>
                    <p>:</p>
                    <p className="Active">{dataCardProduct?.sDescStatus}</p>
                  </li>
                </ul>
              </div>

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
            <div className="container-detraccions">
              <div className="box-title">
                <div>
                  <h3 className="sub"> {t['Credentials for entry to SUNAT']} </h3>
                  <p>{t['Enter credentials from the Tax Obligation Payment System (SPOT)']}</p>
                </div>

                <button
                  className="btn_black"
                  style={{
                    display: initialEdit !== null ? 'none' : 'block',
                  }}
                  onClick={() => {
                    // toggleForm();
                    // setTypeofChange(1);
                  }}
                >
                  {t.Edit}
                </button>
              </div>

              <Formik
                initialValues={initialValues}
                //   validate={(values) => validateFormAddAccount(values, initialVal, showcomponent)}
                onSubmit={(values, { resetForm }) => {
                  if (dataDetracciones) {
                    // handleEditListAccount(values);
                  } else {
                    // onAgregar(values);
                  }
                  resetForm();
                }}
              >
                {({ values, isValid, setFieldValue, isSubmitting }) => (
                  <Form className="form-container formCredential">
                    <div className="content">
                      <div className="subtitle"></div>

                      <div className="input-box">
                        <Field type="number" name="RUC" placeholder=" " />
                        <label htmlFor="RUC">{t['RUC']}</label>
                        <ErrorMessage name="RUC" component="span" className="errorMessage" />
                      </div>

                      <div className="group">
                        <div className="input-box">
                          <Field type="text" name="User" placeholder=" " />
                          <label htmlFor="User">{t['User']}</label>
                          <ErrorMessage name="User" component="span" className="errorMessage" />
                        </div>

                        <div className="input-box">
                          <span className="iconPassword" onClick={togglePasswordVisibility}>
                            <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                          </span>
                          <Field type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder=" " disabled={isSubmitting} />
                          <label htmlFor="password"> {t.Password}</label>
                          <ErrorMessage className="errorMessage" name="password" component="span" />
                        </div>
                      </div>
                    </div>

                    {/* <div className="submit-box">
                      <button
                        type="submit"
                        className="btn_secundary small"
                        onClick={() => {
                          setShowForm(false);
                        }}
                      >
                        {t.Cancel}
                      </button>

                      <button type="submit" className={`btn_primary small ${!isValid ? 'disabled' : ''}`} disabled={!isValid}>
                        {dataDetracciones ? t.Cancel : t.Save}
                      </button>
                    </div> */}
                    
                  </Form>
                )}
              </Formik>

              {/* {completeDetracciones ? (
                <div className="box-buttons">
                  <button type="button" className="btn_secundary small" onClick={() => handleTabClick(0)}>
                    <ImageSvg name="Back" />

                    {l.Download.Previus}
                  </button>
                  <button className={`btn_secundary small  ${completeDetracciones ? ' ' : 'disabled'}`} onClick={() => setConfirmedConfigured(true)} disabled={!completeDetracciones}>
                    {l.Download.Finish}
                    <ImageSvg name="Next" />
                  </button>
                </div>
              ) : (
                <div className="noti">
                  <p> {t['Register the daily exchange rates']}</p>
                  <p>
                    {' '}
                    <span> {t['click on Add']} </span>{' '}
                  </p>
                </div>
              )} */}

            </div>
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
              <h3>{t['Successful configuration']}</h3>

              <div className="box-buttons">
                <button
                  type="button"
                  className="btn_primary small"
                  onClick={() => {
                    router.push('/product');
                    setConfirmedConfigured(false);
                  }}
                >
                  {t['Return a home']}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
