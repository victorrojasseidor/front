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

const Detracctions = () => {
  const { session, setModalToken, logout, l } = useAuth();
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPadrones, setDataPadrones] = useState(null);
  const [itemsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'));
  const [dataInitialSelect, setInitialDataselect] = useState([]);

  const t = l.Captcha;

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
    GetReportePadrones();
  }, []);

  async function GetReportePadrones() {
    setIsLoading(true);
    const body = {
      oResults: {
        FechaDesde: "06/09/2024",
        sFechaHasta: "06/09/2024",
        oIdEmpresa: selectedCompany ? [selectedCompany] : [],

      },
     
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetReporteDetracciones', body, token);
       console.log({responseData});
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setDataPadrones(data);
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

  return (
    <>
      <section className="">
        {isLoading && <LoadingComponent />}

        {requestError && <div className="errorMessage"> {requestError.error}</div>}
        <div className="box-tabs">


        <div className="box-filter">
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
                <InputLabel id="company-label">{t.Company}</InputLabel>
                <Select labelId="company-label" value={selectedCompany} onChange={handleCompanyChange} className="delimite-text" IconComponent={IconArrow}>
                  <MenuItem value="">
                    <em>{t['All Companys']}</em>
                  </MenuItem>
                  {dataInitialSelect.oEmpresa?.map((comp) => (
                    <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                      <div> {comp.razon_social_empresa}</div>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>{t['Select a company']}</FormHelperText> */}
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
            detractions
            <div className="tabOne">
              <div className="contaniner-tables">
                <div className="box-search">
                  <div>
                    <h3> {t['Sunat register report']}</h3>
                    <p> {l.Pattern['Result obtained from the SUNAT portal']} </p>
                  </div>
                </div>

                <div className="boards">
                  <div className="tableContainer">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>{t.Standards} </th>
                          <th> {t['Update date']}</th>
                        </tr>
                      </thead>
                      <tbody className="rowTable">
                        {dataPadrones?.length > 0 ? (
                          dataPadrones
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage) // Slice the array based on the current page
                            .map((row) => (
                              <tr key={row.id_padrones}>
                                <td>{row.nombre_documento}</td>
                                <td>{formatDate(row.fecha_padron)}</td>
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
                        {l.Reporting.Page} {page} {t.of} {Math.ceil(dataPadrones?.length / itemsPerPage)}
                      </Typography>
                      <Pagination
                        count={Math.ceil(dataPadrones?.length / itemsPerPage)} // Calculate the total number of pages
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
