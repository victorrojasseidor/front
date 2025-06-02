import React, { useState, useEffect } from 'react';
import EmailsForm from '../DowloandCurrency/EmailsForm';
import ImageSvg from '@/helpers/ImageSVG';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import { useRouter } from 'next/router';
import Modal from '@/Components/Modal';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { formatDate } from '@/helpers/report';
import FormCurrency from './FormCurrency';

export default function ConfigCurrency() {
  const [initialEdit, setIinitialEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [dataTypeChange, setDataTypeChange] = useState(null);
  const [dataCardProduct, setdataCardProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [completeEmails, setcompleteEmails] = useState(false);
  const [completeConfigDayly, setCompleteConfigDayly] = useState(false);
  const [completeConfigMontly, setCompleteConfigMontly] = useState(false);
  const [typeOfChange, setTypeofChange] = useState(0);
  const [updateEmails, setUpdateEmails] = useState(false);
  const [confirmConfigured, setConfirmedConfiguration] = useState(false);
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

  const t = l.Currency;

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
        oTipoCambio: [
          {
            iIdTipCamb: parseInt(iIdProdEnv),
            iIdPais: values.country,
            iIdMonedaOrigen: values.coinOrigin,
            iIdMonedaDestino: values.coinDestiny,
            iIdFuente: values.fuente,
            iDiasAdicional: values.days,
            iIdTiempoTipoCambio: typeOfChange,
            bEstado: values.state === 'Active',
          },
        ],
      },
    };

    try {
      const token = session.sToken;

      const responseData = await fetchConTokenPost('BPasS/?Accion=RegistrarTipoCambio', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        // const data = responseData.oResults
        setTimeout(() => {
          setModalToken(false);
          setShowForm(false);
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
      getTipCambio();
    }
  }, [updateEmails, showForm, selectedRowToDelete]);

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

  async function getTipCambio() {
    setIsLoadingComponent(true);
    const body = {
      oResults: {
        iIdTipCamb: iIdProdEnv,
        iIdPais: idCountry,
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetTipCambio', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const dataRes = responseData.oResults;
        setDataTypeChange(dataRes);

        if (dataRes.oCorreo.length > 0) {
          setcompleteEmails(true);
        }
        if (dataRes.oDailyExchange.length > 0) {
          setCompleteConfigDayly(true);
        } else {
          setCompleteConfigDayly(false);
        }

        if (dataRes.oMonthExchange.length > 0) {
          setCompleteConfigMontly(true);
        } else {
          setCompleteConfigMontly(false);
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
      await handleDeleteTypeChange(selectedRowToDelete.id_moneda_fuente_tipo_cambio);
      setSelectedRowToDelete(null);
    }
  };

  const handleDeleteTypeChange = async (idbankcred) => {
    setIsLoadingComponent(true);
    const token = session.sToken;
    const body = {
      oResults: {
        oIdRegistro: [idbankcred],
      },
    };
    try {
      const response = await fetchConTokenPost('BPasS/?Accion=EliminarTipoCambio', body, token);
      console.error('res', response);
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false);
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

  const handleEdit = (dataEdit) => {
    setShowForm(true);
    setIinitialEdit(dataEdit);
    setIsEditing(true);
  };

  async function handleEditCurrency(values) {
    setIsLoadingComponent(true);

    const body = {
      oResults: {
        oTipoCambio: [
          {
            iIdRegistro: initialEdit?.id_moneda_fuente_tipo_cambio,
            iIdTipCamb: parseInt(iIdProdEnv),
            iIdPais: values.country,
            iIdMonedaOrigen: values.coinOrigin,
            iIdMonedaDestino: values.coinDestiny,
            iIdFuente: values.fuente,
            iDiasAdicional: values.days,
            iIdTiempoTipoCambio: typeOfChange,
            bEstado: values.state === 'Active',
          },
        ],
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=ActualizarTipoCambio', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        setShowForm(false);
        setIsEditing(false);
        setTimeout(() => {
          setIinitialEdit(null);
          setRequestError(null);
          setShowForm(false);
        }, 2000);
      } else {
        await handleCommonCodes(responseData);
        setShowForm(true);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('error', error);
      setShowForm(true);
      setIsEditing(true);
      setRequestError(null);
    } finally {
      setIsLoadingComponent(false);
      setIinitialEdit(null);
    }
  }

  return (
    <div className="currency_configurations">
      <div className="Tabsumenu">
        <div className="Tabsumenu-header ">
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name="Check" />
            <h4> {t['Status and emails']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 1 ? 'activeST' : ''} ${completeConfigDayly ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}>
            <ImageSvg name="Check" />
            <h4> {t['Daily exchange rate']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 2 ? 'activeST' : ''} ${completeConfigMontly ? 'completeST' : ''}`} onClick={() => handleTabClick(2)}>
            <ImageSvg name="Check" />
            <h4> {t['Monthly exchange rate']}</h4>
          </button>
        </div>

        <div className="Tabsumenu-content">
          {activeTab === 0 && (
            <div className="container-status">
              <EmailsForm dataEmails={dataTypeChange?.oCorreo} setUpdateEmails={setUpdateEmails} sProduct={dataCardProduct?.sProd} get={get} setGet={setGet} />

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
                <div className="tableContainer">
                  <div className="boards">
                    <div className="box-search">
                      <div>
                        <h3>{t['Daily exchange rate']} </h3>
                        <p> {t['Add the setting for Daily exchange rate']} </p>
                      </div>

                      <button
                        className="btn_black"
                        style={{
                          display: initialEdit !== null ? 'none' : 'block',
                        }}
                        onClick={() => {
                          toggleForm();
                          setTypeofChange(1);
                        }}
                      >
                        {showForm ? t.Close : t.Add}
                      </button>
                    </div>

                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>{t.Country} </th>
                          <th> {t['Portal Available']}</th>
                          <th> {t['Source Currency']}</th>

                          <th> {t['Target currency']}</th>
                          <th> {t['Additional days']}</th>

                          <th>{t.State} </th>

                          <th>{t.Actions} </th>
                        </tr>
                      </thead>

                      <tbody>
                        {dataTypeChange?.oDailyExchange?.map((row) => (
                          <tr key={row.id_moneda_fuente_tipo_cambio}>
                            <td>{row.descripcion_pais}</td>
                            <td>{row.nombre} </td>
                            <td>{row.descripcion_moneda_origen}</td>
                            <td>{row.descripcion_moneda_destino}</td>
                            <td>{row.dias_adicional}</td>

                            <td>
                              <span className={row.estado == '23' ? 'status-active' : 'status-disabled'}>{row.estado == '23' ? 'Active' : 'Disabled'}</span>
                            </td>

                            <td className="box-actions">
                              <button
                                className="btn_crud"
                                onClick={() => {
                                  handleEdit(row);
                                  setTypeofChange(1);
                                }}
                              >
                                <ImageSvg name="Edit" />{' '}
                              </button>
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
                    </table>
                    <div>
                      <p> {t['Register your bank Credentials']}</p>
                    </div>
                  </div>
                  {isLoadingComponent && <LoadingComponent />}
                </div>

                {requestError && (
                  <Stack sx={{ width: '100%' }} spacing={1}>
                    {' '}
                    <Alert severity="error">{requestError || ' error service'}</Alert>
                  </Stack>
                )}
              </div>

              <div>
                {completeConfigDayly ? (
                  <div className="box-buttons">
                    <button type="button" className="btn_secundary small" onClick={() => handleTabClick(0)}>
                      <ImageSvg name="Back" />

                      {t.Previus}
                    </button>
                    <button className={`btn_secundary small  ${completeConfigDayly ? ' ' : 'disabled'}`} onClick={() => handleTabClick(2)} disabled={!completeConfigDayly}>
                      {t.Next}
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

          {activeTab === 2 && (
            <div className="config-Automated--tables">
              <div className="contaniner-tables">
                <div className="boards">
                  <div className="box-search">
                    <div>
                      <h3>
                        {t['Monthly exchange rate']} <span>( {t.optional} ) </span>
                      </h3>
                      <p> {t['This exchange rate is used for the monthly accounting closing']} </p>
                    </div>

                    <button
                      className="btn_black"
                      // style={{ display: initialEdit !== null ? 'none' : 'block' }}
                      onClick={() => {
                        toggleForm();
                        setTypeofChange(2);
                      }}
                    >
                      {showForm ? t.Close : t.Add}
                    </button>
                  </div>

                  <div className="tableContainer">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>{t.Country} </th>
                          <th> {t['Portal Available']}</th>
                          <th> {t['Source Currency']}</th>

                          <th> {t['Target currency']}</th>
                          <th> {t['Additional days']}</th>

                          <th>{t.State} </th>

                          <th>{t.Actions} </th>
                        </tr>
                      </thead>

                      <tbody>
                        {dataTypeChange?.oMonthExchange?.map((row) => (
                          <tr key={row.id_moneda_fuente_tipo_cambio}>
                            <td>{row.descripcion_pais}</td>
                            <td>{row.nombre} </td>
                            <td>{row.descripcion_moneda_origen}</td>
                            <td>{row.descripcion_moneda_destino}</td>
                            <td>{row.dias_adicional}</td>

                            <td>
                              <span className={row.estado == '23' ? 'status-active' : 'status-disabled'}>{row.estado == '23' ? 'Active' : 'Disabled'}</span>
                            </td>

                            <td className="box-actions">
                              <button
                                className="btn_crud"
                                onClick={() => {
                                  handleEdit(row);
                                  setTypeofChange(2);
                                }}
                              >
                                <ImageSvg name="Edit" />{' '}
                              </button>
                              <button
                                className="btn_crud "
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
                    </table>
                    <div>
                      <p> {t['Register your bank Credentials']}</p>
                    </div>
                  </div>
                  {isLoadingComponent && <LoadingComponent />}
                </div>

                {requestError && (
                  <Stack sx={{ width: '100%' }} spacing={1}>
                    {' '}
                    <Alert severity="error">{requestError || ' error service'}</Alert>
                  </Stack>
                )}
              </div>

              {dataTypeChange?.oDailyExchange.length > 0 && (
                <div>
                  {completeConfigDayly ? (
                    <div className="box-buttons">
                      <button type="button" className="btn_secundary small" onClick={() => handleTabClick(1)}>
                        <ImageSvg name="Back" />

                        {t.Previus}
                      </button>
                      <button className={`btn_secundary small  ${completeConfigDayly ? ' ' : 'disabled'}`} onClick={() => setConfirmedConfiguration(true)} disabled={!completeConfigDayly}>
                        {t.Finish}
                        <ImageSvg name="Next" />
                      </button>
                    </div>
                  ) : (
                    <div className="noti">
                      <p> {t['Register at least one bank account to proceed to the next step in the setup process']}</p>
                      <p>
                        {' '}
                        <span> {t['Please click on Add Accounts']} </span>{' '}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {showForm && <FormCurrency onAgregar={handleAgregar} dataTypeChange={dataTypeChange} initialVal={isEditing ? initialEdit : null} setIinitialEdit={setIinitialEdit} handleEditCurrency={handleEditCurrency} setShowForm={setShowForm} typeOfChange={typeOfChange} />}

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
      </div>

      {confirmConfigured && (
        <Modal
          close={() => {
            setConfirmedConfiguration(false);
          }}
        >
          <div>
            <ImageSvg name="Check" />
          </div>
          <div>
            <h2>{t.Configured} </h2>

            <p>{dataCardProduct?.sName}</p>

            <div className="box-buttons">
              <button
                type="button"
                className="btn_primary small"
                onClick={() => {
                  router.push('/product');
                  setConfirmedConfiguration(false);
                }}
              >
                {t['Return a home']}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
