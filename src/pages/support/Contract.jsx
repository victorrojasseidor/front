import React, { useState, useEffect } from 'react';
import { useAuth } from '@/Context/DataContext';
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
import { exportToExcelFormat, IconDate, IconArrow } from '@/helpers/report';
import ImageSvg from '@/helpers/ImageSVG';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';

export default function Contract() {
  const { session, setModalToken, logout, l, empresa } = useAuth();
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(session?.oEmpresa[0].id_empresa);
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'));
  const [apply, setApply] = useState(false);
  const [datacontract, setDataContract] = useState(null);

  const t = l.Support;

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

  const hasAppliedFilters = () => {
    return selectedCompany !== '' || startDate !== dayjs().startOf('month').format('DD/MM/YYYY') || endDate !== dayjs().subtract(1, 'day').format('DD/MM/YYYY');
  };

  const handleClearFilters = () => {
    setSelectedCompany('');
    //   setStartDate(dayjs().startOf('month').format('DD/MM/YYYY'));
    //   setEndDate(dayjs().subtract(1, 'day').format('DD/MM/YYYY'));
    setApply(!apply);
  };

  return (
    <section className="contract">
      <div className="tab-content ">
        <div className="tabOne">
          <div className="contaniner-tables ">
            <div>
              <div className="box-search">
                <div>
                  <h3> {t['Manage contracts']} </h3>
                  <p>{t['Set up and manage contracts']}</p>
                </div>

                <div className="box-clear">
                  <button className={`btn_primary small black  ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={() => setApply(!apply)} disabled={!hasAppliedFilters()}>
                    {t['Create contract']}
                  </button>
                </div>
              </div>

              <div className="box-filter">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="company-label">{t.Company}</InputLabel>
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

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="company-label">{t.Enterprise}</InputLabel>
                  <Select labelId="company-label" value={selectedCompany} onChange={handleCompanyChange} IconComponent={IconArrow}>
                    <MenuItem value="">
                      <em>{t.all}</em>
                    </MenuItem>
                    {session?.oEmpresa.map((comp) => (
                      <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                        <div> {comp.razon_social_empresa}</div>
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>{t['Selected company']}</FormHelperText> */}
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="company-label">{t.Status}</InputLabel>
                  <Select labelId="company-label" value={selectedCompany} onChange={handleCompanyChange} IconComponent={IconArrow}>
                    <MenuItem value="">
                      <em>{t.All}</em>
                    </MenuItem>
                    {session?.oEmpresa.map((comp) => (
                      <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                        <div> {comp.razon_social_empresa}</div>
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>{t['Selected company']}</FormHelperText> */}
                </FormControl>
              </div>
            </div>

            <div className="boards">
              <div className="tableContainer">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th> {t['Contract']} </th>
                      <th> {t['Enterprise']} </th>
                      <th> {t['Start date']} </th>
                      <th> {t['End date']} </th>
                      <th> {t['Status']} </th>
                      <th> {t['Renew']} </th>
                      <th> {t['Actions']} </th>
                    </tr>
                  </thead>
                  <tbody className="rowTable">
                    {datacontract?.length > 0 ? (
                      datacontract
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage) 
                        .map((row) => (
                          <tr key={row.id_detracciones_pago}>
                            <td>{formatDate(row.fecha_pago)}</td>
                            <td>{row.razon_social_empresa}</td>
                            <td>{row.tipo_cuenta}</td>
                            <td>{row.numero}</td>
                            <td>{row.archivo}</td>
                            <td>{row.importe_total}</td>
                            <td> {row.numero_pago_detracciones == 'String/null' ? '-' : row.numero_pago_detracciones}</td>
                            <td className="box-actions">
                              <button className="btn_crud" onClick={() => handleEdit(row)}>
                                <ImageSvg name="Edit" />{' '}
                              </button>
                              <button className="btn_crud" onClick={() => setSelectedRowToDelete(row)}>
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
              {/* <Stack spacing={2}>
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
                              </Stack> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
