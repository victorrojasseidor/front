import React, { useState, useEffect } from 'react';
import EmailsForm from '../DowloandCurrency/EmailsForm';
import ImageSvg from '@/helpers/ImageSVG';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import { useRouter } from 'next/router';
import Modal from '@/Components/Modal';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { formatDate } from '@/helpers/report';
import FormPatters from './FormPatters';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function ConfigPattern() {
  const [initialEdit, setIinitialEdit] = useState(null);
  const [isEditing] = useState(null);
  const [dataPadrones, setDataPadrones] = useState(null);
  const [dataCardProduct, setdataCardProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [completeEmails, setcompleteEmails] = useState(false);
  const [completePadrones, setcompletePadrones] = useState(false);
  const [updateEmails, setUpdateEmails] = useState(true);
  const [confirmedConfigured, setConfirmedConfigured] = useState(false);
  const [get, setGet] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const router = useRouter();
  const iIdProdEnv = router.query.iIdProdEnv;
  const iId = router.query.iId;
  const idEmpresa = router.query.idEmpresa;

  const { session, setModalToken, logout, l, idCountry, getProducts, setModalDenied } = useAuth();

  const t = l.Pattern;

  async function handleCommonCodes(response) {
    if (response.oAuditResponse?.iCode === 27) {
      setModalToken(true);
    } else if (response.oAuditResponse?.iCode === 4) {
      await logout();
    } else if (response.oAuditResponse?.iCode === 403) {
      setModalDenied(true);
      setTimeout(() => {
        setModalDenied(false);
        router.push('/product');
      }, 8000);
    } else {
      const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in delete ';
      console.log('error, ', errorMessage);
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
        oPadrones: [
          {
            iIdPadrones: parseInt(iIdProdEnv),
            iIdDocumento: values.Pattern,
            iIdPais: values.country,
            bEstado: true,
            // bEstado: values.state === 'Active'
          },
        ],
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=RegistrarPadrones', body, token);

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
        const selectedProduct = data.find((p) => p.iId === parseInt(iId));
        setdataCardProduct(selectedProduct);
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
        iIdPadrones: Number(iIdProdEnv), 
        iIdPais: Number(idCountry) || dataCardProduct?.iCountry,
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetPadrones', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const dataRes = responseData.oResults;
        setDataPadrones(dataRes);
        if (dataRes.oCorreo.length > 0) {
          setcompleteEmails(true);
        }
        if (dataRes.oPadrones.length > 0) {
          setcompletePadrones(true);
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

  const handleDeleteConfirmation = async () => {
    if (selectedRowToDelete) {
      await handleDeletePadrones(selectedRowToDelete?.id_principal);
      setSelectedRowToDelete(null);
    }
  };

  const handleDeletePadrones = async (id) => {
    setIsLoadingComponent(true);
    const token = session.sToken;
    const body = {
      oResults: {
        oIdRegistro: [id],
      },
    };

    try {
      const response = await fetchConTokenPost('BPasS/?Accion=EliminarPadrones', body, token);
      console.error('res', response);
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        setGet(!get);
        setTimeout(() => {}, 1000);
      } else {
        await handleCommonCodes(response);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error);
    } finally {
      setIsLoadingComponent(false);
    }
  };

  return (
    <div className="pattern-configuration">
      <div className="Tabsumenu">
        <div className="Tabsumenu-header ">
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name="Check" />
            <h4> {t['Status and emails']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 1 ? 'activeST' : ''} ${completePadrones ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}>
            <ImageSvg name="Check" />
            <h4> {t.Pattern} </h4>
          </button>
        </div>

        <div className="Tabsumenu-content">
          {activeTab === 0 && (
            <div className="container-status">
              <EmailsForm dataEmails={dataPadrones?.oCorreo} setUpdateEmails={setUpdateEmails} sProduct={dataCardProduct?.sProd} get={get} setGet={setGet} />

              <div className="box-buttons">
                <button type="button" className={`btn_secundary small ${completeEmails ? ' ' : 'disabled'}`} onClick={() => handleTabClick(1)} disabled={!completeEmails}>
                  {t.Next}
                  <ImageSvg name="Next" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="config-Automated--tables">
              <div className="contaniner-tables">
                <div className="box-search">
                  <div>
                    <h3> {dataCardProduct?.sName} </h3>
                    <p> {t['This exchange rate is used for the monthly accounting closing']} </p>
                  </div>

                  <button
                    className="btn_black"
                    // style={{ display: initialEdit !== null ? 'none' : 'block' }}
                    onClick={() => {
                      toggleForm();
                    }}
                  >
                    {showForm ? t.Close : t.Add}
                  </button>
                </div>

                <div className="boards">
                  <div className="tableContainer">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>{t.Pattern} </th>
                          <th> {t.Country}</th>
                          {/*
                          <th>{t.State} </th> */}

                          <th>{t.Actions} </th>
                        </tr>
                      </thead>

                      {dataPadrones?.oPadrones.length > 0 ? (
                        <tbody>
                          {dataPadrones?.oPadrones?.map((row) => (
                            <tr key={row.id_principal}>
                              <td>{row.desc_documento}</td>
                              <td>{row.id_pais == 1 ? 'Perú' : row.id_pais} </td>

                              {/* <td>
                              <span className={row.estado == '23' ? 'status-active' : 'status-disabled'}>{row.estado == '23' ? 'Active' : 'Disabled'}</span>
                            </td> */}

                              <td className="box-actions">
                                <button
                                  className="btn_crud delete"
                                  onClick={() => {
                                    setSelectedRowToDelete(row);
                                  }}
                                >
                                  <ImageSvg name="Delete" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <div className=" ">
                          <p className="errorMessage">{t['Add patterns']}</p>
                        </div>
                      )}
                    </table>
                  </div>
                  {isLoadingComponent && <LoadingComponent />}
                </div>

              
                {requestError && <Stack sx={{ width: '100%' }} spacing={1}> <Alert severity="error">{requestError || ' error service'}</Alert>
                </Stack>}

              </div>

              <div>
                {completePadrones ? (
                  <div className="box-buttons">
                    <button type="button" className="btn_secundary small" onClick={() => handleTabClick(0)}>
                      <ImageSvg name="Back" />

                      {t.Previus}
                    </button>
                    <button className={`btn_secundary small  ${completePadrones ? ' ' : 'disabled'}`} onClick={() => setConfirmedConfigured(true)} disabled={!completePadrones}>
                      {t.Finish}
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
                )}
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <FormPatters
            onAgregar={handleAgregar}
            dataPadrones={dataPadrones}
            initialVal={isEditing ? initialEdit : null}
            setIinitialEdit={setIinitialEdit}
            // handleEditCurrency={handleEditCurrency}
            setShowForm={setShowForm}
          />
        )}

        {selectedRowToDelete && (
          <Modal
            close={() => {
              setSelectedRowToDelete(null);
            }}
          >
            <ImageSvg name="Question" />

            <div>
              <h3>{t['Do you want to delete this record']}</h3>
              <div className="box-buttons">
                <button type="button" className="btn_primary small" onClick={handleDeleteConfirmation}>
                  {t.Yeah}
                </button>
                <button type="button" className="btn_secundary small" onClick={() => setSelectedRowToDelete(null)}>
                  {t.No}
                </button>
              </div>
            </div>
          </Modal>
        )}

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
