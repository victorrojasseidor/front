import React, { useState, useEffect } from 'react';
import { useAuth } from '@/Context/DataContext';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { fetchConTokenPost } from '@/helpers/fetch';
import dayjs from 'dayjs';
import { formatDate } from '@/helpers/report';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { IconDate, IconArrow } from '@/helpers/report';
import ImageSvg from '@/helpers/ImageSVG';
import Loading from '@/Components/Atoms/Loading';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';

const Detracctions = () => {
  const { session, setModalToken, logout, l } = useAuth();
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataDetracciones, setDataDetracciones] = useState(null);
  const [itemsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'));
  const [dataInitialSelect, setInitialDataselect] = useState([]);
  const [apply, setApply] = useState(false);
  const t = l.Reporting;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'));
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'));
  };

  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedCompany(selectCompanyValue);
  };

  useEffect(() => {
    GetReporteDetracciones();
  }, [apply]);

  async function GetReporteDetracciones() {
    setIsLoading(true);

    // empresa 5 y fechas de 06/09 al 10/09
    const body = {
      oResults: {
        sFechaDesde: startDate,
        sFechaHasta: endDate,
        oIdEmpresa: selectedCompany ? [selectedCompany] : [],
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetReporteDetracciones', body, token);
      console.log(body, { responseData });
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setDataDetracciones(data);
        setModalToken(false);
        setRequestError(null);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        setTimeout(() => {
          setRequestError(null);
        }, 2000);
      }
    } catch (error) {
      console.error('error', error);
      setModalToken(true);
      setRequestError(error);
      setTimeout(() => {
        setRequestError(null);
      }, 1000);
    } finally {
      setIsLoading(false); // Ocultar señal de carga
    }
  }

  const hasAppliedFilters = () => {
    return selectedCompany !== '' || startDate !== dayjs().startOf('month').format('DD/MM/YYYY') || endDate !== dayjs().subtract(1, 'day').format('DD/MM/YYYY');
  };

  const handleClearFilters = () => {
    setSelectedCompany('');
    setStartDate(dayjs().startOf('month').format('DD/MM/YYYY'));
    setEndDate(dayjs().subtract(1, 'day').format('DD/MM/YYYY'));
    setApply(!apply);
  };

  const exportToExcel = () => {
    // if (balances && balances.oSaldos.length > 0) {
    //   const filteredData = balances.oSaldos.map((row) => ({
    //     Date: formatDate(row.fecha),
    //     Company: row.razon_social_empresa,
    //     Bank: row.nombre_banco,
    //     Account: row.desc_cuenta_conf_cuenta,
    //     Currency: row.moneda,
    //     Balance: row.saldo,
    //   }));
    //   if (filteredData.length > 0) {
    //     const ws = XLSX.utils.json_to_sheet(filteredData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Balance Report');
    //     XLSX.writeFile(wb, 'balance_report.xlsx');
    //   }
    // }
  };

  return (
    <>
      <section className="reporting-detraccions">
        {isLoading && <LoadingComponent />}

        {requestError && <div className="errorMessage"> {requestError.error}</div>}
        <div className="box-tabs">
          <div className="box-filter">
            <div className="box-search">
              <h3> Detractions report </h3>

              <p>
                {t['If you want to view the complete information, use the']} <span>{t['export option']}</span>
              </p>
            </div>

            <div className="date">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t.From}
                  value={dayjs(startDate, 'DD/MM/YYYY')}
                  slotProps={{
                    textField: {
                      // helperText: t['Date start']
                    },
                  }}
                  onChange={handleStartDateChange}
                  format="DD/MM/YYYY"
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
                  value={dayjs(endDate, 'DD/MM/YYYY')}
                  slotProps={{
                    textField: {
                      // helperText: t['Date end']
                    },
                  }}
                  onChange={handleEndDateChange}
                  format="DD/MM/YYYY"
                  components={{
                    OpenPickerIcon: IconDate,
                    CalendarIcon: IconDate,
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

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
              {/* <FormHelperText>{t['Selected company']}</FormHelperText> */}
            </FormControl>

            <div className="box-clear">
              <button className={`btn_primary small  ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={() => setApply(!apply)} disabled={!hasAppliedFilters()}>
                {t.Apply}
              </button>

              <button className={`btn_secundary small ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={handleClearFilters} disabled={!hasAppliedFilters()}>
                {t.Clear}
              </button>
            </div>
          </div>

          <div className="tab-content">
            <div className="tabOne">
              <div className="contaniner-tables">
                <div className="box-export">
                  <p> {l.Pattern['Result obtained from the SUNAT portal']} </p>

                  <button className="btn_black " onClick={exportToExcel}>
                    <ImageSvg name="Download" /> {t['Export to Excel']}
                  </button>
                </div>

                <div className="boards">
                  <div className="tableContainer">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th> Payment date                           </th>
                          <th>  Company </th>
                          <th>  Account type </th>
                          <th>  Number </th>
                          <th>  File </th>
                          <th>  Total amount </th>
                          <th>  Deduction payment number </th>


                        </tr>
                      </thead>
                      <tbody className="rowTable">
                        {dataDetracciones?.length > 0 ? (
                          dataDetracciones
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage) // Slice the array based on the current page
                            .map((row) => (
                              <tr key={row.id_detracciones_pago}>
                               
                                <td>{formatDate(row.fecha_pago)}</td>
                                <td>{row.razon_social_empresa}</td>
                                <td>{row.tipo_cuenta}</td>
                             
                                <td>{row.numero}</td>
                                <td>{row.archivo}</td>
                                <td>{row.importe_total}</td>
                                <td> {row.numero_pago_detracciones}</td>
                                

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
                        {l.Reporting.Page} {page} {t.of} {Math.ceil(dataDetracciones?.length / itemsPerPage)}
                      </Typography>
                      <Pagination
                        count={Math.ceil(dataDetracciones?.length / itemsPerPage)} // Calculate the total number of pages
                        page={page}
                        onChange={handleChangePage}
                      />
                    </div>
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Detracctions;
