import React, { useState, useEffect } from 'react';
import { useAuth } from '@/Context/DataContext';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { fetchConTokenPost } from '@/helpers/fetch';
import { formatDate } from '@/helpers/report';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { v4 as uuidv4 } from 'uuid';
import { exportToExcelFormat, IconDate, IconArrow } from '@/helpers/report';
import ImageSvg from '@/helpers/ImageSVG';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import FormContract from './FormContract';
import Modal from '@/Components/Modal';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { object } from 'yup';

export default function Contract() {
  const { session, setModalToken, empresa, setModalDenied, modalDenied, l, logout } = useAuth();
  const [requestError, setRequestError] = useState();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [dataEnterprise, setDataEnterprise] = useState([]);
  const [datacontractFilter, setDataContractFilter] = useState(null);
  const [datacontract, setDataContract] = useState([]);
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [confimationDelete, setConfirmationDelete] = useState(false);
  const [dataAction, setDataAction] = useState([]);
  const [itemsPerPage] = useState(32);
  const [page, setPage] = useState(1);

  const t = l.Support;
  //  const id = useId();

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const router = useRouter();

  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedCompany(selectCompanyValue);
    const selectedCompanyData = datacontractFilter?.oCompany.find((comp) => comp.id_company === Number(selectCompanyValue));
    if (selectedCompanyData) {
      setDataEnterprise(selectedCompanyData.oEmpresa);
    } else {
      setDataEnterprise(null);
    }
  };

  const handleEnterpriseChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedEnterprise(selectCompanyValue);
  };

  const handleStateChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedState(selectCompanyValue);
  };

  const handleClearFilters = () => {
    setSelectedCompany('');
    setSelectedEnterprise('');
    setSelectedState('');
    setConfirmation(false);
  };

  const hasAppliedFilters = () => {
    return selectedCompany !== '' || selectedEnterprise !== '' || selectedState !== '' || confirmation;
  };

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
      console.log('errok, ', errorMessage);
      setModalToken(false);
      setRequestError(errorMessage);
      setTimeout(() => {
        setRequestError(null);
      }, 5000);
    }
  }

  useEffect(() => {
    if (session) {
      getGetInitContrato();
    }
  }, []);

  if (datacontractFilter == null) {
    return (
      <div className="loading">
        <LoadingComponent />
      </div>
    );
  }

  async function getGetInitContrato() {
    setIsLoadingComponent(true);
    setConfirmation(false);
    const body = {
      oResults: {
        oIdCompany: [selectedCompany],
        oIdEmpresa: [selectedEnterprise],
        oIdEstado: [selectedState],
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS?Accion=GetInitContrato', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const dataRes = responseData.oResults;
        setDataContractFilter(dataRes);
      } else {
        await handleCommonCodes(responseData);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingComponent(false);
    }
  }
  async function GetBuscarContrato() {
    setIsLoadingComponent(true);
    const body = {
      oResults: {
        oIdCompany: selectedCompany ? [selectedCompany] : [],
        oIdEmpresa: selectedEnterprise ? [selectedEnterprise] : [],
        oIdEstado: selectedState ? [selectedState] : [],
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS?Accion=GetBuscarContrato', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const dataRes = responseData.oResults;
        console.log('dataRes', dataRes);
        const datatrasform = acumulatorTransform(dataRes);
        setDataContract(datatrasform);
      } else {
        await handleCommonCodes(responseData);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingComponent(false);
    }
  }

  const reduceEndDateByOneMonth = (date) => {
    const newEndDate = dayjs(date, 'DD/MM/YYYY').subtract(1, 'month').format('DD/MM/YYYY');
    return newEndDate;
  };

  async function PostCrearContrato(values) {
    console.log('values', values);
    setIsLoadingComponent(true);
    const body = {
      oResults: {
        iIdEmpresa: values.iIdEmpresa,
        sNumContrato: values.sNumContrato,
        sReferencia: values.sReferencia,
        sFechaInicio: values.sFechaInicio,
        sFechaFin: values.sFechaFin,
        iEstado: values.iEstado,
        oHabilidad: values.oHabilidad,
        sFechaContractual: reduceEndDateByOneMonth(values.sFechaFin),
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS?Accion=PostCrearContrato', body, token);
      console.log('responseData', responseData);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        setShowForm(false);
        setConfirmation(true);
        setTimeout(() => {
          setConfirmation(false);
          getGetInitContrato();
        }, 3000);
      } else {
        await handleCommonCodes(responseData);
      }

      if (responseData.oResults.respuesta == false) {
        setConfirmation(false);
        setRequestError(responseData.oResults.respuesta_desc);

        setTimeout(() => {
          setRequestError(null);
        }, 5000);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingComponent(false);
    }
  }

  async function EliminarContrato() {
    setIsLoadingComponent(true);

    const body = {
      oResults: {
        iIdContrato: Number(dataAction?.id_contrato),
        oIdHabilidad: dataAction ? arrayhability(dataAction) : [],
      },
    };

    console.log('body eliminar', body);

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS?Accion=EliminarContrato', body, token);
      console.log('responseDataeliminar', responseData);
      if (responseData.oAuditResponse?.iCode === 1) {
        setTimeout(() => {
          setDataAction(null);
          setConfirmationDelete(false);
          getGetInitContrato();


        }, 3000);
      } else {
        await handleCommonCodes(responseData);
      }

      if (responseData.oResults.respuesta == false) {
        setConfirmation(false);
        setRequestError(responseData.oResults.respuesta_desc);
        setTimeout(() => {
          setRequestError(null);
          setShowForm(false);
        }, 5000);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsLoadingComponent(false);
      GetBuscarContrato()
    }
  }

  const acumulatorTransform = (datos) => {
    const datoReduce = datos.reduce((acc, item) => {
      const { id_contrato_servicio, id_contrato, id_habilidad, is_activo, is_suspendido, fecha_inicio, fecha_fin, referencia, descripcion_estado, razon_social, estado, ruc, id_company, id_empresa } = item;

      //create a unique key for each contract
      if (!acc[id_contrato]) {
        acc[id_contrato] = {
          id_contrato,

          fecha_inicio,
          fecha_fin,
          referencia,
          descripcion_estado,
          razon_social,
          estado,
          ruc,
          id_company,
          id_empresa,
          habilidad: [],
        };
      }

      //push hability for each contract
      acc[id_contrato].habilidad.push({
        id_habilidad: id_habilidad,
        is_activo: is_activo,
        is_suspendido: is_suspendido,
        id_contrato_servicio: id_contrato_servicio,
      });
      return acc;
    }, {});

    return Object.values(datoReduce);
  };

  const arrayhability = (dataSelect) => {
    const habilidades = dataSelect.habilidad?.reduce((acc, item) => {
      acc.push(item.id_habilidad);
      return acc;
    }, []);
    return habilidades;

  };


  console.log('datacontract', datacontract);


  return (
    <section className="contract">
      <div className="tab-content ">
        <div className="tabOne">
          <div className="contaniner-tables ">
            {requestError && (
              <Stack sx={{ width: '100%' }} spacing={1}>
                <Alert severity="error">{requestError || ' error service'}</Alert>
              </Stack>
            )}
            <div>
              <div className="box-search">
                {isLoadingComponent && <LoadingComponent />}

                <div>
                  <h3> {t['Manage contracts']} </h3>
                  <p>{t['Set up and manage contracts']}</p>
                </div>

                <div className="box-clear">
                  {/* <button className={`btn_primary small black  ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={() => setApply(!apply)} disabled={!hasAppliedFilters()}>*/}

                  <button className={`btn_primary small black  ${showForm ? 'desactivo' : ''}`} onClick={() => setShowForm(true)}>
                    {t['Create contract']}
                  </button>

                  {showForm && <FormContract setShowForm={setShowForm} datacontractFilter={datacontractFilter} onAgregar={PostCrearContrato} />}
                </div>
              </div>

              <div className="box-filter">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="company-label">{t.Company}</InputLabel>
                  <Select labelId="company-label" value={selectedCompany} onChange={handleCompanyChange} IconComponent={IconArrow}>
                    {datacontractFilter?.oCompany.map((comp) => (
                      <MenuItem key={Number(comp.ruc_company)} value={comp.id_company}>
                        <div> {comp.razon_social_company}</div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="company-label">{t.Enterprise}</InputLabel>
                  <Select labelId="company-label" value={selectedEnterprise} onChange={handleEnterpriseChange} IconComponent={IconArrow}>
                    {dataEnterprise?.map((comp) => (
                      <MenuItem key={comp.razon_social_empresa} value={comp.id_empresa}>
                        <div> {comp.razon_social_empresa}</div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="company-label">{t.Status}</InputLabel>
                  <Select labelId="company-label" value={selectedState} onChange={handleStateChange} IconComponent={IconArrow}>
                    <MenuItem value=""> {t.All} </MenuItem>
                    {datacontractFilter?.oEstado.map((comp, index) => (
                      <MenuItem key={uuidv4()} value={comp.code_estado}>
                        <div> {comp.descripcion_estado}</div>
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>{t['Selected company']}</FormHelperText> */}
                </FormControl>
                <div className="box-clear">
                  <button className={`btn_primary small  ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={() => GetBuscarContrato()} disabled={!hasAppliedFilters()}>
                    {l.Reporting.Apply}
                  </button>
                  <button
                    className={`btn_secundary small ${hasAppliedFilters() ? '' : 'desactivo'}`}
                    onClick={() => {
                      handleClearFilters();
                      setDataContract([]);
                    }}
                    disabled={!hasAppliedFilters()}
                  >
                    {l.Reporting.Clear}
                  </button>
                </div>
              </div>
            </div>

            <div className="boards">
              <div className="tableContainer contract-table">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th> {t['Contract']} </th>
                      <th> {t['Enterprise']} </th>
                      <th> {t['Start date']} </th>
                      <th> {t['End date']} </th>
                      <th> {t['Skills']} </th>
                      <th> {t['Status']} </th>
                      <th> {t['Renew']} </th>
                      <th> {t['Actions']} </th>
                    </tr>
                  </thead>
                  <tbody className="rowTable">
                    {datacontract?.length > 0 ? (
                      datacontract.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((row, index) => (
                        <tr key={'id_' + row.id_contrato}>
                          <td>
                            {row.id_contrato} - {row.referencia}
                          </td>
                          <td>{row.razon_social}</td>
                          <td>{formatDate(row.fecha_inicio)}</td>
                          <td>{formatDate(row.fecha_fin)}</td>
                          <td> {row.habilidad.map((item, index) => (
                            <span key={index} className={item.is_activo == 1 ? 'habilidad' : 'habilidad suspendido'}>
                              {item.id_habilidad} -
                            </span>
                          ))} </td>
                          <td className={row.estado == 32 ? 'state-check' : ''}> {row.descripcion_estado}</td>
                          {row.is_suspendido == 1 || row.estado === 35 ? (
                            <td >

                              <button className="btn_green" onClick={() => console.log(row)}>
                                {t.Renew}
                              </button>
                            </td>
                          ) : (
                            <td>
                              <span></span>

                            </td>
                          )}

                          <td className="box-actions">
                            <button className="btn_crud" onClick={() => console.log(row)}>
                              <ImageSvg name="Edit" />
                            </button>
                            <button
                              className="btn_crud"
                              onClick={() => {
                                setDataAction(row);
                                setConfirmationDelete(true);
                              }}
                            >
                              <ImageSvg name="Delete" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">{l.Reporting['There is no data']}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Stack spacing={2}>
                <div className="pagination">
                  <Typography>
                    {l.Reporting.Page} {page} {l.Reporting.of} {Math.ceil(datacontract?.length / itemsPerPage)}
                  </Typography>
                  <Pagination count={Math.ceil(datacontract?.length / itemsPerPage)} page={page} onChange={handleChangePage} />
                </div>
              </Stack>
            </div>

            {confimationDelete && (
              <Modal
                // open={confimationDelete}
                onClose={() => {
                  setDataAction(null);
                  setConfirmationDelete(false);
                }}
              >
                <ImageSvg name="Delete" />
                <h2> {t['Delete contract']} </h2>
                <span> "{dataAction.referencia} "</span>
                <p>{t['Are you sure you want to delete this contract']} </p>
                <div className="box-actions">
                  <button className="btn_secundary small" onClick={() => EliminarContrato()}>
                    {t.YES}
                  </button>
                  <button
                    className="btn_primary small"
                    onClick={() => {
                      setConfirmationDelete(false);
                      setDataAction(null);
                    }}
                  >
                    {t.NO}
                  </button>
                </div>
              </Modal>
            )}
          </div>

          {confirmation && (
            <Modal open={confirmation} onClose={() => setConfirmation(false)}>
              <ImageSvg name="Check" />
              <h2> {t['Contract created successfully']}</h2>
            </Modal>
          )}
        </div>
      </div>
    </section>
  );
}
