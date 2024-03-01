import React, { useState, useEffect } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import CaptchaChart from '@/Components/Grafics/CaptchaChart'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { IconArrow, IconDate } from '@/helpers/report'
import { fetchConTokenPost } from '@/helpers/fetch'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as XLSX from 'xlsx'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'

const captcha = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { session, setModalToken, logout, l, idCountry } = useAuth()
  const [page, setPage] = useState(1)
  const [selectedCompany, setSelectedCompany] = useState(session?.oEmpresa[0].id_empresa)
  const [dataSumary, setDataSumary] = useState(null)
  const [dataCaptcha, setDataCaptcha] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [itemsPerPage] = useState(32)
  const [filterDate, setFilterDate] = useState(30)
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('DD/MM/YYYY'))
  const [endDate, setEndDate] = useState(dayjs().format('DD/MM/YYYY'))
  const [requestError, setRequestError] = useState()
  const t = l.Captcha

  const months = [l.Reporting.January, l.Reporting.February, l.Reporting.March, l.Reporting.April, l.Reporting.May, l.Reporting.June, l.Reporting.July, l.Reporting.August, l.Reporting.September, l.Reporting.October, l.Reporting.November, l.Reporting.December]

  const transformMonthsFormat = (data) => {
       const partes = data.split('-')
    const mes = months[Number(partes[0]-1)]

    return `${mes}-${partes[1]}`
  }


  const rangeDateSelect = (duration) => {
    const endDate = dayjs()
    let startDate

    // Calcula la fecha de inicio restando la duración
    if (duration === 12) {
      startDate = endDate.subtract(duration, 'month')
    } else {
      startDate = endDate.subtract(duration, 'day')
    }

    const startDateFormatted = startDate.format('DD/MM/YYYY') // Formatea la fecha
    setStartDate(startDateFormatted)
    setEndDate(endDate.format('DD/MM/YYYY'))

    setFilterDate(duration)
  }

  // console.log({ startDate })
  // console.log({ endDate })

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }
  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value
    setSelectedCompany(selectCompanyValue)
  }

  const sumCaptchaResolved = (data) => (Array.isArray(data) ? data.reduce((total, entry) => total + entry.captcha_resolved, 0) : 0)

  if (dataCaptcha) {
    sumCaptchaResolved(dataCaptcha)
  }

  // function filterDataByIdEmpresa (data, idEmpresa) {
  //   const datasuma = data.filter((company) => company.id_empresa === idEmpresa)
  //   setDataSumary(datasuma[0])
  // }

  useEffect(() => {
    GetCabeceraCaptcha()
  
  }, [selectedCompany ])


  useEffect(() => {
  
    GetDetalleCaptcha()
  }, [selectedCompany , startDate, endDate])


  

  async function GetCabeceraCaptcha () {
    setIsLoading(true)
    const body = {
      oResults: {
        iIdPais: idCountry || 1,
        iIdEmpresa: selectedCompany || []
        }
    }

    try {
      const token = session.sToken
      // console.log(body)
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetCabeceraCaptcha', body, token)
      // console.log('cabecera', { responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setDataSumary(data)
        // filterDataByIdEmpresa(data, selectedCompany)
        setModalToken(false)
        setRequestError(null)
        setPage(1)
        // orderDataByDate('fecha', true)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  async function GetDetalleCaptcha () {
    setIsLoading(true)
    const body = {
      oResults: {
        iIdPais: idCountry || 1,
        sFechaDesde: startDate,
        sFechaHasta: endDate,
        iIdEmpresa: selectedCompany || []

      }
    }

    try {
      const token = session.sToken
      // console.log(body)
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetDetalleCaptcha', body, token)
      // console.log('detalle', { responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setDataCaptcha(data)
        setModalToken(false)
        setRequestError(null)
        setPage(1)
        // orderDataByDate('fecha', true)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  // console.log(startDate, endDate)

  const formatDate = (date) => {
    // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
    const fechaObjeto = new Date(date)

    // Obtener las partes de la fecha (mes, día y año)
    const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0') // +1 porque los meses comienzan en 0
    const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0')
    const año = fechaObjeto.getUTCFullYear()

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    const fechaFormateada = `${dia}-${mes}-${año}`
    return fechaFormateada
  }

  const exportToExcel = () => {
    if (dataCaptcha && dataCaptcha.length > 0) {
      const filteredData = dataCaptcha.map((row) => ({
        // Date: formatDate(row.fecha),
        fecha: row.fecha,
        Resuelto: row.captcha_resolved,
        No_Resuelto: row.captcha_not_resolved,
        Tipo: row.captcha_type,
        Dirección_IP: row.ip_address
      }))

      if (filteredData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Anticaptcha Report')
        XLSX.writeFile(wb, 'Anticaptcha_report.xlsx')
      }
    }
  }

  return (
    <LayoutProducts menu='Reporting'>
      <NavigationPages title={t.Anticapcha}>
        <Link href='/reporting'>
          <ImageSvg name='Dashboard' />
          <p>{t.Reporting}</p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href='#'>{t.Anticapcha}</Link>
      </NavigationPages>
      <section className='captcha'>
        <div className='captcha-summary'>
          <div className='reporting-box'>
            <div className='report-content'>
              <div className='report  blue'>
                <div className='report_icon  '>
                  <ImageSvg name='Profile' />
                </div>

                <div className='report_data'>
                  <div className='box-filter'>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id='company-label'>{l.Reporting.Company}</InputLabel>
                      <Select labelId='company-label' value={selectedCompany} onChange={handleCompanyChange} IconComponent={IconArrow}>
                        <MenuItem value=''>
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
                  </div>

                  <article>{t['Selected company']}</article>
                </div>
              </div>
            </div>

            <div className='report-content'>
              <div className='report red'>
                <div className='report_icon  '>
                  <ImageSvg name='IconCaptcha' />
                </div>

                <div className='report_data'>
                  <article>{t['Captcha solved']}</article>
                  <h3> {dataSumary?.captcha_resolved_until_now} </h3>

                  <p>
                    {' '}
                    <ImageSvg name='ArrowUp' /> {t.To} {dataSumary?.fecha_until}{' '}
                  </p>
                </div>
              </div>

              <div className='report green '>
                <div className='report_icon  '>
                  <ImageSvg name='IconCaptcha' />
                </div>

                <div className='report_data'>
                  <article>{t['Resolved Connections']}</article>

                  <h3> {dataSumary?.captcha_conexion_until_now} </h3>

                  <p>
                    {' '}
                    <ImageSvg name='ArrowUp' /> {t.To} {dataSumary?.fecha_until}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='report-months'>
            <div className='contaniner-tables'>
              <div className='box-search'>
                <div>
                  <h3> {t['Last Months']} </h3>
                  <p> {t['Results of the Last 6 Months']} </p>
                </div>
              </div>

              <div className='boards'>
                <div className='tableContainer'>
                  <table className='dataTable'>
                    <thead>
                      <tr>
                        <th>{t.Date} </th>
                        <th> {t['Captcha solved']}</th>
                        <th> {t['Resolved Connections']}</th>
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
        </div>

        <div className='captcha-filters'>
          <h3> {t['Filter Statistics']} </h3>
          <p> {t['Filter the Desired Reports and Graphs, and if you want to see the complete information, use the export option.']} </p>
          <div class='box-filters'>
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

              <ImageSvg name='Time' />
            </button>
          </div>

          {!filterDate && (
            <div className='box-filters'>
              <div className='date'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.From}
                    value={dayjs(startDate, 'DD/MM/YYYY')}
                    slotProps={{
                      textField: {
                        helperText: t['Date start']
                      }
                    }}
                    onChange={handleStartDateChange}
                    format='DD/MM/YYYY'
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate
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
                        helperText: t['Date end']
                      }
                    }}
                    onChange={handleEndDateChange}
                    format='DD/MM/YYYY'
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
          )}
        </div>

        {requestError && <div className='errorMessage'>{requestError.message || ' error service'}</div>}

        {isLoading && <LoadingComponent />}

        <div className='box-tabs'>
          <div className='horizontalTabs'>
            <div className='tab-header'>
              <Link href='#'>
                <button className={activeTab === 0 ? 'active' : ''} onClick={() => handleTabClick(0)}>
                  <h4> {t.Reports}</h4>
                </button>
              </Link>

              <Link href='#'>
                <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>
                  <h4> {t.Graphs}</h4>
                </button>
              </Link>
            </div>
            <div className='tab-content'>
              {activeTab === 0 && (
                <div className='tabOne'>
                  <div className='contaniner-tables'>
                    <div className='box-search'>
                      <div>
                        <h3> {t['Anticaptcha report']} </h3>
                        <p> {t['Results Obtained from Dates']} </p>
                      </div>

                      <div>
                        <button className='btn_black ' onClick={() => exportToExcel()}>
                          <ImageSvg name='Download' /> {t.Export}
                        </button>
                      </div>
                    </div>

                    <div className='boards'>
                      <div className='tableContainer'>
                        <table className='dataTable'>
                          <thead>
                            <tr>
                              <th>{t.Date} </th>
                              <th> {t.Resolved}</th>
                              <th> {t['Not Resolved']}</th>
                              <th> {t['Captcha Type']}</th>
                              <th> {t['IP Address']}</th>
                            </tr>
                          </thead>

                          <tbody>
                            {dataCaptcha.length > 0
                              ? (
                                  dataCaptcha?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((row) => (
                                    <tr key={row.id_captcha_data}>
                                      <td>{formatDate(row.fecha)}</td>
                                      <td>{row.captcha_resolved} </td>
                                      <td>{row.captcha_not_resolved}</td>
                                      <td>{row.captcha_type}</td>
                                      <td>{row.ip_address}</td>
                                    </tr>
                                  ))
                                )
                              : (
                                <tr>
                                  <td colSpan='5'>{t['There is no data']}</td>
                                </tr>
                                )}
                          </tbody>
                        </table>
                      </div>

                      <Stack spacing={2}>
                        <div className='pagination'>
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

                    <div className='reporting-box'>
                      <div className='report-content' style={{ paddingLeft: '0rem' }}>
                        <div className='report blue'>
                          <div className='report_icon  '>
                            <ImageSvg name='IconCaptcha' />
                          </div>

                          <div className='report_data'>
                            <article>{t['Captcha solved']}</article>
                            <h3> {dataCaptcha && sumCaptchaResolved(dataCaptcha)}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className='grafics'>
                  <CaptchaChart captchaData={dataCaptcha} exportToExcel={exportToExcel} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </LayoutProducts>
  )
}

export default captcha
