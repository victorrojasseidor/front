import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Loading from '@/Components/Atoms/Loading'
import dayjs from 'dayjs'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { fetchConTokenPost } from '@/helpers/fetch'
import Modal from '../Modal'
import ImageSvg from '@/helpers/ImageSVG'
import { getProducts } from '@/helpers/auth'
import { IconDate, IconArrow } from '@/helpers/report'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { GiH2O } from 'react-icons/gi'
import CaptchaConfig from './CaptchaConfig'

export default function Apiconfiguration ({ nameEmpresa }) {
  const { session, setModalToken, logout, l, idCountry } = useAuth()
  const [product, setProduct] = useState(null)
  const [selectContract, setSelectContract] = useState('other')
  const [contracOther, setContractOther] = useState('')

  const router = useRouter()

  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa

  const t = l.Apiconfuguration

  const pStatus = product?.iCodeStatus



  async function getDataProduct () {
    setIsLoading(true)
    try {
      const token = session.sToken
      const responseData = await getProducts(idEmpresa, token, idCountry)
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const data = responseData.oResults
        const selectedProduct = data.find((p) => p.iId === parseInt(iId))
        setProduct(selectedProduct)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
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
      setIsLoading(false)
    }
  }

  const parsedStartDate = dayjs(product?.sDateInit, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })
  const parsedEndDate = dayjs(product?.sDateEnd, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [requestError, setRequestError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [valueState, setValueState] = useState(null)
  const [stateInitial, setStateInitial] = useState(null)
  const [modalConfirmed, setModalConfirmed] = useState(false)
  const [message, setMessage] = useState(null)
  const [historical, setHistorical] = useState(null)

  useEffect(() => {
    getDataProduct()
  }, [pStatus, valueState, modalConfirmed, startDate, endDate])

  useEffect(() => {
    if (product) {
      GetHistoricoProducto()
    }
  }, [product, modalConfirmed])

  const handleChangeState = (event) => {
    setValueState(event.target.value)
  }

  const handleChangemessage = (event) => {
    setMessage(event.target.value)
  }

  const handleContractChange = (event) => {
    const selectValue = event.target.value
    setSelectContract(selectValue)
  }

  const handleContractChangeOther = (event) => {
    const selectValue = event.target.value
    setContractOther(selectValue)
  }
  useEffect(() => {
    if (pStatus == 31) {
      setValueState('NotHiredProducto')
      setStateInitial('NotHiredProducto')
    } else if (pStatus == 27) {
      setValueState('SolicitarProducto')
      setStateInitial('SolicitarProducto')
    } else if (pStatus == 28) {
      setValueState('AprobarSolProducto')
      setStateInitial('AprobarSolProducto')
    } else if (pStatus == 23) {
      setValueState('ConfirmarConfiguracionProducto')
      setStateInitial('ConfirmarConfiguracionProducto')
    }
  }, [pStatus])

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
  }

  async function GetHistoricoProducto () {
    setIsLoading(true)

    const body = {
      oResults: {
        sCodigoProducto: product?.sProd,
        iIdEmpresa: Number(idEmpresa)
      }

    }

    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost('BPasS/?Accion=GetHistoricoProducto', body, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        setHistorical(responseData.oResults)

        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        setRequestError(errorMessage)

        setTimeout(() => {
          setRequestError(null)
        }, 5000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error.message)
      setTimeout(() => {
        setRequestError(null)
      }, 5000)
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  async function handleServiceChange () {
    setIsLoading(true)

    const body = {
      oResults: {
        sProd: product?.sProd,
        iIdProdEnv: product?.iIdProdEnv,
        sMessage: message || 'sin mensaje',
        sContrato: selectContract == 'other' ? contracOther : selectContract || 'Contrato no definido',
        iIdEmpresa: Number(idEmpresa)
      }

    }

    if (valueState === 'SolicitarProducto' || valueState === 'NotHiredProducto') {
      body.oResults.sCorreo = session?.sCorreo
      body.oResults.sTitle = 'Admin'
      body.oResults.sPhoneNumber = session?.sPhone
    } else if (valueState === 'AprobarSolProducto' || valueState === 'ConfirmarConfiguracionProducto') {
      body.oResults.sCorreo = session?.sCorreo
      body.oResults.sTitle = 'Admin'
      body.oResults.sPhoneNumber = session?.sPhone
      body.oResults.sFechaInit = startDate || product?.sDateInit
      body.oResults.sCorreo = session?.sCorreo
      body.oResults.sFechaEnd = endDate || product?.sDateEnd
    }

    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost(`BPasS/?Accion=${valueState}`, body, token)
      console.log({responseData})
      if (responseData.oAuditResponse?.iCode === 1) {
        // setModalFreeTrial(false)
        setModalConfirmed(false)
        setEndDate(null)
        setStartDate(null)
        setMessage(null)
        setContractOther('')

        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null)
          setMessage(null)
          setContractOther('')
        }, 5000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error.message)
      setTimeout(() => {
        setRequestError(null)
      }, 5000)
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  const formatDate = (date) => {
    // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
    const fechaObjeto = new Date(date)

    // Obtener las partes de la fecha (mes, día y año)
    const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0') // +1 porque los meses comienzan en 0
    const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0')
    const año = fechaObjeto.getUTCFullYear()

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    const fechaFormateada = `${dia}/${mes}/${año}`
    return fechaFormateada
  }

  return (
    <>
      <div className='apiconfiguration'>

        <div className='admin'>
          <div className='admin-product '>

            <div className='reporting-box '>
              <div className='report-content'>

                <div className='report red'>

                  <div className='report_icon  '>

                    <ImageSvg name='Profile' />

                  </div>

                  <div className='report_data'>

                    <article>
                      {t.Company}:

                    </article>
                    <h4> {nameEmpresa}</h4>

                  </div>

                </div>

                <div className='report green '>

                  <div className='report_icon  '>

                    <ImageSvg name='Account' />

                  </div>

                  <div className='report_data'>

                    <article>
                      {t['Digital employees']}:

                    </article>
                    <h4>{product?.sName} </h4>

                  </div>

                </div>

                <div className='report  blue'>

                  <div className='report_icon  '>

                    <ImageSvg name='Support' />

                  </div>

                  <div className='report_data'>

                    <article>
                      {t.State}:
                    </article>
                    <h4>  {pStatus} - {product?.sDescStatus}
                    </h4>

                    <p> <span>  {t['Service start date']}: </span>{formatDate(product?.sDateInit)}</p>
                    <p> <span>  {t['End of service date']}: </span>{formatDate(product?.sDateEnd)}</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className='admin-update'>

            <div className=''>
              <h3 className='sub'> {t['Update the status']} </h3>
              <p className='description'> {t['Update the status of digital employees']}  </p>

              <div className='content'>

                <FormControl>

                  <RadioGroup
                    row
                    aria-labelledby='demo-form-control-label-placement'
                    name='position'
                    value={valueState}
                    onChange={handleChangeState}
                  >

                    <FormControlLabel
                      value='NotHiredProducto'
                      control={<Radio />}
                      label={t['Not hired']}
                    />

                    <FormControlLabel
                      value='SolicitarProducto'
                      control={<Radio color='success' />}
                      label={t['Free Trial']}
                    />

                    <FormControlLabel
                      value='AprobarSolProducto'
                      control={<Radio />}
                      label={t.Pending}
                    />

                    <FormControlLabel
                      value='ConfirmarConfiguracionProducto'
                      control={<Radio />}
                      label={t.Configured}
                    />

                  </RadioGroup>

                </FormControl>

              </div>
            </div>

            {valueState == 'AprobarSolProducto' || valueState == 'ConfirmarConfiguracionProducto'
              ? <div className='box-filter' style={{ flexDirection: 'row' }}>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.From}
                    value={dayjs(parsedStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}
                    slotProps={{
                      textField: {
                        helperText: t['Service start date']
                      }

                    }}
                    onChange={handleStartDateChange}
                    format='DD-MM-YYYY'
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate
                    }}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.To}
                    value={dayjs(parsedEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}
                    slotProps={{
                      textField: {
                        helperText: t['End of service date']
                      }

                    }}
                    onChange={handleEndDateChange}
                    format='DD-MM-YYYY'
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate
                    }}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )}
                  />
                </LocalizationProvider>

                </div>
              : ''}

            {valueState !== stateInitial || startDate || endDate
              ? <div className='box-buttons' style={{ justifyContent: 'flex-start' }}>
                <button
                  type='button'
                  className='btn_primary small'
                  onClick={() => { setModalConfirmed(true) }}
                >
                  {t.Update}

                </button>

                <button
                  type='button'
                  className='btn_secundary small'
                  onClick={() => {
                    setValueState(stateInitial); setEndDate(null)
                    setStartDate(null)
                  }}
                >
                  {t.Cancel}

                </button>

                </div>
              : ''}
          </div>

        </div>

        {product?.iId === 4 && <CaptchaConfig />}

        <div className='historical'>

          <div className='contaniner-tables'>
            <div className='boards'>
              <div className='box-search'>
                <h3>
                  {t['History of changes']}
                </h3>

              </div>
              <div className='tableContainer'>

                <table className='dataTable Account'>
                  <thead>
                    <tr>
                      <th
                      // onClick={() => orderDataByDate()}
                        draggable
                      >
                        {t['Date modification']}
                        <button className='btn_crud'>
                          {/* <ImageSvg name={isDateSorted ? 'OrderDown' : 'OrderUP'} /> */}
                        </button>
                      </th>

                      <th>
                        {t['Star date']}

                      </th>

                      <th>  {t['End date']} </th>
                      <th>   {t.State} </th>
                      <th>   {t.Contract}</th>
                      <th>
                        {t.Message}
                      </th>

                    </tr>
                  </thead>
                  <tbody className='rowTable'>
                    {historical?.length > 0
                      ? historical
                        .map((row) => (
                          <tr key={row.id_historico_producto}>
                            <td>{formatDate(row.fecha_modifica)}</td>
                            <td>
                              {row.fecha_inicio_servicio}
                            </td>

                            <td>  {row.fecha_fin_servicio}</td>
                            <td>{row.codigo_proceso}</td>
                            <td>
                              {row.contrato}
                            </td>
                            <td>
                              {row.mensaje}
                            </td>

                          </tr>
                        ))
                      : (
                        <tr>
                          <td colSpan='6'>
                            {t['There is no data']}
                          </td>
                        </tr>
                        )}
                  </tbody>
                </table>

              </div>

            </div>
          </div>

        </div>

        {isLoading && <Loading />}

        {modalConfirmed && (
          <Modal close={() => { setModalConfirmed(false); setContractOther('') }}>
            <ImageSvg name='Question' />
            <h3>
              {t['Do you want to update the status?']}
            </h3>

            <div className='box-filter'>

              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id='contract' name='contract'>{t.Contract} </InputLabel>
                <Select
                  labelId='contract'
                  name='contract' // Make sure this matches the Field name
                  value={selectContract}
                  IconComponent={IconArrow}
                  onChange={(values) => { handleContractChange(values) }}
                >

                  {/* Opción por defecto vacía */}
                  <MenuItem value='other'>
                    <em>{t.Other}</em>
                  </MenuItem>

                  <MenuItem key='freeTrial' value='free trial contract'>
                    {t['Free trial contract']}
                  </MenuItem>

                </Select>
                <FormHelperText> {selectContract ? '' : t.Select} </FormHelperText>
              </FormControl>

            </div>

            <div className='box-inputs'>
              <Box
                component='form'
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '100%' }
                }}
                noValidate
                autoComplete='off'
              >
                <div>
                  {selectContract === 'other' && (
                    <TextField
                      id='outlined-multiline-flexible'
                      label={t['Contract number']}
                      multiline
                      maxRows={4}
                      value={contracOther}
                      onChange={handleContractChangeOther}
                    />
                  )}
                  <TextField
                    id='outlined-multiline-flexible'
                    label={t.Message}
                    multiline
                    value={message}
                    maxRows={6}
                    onChange={handleChangemessage}
                  />
                </div>
              </Box>
            </div>

            {message && selectContract &&

              <div className='box-buttons'>

                <button
                  type='button'
                  className='btn_primary small'
                  onClick={() => {
                    handleServiceChange()
                    setModalConfirmed(false)
                  }}
                >
                  {t.Yees}
                </button>

                <button
                  type='button'
                  className='btn_secundary small'
                  onClick={() => {
                    setModalConfirmed(false)
                    // Reset contractNumber when modal is closed
                    setMessage(null)
                    setContractOther('')
                  }}
                >
                  {t.No}
                </button>
              </div>}

          </Modal>
        )}

      </div>

      {requestError && <div className='requestError'> {requestError}</div>}

    </>

  )
}
