import React, { useState, useEffect } from 'react';
import { exportToExcelFormat, IconArrow, IconDate } from '@/helpers/report';
import ImageSvg from '@/helpers/ImageSVG';
import Link from 'next/link';
import { useAuth } from '@/Context/DataContext';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormHelperText } from '@mui/material';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField'; // Importa TextField aquí
import { fetchConTokenPost } from '@/helpers/fetch';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ButtonGradient from '@/Components/Atoms/ButtonGradient';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import LineCaptcha from '@/Components/Grafics/LineCaptcha';

const Captcha = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabSub, setActiveTabSub] = useState(0);

  const { session, setModalToken, logout, l, idCountry, empresa } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(empresa?.id_empresa || session?.oEmpresa[0].id_empresa);
  const [dataSumary, setDataSumary] = useState(null);
  const [dataCaptcha, setDataCaptcha] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage] = useState(32);
  const [filterDate, setFilterDate] = useState(30);
  const [isDateSorted, setIsDateSorted] = useState(true);
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [requestError, setRequestError] = useState();
  const t = l.Captcha;
  const [selectedContract, setSelectedContract] = useState(empresa?.id_empresa || session?.oEmpresa[0].id_empresa);

  const months = [l.Reporting.January, l.Reporting.February, l.Reporting.March, l.Reporting.April, l.Reporting.May, l.Reporting.June, l.Reporting.July, l.Reporting.August, l.Reporting.September, l.Reporting.October, l.Reporting.November, l.Reporting.December];

  const transformMonthsFormat = (data) => {
    const partes = data.split('-');
    const mes = months[Number(partes[0] - 1)];

    return `${mes}-${partes[1]}`;
  };

  const rangeDateSelect = (duration) => {
    const endDate = dayjs();
    let startDate;

    // Calcula la fecha de inicio restando la duración
    if (duration === 12) {
      startDate = endDate.subtract(duration, 'month');
    } else {
      startDate = endDate.subtract(duration, 'day');
    }

    const startDateFormatted = startDate.format('YYYY-MM-DD'); // Formatea la fecha
    setStartDate(startDateFormatted);
    setEndDate(endDate.format('YYYY-MM-DD'));

    setFilterDate(duration);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('YYYY-MM-DD'));
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('YYYY-MM-DD'));
  };

  const handleTabClickSub = (index) => {
    setActiveTabSub(index);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedCompany(selectCompanyValue);
  };

  const handleContractChange = (event) => {
    const selectContractValue = event.target.value;
    setSelectedContract(selectContractValue);
  };

  const sumCaptchaResolved = (data, key) => (Array.isArray(data) ? data.reduce((total, entry) => total + entry[key], 0) : 0);

  if (dataCaptcha) {
    sumCaptchaResolved(dataCaptcha);
  }

  useEffect(() => {
    GetCabeceraCaptcha();
  }, [selectedCompany]);

  useEffect(() => {
    GetDetalleCaptcha();
  }, [selectedCompany, startDate, endDate]);

  async function GetCabeceraCaptcha() {
    setIsLoading(true);
    const start = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const end = dayjs().format('YYYY-MM-DD');
    const body = {
      oResults: {
        iIdPais: idCountry || 1,
        sFechaDesde: start,
        sFechaHasta: end,
        iIdEmpresa: selectedCompany || [],
      },
    };

    try {
      const token = session.sToken;

      const responseData = await fetchConTokenPost('BPasS/?Accion=GetCabeceraCaptcha', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;

        const dataOrder = orderDataByDateSumary(data);
        setDataSumary(dataOrder);

        setModalToken(false);
        setRequestError(null);
        setPage(1);
        // orderDataByDate('fecha', true)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        setTimeout(() => {
          setRequestError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('error', error);
      setRequestError(error);
      setTimeout(() => {
        setRequestError(null);
      }, 1000);
    } finally {
      setIsLoading(false); // Ocultar señal de carga
    }
  }

  async function GetDetalleCaptcha() {
    setIsLoading(true);
    const body = {
      oResults: {
        iIdPais: idCountry || 1,
        sFechaDesde: startDate,
        sFechaHasta: endDate,
        iIdEmpresa: selectedCompany || [],
      },
    };

    try {
      const token = session.sToken;

      const responseData = await fetchConTokenPost('BPasS/?Accion=GetDetalleCaptcha', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setIsDateSorted(true);
        setDataCaptcha(data);
        orderDataByDate();
        setModalToken(false);
        setRequestError(null);
        setPage(1);
        // orderDataByDate('fecha', true)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        setTimeout(() => {
          setRequestError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('error', error);
      setRequestError(error);
      setTimeout(() => {
        setRequestError(null);
      }, 1000);
    } finally {
      setIsLoading(false); // Ocultar señal de carga
    }
  }

  function orderDataByDateSumary(data) {
    // Función para convertir fechas en formato "MM-YYYY" a "YYYY-MM-DD" para facilitar la comparación
    function convertirFecha(fecha) {
      const [mes, anio] = fecha.split('-');
      return new Date(`${anio}-${mes}-01`);
    }

    // Verificar y ordenar la lista 'data_summary' por fecha
    if (Array.isArray(data.data_summary)) {
      data.data_summary.sort((a, b) => convertirFecha(b.fecha) - convertirFecha(a.fecha));
    }

    return data;
  }

  const orderDataByDate = () => {
    // Alterna el estado de ordenación
    setIsDateSorted((prevState) => !prevState);

    // Actualiza los datos ordenados
    setDataCaptcha((prevData) => {
      // Clona el array de datos para no mutar el estado anterior
      const sortedData = [...prevData];

      // Ordena los datos en función del estado actual de isDateSorted
      if (isDateSorted) {
        sortedData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      } else {
        sortedData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      }

      // Retorna el array ordenado
      return sortedData;
    });
  };

  const formatDate = (date) => {
    // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
    const fechaObjeto = new Date(date);

    // Obtener las partes de la fecha (mes, día y año)
    const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan en 0
    const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0');
    const año = fechaObjeto.getUTCFullYear();

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    const fechaFormateada = `${dia}-${mes}-${año}`;
    return fechaFormateada;
  };

  const exportToExcel = () => {
    const data = dataCaptcha;
    const fileName = 'Captcha_report.xlsx';
    if (data && data.length > 0) {
      const headers = [
        { header: 'Fecha', key: 'fecha', width: 20 },
        { header: 'Resuelto', key: 'captcha_resolved', width: 20 },
        { header: 'No Resuelto', key: 'captcha_not_resolved', width: 20 },
        { header: 'Tipo', key: 'captcha_type', width: 20 },
        { header: 'Conexiones', key: 'captcha_conexion_until_now', width: 20 },
      ];

      // Llama a la función exportToExcelFormat con los parámetros necesarios
      exportToExcelFormat(data, fileName, headers, (row) => {
        // Formatea cada fila de datos según lo necesites
        const formattedDate = formatDate(row.fecha);
        return {
          fecha: formattedDate,
          captcha_resolved: row.captcha_resolved,
          captcha_not_resolved: row.captcha_not_resolved,
          captcha_type: row.captcha_type,
          captcha_conexion_until_now: row.captcha_conexion_until_now,
        };
      });
    }
  };

  const componentFilters = () => {
    return (
      <div className="captcha-filters">
        <div className="box-filters">
          <div className="date">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t.From}
                value={dayjs(startDate, 'YYYY-MM-DD')}
                slotProps={{
                  textField: {
                    // helperText: t['Date start'],
                  },
                }}
                onChange={handleStartDateChange}
                format="YYYY-MM-DD"
                components={{
                  OpenPickerIcon: IconDate,
                  CalendarIcon: IconDate,
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t.To}
                value={dayjs(endDate, 'YYYY-MM-DD')}
                slotProps={{
                  textField: {
                    // helperText: t['Date end'],
                  },
                }}
                onChange={handleEndDateChange}
                format="YYYY-MM-DD"
                components={{
                  OpenPickerIcon: IconDate,
                  CalendarIcon: IconDate,
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="box-filter">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="contract-label">{t.Contract}</InputLabel>
            <Select labelId="contract-label" value={selectedContract} onChange={handleContractChange} IconComponent={IconArrow}>
              <MenuItem value="">
                <em>{t['Contract']}</em>
              </MenuItem>
              {session?.oEmpresa.map((comp) => (
                <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                  <div> {comp.razon_social_empresa}</div>
                </MenuItem>
              ))}
            </Select>
            {/* <FormHelperText>{!selectedCompany && t['Select the company']}</FormHelperText> */}
          </FormControl>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="captcha">
        <div className="captcha-summary">
          <div className="reporting-box">
            <div className="report-content">
              <div className="report_data">
                <div className="box-filter">
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="company-label">{l.Reporting.Company}</InputLabel>
                    <Select labelId="company-label" value={selectedCompany} onChange={handleCompanyChange} IconComponent={IconArrow}>
                      <MenuItem value="">
                        <em>{l.Reporting['All Companys']}</em>
                      </MenuItem>
                      {session?.oEmpresa.map((comp) => (
                        <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                          <div> {comp.razon_social_empresa}</div>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{!selectedCompany && t['Select the company']}</FormHelperText>
                  </FormControl>
                </div>
              </div>

              <div className="report_resume">
                <div className="report gradientAri">
                  <div className="report_icon  ">
                    <ImageSvg name="IconCaptcha" />
                  </div>

                  <div className="report_data">
                    <article>{t['Hired connections']}</article>
                    {/* <h3> {dataSumary?.captcha_resolved_until_now} </h3> */}

                    <h3>60 ,000</h3>

                    <p>
                      <ImageSvg name="Check" /> {t['Last contract']} {dataSumary?.fecha_until}{' '}
                    </p>
                  </div>
                </div>

                <div className="report gradientAri ">
                  <div className="report_icon  ">
                    <ImageSvg name="IconCaptcha" />
                  </div>

                  <div className="report_data">
                    <article>{t['Connections used']}</article>

                    {/* <h3> {dataSumary?.captcha_conexion_until_now} </h3> */}
                    <h3>24 ,000</h3>
                    <p>
                      <ImageSvg name="Check" /> {t.To} {dataSumary?.fecha_until}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="box-filters">
          <button className={`btn_filter ${filterDate === 365 ? 'active' : ''}`} onClick={() => rangeDateSelect(365)}>
          {t['Monthly summary']}
          </button>

          <button className={`btn_filter ${filterDate === 180 ? 'active' : ''}`} onClick={() => rangeDateSelect(180)}>
          {t['Results per day']}
          </button>


        </div> */}

        {/* <div className="captcha-filters">
          <h3> {t['Filter Statistics']} </h3>
          <p> {t['Filter the Desired Reports and Graphs, and if you want to see the complete information, use the export option.']} </p>
          <div className="box-filters">
            <button className={`btn_filter ${filterDate === 365 ? 'active' : ''}`} onClick={() => rangeDateSelect(365)}>
              {t.Last} 12 {t.Months}
            </button>

            <button className={`btn_filter ${filterDate === 180 ? 'active' : ''}`} onClick={() => rangeDateSelect(180)}>
              {t.Last} 6 {t.Months}
            </button>

            <button className={`btn_filter ${filterDate === 30 ? 'active' : ''}`} onClick={() => rangeDateSelect(30)}>
              {t.Last} 30 {t.Days}
            </button>

            <button className={`btn_filter ${filterDate === 7 ? 'active' : ''}`} onClick={() => rangeDateSelect(7)}>
              {t.Last} 7 {t.Days}
            </button>

            <button className={`btn_filter ${filterDate === null ? 'active' : ''}`} onClick={() => setFilterDate(null)}>
              {t['Other Dates']}

              <ImageSvg name="Time" />
            </button>
          </div>

          {!filterDate && (
            <div className="box-filters">
              <div className="date">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.From}
                    value={dayjs(startDate, 'YYYY-MM-DD')}
                    slotProps={{
                      textField: {
                        helperText: t['Date start'],
                      },
                    }}
                    onChange={handleStartDateChange}
                    format="YYYY-MM-DD"
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate,
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.To}
                    value={dayjs(endDate, 'YYYY-MM-DD')}
                    slotProps={{
                      textField: {
                        helperText: t['Date end'],
                      },
                    }}
                    onChange={handleEndDateChange}
                    format="YYYY-MM-DD"
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate,
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
          )}

        </div> */}

        {requestError && <div className="errorMessage">{requestError.message || ' error service'}</div>}

        {isLoading && <LoadingComponent />}

        <div className="box-tabs">
          <div className="horizontalTabs">
            <div className="captcha-tabs">
              <button className={`btn_types ${activeTab === 0 ? 'activeTypes' : ''}`} onClick={() => handleTabClick(0)}>
                <ImageSvg name="Report" />
                {t['Monthly summary']}
              </button>

              <button className={`btn_types ${activeTab === 1 ? 'activeTypes' : ''}`} onClick={() => handleTabClick(1)}>
                <ImageSvg name="Report" />
                {t['Results per day']}
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 0 && (
                <div className="report-months">
                  <div className="contaniner-tables">
                    <div className="box-search">
                      <div>
                        <h3> {t['Last Months']} </h3>
                        <p> {t['Results of the Last Months']} </p>
                      </div>
                    </div>

                    <div className="boards">
                      {componentFilters()}

                      <div className="tableContainer">
                        <table className="dataTable">
                          <thead>
                            <tr>
                              <th>{t.Date} </th>
                              <th> {t['Captcha solved']}</th>
                              <th> {t.Connections}</th>
                            </tr>
                          </thead>

                          <tbody>
                            {dataSumary?.data_summary.map((row) => (
                              <tr key={row.id_data}>
                                <td>{transformMonthsFormat(row.fecha)}</td>
                                <td>{row.captcha_resolved}</td>
                                <td>{row.captcha_conexion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <div className="tabOne">
                    <div className="contaniner-tables">
                      <div className="box-search">
                        <div>
                          <h3> {t['Captcha report by day']} </h3>
                          <p> {t['Results Obtained from Dates']} </p>
                        </div>

                        <div className="content-headers">
                          <div className="tab-header">
                            <Link href="#">
                              <button className={activeTabSub === 0 ? 'active' : ''} onClick={() => handleTabClickSub(0)}>
                                Report
                              </button>
                            </Link>

                            <Link href="#">
                              <button className={activeTabSub === 1 ? 'active' : ''} onClick={() => handleTabClickSub(1)}>
                                Grafics
                              </button>
                            </Link>
                          </div>

                          {/* <button className="btn_black text " onClick={() => exportToExcel()}>
                            <ImageSvg name="Download" /> {t.Export}
                          </button> */}

                                  <ButtonGradient classButt="whiteButton" onClick={() => exportToExcel()}>
                                  <ImageSvg name="Download" /> {t.Export}

                                    {t['WHY CHOOSE US']}
                                    </ButtonGradient>
                          
                        </div>
                      </div>

                      {componentFilters()}

                      <div className="tab-content">
                        {activeTabSub === 0 && (
                          <>
                            <div className="boards">
                              <div className="tableContainer">
                                <table className="dataTable">
                                  <thead>
                                    <tr>
                                      {/* <th>{t.Date} </th> */}
                                      <th onClick={() => orderDataByDate()}>
                                        {t.Date}
                                        <button className="btn_crud">
                                          <ImageSvg name={isDateSorted ? 'OrderDown' : 'OrderUP'} />
                                        </button>
                                      </th>
                                      <th> {t.Resolved}</th>
                                      <th> {t['Not Resolved']}</th>
                                      <th> {t['Captcha Type']}</th>
                                      <th> {t.Connections}</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {dataCaptcha.length > 0 ? (
                                      dataCaptcha?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((row) => (
                                        <tr key={row.id_captcha_data}>
                                          <td>{formatDate(row.fecha)}</td>
                                          <td>{row.captcha_resolved} </td>
                                          <td>{row.captcha_not_resolved}</td>
                                          <td>{row.captcha_type}</td>
                                          <td>{row.captcha_conexion_until_now}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="5">{t['There is no data']}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              <Stack spacing={2}>
                                <div className="pagination">
                                  <Typography>
                                    {t.Page} {page} {t.of} {Math.ceil(dataCaptcha.length / itemsPerPage)}
                                  </Typography>
                                  <Pagination
                                    count={Math.ceil(dataCaptcha.length / itemsPerPage)} // Calculate the total number of pages
                                    page={page}
                                    onChange={handleChangePage}
                                  />
                                </div>
                              </Stack>
                            </div>

                            <div className="reporting-box">
                              <div className="report-content" style={{ paddingLeft: '0rem' }}>
                                <div className="report gradientAri">
                                  <div className="report_icon  ">
                                    <ImageSvg name="IconCaptcha" />
                                  </div>

                                  <div className="report_data">
                                    <article>{t['Captcha solved']}</article>
                                    <h3> {dataCaptcha && sumCaptchaResolved(dataCaptcha, 'captcha_resolved')}</h3>
                                  </div>
                                </div>

                                <div className="report gradientAri">
                                  <div className="report_icon  ">
                                    <ImageSvg name="IconCaptcha" />
                                  </div>

                                  <div className="report_data">
                                    <article>{t.Connections}</article>
                                    <h3> {dataCaptcha && sumCaptchaResolved(dataCaptcha, 'captcha_conexion_until_now')}</h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {activeTabSub === 1 && (
                          <div className="grafics">
                            <LineCaptcha captchaData={dataCaptcha} startDate={startDate} endDate={endDate} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Captcha;
